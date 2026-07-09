import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing with higher limits for base64 image upload
app.use(express.json({ limit: "10mb" }));

// Lazy init Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not defined. AgriSense will operate with high-fidelity simulated diagnostics.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Robust fallback execution for generateContent when models experience high-demand/503
async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: any
): Promise<any> {
  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting generateContent using model: ${modelName}...`);
      const response = await ai.models.generateContent({
        ...params,
        model: modelName
      });
      console.log(`Successfully generated content using model: ${modelName}`);
      return response;
    } catch (err: any) {
      console.error(`Error with model ${modelName}:`, err?.message || err);
      lastError = err;
      // If it's a 503 UNAVAILABLE or any other API error, we immediately try the next fallback model.
    }
  }

  throw lastError || new Error("All fallback models failed to generate content");
}

// Robust helper to extract and clean JSON string from LLM responses
function cleanJsonText(text: string): string {
  let clean = text.trim();
  
  // Strip markdown code fences if present
  if (clean.includes("```json")) {
    const startIndex = clean.indexOf("```json") + 7;
    const endIndex = clean.lastIndexOf("```");
    if (endIndex > startIndex) {
      clean = clean.substring(startIndex, endIndex);
    }
  } else if (clean.includes("```")) {
    const startIndex = clean.indexOf("```") + 3;
    const endIndex = clean.lastIndexOf("```");
    if (endIndex > startIndex) {
      clean = clean.substring(startIndex, endIndex);
    }
  }
  
  // Extract strictly from the first brace to the last brace
  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }
  
  return clean.trim();
}

// Pre-packaged simulated mock diagnoses in case of offline/no-api-key fallback
const MOCK_DIAGNOSES = {
  early_blight: {
    isHealthy: false,
    cropName: "Tomato",
    diseaseName: "Early Blight",
    scientificName: "Alternaria solani",
    confidence: 87,
    severity: "Moderate" as const,
    description: "Early blight is a common fungal disease affecting tomatoes, potatoes, and peppers. It typically starts on the lower leaves with small, brown spots that develop concentric rings like a target. Over time, leaves turn yellow and drop off, exposing fruit to sunscald.",
    symptoms: [
      "Concentric rings ('target spots') on older leaves",
      "Yellow halos surrounding brown necrotic spots",
      "Stem lesions with dark sunken areas",
      "Premature defoliation starting from the bottom of the plant"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Prune off affected lower leaves immediately and dispose of them securely (do not compost).",
          "Sterilize pruning shears with isopropyl alcohol between cuts to prevent spreading the spores."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Water at the base of the plant (drip irrigation) to avoid wetting leaves.",
          "Apply a 2-3 inch layer of organic mulch to prevent fungal spores in the soil from splashing onto foliage."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray with copper-based organic fungicides or Bacillus subtilis preventative sprays.",
          "Apply a baking soda solution (1 tbsp baking soda, 1 tsp liquid soap, 1 gallon water) as a mild prophylactic."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Practice 3-year crop rotation (avoid planting Solanaceae crops in the same spot).",
          "Ensure wide spacing (24-36 inches) between tomato plants to maximize airflow."
        ]
      }
    ]
  },
  late_blight: {
    isHealthy: false,
    cropName: "Tomato",
    diseaseName: "Late Blight",
    scientificName: "Phytophthora infestans",
    confidence: 94,
    severity: "High" as const,
    description: "Late blight is a highly destructive oomycete disease. It thrives in cool, wet weather and spreads rapidly, capable of destroying entire fields within days. It causes large, water-soaked dark patches on leaves, which may develop a white, fuzzy growth on the undersides in humid conditions.",
    symptoms: [
      "Large, irregular water-soaked dark brown or black lesions on foliage",
      "White, fuzzy fungal growth on leaf undersides in humid conditions",
      "Dark brown, greasy lesions on stems and green tomato fruits",
      "Rapid collapses of entire branches and leaf stems"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Destroy and deeply bury or bag infected plants immediately. Do not compost or leave them in the field.",
          "Notify surrounding farmers, as late blight spores can travel miles in the wind."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Harvest salvageable fruit immediately to prevent total crop loss.",
          "Remove any wild nightshade weeds which act as volunteer hosts."
        ]
      },
      {
        category: "Chemical/Organic Treatments",
        steps: [
          "Apply preventative copper-based fungicides aggressively on remaining healthy plants in damp weather.",
          "In conventional systems, apply systemic fungicides containing chlorothalonil or mefenoxam."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Always buy certified disease-free seeds and seedlings.",
          "Select resistant tomato cultivars such as 'Defiant PHR', 'Mountain Merit', or 'Plum Regal'."
        ]
      }
    ]
  },
  leaf_mold: {
    isHealthy: false,
    cropName: "Tomato",
    diseaseName: "Leaf Mold",
    scientificName: "Passalora fulva",
    confidence: 81,
    severity: "Moderate" as const,
    description: "Leaf mold is primarily a greenhouse tomato disease occurring in humid, poorly ventilated environments. It presents as pale green or yellow spots on the upper leaf surface, with olive-green to grey velvety spore mats underneath.",
    symptoms: [
      "Pale green to light yellow spots on upper leaf surface",
      "Olive-green, velvety mold growth on the corresponding lower leaf surface",
      "Withering, curling, and premature dropping of infected foliage"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Immediately increase greenhouse ventilation by opening vents, adding fans, and lowering relative humidity below 85%."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Prune lower foliage to increase air circulation around the lower canopy.",
          "Switch completely to early morning drip watering to allow the soil surface to dry during the day."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Apply copper fungicides or biofungicides containing Bacillus amyloliquefaciens."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Space plants generously inside tunnels or greenhouses.",
          "Select tomato varieties bred specifically with high resistance to leaf mold."
        ]
      }
    ]
  },
  bacterial_spot: {
    isHealthy: false,
    cropName: "Pepper",
    diseaseName: "Bacterial Spot",
    scientificName: "Xanthomonas campestris pv. vesicatoria",
    confidence: 89,
    severity: "Moderate" as const,
    description: "Bacterial spot affects peppers and tomatoes, causing small, circular, dark-colored spots with yellow halos. In wet conditions, the spots look greasy or water-soaked. Severe infection causes extensive yellowing and defoliation, leaving the fruit vulnerable to sunburn.",
    symptoms: [
      "Small, dark, greasy circular spots on leaves",
      "Yellow halos surrounding older lesions",
      "Scabby, raised brown spots on pepper fruit surfaces",
      "Widespread yellowing and defoliation starting at lower stems"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Do not work in the fields or harvest pepper crops when leaves are wet to prevent spreading the bacteria.",
          "Remove and dispose of heavily infected leaves immediately."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Ensure clean, sanitized tools are used for any farming operations.",
          "Implement rigorous weed control to remove host weeds like horsenettle or nightshade."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray preventative copper-based bactericides mixed with mancozeb (if permitted) starting at transplanting."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Practice a 2 to 3-year crop rotation out of tomatoes and peppers.",
          "Use only certified disease-free seed, or treat seed with hot water before planting."
        ]
      }
    ]
  },
  healthy: {
    isHealthy: true,
    cropName: "Crop",
    diseaseName: "Healthy Folier Status",
    scientificName: "N/A",
    confidence: 96,
    severity: "Healthy" as const,
    description: "The foliage appears vibrant, robust, and free from common fungal, bacterial, or viral disease symptoms. Keep maintaining healthy farming practices including consistent watering, good soil health, and balanced nutrition.",
    symptoms: [
      "Vibrant green leaf coloration",
      "No spotting, mold, or water-soaked lesions",
      "Strong turgor pressure (no wilting)"
    ],
    treatments: [
      {
        category: "Supportive Care",
        steps: [
          "Continue drip irrigation and regular soil nourishment.",
          "Monitor foliage weekly to catch any early signs of pests or disease."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Ensure companion planting and crop rotation cycles are followed to keep the ecosystem resilient."
        ]
      }
    ]
  },
  nutrient_deficiency: {
    isHealthy: false,
    cropName: "Crop",
    diseaseName: "Nutritional Deficiency",
    scientificName: "Abiotic Disorder",
    confidence: 88,
    severity: "Moderate" as const,
    description: "The crop foliage shows a pattern of uniform yellowing from leaf tips, green veins, or chlorosis on older leaves without spots or fungal mold. This strongly suggests a nutrient deficiency, such as nitrogen, magnesium, or iron deficiency rather than an infectious disease.",
    symptoms: [
      "Uniform yellowing starting from leaf tips and margins",
      "Interveinal chlorosis (green veins with yellow leaf tissue)",
      "Stunted leaf expansion without spots or mold",
      "Premature leaf drop starting on older lower foliage first"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Apply balanced organic liquid fertilizer or nitrogen-rich manure.",
          "Test soil pH to ensure nutrients are not locked out due to high/low acidity."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray Epsom salt (magnesium sulfate) solution (1-2 tbsp per gallon of water) for magnesium deficiency.",
          "Apply well-rotted cow dung manure, vermicompost, or compost tea to enrich soil nitrogen."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Rotate crops with nitrogen-fixing legumes like beans or peas.",
          "Maintain consistent watering to ensure stable nutrient uptake."
        ]
      }
    ]
  },
  viral_disease: {
    isHealthy: false,
    cropName: "Crop",
    diseaseName: "Viral Infection (Mosaic / Leaf Curl)",
    scientificName: "Plant Virus Complex",
    confidence: 85,
    severity: "High" as const,
    description: "Characterized by mosaic mottling, crinkling, yellow-green patchiness, leaf curling, or stunted growth on new shoots, with NO spots, holes, or fuzzy mold. This is caused by plant viruses often transmitted by sap-sucking pests like whiteflies or aphids.",
    symptoms: [
      "Mosaic-like green and yellow mottling patterns on foliage",
      "Upward or downward leaf curling and puckered texture",
      "Severe stunting of plant growth and distorted new shoots",
      "No circular spots, wet lesions, or velvety mold growth"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Immediately uproot and destroy severely infected plants to prevent virus spread. Viruses cannot be cured once inside a plant.",
          "Control sap-sucking insect vectors like whiteflies and aphids that transmit the virus."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray organic Neem oil (1-2%) or herbal insect repellents (Agnisastra) to control pest vectors.",
          "Install yellow sticky traps in the field to capture whiteflies and leafhoppers."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Grow resistant crop varieties suited to your local region.",
          "Keep the farm free of host weeds that shelter pests and viral reservoirs."
        ]
      }
    ]
  }
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  pa: "Punjabi",
  te: "Telugu",
  ta: "Tamil",
  mr: "Marathi",
  bn: "Bengali",
  kn: "Kannada"
};

function getNoPlantFoundResponse(language: string): any {
  const dictionary: Record<string, any> = {
    en: {
      isHealthy: true,
      cropName: "N/A",
      diseaseName: "No familiar object found",
      scientificName: "N/A",
      confidence: 100,
      severity: "Healthy",
      description: "No familiar plant or leaf object could be detected in this image. Please upload a clear photo of a crop or leaf.",
      symptoms: ["Unrecognized visual patterns"],
      treatments: []
    },
    hi: {
      isHealthy: true,
      cropName: "N/A",
      diseaseName: "कोई परिचित वस्तु नहीं मिली (No familiar object found)",
      scientificName: "N/A",
      confidence: 100,
      severity: "Healthy",
      description: "इस छवि में किसी परिचित पौधे या पत्ती की पहचान नहीं की जा सकी। कृपया फसल या पत्ती की स्पष्ट फोटो अपलोड करें।",
      symptoms: ["अपरिचित दृश्य पैटर्न"],
      treatments: []
    },
    pa: {
      isHealthy: true,
      cropName: "N/A",
      diseaseName: "ਕੋਈ ਜਾਣੂ ਵਸਤੂ ਨਹੀਂ ਮਿਲੀ",
      scientificName: "N/A",
      confidence: 100,
      severity: "Healthy",
      description: "ਇਸ ਤਸਵੀਰ ਵਿੱਚ ਕੋਈ ਜਾਣੂ ਪੌਦਾ ਜਾਂ ਪੱਤਾ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਫਸਲ ਜਾਂ ਪੱਤੇ ਦੀ ਸਾਫ਼ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ।",
      symptoms: ["ਅਣਪਛਾਤੇ ਪੈਟਰਨ"],
      treatments: []
    },
    te: {
      isHealthy: true,
      cropName: "N/A",
      diseaseName: "ఎలాంటి తెలిసిన వస్తువు కనుగొనబడలేదు",
      scientificName: "N/A",
      confidence: 100,
      severity: "Healthy",
      description: "ఈ చిత్రంలో ఎటువంటి తెలిసిన మొక్క లేదా ఆకు కనుగొనబడలేదు. దయచేసి పంట లేదా ఆకు యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి.",
      symptoms: ["గుర్తించబడని నమూనాలు"],
      treatments: []
    },
    ta: {
      isHealthy: true,
      cropName: "N/A",
      diseaseName: "அறியப்பட்ட பொருள் எதுவும் இல்லை",
      scientificName: "N/A",
      confidence: 100,
      severity: "Healthy",
      description: "இந்த படத்தில் அறியப்பட்ட தாவரம் அல்லது இலை எதுவும் கண்டறியப்படவில்லை. தயவுசெய்து பயிர் அல்லது இலையின் தெளிவான புகைப்படத்தைப் பதிவேற்றவும்.",
      symptoms: ["அடையாளம் காணப்படாத வடிவங்கள்"],
      treatments: []
    },
    mr: {
      isHealthy: true,
      cropName: "N/A",
      diseaseName: "कोणतीही ओळखीची वस्तू आढळली नाही",
      scientificName: "N/A",
      confidence: 100,
      severity: "Healthy",
      description: "या चित्रामध्ये कोणतीही ओळखीची वनस्पती किंवा पान आढळले नाही. कृपया पीक किंवा पानाचा स्पष्ट फोटो अपलोड करा।",
      symptoms: ["अनोळखी नमुने"],
      treatments: []
    },
    bn: {
      isHealthy: true,
      cropName: "N/A",
      diseaseName: "কোনো পরিচিত বস্তু পাওয়া যায়নি",
      scientificName: "N/A",
      confidence: 100,
      severity: "Healthy",
      description: "এই ছবিতে কোনো পরিচিত উদ্ভিদ বা পাতা সনাক্ত করা যায়নি। অনুগ্রহ করে ফসল বা পাতার একটি পরিষ্কার ছবি আপলোড করুন।",
      symptoms: ["অপরিচিত প্যাটার্ন"],
      treatments: []
    },
    kn: {
      isHealthy: true,
      cropName: "N/A",
      diseaseName: "ಯಾವುದೇ ಪರಿಚಿತ ವಸ್ತು ಕಂಡುಬಂದಿಲ್ಲ",
      scientificName: "N/A",
      confidence: 100,
      severity: "Healthy",
      description: "ಈ ಚಿತ್ರದಲ್ಲಿ ಯಾವುದೇ ಪರಿಚಿತ ಸಸ್ಯ ಅಥವಾ ಎಲೆ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೆಳೆ ಅಥವಾ ಎಲೆಯ ಸ್ಪಷ್ಟವಾದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      symptoms: ["ಅಪರಿಚಿತ ಮಾದರಿಗಳು"],
      treatments: []
    }
  };

  return dictionary[language] || dictionary.en;
}

// API Endpoint for Leaf / Symptom Diagnosis
function formatChatHistory(messages: any[]): any[] {
  if (!messages || messages.length === 0) return [];

  // Map roles and form basic items
  const rawTurns = messages.map((m: any) => ({
    role: m.role === "user" ? "user" : "model",
    text: m.content || ""
  }));

  const consolidated: any[] = [];
  for (const turn of rawTurns) {
    if (consolidated.length > 0 && consolidated[consolidated.length - 1].role === turn.role) {
      // Append text with newline to prevent alternation error
      consolidated[consolidated.length - 1].text += "\n" + turn.text;
    } else {
      consolidated.push(turn);
    }
  }

  // Ensure it starts with user
  while (consolidated.length > 0 && consolidated[0].role !== "user") {
    consolidated.shift();
  }

  // Format into Gemini contents format
  return consolidated.map(turn => ({
    role: turn.role,
    parts: [{ text: turn.text }]
  }));
}

// Preprocessor to handle negation in symptoms (e.g. "no mold", "no spots") and explicit healthy statuses
function preprocessTextForSimulator(text: string): { cleanedText: string; isExplicitlyHealthy: boolean } {
  const lower = text.toLowerCase();

  // Explicit health/good condition indicators
  const healthyPhrases = [
    "healthy", "perfect", "excellent", "vigorous", "normal", "good health", "all good", "doing well",
    "no symptoms", "no disease", "no infection", "no damage", "clean leaves", "perfectly healthy",
    "excellent health", "fully green", "no spots", "no mold", "no yellowing",
    "स्वस्थ", "अच्छा", "कोई लक्षण नहीं", "कोई बीमारी नहीं", "बढ़िया"
  ];
  const hasHealthyPhrase = healthyPhrases.some(phrase => lower.includes(phrase));

  // Remove common negated descriptions to prevent false positives in string matching
  const negations = [
    "no spots", "no yellowing", "no curling", "no mold", "no holes", "no discoloration", 
    "no blight", "no infection", "no lesions", "no disease", "no damage", "no spots",
    "no rot", "no wilting", "no mosaics", "no curling", "no spot", "no leaf mold",
    "without spots", "without mold", "without yellowing", "without holes", "without discoloration", 
    "without disease", "without blight", "without rot", "without infection",
    "free of spots", "free of mold", "free of disease", "free of yellowing",
    "कोई बीमारी नहीं", "कोई धब्बा नहीं", "कोई फफूंद नहीं", "कोई पीलापन नहीं", "कोई धब्बे नहीं",
    "नहीं है", "नहीं दिख रहा", "नहीं दिख रही"
  ];

  let cleaned = lower;
  negations.forEach(neg => {
    cleaned = cleaned.replace(new RegExp(neg, "g"), " ");
  });

  // Handle word boundaries for simple patterns "no X", "not X"
  cleaned = cleaned.replace(/\b(no|not|without|free\s+of)\s+(spots|spot|yellowing|yellow|mold|moldy|blight|curling|curl|mosaic|rot|deficiency|holes|hole|discoloration|lesions|lesion|wilting|wilt)\b/g, " ");

  // Hindi simple negation
  cleaned = cleaned.replace(/(धब्बा|पीलापन|फफूंद|झुलसा|सिकुड़न|बीमारी|लक्षण)\s+(नहीं)/g, " ");

  return { cleanedText: cleaned, isExplicitlyHealthy: hasHealthyPhrase };
}

app.post("/api/diagnose", async (req, res) => {
  const { image, description, offlineSimulated, language } = req.body;
  const targetLanguageName = LANGUAGE_NAMES[language as string] || "English";

  const ai = getAiClient();
  const plantIdApiKey = process.env.PLANT_ID_API_KEY;
  const isPlantIdActive = !!(plantIdApiKey && plantIdApiKey !== "MY_PLANT_ID_API_KEY" && image);

  // Fallback to simulated if offlineSimulated or if we have no active APIs
  if (offlineSimulated || (!ai && !isPlantIdActive)) {
    // High-fidelity fallback / simulated responses based on keywords or inputs
    const desc = description || "";
    const { cleanedText, isExplicitlyHealthy } = preprocessTextForSimulator(desc);
    
    let choice = "healthy";

    const hasDiseaseKeywords = cleanedText.includes("blight") || 
                               cleanedText.includes("concentric") || 
                               cleanedText.includes("target") || 
                               cleanedText.includes("phytophthora") || 
                               cleanedText.includes("mold") || 
                               cleanedText.includes("velvety") || 
                               cleanedText.includes("bacterial") || 
                               cleanedText.includes("greasy") || 
                               cleanedText.includes("deficiency") || 
                               cleanedText.includes("chlorosis") || 
                               cleanedText.includes("mosaic") || 
                               cleanedText.includes("mottling") || 
                               cleanedText.includes("curling") || 
                               cleanedText.includes("stunted") || 
                               cleanedText.includes("curl") || 
                               cleanedText.includes("virus") ||
                               cleanedText.includes("छल्ले") || 
                               cleanedText.includes("अगेती") || 
                               cleanedText.includes("पछेती") || 
                               cleanedText.includes("मखमली") || 
                               cleanedText.includes("फफूंद") || 
                               cleanedText.includes("तैलीय") || 
                               cleanedText.includes("कमी") || 
                               cleanedText.includes("पोषक") || 
                               cleanedText.includes("विषाणु") || 
                               cleanedText.includes("मोज़ेक");

    if (isExplicitlyHealthy && !hasDiseaseKeywords) {
      choice = "healthy";
    } else if (cleanedText.includes("early blight") || cleanedText.includes("concentric") || cleanedText.includes("target") || cleanedText.includes("छल्ले") || cleanedText.includes("अगेती")) {
      choice = "early_blight";
    } else if (cleanedText.includes("late blight") || cleanedText.includes("water-soaked") || cleanedText.includes("phytophthora") || cleanedText.includes("पछेती")) {
      choice = "late_blight";
    } else if (cleanedText.includes("mold") || cleanedText.includes("velvety") || cleanedText.includes("humid") || cleanedText.includes("मखमली") || cleanedText.includes("फफूंद")) {
      choice = "leaf_mold";
    } else if (cleanedText.includes("bacterial") || cleanedText.includes("greasy") || cleanedText.includes("pepper") || cleanedText.includes("तैलीय")) {
      choice = "bacterial_spot";
    } else if (cleanedText.includes("nutrient") || cleanedText.includes("deficiency") || cleanedText.includes("chlorosis") || (cleanedText.includes("yellowing") && cleanedText.includes("vein")) || cleanedText.includes("कमी") || cleanedText.includes("पोषक")) {
      choice = "nutrient_deficiency";
    } else if (cleanedText.includes("mosaic") || cleanedText.includes("mottling") || cleanedText.includes("curling") || cleanedText.includes("stunted") || cleanedText.includes("curl") || cleanedText.includes("virus") || cleanedText.includes("विषाणु") || cleanedText.includes("मोज़ेक")) {
      choice = "viral_disease";
    } else if (image) {
      // If we have an image, let's randomly assign a disease for high-quality demo (excluding healthy, to make it fun, or healthy sometimes)
      const keys = ["early_blight", "late_blight", "leaf_mold", "bacterial_spot", "nutrient_deficiency", "viral_disease", "healthy"];
      // Hash the image length to make it deterministic for the same image upload
      const hashIndex = image.length % keys.length;
      choice = keys[hashIndex];
    } else if (cleanedText.length > 0) {
      // Just some general problem description
      if (cleanedText.includes("yellow") || cleanedText.includes("spot") || cleanedText.includes("brown") || cleanedText.includes("पीला") || cleanedText.includes("धब्बा")) {
        choice = "early_blight";
      } else {
        choice = "healthy";
      }
    }

    const matchedResult = MOCK_DIAGNOSES[choice as keyof typeof MOCK_DIAGNOSES];
    // Add timestamp and a small simulation disclaimer
    return res.json({
      ...matchedResult,
      isUncertain: false,
      uncertaintyWarning: "",
      createdAt: new Date().toISOString(),
      simulated: true,
      description: matchedResult.description + ` (Simulated analysis in ${targetLanguageName} based on local Indian agricultural database)`
    });
  }

  // Real plant.id (photo.id) API Integration if API key is provided and we have an image
  if (isPlantIdActive && !offlineSimulated) {
    try {
      console.log("Calling plant.id (photo.id) API for professional plant disease diagnostics...");
      const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");
      
      const plantIdResponse = await fetch("https://api.plant.id/v3/identification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": plantIdApiKey
        },
        body: JSON.stringify({
          images: [cleanBase64],
          health: "all",
          similar_images: true
        })
      });

      if (!plantIdResponse.ok) {
        throw new Error(`plant.id API returned status ${plantIdResponse.status}`);
      }

      const plantIdData = await plantIdResponse.json() as any;
      console.log("plant.id API responded successfully.");

      // Check if it's not a plant
      let isPlant = true;
      let isPlantProb = 1.0;
      if (typeof plantIdData.result?.is_plant === "boolean") {
        isPlant = plantIdData.result.is_plant;
      } else if (plantIdData.result?.is_plant && typeof plantIdData.result.is_plant === "object") {
        isPlant = plantIdData.result.is_plant.binary ?? true;
        isPlantProb = plantIdData.result.is_plant.probability ?? 1.0;
      }

      const classification = plantIdData.result?.classification?.suggestions?.[0];
      const classProb = classification?.probability ?? 1.0;

      console.log(`Diagnostic plant.id verification check: isPlant=${isPlant}, isPlantProb=${isPlantProb}, classProb=${classProb}`);

      if (!isPlant || isPlantProb < 0.45 || !classification || classProb < 0.15) {
        console.log(`plant.id determined this is NOT a plant (is_plant: ${isPlant}, probability: ${isPlantProb}, suggestion probability: ${classProb}). Returning 'No familiar object found'.`);
        const noPlantResult = getNoPlantFoundResponse(language);
        return res.json({
          ...noPlantResult,
          createdAt: new Date().toISOString(),
          simulated: false,
          dataSource: "plant.id"
        });
      }

      // If Gemini is available, use it to localize and enrich the plant.id response
      if (ai) {
        try {
          console.log("Enriching plant.id results using Gemini AI for language localization and validation...");
          const systemPrompt = `You are AgriSense AI, an expert agricultural pathologist and crop specialist. 
Your task is to translate, format, and strictly enrich the provided raw plant.id diagnosis data into ${targetLanguageName} matching our response schema.

STRICT GROUNDING RULE:
- You MUST base your diagnosis (diseaseName, scientificName, and whether isHealthy is true/false) strictly and exclusively on the top disease suggestion provided in the raw plant.id JSON: "plantIdData.result.disease.suggestions[0]".
- You are FORBIDDEN from inventing, hallucinating, or diagnosing a different disease (such as "Rust" with raised dusty orange pustules when the plant.id output specifies "Bacterial spot" caused by Xanthomonas campestris pv. vesicatoria). You must be a faithful translator and enricher of the plant.id result.
- The "cropName" should match the top plant classification suggestion: "plantIdData.result.classification.suggestions[0].name" (translated into ${targetLanguageName}, e.g. "टमाटर" for Tomato if Hindi).
- Set "isHealthy" to true only if the plant.id "is_healthy" assessment is positive (or if there are no disease suggestions with a probability >= 0.20). Otherwise, set "isHealthy" to false and diagnose the top disease suggestion from plant.id.
- The "confidence" score should be directly derived from the top disease suggestion's probability (multiplied by 100 to get a percentage, e.g. 0.82 becomes 82) or the top plant classification probability.
- If the confidence score is low (under 60%) or if the top plant.id suggestion has low probability (under 0.35), you MUST set "isUncertain" to true, and provide a clear, helpful warning in "uncertaintyWarning" (translated into ${targetLanguageName}) explaining that the scan confidence is low and suggesting the farmer upload a clearer, well-lit close-up of a single leaf under natural light. Otherwise, set "isUncertain" to false and "uncertaintyWarning" to "".

CRITICAL NON-PLANT CHECK:
You must look at BOTH the uploaded image and the raw plant.id JSON.
If the uploaded image does NOT contain a plant, leaf, crop, flower, fruit, vegetable, or agricultural tree, or if it is a random household object, a human face, an animal, a car, or anything unrelated to plants/agriculture, you MUST return the following response format (translated to ${targetLanguageName}):
- isHealthy: true
- cropName: "N/A"
- diseaseName: "No familiar object found" (translate this strictly to ${targetLanguageName})
- scientificName: "N/A"
- confidence: 100
- severity: "Healthy"
- isUncertain: false
- uncertaintyWarning: ""
- description: "No familiar plant or leaf object could be detected in this image. Please upload a clear photo of a crop or leaf." (translate this to ${targetLanguageName})
- symptoms: ["Non-plant object detected"] (translate this to ${targetLanguageName})
- treatments: [] (empty array)

Translate all valid common names, descriptions, symptoms, and treatment steps into ${targetLanguageName} (except scientific names which should remain as Latin scientific names). Use Indian subcontinent agricultural contexts for treatments.

CRITICAL REQUIREMENT FOR SIMPLICITY:
- All explanations, descriptions, and treatment steps must be written in EXTREMELY simple, plain, non-technical terms.
- Use simple, everyday words that a normal farmer or beginner can easily understand. Avoid complex scientific jargon, heavy botany terms, or overly complicated instructions.
- Keep the "description" highly clear, humble, and straightforward.
- Explain the "treatments" (cure) in very simple, step-by-step plain words so anyone can do them easily.

Return the output strictly in the requested JSON format matching the schema. Do not include markdown formatting or backticks.`;

          const response = await generateContentWithFallback(ai, {
            contents: {
              parts: [
                {
                  inlineData: {
                    data: cleanBase64,
                    mimeType: "image/jpeg"
                  }
                },
                {
                  text: `Here is the raw plant.id (photo.id) API output for a crop leaf scan:
${JSON.stringify(plantIdData, null, 2)}

Please convert this into a single localized DiagnosisResult JSON conforming to this schema:
- isHealthy: boolean (true if healthy, false if has diseases)
- cropName: common name of the plant in ${targetLanguageName} (e.g., Tomato, Paddy/Rice, Wheat, etc.)
- diseaseName: common name of the top disease in ${targetLanguageName} or "Healthy" if healthy
- scientificName: scientific name of the crop or pathogen (Latin, e.g., Solanum lycopersicum)
- confidence: number between 0 and 100
- severity: "High", "Moderate", "Low", or "Healthy"
- isUncertain: boolean (true if scan probability/confidence is low or ambiguous)
- uncertaintyWarning: string (clear advice for the farmer if isUncertain is true, otherwise empty "")
- description: a localized 2-3 sentence overview of this crop condition
- symptoms: array of 3-5 localized symptoms
- treatments: array of localized treatment objects, each having { category: string, steps: string[] } (using organic/Indian practices where applicable)`
                }
              ]
            },
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  isHealthy: { type: Type.BOOLEAN },
                  cropName: { type: Type.STRING },
                  diseaseName: { type: Type.STRING },
                  scientificName: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  severity: { type: Type.STRING },
                  isUncertain: { type: Type.BOOLEAN },
                  uncertaintyWarning: { type: Type.STRING },
                  description: { type: Type.STRING },
                  symptoms: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  treatments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        steps: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        }
                      },
                      required: ["category", "steps"]
                    }
                  }
                },
                required: [
                  "isHealthy",
                  "cropName",
                  "diseaseName",
                  "scientificName",
                  "confidence",
                  "severity",
                  "isUncertain",
                  "uncertaintyWarning",
                  "description",
                  "symptoms",
                  "treatments"
                ]
              }
            }
          });

          const text = response.text;
          if (text) {
            const result = JSON.parse(cleanJsonText(text));
            return res.json({
              ...result,
              createdAt: new Date().toISOString(),
              simulated: false,
              dataSource: "plant.id + Gemini"
            });
          }
        } catch (enrichError: any) {
          console.warn("Gemini enrichment failed (potentially due to restricted/blocked API key). Falling back to direct plant.id parser:", enrichError?.message || enrichError);
        }
      }

      // Fallback manual extraction if Gemini is not available or failed to enrich
      const fallbackClassification = plantIdData.result?.classification?.suggestions?.[0];
      const disease = plantIdData.result?.disease?.suggestions?.[0];
      
      const isHealthy = plantIdData.result?.is_healthy?.binary ?? (!disease || disease.probability < 0.2);
      const cropName = fallbackClassification?.name ?? "Crop";
      const diseaseName = isHealthy ? "Healthy Foliage Status" : (disease?.common_names?.[0] ?? disease?.name ?? "Unknown disease");
      const scientificName = isHealthy ? (fallbackClassification?.name ?? "N/A") : (disease?.name ?? "N/A");
      const confidence = Math.round((isHealthy ? (fallbackClassification?.probability ?? 0.9) : (disease?.probability ?? 0.8)) * 100);
      const severity = isHealthy ? "Healthy" : "Moderate";
      const isUncertain = confidence < 60;
      const uncertaintyWarning = isUncertain 
        ? "The scan confidence is low. Please make sure the photo is close-up, well-lit, and focused on a single leaf with visible symptoms." 
        : "";
      const description = isHealthy 
        ? "The crop foliage appears vigorous and healthy with active photosynthesis." 
        : (disease?.details?.description ?? "A disease has been detected affecting the crop leaves and vascular systems.");
      
      const symptoms = isHealthy 
        ? ["Vibrant green coloration", "Active turgor pressure", "No visible necrotic spots"]
        : ["Leaf discoloration or necrotic lesions", "Foliage spotting", "Potential wilting or tissue damage"];

      const treatments: any[] = [];
      if (disease?.details?.treatment?.biological) {
        treatments.push({
          category: "Organic Solutions",
          steps: disease.details.treatment.biological
        });
      }
      if (disease?.details?.treatment?.prevention) {
        treatments.push({
          category: "Prevention",
          steps: disease.details.treatment.prevention
        });
      }
      if (treatments.length === 0) {
        treatments.push({
          category: "Recommended Practices",
          steps: isHealthy 
            ? ["Continue monitoring regularly", "Ensure optimal hydration and organic cow compost application"]
            : ["Prune and destroy infected leaves immediately", "Avoid overhead watering to restrict spore spread"]
        });
      }

      return res.json({
        isHealthy,
        cropName,
        diseaseName,
        scientificName,
        confidence,
        severity,
        isUncertain,
        uncertaintyWarning,
        description,
        symptoms,
        treatments,
        createdAt: new Date().toISOString(),
        simulated: false,
        dataSource: "plant.id"
      });

    } catch (err: any) {
      console.error("plant.id API Error, falling back to standard Gemini API:", err);
    }
  }

  // Real Gemini API Call!
  try {
    const parts: any[] = [];

    // Prompt instructions to guide Gemini for professional crop diagnosis
    const systemPrompt = `You are AgriSense AI, an expert plant pathologist and crop specialist. 
Your task is to diagnose plant diseases, nutritional deficiencies, or health status from leaves, stems, or crop images, or from the farmer's written descriptions.

CLINICAL SYMPTOM DIAGNOSIS & GROUNDING PROCESS:
You can diagnose ANY known plant disease, pest, or deficiency globally. You MUST follow a rigorous clinical reasoning process to analyze symptoms. Compare reported symptoms against exact pathological definitions to ensure highly accurate diagnoses.
- Do NOT limit yourself to a few common diseases. If the symptoms indicate Powdery Mildew, Downy Mildew, Anthracnose, Aphids, Spider Mites, Fusarium Wilt, or any other specific issue, diagnose it accurately.
- Avoid bucketing unrelated symptoms into generic categories. If the farmer describes a unique pest or rare fungal infection, identify it correctly based on your broad agricultural knowledge.

STRICT SYMPTOM MATCHING RULE:
- Do NOT jump to high-confidence conclusions (e.g. over 85% confidence) unless symptoms match a unique disease's profile perfectly.
- Carefully distinguish between fungal, bacterial, viral, pest, and abiotic (nutritional/environmental) issues.
- For example, if a nutritional deficiency (yellowing, green veins, no spots/mold) or a viral issue (curling, mosaic, stunting) is described or shown, you MUST classify it accurately rather than forcing it into a fungal category.
- If the farmer's description is ambiguous, too short, or lacks clear descriptors, you MUST set "isUncertain" to true, lower the confidence score (e.g. between 40-60%), and provide specific questions in "uncertaintyWarning" (translated to ${targetLanguageName}) to help the farmer clarify (e.g., "Are the spots small and flat, or large and greasy-looking? Are there any pests visible?").
- If the description matches multiple potential diseases or is contradictory, set "isUncertain" to true and describe the possibilities and recommendations in "uncertaintyWarning".

CRITICAL NON-PLANT CHECK:
If the uploaded image does NOT contain a plant, leaf, crop, flower, fruit, vegetable, or agricultural tree, or if it is a random household object, a human face, an animal, a car, or anything unrelated to plants/agriculture, you MUST return the following response format (translated to ${targetLanguageName}):
- isHealthy: true
- cropName: "N/A"
- diseaseName: "No familiar object found" (translate this strictly to ${targetLanguageName}, e.g. "कोई परिचित वस्तु नहीं मिली (No familiar object found)" in Hindi)
- scientificName: "N/A"
- confidence: 100
- severity: "Healthy"
- isUncertain: false
- uncertaintyWarning: ""
- description: "No familiar plant or leaf object could be detected in this image. Please upload a clear photo of a crop or leaf." (translate this to ${targetLanguageName})
- symptoms: ["Non-plant object detected"] (translate this to ${targetLanguageName})
- treatments: [] (empty array)

Otherwise, diagnose the plant disease. The farmer is based in India. You must use Indian-oriented agronomy practices, organic/cultural solutions (such as Neem oil, Panchagavya, Trichoderma viride, copper oxychloride, cow dung compost, ash dusting), and crop names relevant to India.

CRITICAL REQUIREMENT FOR SIMPLICITY:
- All explanations, descriptions, symptoms, and treatment steps must be written in EXTREMELY simple, plain, non-technical terms.
- Use simple, everyday words that a normal farmer or beginner can easily understand. Avoid complex scientific jargon, heavy botany terms, or overly complicated instructions.
- Keep the "description" highly clear, humble, and straightforward.
- Explain the "treatments" (cures) in very simple, step-by-step plain words so anyone can perform them easily.

IMPORTANT: You MUST respond and translate all output fields into the language: "${targetLanguageName}". 
If "${targetLanguageName}" is not English, you MUST translate ALL fields in the response JSON (except scientific name which should remain scientific) into "${targetLanguageName}". For example:
- "cropName": translate to the local name in "${targetLanguageName}" (e.g. "टमाटर" for Tomato, "आलू" for Potato if Hindi)
- "diseaseName": translate to "${targetLanguageName}" (e.g., "अगेती झुलसा" for Early Blight)
- "description": write the entire 2-3 sentence overview in "${targetLanguageName}" (using extremely simple, plain language)
- "symptoms": write each symptom in "${targetLanguageName}" (using extremely simple, plain language)
- "treatments": write all categories (e.g. 'तत्काल कार्रवाई', 'जैविक उपाय') and steps in "${targetLanguageName}" (using extremely simple, plain language)

Return the output strictly in the requested JSON format matching the schema. Do not include markdown formatting or backticks outside the json.`;

    if (image) {
      // Image data represents base64 encoded picture
      // Clean up the prefix if present
      const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      });
    }

    let userPromptText = "Please analyze this plant foliage.";
    if (description) {
      userPromptText += ` The farmer described the symptoms as follows: "${description}"`;
    }
    parts.push({ text: userPromptText });

    const response = await generateContentWithFallback(ai, {
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isHealthy: { type: Type.BOOLEAN, description: "True if the plant/leaf is healthy, false if diseased" },
            cropName: { type: Type.STRING, description: `The common name of the crop in ${targetLanguageName} (e.g. Tomato, Pepper, Potato, Paddy/Rice, Cotton, Wheat)` },
            diseaseName: { type: Type.STRING, description: `The common name of the disease in ${targetLanguageName} or 'Healthy' if healthy` },
            scientificName: { type: Type.STRING, description: "The scientific name of the disease pathogen (e.g. Phytophthora infestans) or 'N/A' if healthy" },
            confidence: { type: Type.NUMBER, description: "A confidence score between 0 and 100 representing certainty" },
            severity: { type: Type.STRING, description: "The severity rating: 'High', 'Moderate', 'Low', or 'Healthy'" },
            isUncertain: { type: Type.BOOLEAN, description: "True if symptoms are ambiguous, mismatch the image/description, or match multiple potential diseases" },
            uncertaintyWarning: { type: Type.STRING, description: "A friendly, helpful warning explaining the ambiguity and what the farmer should do or check" },
            description: { type: Type.STRING, description: `A 2-3 sentence overview in ${targetLanguageName} describing the disease, its characteristics, and how it damages the crop` },
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `A list of visual symptoms present or matching this disease in ${targetLanguageName} (3-5 points)`
            },
            treatments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: `Category name in ${targetLanguageName}, e.g., 'Immediate Actions', 'Cultural Controls', 'Organic Solutions', 'Chemical Treatments', 'Prevention'` },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: `Actionable concrete steps for the category in ${targetLanguageName} (2-4 steps per category)`
                  }
                },
                required: ["category", "steps"]
              },
              description: "List of treatment categories and concrete steps"
            }
          },
          required: [
            "isHealthy",
            "cropName",
            "diseaseName",
            "scientificName",
            "confidence",
            "severity",
            "isUncertain",
            "uncertaintyWarning",
            "description",
            "symptoms",
            "treatments"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text returned from Gemini API");
    }

    const result = JSON.parse(cleanJsonText(text));
    return res.json({
      ...result,
      createdAt: new Date().toISOString(),
      simulated: false
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Fallback to simulated if real call fails
    return res.status(500).json({
      error: "AI diagnosis failed temporarily. Reverting to local fallback.",
      details: error.message
    });
  }
});


// API Endpoint for Diagnostic Chat
app.post("/api/chat", async (req, res) => {
  const { messages, offlineSimulated, language } = req.body;
  const targetLanguageName = LANGUAGE_NAMES[language as string] || "English";
  const ai = getAiClient();

  const lastUserMessage = messages && messages.length > 0 
    ? messages[messages.length - 1].content 
    : "";

  if (!ai || offlineSimulated) {
    // High-fidelity local diagnostic chatbot simulation
    const lang = (language as string) || "en";
    const { cleanedText, isExplicitlyHealthy } = preprocessTextForSimulator(lastUserMessage);
    let reply = "";
    let diagnosisKey: string | null = null;

    const hasDiseaseKeywords = cleanedText.includes("blight") || 
                               cleanedText.includes("concentric") || 
                               cleanedText.includes("target") || 
                               cleanedText.includes("phytophthora") || 
                               cleanedText.includes("mold") || 
                               cleanedText.includes("velvety") || 
                               cleanedText.includes("bacterial") || 
                               cleanedText.includes("greasy") || 
                               cleanedText.includes("deficiency") || 
                               cleanedText.includes("chlorosis") || 
                               cleanedText.includes("mosaic") || 
                               cleanedText.includes("mottling") || 
                               cleanedText.includes("curling") || 
                               cleanedText.includes("stunted") || 
                               cleanedText.includes("curl") || 
                               cleanedText.includes("virus") ||
                               cleanedText.includes("छल्ले") || 
                               cleanedText.includes("अगेती") || 
                               cleanedText.includes("पछेती") || 
                               cleanedText.includes("मखमली") || 
                               cleanedText.includes("फफूंद") || 
                               cleanedText.includes("तैलीय") || 
                               cleanedText.includes("कमी") || 
                               cleanedText.includes("पोषक") || 
                               cleanedText.includes("विषाणु") || 
                               cleanedText.includes("मोज़ेक");

    if (isExplicitlyHealthy && !hasDiseaseKeywords) {
      reply = lang === "hi"
        ? "बहुत बढ़िया! आपकी फसल की पत्तियां पूरी तरह स्वस्थ, हरी और चमकदार दिख रही हैं। मिट्टी की सेहत बनाए रखने के लिए समय-समय पर वर्मीकम्पोस्ट या पंचगव्य का उपयोग जारी रखें।"
        : `Excellent. Your foliage appears vibrant green and displays solid turgor pressure. This indicates healthy leaf status with active photosynthesis. Keep applying cow dung manure and Panchagavya for high vigor.`;
      diagnosisKey = "healthy";
    } else if (cleanedText.includes("early blight") || cleanedText.includes("concentric") || cleanedText.includes("target") || cleanedText.includes("छल्ले") || cleanedText.includes("अगेती")) {
      reply = lang === "hi"
        ? "समझ गया। पुरानी पत्तियों पर गोलाकार 'निशाना धब्बे' (concentric rings) बनना अगेती झुलसा (Early Blight) रोग का मजबूत लक्षण है। सूखी धूप के समय संक्रमित निचली पत्तियों को तुरंत हटा दें और जैविक नीम के तेल का छिड़काव करें।"
        : `I see. Concentric rings forming target-like patterns on older foliage strongly indicate Early Blight (Alternaria solani). For smallholder Indian farms, pruning lower leaves and applying organic Neem oil or biofungicides like Trichoderma viride is highly recommended.`;
      diagnosisKey = "early_blight";
    } else if (cleanedText.includes("late blight") || cleanedText.includes("water-soaked") || cleanedText.includes("phytophthora") || cleanedText.includes("पछेती")) {
      reply = lang === "hi"
        ? "यह बहुत गंभीर स्थिति है। ठंडे और गीले मौसम में पत्तियों पर तेजी से फैलने वाले पानीदार धब्बे पछेती झुलसा (Late Blight) की पहचान हैं। संक्रमित पौधों को तुरंत उखाड़कर नष्ट करें और शेष फसलों पर तांबा युक्त जैविक कवकनाशी का छिड़काव करें।"
        : `That is critical. Large water-soaked lesions that blacken rapidly under cool, damp conditions indicate Late Blight (Phytophthora infestans). This is highly destructive. Remove the infected plants immediately and spray copper oxychloride on neighboring healthy crops.`;
      diagnosisKey = "late_blight";
    } else if (cleanedText.includes("mold") || cleanedText.includes("velvety") || cleanedText.includes("humid") || cleanedText.includes("मखमली") || cleanedText.includes("फफूंद")) {
      reply = lang === "hi"
        ? "पत्तियों की निचली सतह पर जैतून-हरे या भूरे रंग की मखमली परत का होना लीफ मोल्ड (Leaf Mold) का लक्षण है। ग्रीनहाउस या पॉलीहाउस में हवा का प्रवाह बढ़ाएं और आर्द्रता को कम रखें।"
        : `Based on the velvety growth and light-yellow spots on your crop foliage, this looks like Leaf Mold (Passalora fulva). In India, increasing ventilation in polyhouses and dusting organic wood ash is a helpful local cultural remedy.`;
      diagnosisKey = "leaf_mold";
    } else if (cleanedText.includes("bacterial") || cleanedText.includes("greasy") || cleanedText.includes("pepper") || cleanedText.includes("तैलीय")) {
      reply = lang === "hi"
        ? "मिर्च या टमाटर की पत्तियों पर छोटे, काले चिकने या तैलीय धब्बे बैक्टीरियल स्पॉट (Bacterial Spot) के लक्षण हैं। गीली पत्तियों को छूने से बचें और तांबे वाले जैविक कवकनाशी का छिड़काव करें।"
        : `Small, greasy dark spots with faint yellow margins on pepper/chilli leaves point to Bacterial Spot (Xanthomonas campestris). Ensure seed treatment with hot water and avoid irrigation during wet periods.`;
      diagnosisKey = "bacterial_spot";
    } else if (cleanedText.includes("nutrient") || cleanedText.includes("deficiency") || cleanedText.includes("chlorosis") || (cleanedText.includes("yellowing") && cleanedText.includes("vein")) || cleanedText.includes("कमी") || cleanedText.includes("पोषक")) {
      reply = lang === "hi"
        ? "यह एक अजैविक पोषक तत्व की कमी (Nutritional Deficiency) का संकेत है। बिना किसी फंगस या धब्बे के पत्ती के सिरों से शुरू होने वाला समान पीलापन या हरी नसें इस कमी को दर्शाती हैं। कृपया संतुलित जैविक खाद, वर्मीकम्पोस्ट या नीम की खली का प्रयोग करें।"
        : `This indicates an abiotic Nutritional Deficiency. Uniform yellowing starting from leaf tips and interveinal chlorosis (green veins) with no fungal spots are key characteristics. We recommend testing your soil pH and applying balanced organic manure or nitrogen-rich compost tea.`;
      diagnosisKey = "nutrient_deficiency";
    } else if (cleanedText.includes("mosaic") || cleanedText.includes("mottling") || cleanedText.includes("curling") || cleanedText.includes("stunted") || cleanedText.includes("curl") || cleanedText.includes("virus") || cleanedText.includes("विषाणु") || cleanedText.includes("मोज़ेक")) {
      reply = lang === "hi"
        ? "यह एक विषाणु जनित रोग (Viral Infection) का संकेत है, जैसे मोज़ेक या लीफ कर्ल। यह अक्सर सफेद मक्खी या एफिड्स जैसे रस चूसने वाले कीटों द्वारा फैलता है। संक्रमित पौधों को तुरंत उखाड़ दें और कीटों को नियंत्रित करने के लिए जैविक नीम के तेल का छिड़काव करें।"
        : `This looks like a Viral Infection (such as Mosaic Virus or Leaf Curl Complex). Characterized by mosaic mottling, crinkled texture, leaf curling, and stunting with no mold, this is spread by pests like whiteflies. Immediately pull and destroy heavily infected plants and use organic Neem oil to control insect vectors.`;
      diagnosisKey = "viral_disease";
    } else if (cleanedText.includes("healthy") || cleanedText.includes("perfect") || cleanedText.includes("no spots") || cleanedText.includes("स्वस्थ")) {
      reply = lang === "hi"
        ? "बहुत बढ़िया! आपकी फसल की पत्तियां पूरी तरह स्वस्थ, हरी और चमकदार दिख रही हैं। मिट्टी की सेहत बनाए रखने के लिए समय-समय पर वर्मीकम्पोस्ट या पंचगव्य का उपयोग जारी रखें।"
        : `Excellent. Your foliage appears vibrant green and displays solid turgor pressure. This indicates healthy leaf status with active photosynthesis. Keep applying cow dung manure and Panchagavya for high vigor.`;
      diagnosisKey = "healthy";
    } else {
      reply = lang === "hi"
        ? "नमस्कार! मैं आपका एआई कृषि विशेषज्ञ सलाहकार हूँ। कृपया अपनी फसल का नाम (जैसे टमाटर, मिर्च, धान) और पत्ती पर दिखने वाले लक्षणों का वर्णन करें ताकि मैं सही उपचार बता सकूँ।"
        : `Greetings! I am the AgriSense AI Agronomist, based in India. Please describe your crop type (e.g. Tomato/टमाटर, Chilli/मिर्च, Paddy/धान, Cotton/कपास) and any specific foliage symptoms (such as spot colors, concentric rings, or water-soaked patches) so I can diagnose it in real-time.`;
    }

    let diagnosis = null;
    if (diagnosisKey) {
      const baseResult = MOCK_DIAGNOSES[diagnosisKey as keyof typeof MOCK_DIAGNOSES];
      diagnosis = {
        ...baseResult,
        createdAt: new Date().toISOString()
      };
    }

    return res.json({
      reply,
      diagnosis,
      simulated: true
    });
  }

  // Real Gemini API call for Chat Diagnostic
  try {
    const systemPrompt = `You are AgriSense AI Agronomist, an expert plant pathologist and crop specialist. 
Your task is to chat with the farmer, understand their plant issues, and diagnose any potential crop diseases, pest infestations, nutritional deficiencies, or foliar issues in real-time.

CLINICAL SYMPTOM DIAGNOSIS & GROUNDING PROCESS:
You can diagnose ANY known plant disease, pest, or deficiency globally. You MUST follow a rigorous clinical reasoning process to analyze symptoms described in the chat. Compare reported symptoms against exact pathological definitions to ensure highly accurate diagnoses.
- Do NOT limit yourself to a few common diseases. If the symptoms indicate Powdery Mildew, Downy Mildew, Anthracnose, Aphids, Spider Mites, Fusarium Wilt, or any other specific issue, diagnose it accurately.
- Avoid bucketing unrelated symptoms into generic categories. If the farmer describes a unique pest or rare fungal infection, identify it correctly based on your broad agricultural knowledge.

STRICT SYMPTOM MATCHING RULE:
- Do NOT jump to high-confidence conclusions (e.g. over 85% confidence) unless symptoms match a unique disease's profile perfectly.
- Carefully distinguish between fungal, bacterial, viral, pest, and abiotic (nutritional/environmental) issues.
- For example, if a nutritional deficiency (yellowing, green veins, no spots/mold) or a viral issue (curling, mosaic, stunting) is described, you MUST classify it accurately rather than forcing it into a fungal category.
- If the farmer's description is ambiguous, too short, or lacks clear descriptors, do NOT return a diagnosis; instead, set "diagnosis" to null, and in your "reply" ask specific clarifying questions to help the farmer clarify (e.g., "Are the spots small and flat, or large and greasy-looking? Are there any pests visible?").

CRITICAL NON-AGRICULTURAL / NON-PLANT CHAT CHECK:
If the user's message or the conversation topic is NOT related to plants, crops, farming, soil, plant diseases, gardening, or agriculture (for example, asking general questions like "who are you", "tell me a joke", or talking about coding, cars, movies, politics, or other random off-topic things), you MUST politely decline to discuss non-farming topics. Specifically, set the "diagnosis" field to null and set the "reply" field to a friendly, polite refusal in ${targetLanguageName} (e.g., "I am an AI Agronomist dedicated to helping with crops and plants. Please ask me questions related to agriculture, crops, or leaf diseases!").

Otherwise, help the farmer with their agricultural issue. The farmer is based in India. Use Indian-oriented agronomy practices, organic/cultural solutions (such as Neem oil, Panchagavya, Trichoderma viride, copper oxychloride, cow dung compost, wood ash dusting), and crop names relevant to the Indian subcontinent.

CRITICAL REQUIREMENT FOR SIMPLICITY:
- All explanations, conversations, descriptions, symptoms, and treatment steps must be written in EXTREMELY simple, plain, non-technical terms.
- Use simple, everyday words that a normal farmer or beginner can easily understand. Avoid complex scientific jargon, heavy botany terms, or overly complicated instructions.
- Explain the diagnosis and "treatments" (cures) in very simple, step-by-step plain words so anyone can do them easily.

You must converse and respond in the language: "${targetLanguageName}". 
If "${targetLanguageName}" is not English, you MUST translate the "reply" and the entire "diagnosis" object fields (except scientific name which should remain scientific) into "${targetLanguageName}". For example:
- "reply": write the friendly conversational message in "${targetLanguageName}" (using extremely simple, plain language)
- "cropName": translate to the local name in "${targetLanguageName}" (e.g. "टमाटर" for Tomato)
- "diseaseName": translate to "${targetLanguageName}" (e.g. "अगेती झुलसा" for Early Blight)
- "description": write the overview in "${targetLanguageName}" (using extremely simple, plain language)
- "symptoms": write each symptom in "${targetLanguageName}" (using extremely simple, plain language)
- "treatments": write the categories (e.g. 'तुरंत कार्रवाई', 'जैविक समाधान') and steps in "${targetLanguageName}" (using extremely simple, plain language)

Guidelines:
1. Analyze the symptoms described by the farmer in the conversation history.
2. Ask helpful clarifying questions if you need more details to form a certain diagnosis (e.g. asking about spot colors, target-like concentric rings, humidity, crop name, leaf undersides).
3. Be professional, friendly, and concise. Keep your text reply between 1 and 3 sentences.
4. IMPORTANT: If the farmer has provided enough details (such as the crop name and clear visual symptoms) to identify the crop condition or disease with reasonable certainty, populate the 'diagnosis' field with a highly accurate structured analysis. Otherwise, set the 'diagnosis' field to null.
5. If you do generate a diagnosis, ensure it matches the plant pathology schema. Ensure isUncertain (boolean) is false if certain, or true if there is low confidence, and populate uncertaintyWarning (string) accordingly.

Response Schema:
You must return your output strictly in JSON format matching this schema:
- reply (string): your friendly, helpful, and concise conversational message in ${targetLanguageName} (1-3 sentences).
- diagnosis (object or null):
  - isHealthy (boolean): true if the crop is healthy, false if diseased/damaged
  - cropName (string): the common name of the crop in ${targetLanguageName} (e.g., Tomato, Potato, Pepper)
  - diseaseName (string): the common name of the disease or "Healthy Folier Status" in ${targetLanguageName}
  - scientificName (string): the scientific name of the pathogen or "N/A"
  - confidence (number): your confidence score from 0 to 100
  - severity (string): "High", "Moderate", "Low", or "Healthy"
  - description (string): a brief 2-3 sentence overview of the condition in ${targetLanguageName}
  - symptoms (array of strings): list of 3-5 visual symptoms matching this condition in ${targetLanguageName}
  - treatments (array of objects): list of treatment categories and steps in ${targetLanguageName}, where each object has:
    - category (string): e.g., 'Immediate Actions', 'Cultural Controls', 'Organic Solutions', 'Prevention'
    - steps (array of strings): actionable concrete steps`;

    // Map roles strictly using formatChatHistory helper
    const contents = formatChatHistory(messages);

    const response = await generateContentWithFallback(ai, {
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: `Your conversational response in ${targetLanguageName} (1-3 sentences)` },
            diagnosis: {
              type: Type.OBJECT,
              nullable: true,
              description: "A structured DiagnosisResult if enough details exist to make a reliable diagnosis, or null otherwise",
              properties: {
                isHealthy: { type: Type.BOOLEAN },
                cropName: { type: Type.STRING },
                diseaseName: { type: Type.STRING },
                scientificName: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                severity: { type: Type.STRING },
                description: { type: Type.STRING },
                symptoms: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                treatments: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      steps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    },
                    required: ["category", "steps"]
                  }
                }
              },
              required: [
                "isHealthy",
                "cropName",
                "diseaseName",
                "scientificName",
                "confidence",
                "severity",
                "description",
                "symptoms",
                "treatments"
              ]
            }
          },
          required: ["reply", "diagnosis"]
        }
      }
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response text returned from Gemini API");
    }

    const result = JSON.parse(cleanJsonText(text));
    if (result.diagnosis) {
      result.diagnosis.createdAt = new Date().toISOString();
    }
    return res.json({
      ...result,
      simulated: false
    });

  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    // Fallback response
    return res.status(500).json({
      error: "AI diagnostic chat failed temporarily.",
      details: error.message
    });
  }
});

// Translation fallbacks for offline or simulated mode
function getSimulatedHindiTranslation(diag: any): any {
  const cropMap: Record<string, string> = {
    "Tomato": "टमाटर",
    "Potato": "आलू",
    "Pepper": "मिर्च",
    "Chilli": "मिर्च",
    "Rice": "धान (चावल)",
    "Paddy": "धान (चावल)",
    "Cotton": "कपास",
    "Lemon": "नींबू",
    "Lime": "नींबू",
    "Wheat": "गेहूं",
    "Crop": "फसल"
  };

  const diseaseMap: Record<string, string> = {
    "Early Blight": "अगेती झुलसा",
    "Late Blight": "पछेती झुलसा",
    "Leaf Mold": "पत्ती का मोल्ड रोग",
    "Bacterial Spot": "जीवाणु जनित धब्बा रोग",
    "Bacterial Wilt": "जीवाणु जनित मुरझान रोग",
    "Crown Gall": "क्राउन गॉल (ट्यूमर रोग)",
    "Potato Scab": "आलू का खुरंड रोग",
    "Damping Off": "आर्द्र पतन (डैम्पिंग ऑफ)",
    "Fusarium Wilt": "फ्यूजेरियम विल्ट",
    "Rice Blast": "धान का झोंका रोग (ब्लास्ट)",
    "Cotton Leaf Curl": "कपास का पत्ता मरोड़ रोग",
    "Citrus Canker": "नींबू का कैंकर रोग",
    "Black Scurf": "आलू का ब्लैक स्कर्फ",
    "Black Rust": "गेहूं का काला किट्ट",
    "Healthy Foliage Status": "स्वस्थ पत्ती स्थिति",
    "No familiar object found": "कोई परिचित वस्तु नहीं मिली"
  };

  const categoryMap: Record<string, string> = {
    "Immediate Actions": "तत्काल कार्रवाई",
    "Cultural Controls": "सांस्कृतिक नियंत्रण",
    "Organic Solutions": "जैविक समाधान",
    "Chemical Treatments": "रासायनिक उपचार",
    "Prevention": "बचाव व रोकथाम",
    "Recommended Practices": "अनुशंसित प्रथाएं",
    "Supportive Care": "सहायक देखभाल"
  };

  return {
    ...diag,
    cropName: cropMap[diag.cropName] || diag.cropName,
    diseaseName: diseaseMap[diag.diseaseName] || diag.diseaseName,
    description: `[अनुवाद] ${diag.description || "कोई विवरण उपलब्ध नहीं है।"}`,
    symptoms: diag.symptoms ? diag.symptoms.map((s: string) => `लक्षण: ${s}`) : [],
    treatments: diag.treatments ? diag.treatments.map((t: any) => ({
      category: categoryMap[t.category] || t.category,
      steps: t.steps ? t.steps.map((st: string) => `कदम: ${st}`) : []
    })) : []
  };
}

// API Endpoint for translating structured diagnosis
app.post("/api/translate-diagnosis", async (req, res) => {
  const { diagnosis, targetLanguage = "hi" } = req.body;
  const ai = getAiClient();

  if (!ai) {
    return res.json(getSimulatedHindiTranslation(diagnosis));
  }

  try {
    const targetLanguageName = targetLanguage === "hi" ? "Hindi" : "English";
    const systemPrompt = `You are AgriSense AI, an expert agricultural pathology translator.
Your task is to translate the provided structured plant diagnosis object into extremely simple, humble, farmer-friendly ${targetLanguageName}.
Translate all crop names, disease names (except scientific name which must remain exactly as it is), descriptions, symptoms, and treatment categories/steps into simple everyday ${targetLanguageName} words.
Return the output strictly in JSON format matching the input schema exactly. Do not include markdown formatting or backticks outside the json.`;

    const response = await generateContentWithFallback(ai, {
      contents: `Please translate this diagnosis to simple farmer-friendly ${targetLanguageName}:
${JSON.stringify(diagnosis, null, 2)}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isHealthy: { type: Type.BOOLEAN },
            cropName: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            severity: { type: Type.STRING },
            description: { type: Type.STRING },
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            treatments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["category", "steps"]
              }
            }
          },
          required: [
            "isHealthy",
            "cropName",
            "diseaseName",
            "scientificName",
            "confidence",
            "severity",
            "description",
            "symptoms",
            "treatments"
          ]
        }
      }
    });

    const text = response.text;
    if (text) {
      const result = JSON.parse(cleanJsonText(text));
      return res.json({
        ...result,
        translated: true
      });
    }
    throw new Error("Empty translation text");
  } catch (err: any) {
    console.error("Translation API Error, falling back to simulated Hindi:", err);
    return res.json(getSimulatedHindiTranslation(diagnosis));
  }
});

// API Endpoint for translating general text
app.post("/api/translate-text", async (req, res) => {
  const { text, targetLanguage = "hi" } = req.body;
  const ai = getAiClient();

  if (!ai || !text) {
    return res.json({ translatedText: `[अनुवाद] ${text}` });
  }

  try {
    const targetLanguageName = targetLanguage === "hi" ? "Hindi" : "English";
    const systemPrompt = `You are AgriSense AI Agronomist, translating farmer-agronomist communications into extremely simple, warm, everyday, farmer-friendly ${targetLanguageName}. Do not add any conversational padding like "Sure, here is the translation" - just output the exact translated text.`;

    const response = await generateContentWithFallback(ai, {
      contents: `Translate this text to simple ${targetLanguageName}: "${text}"`,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    const translated = response.text?.trim() || text;
    return res.json({
      translatedText: translated,
      translated: true
    });
  } catch (err: any) {
    console.error("Text Translation Error:", err);
    return res.json({ translatedText: `[अनुवाद] ${text}` });
  }
});


// Serve Vite in development, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgriSense server running on http://localhost:${PORT}`);
  });
}

startServer();
