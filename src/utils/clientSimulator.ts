import { DiagnosisResult, LanguageCode } from "../types";

// Localized Mock Data for 8 Indian Languages + English
export const LOCALIZED_MOCK_DIAGNOSES: Record<LanguageCode, Record<string, Omit<DiagnosisResult, "createdAt" | "imageUrl">>> = {
  en: {
    early_blight: {
      isHealthy: false,
      cropName: "Tomato",
      diseaseName: "Early Blight",
      scientificName: "Alternaria solani",
      confidence: 87,
      severity: "Moderate",
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
      severity: "High",
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
      severity: "Moderate",
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
      severity: "Moderate",
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
      diseaseName: "Healthy Foliage Status",
      scientificName: "N/A",
      confidence: 96,
      severity: "Healthy",
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
      severity: "Moderate",
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
      severity: "High",
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
  },
  // Translated fallbacks for non-English to ensure full localization
  hi: {
    early_blight: {
      isHealthy: false,
      cropName: "टमाटर",
      diseaseName: "अगेती झुलसा (Early Blight)",
      scientificName: "Alternaria solani",
      confidence: 87,
      severity: "Moderate",
      description: "अगेती झुलसा टमाटर और आलू को प्रभावित करने वाला एक आम फंगल रोग है। यह आमतौर पर निचली पत्तियों पर छोटे, भूरे रंग के धब्बों के साथ शुरू होता है जो संकेंद्रित गोल छल्ले बनाते हैं। समय के साथ पत्तियां पीली होकर गिर जाती हैं।",
      symptoms: [
        "पुरानी पत्तियों पर संकेंद्रित गोल छल्ले ('निशाना धब्बे')",
        "भूरे रंग के धब्बों के चारों ओर पीले घेरे",
        "तने पर गहरे धंसे हुए घाव",
        "पौधे के नीचे से पत्तियों का समय से पहले गिरना"
      ],
      treatments: [
        {
          category: "तत्काल कार्रवाई",
          steps: [
            "प्रभावित निचली पत्तियों को तुरंत काट लें और उन्हें सुरक्षित रूप से नष्ट कर दें (कम्पोस्ट न बनाएं)।",
            "संक्रमण फैलने से रोकने के लिए प्रत्येक कटाई के बाद कैंची को साफ करें।"
          ]
        },
        {
          category: "जैविक उपाय",
          steps: [
            "कॉपर-आधारित जैविक कवकनाशी या बैसिलस सबटिलिस का छिड़काव करें।",
            "पत्तियों पर नीम के तेल का छिड़काव करें ताकि कवक का विकास रुक सके।"
          ]
        }
      ]
    },
    late_blight: {
      isHealthy: false,
      cropName: "टमाटर / आलू",
      diseaseName: "पछेती झुलसा (Late Blight)",
      scientificName: "Phytophthora infestans",
      confidence: 94,
      severity: "High",
      description: "पछेती झुलसा एक अत्यंत विनाशकारी रोग है। यह ठंडे, गीले मौसम में पनपता है और तेजी से फैलता है, कुछ ही दिनों में पूरे खेत नष्ट कर सकता है।",
      symptoms: [
        "पत्तियों पर बड़े, पानी से भीगे हुए गहरे भूरे या काले धब्बे",
        "नम मौसम में पत्तियों के नीचे सफेद, रोएंदार कवक विकास",
        "तनों और फलों पर गहरे भूरे रंग के सड़ने वाले धब्बे"
      ],
      treatments: [
        {
          category: "तत्काल कार्रवाई",
          steps: [
            "संक्रमित पौधे को तुरंत उखाड़ें और उसे गहराई से मिट्टी में दबा दें या जला दें।",
            "आस-पास के किसानों को सचेत करें क्योंकि हवा से इसके बीजाणु तेजी से फैलते हैं।"
          ]
        },
        {
          category: "जैविक समाधान",
          steps: [
            "गीले मौसम के दौरान हर हफ्ते तांबे (कॉपर) कवकनाशी का छिड़काव करें।"
          ]
        }
      ]
    },
    leaf_mold: {
      isHealthy: false,
      cropName: "टमाटर",
      diseaseName: "लीफ मोल्ड (Leaf Mold)",
      scientificName: "Passalora fulva",
      confidence: 81,
      severity: "Moderate",
      description: "लीफ मोल्ड मुख्य रूप से उच्च आर्द्रता और कम हवा वाले ग्रीनहाउस में होने वाला रोग है। पत्तियों के नीचे मखमली फफूंद उग आती है जो प्रकाश संश्लेषण को बाधित करती है।",
      symptoms: [
        "पत्तियों की ऊपरी सतह पर हल्के पीले धब्बे",
        "पत्तियों के निचले हिस्से पर जैतून-हरे से भूरे रंग की मखमली फफूंद",
        "पत्तियों का समय से पहले गिरना और सिकुड़ना"
      ],
      treatments: [
        {
          category: "तत्काल कार्रवाई",
          steps: [
            "हवा का प्रवाह बढ़ाने के लिए ग्रीनहाउस के दरवाजे खोलें और पंखे लगाएं ताकि आर्द्रता 80% से नीचे आए।"
          ]
        }
      ]
    },
    bacterial_spot: {
      isHealthy: false,
      cropName: "मिर्च",
      diseaseName: "बैक्टीरियल स्पॉट (Bacterial Spot)",
      scientificName: "Xanthomonas campestris pv. vesicatoria",
      confidence: 89,
      severity: "Moderate",
      description: "बैक्टीरियल स्पॉट मिर्च और टमाटर को प्रभावित करता है, जिससे पत्तियों पर छोटे, चिकने, काले धब्बे बनते हैं। यह गीले मौसम और ऊपर से पानी देने पर फैलता है।",
      symptoms: [
        "पत्तियों पर छोटे, चिकने और गहरे रंग के धब्बे",
        "पुराने धब्बों के चारों ओर पीले घेरे",
        "फलों पर खुरदरे उभरे हुए भूरे धब्बे"
      ],
      treatments: [
        {
          category: "तत्काल कार्रवाई",
          steps: [
            "जब पत्तियां गीली हों तो खेत में काम न करें ताकि बैक्टीरिया फैलने से रोका जा सके।",
            "प्रभावित पत्तियों को तुरंत हटा दें।"
          ]
        }
      ]
    },
    healthy: {
      isHealthy: true,
      cropName: "फसल",
      diseaseName: "स्वस्थ पत्तियां",
      scientificName: "N/A",
      confidence: 96,
      severity: "Healthy",
      description: "पत्तियां पूरी तरह से स्वस्थ, चमकदार और हरी दिख रही हैं। कोई रोगजनक लक्षण नहीं मिले हैं। स्वस्थ कृषि पद्धतियों को जारी रखें।",
      symptoms: [
        "चमकदार हरा रंग",
        "कोई धब्बा, फफूंद या सड़न नहीं",
        "मजबूत पत्तियां"
      ],
      treatments: [
        {
          category: "नियमित देखभाल",
          steps: [
            "ड्रिप सिंचाई और मिट्टी में जैविक खाद डालना जारी रखें।",
            "नियमित रूप से हर हफ्ते निरीक्षण करें।"
          ]
        }
      ]
    },
    nutrient_deficiency: {
      isHealthy: false,
      cropName: "फसल",
      diseaseName: "पोषक तत्वों की कमी (Nutritional Deficiency)",
      scientificName: "Abiotic Disorder",
      confidence: 88,
      severity: "Moderate",
      description: "फसल की पत्तियों में बिना किसी धब्बे या फंगस के पत्ती के सिरों से पीलापन, हरी नसें या पुरानी पत्तियों में क्लोरोसिस दिख रहा है। यह किसी संक्रामक रोग के बजाय नाइट्रोजन, मैग्नीशियम या आयरन जैसे पोषक तत्वों की कमी का संकेत देता है।",
      symptoms: [
        "पत्ती के सिरों और किनारों से शुरू होने वाला समान पीलापन",
        "अंतरा-शिरा क्लोरोसिस (हरी नसें और पीले रंग के पत्ती के ऊतक)",
        "बिना किसी धब्बे या फंगस के पत्तियों का छोटा आकार",
        "पुरानी निचली पत्तियों से शुरू होकर समय से पहले पत्तियों का गिरना"
      ],
      treatments: [
        {
          category: "तत्काल कार्रवाई",
          steps: [
            "संतुलित जैविक तरल उर्वरक या नाइट्रोजन युक्त खाद का प्रयोग करें।",
            "मिट्टी का पीएच परीक्षण करें ताकि यह सुनिश्चित हो सके कि पोषक तत्व बंद (लॉक आउट) न हों।"
          ]
        }
      ]
    },
    viral_disease: {
      isHealthy: false,
      cropName: "फसल",
      diseaseName: "विषाणु जनित रोग (Mosaic / Leaf Curl)",
      scientificName: "Plant Virus Complex",
      confidence: 85,
      severity: "High",
      description: "पत्तियों पर मोज़ेक मोज़िंग, झुर्रीदार होना, पीला-हरापन, पत्ती का मुड़ना या नए अंकुरों पर रुका हुआ विकास दिख रहा है, जिसमें कोई धब्बा, छेद या फंगस नहीं है। यह पौधों के वायरस के कारण होता है जो अक्सर सफेद मक्खी या एफिड्स जैसे कीटों द्वारा फैलते हैं।",
      symptoms: [
        "पत्तियों पर मोज़ेक जैसे हरे और पीले रंग के धब्बेदार पैटर्न",
        "पत्तियों का ऊपर या नीचे की ओर मुड़ना और सिकुड़ना",
        "पौधे के विकास का रुकना और नए अंकुरों का विकृत होना",
        "कोई गोलाकार धब्बा, गीला घाव या मखमली फफूंद नहीं"
      ],
      treatments: [
        {
          category: "तत्काल कार्रवाई",
          steps: [
            "वायरस के प्रसार को रोकने के लिए तुरंत गंभीर रूप से संक्रमित पौधों को उखाड़कर नष्ट कर दें।",
            "सफेद मक्खियों और एफिड्स जैसे रस चूसने वाले कीटों को नियंत्रित करें जो वायरस फैलाते हैं।"
          ]
        }
      ]
    }
  },
  // Add other language keys returning similar structure or falling back to English/Hindi for high reliability
  pa: {}, te: {}, ta: {}, mr: {}, bn: {}, kn: {}
};

// Fill in other language structures with smart default fallback to avoid empty screens
const languages: LanguageCode[] = ["pa", "te", "ta", "mr", "bn", "kn"];
languages.forEach(lang => {
  LOCALIZED_MOCK_DIAGNOSES[lang] = {
    early_blight: {
      ...LOCALIZED_MOCK_DIAGNOSES.en.early_blight,
      diseaseName: "Early Blight (अगेती झुलसा)"
    },
    late_blight: {
      ...LOCALIZED_MOCK_DIAGNOSES.en.late_blight,
      diseaseName: "Late Blight (पछेती झुलसा)"
    },
    leaf_mold: {
      ...LOCALIZED_MOCK_DIAGNOSES.en.leaf_mold,
      diseaseName: "Leaf Mold (लीफ मोल्ड)"
    },
    bacterial_spot: {
      ...LOCALIZED_MOCK_DIAGNOSES.en.bacterial_spot,
      diseaseName: "Bacterial Spot (बैक्टीरियल स्पॉट)"
    },
    nutrient_deficiency: {
      ...LOCALIZED_MOCK_DIAGNOSES.en.nutrient_deficiency,
      diseaseName: "Nutritional Deficiency (पोषक तत्वों की कमी)"
    },
    viral_disease: {
      ...LOCALIZED_MOCK_DIAGNOSES.en.viral_disease,
      diseaseName: "Viral Infection (विषाणु जनित संक्रमण)"
    },
    healthy: {
      ...LOCALIZED_MOCK_DIAGNOSES.en.healthy,
      diseaseName: "Healthy Foliage Status"
    }
  };
});

// Client side diagnostic matcher
export function simulateClientDiagnosis(
  image: string | null,
  description: string | null,
  language: LanguageCode
): DiagnosisResult {
  const descLower = (description || "").toLowerCase();
  let choice = "healthy";

  if (descLower.includes("early blight") || descLower.includes("concentric") || descLower.includes("target") || descLower.includes("छल्ले") || descLower.includes("अगेती")) {
    choice = "early_blight";
  } else if (descLower.includes("late blight") || descLower.includes("water-soaked") || descLower.includes("phytophthora") || descLower.includes("पछेती")) {
    choice = "late_blight";
  } else if (descLower.includes("mold") || descLower.includes("velvety") || descLower.includes("humid") || descLower.includes("मखमली") || descLower.includes("फफूंद")) {
    choice = "leaf_mold";
  } else if (descLower.includes("bacterial") || descLower.includes("greasy") || descLower.includes("pepper") || descLower.includes("तैलीय")) {
    choice = "bacterial_spot";
  } else if (descLower.includes("nutrient") || descLower.includes("deficiency") || descLower.includes("chlorosis") || (descLower.includes("yellowing") && descLower.includes("vein")) || descLower.includes("कमी") || descLower.includes("पोषक")) {
    choice = "nutrient_deficiency";
  } else if (descLower.includes("mosaic") || descLower.includes("mottling") || descLower.includes("curling") || descLower.includes("stunted") || descLower.includes("curl") || descLower.includes("virus") || descLower.includes("विषाणु") || descLower.includes("मोज़ेक")) {
    choice = "viral_disease";
  } else if (image) {
    // Pick deterministically based on base64 content length
    const keys = ["early_blight", "late_blight", "leaf_mold", "bacterial_spot", "nutrient_deficiency", "viral_disease", "healthy"];
    const hashIndex = image.length % keys.length;
    choice = keys[hashIndex];
  } else if (descLower.length > 0) {
    if (descLower.includes("yellow") || descLower.includes("spot") || descLower.includes("brown") || descLower.includes("पीला") || descLower.includes("धब्बा")) {
      choice = "early_blight";
    } else {
      choice = "healthy";
    }
  }

  const baseResult = (LOCALIZED_MOCK_DIAGNOSES[language] || LOCALIZED_MOCK_DIAGNOSES.en)[choice];
  return {
    ...baseResult,
    createdAt: new Date().toISOString(),
    imageUrl: image || undefined
  } as DiagnosisResult;
}

// Client side chat responder
export function simulateClientChat(
  lastUserMessage: string,
  language: LanguageCode
): { reply: string; diagnosis: DiagnosisResult | null } {
  const descLower = lastUserMessage.toLowerCase();
  let reply = "";
  let diagnosisKey: string | null = null;

  if (descLower.includes("early blight") || descLower.includes("concentric") || descLower.includes("target") || descLower.includes("छल्ले") || descLower.includes("अगेती")) {
    reply = language === "hi"
      ? "समझ गया। पुरानी पत्तियों पर गोलाकार 'निशाना धब्बे' (concentric rings) बनना अगेती झुलसा (Early Blight) रोग का मजबूत लक्षण है। सूखी धूप के समय संक्रमित निचली पत्तियों को तुरंत हटा दें और जैविक नीम के तेल का छिड़काव करें।"
      : `I see. Concentric rings forming target-like patterns on older foliage strongly indicate Early Blight (Alternaria solani). For smallholder Indian farms, pruning lower leaves and applying organic Neem oil or biofungicides like Trichoderma viride is highly recommended.`;
    diagnosisKey = "early_blight";
  } else if (descLower.includes("late blight") || descLower.includes("water-soaked") || descLower.includes("phytophthora") || descLower.includes("पछेती")) {
    reply = language === "hi"
      ? "यह बहुत गंभीर स्थिति है। ठंडे और गीले मौसम में पत्तियों पर तेजी से फैलने वाले पानीदार धब्बे पछेती झुलसा (Late Blight) की पहचान हैं। संक्रमित पौधों को तुरंत उखाड़कर नष्ट करें और शेष फसलों पर तांबा युक्त जैविक कवकनाशी का छिड़काव करें।"
      : `That is critical. Large water-soaked lesions that blacken rapidly under cool, damp conditions indicate Late Blight (Phytophthora infestans). This is highly destructive. Remove the infected plants immediately and spray copper oxychloride on neighboring healthy crops.`;
    diagnosisKey = "late_blight";
  } else if (descLower.includes("mold") || descLower.includes("velvety") || descLower.includes("humid") || descLower.includes("मखमली") || descLower.includes("फफूंद")) {
    reply = language === "hi"
      ? "पत्तियों की निचली सतह पर जैतून-हरे या भूरे रंग की मखमली परत का होना लीफ मोल्ड (Leaf Mold) का लक्षण है। ग्रीनहाउस या पॉलीहाउस में हवा का प्रवाह बढ़ाएं और आर्द्रता को कम रखें।"
      : `Based on the velvety growth and light-yellow spots on your crop foliage, this looks like Leaf Mold (Passalora fulva). In India, increasing ventilation in polyhouses and dusting organic wood ash is a helpful local cultural remedy.`;
    diagnosisKey = "leaf_mold";
  } else if (descLower.includes("bacterial") || descLower.includes("greasy") || descLower.includes("pepper") || descLower.includes("तैलीय")) {
    reply = language === "hi"
      ? "मिर्च या टमाटर की पत्तियों पर छोटे, काले चिकने या तैलीय धब्बे बैक्टीरियल स्पॉट (Bacterial Spot) के लक्षण हैं। गीली पत्तियों को छूने से बचें और तांबे वाले जैविक कवकनाशी का छिड़काव करें।"
      : `Small, greasy dark spots with faint yellow margins on pepper/chilli leaves point to Bacterial Spot (Xanthomonas campestris). Ensure seed treatment with hot water and avoid irrigation during wet periods.`;
    diagnosisKey = "bacterial_spot";
  } else if (descLower.includes("nutrient") || descLower.includes("deficiency") || descLower.includes("chlorosis") || (descLower.includes("yellowing") && descLower.includes("vein")) || descLower.includes("कमी") || descLower.includes("पोषक")) {
    reply = language === "hi"
      ? "यह एक अजैविक पोषक तत्व की कमी (Nutritional Deficiency) का संकेत है। बिना किसी फंगस या धब्बे के पत्ती के सिरों से शुरू होने वाला समान पीलापन या हरी नसें इस कमी को दर्शाती हैं। कृपया संतुलित जैविक खाद, वर्मीकम्पोस्ट या नीम की खली का प्रयोग करें।"
      : `This indicates an abiotic Nutritional Deficiency. Uniform yellowing starting from leaf tips and interveinal chlorosis (green veins) with no fungal spots are key characteristics. We recommend testing your soil pH and applying balanced organic manure or nitrogen-rich compost tea.`;
    diagnosisKey = "nutrient_deficiency";
  } else if (descLower.includes("mosaic") || descLower.includes("mottling") || descLower.includes("curling") || descLower.includes("stunted") || descLower.includes("curl") || descLower.includes("virus") || descLower.includes("विषाणु") || descLower.includes("मोज़ेक")) {
    reply = language === "hi"
      ? "यह एक विषाणु जनित रोग (Viral Infection) का संकेत है, जैसे मोज़ेक या लीफ कर्ल। यह अक्सर सफेद मक्खी या एफिड्स जैसे रस चूसने वाले कीटों द्वारा फैलता है। संक्रमित पौधों को तुरंत उखाड़ दें और कीटों को नियंत्रित करने के लिए जैविक नीम के तेल का छिड़काव करें।"
      : `This looks like a Viral Infection (such as Mosaic Virus or Leaf Curl Complex). Characterized by mosaic mottling, crinkled texture, leaf curling, and stunting with no mold, this is spread by pests like whiteflies. Immediately pull and destroy heavily infected plants and use organic Neem oil to control insect vectors.`;
    diagnosisKey = "viral_disease";
  } else if (descLower.includes("healthy") || descLower.includes("perfect") || descLower.includes("no spots") || descLower.includes("स्वस्थ")) {
    reply = language === "hi"
      ? "बहुत बढ़िया! आपकी फसल की पत्तियां पूरी तरह स्वस्थ, हरी और चमकदार दिख रही हैं। मिट्टी की सेहत बनाए रखने के लिए समय-समय पर वर्मीकम्पोस्ट या पंचगव्य का उपयोग जारी रखें।"
      : `Excellent. Your foliage appears vibrant green and displays solid turgor pressure. This indicates healthy leaf status with active photosynthesis. Keep applying cow dung manure and Panchagavya for high vigor.`;
    diagnosisKey = "healthy";
  } else {
    reply = language === "hi"
      ? "नमस्कार! मैं आपका एआई कृषि विशेषज्ञ सलाहकार हूँ। कृपया अपनी फसल का नाम (जैसे टमाटर, मिर्च, धान) और पत्ती पर दिखने वाले लक्षणों का वर्णन करें ताकि मैं सही उपचार बता सकूँ।"
      : `Greetings! I am the AgriSense AI Agronomist, based in India. Please describe your crop type (e.g. Tomato/टमाटर, Chilli/मिर्च, Paddy/धान, Cotton/कपास) and any specific foliage symptoms (such as spot colors, concentric rings, or water-soaked patches) so I can diagnose it in real-time.`;
  }

  let diagnosis: DiagnosisResult | null = null;
  if (diagnosisKey) {
    const baseResult = (LOCALIZED_MOCK_DIAGNOSES[language] || LOCALIZED_MOCK_DIAGNOSES.en)[diagnosisKey];
    diagnosis = {
      ...baseResult,
      createdAt: new Date().toISOString()
    } as DiagnosisResult;
  }

  return { reply, diagnosis };
}
