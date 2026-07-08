import { LibraryDisease } from "../types";

export const PRESET_DISEASES: LibraryDisease[] = [
  {
    id: "early_blight",
    name: "Early Blight",
    scientificName: "Alternaria solani",
    crop: "Tomato",
    severity: "Moderate",
    description: "A very common fungal pathogen affecting tomato and potato foliage. It begins as small, dark brown lesions on older foliage and works its way upward. Untreated, it leads to heavy defoliation and reduces crop yield significantly.",
    symptoms: [
      "Concentric black/brown ring lesions ('target-spots')",
      "Yellowing of leaves starting at the bottom of the plant",
      "Leathery black spots on tomatoes near the stem end",
      "Stunted growth and premature leaf drop"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Prune off infected lower leaves immediately and burn or bag them.",
          "Wipe shears with antiseptic wipes after every cut to avoid cross-contamination."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Apply mulch to prevent soil-dwelling spores from splashing onto foliage.",
          "Switch to early morning drip irrigation; avoid overhead sprinklers."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray with copper fungicides or organic Bacillus subtilis biopesticides.",
          "Apply neem oil to leaves to suppress fungal development."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Rotate nightshade crops with non-susceptible crops every 3 years.",
          "Space plants 3 feet apart to facilitate ample wind drying."
        ]
      }
    ],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTLklxllDm4TixyWPAS21jubyizji3zSuIrW7MLF5O2Cb0EsiCCbJmcm0J-pj66_7sfwtw1Dq2Vj3IcLieGbeQ9obHCOgrms2r9mR0RcifyvzEXM7R8gixTAdQUNB07MSpywFHRqNDiZBEQGeNumbMhYg6NEdlYe3R_9qJepMDXS5WhKq0h00-03Gv_MQeusYKnfqBT0VHQtBnd1T97b9ygga4oxp8Q050LFKT53ufTi4L2TUhoW6ezCG11D4KCc5AugBeiJ0UHr8"
  },
  {
    id: "late_blight",
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    crop: "Potato / Tomato",
    severity: "High",
    description: "An incredibly destructive oomycete disease thriving in wet and cool weather. Famous for causing the Irish Potato Famine, late blight destroys leaf canopies and rots tubers, spreading via airborne spores for miles.",
    symptoms: [
      "Large, irregular water-soaked dark lesions on leaves",
      "Fuzzy white mold-like spore growth on leaf undersides in wet weather",
      "Dark brown, greasy-looking rot on tomato fruits",
      "Complete branch collapse and leaf necrosis within 48 hours"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Pull out the entire infected plant and destroy or bury it deeply. Do not compost.",
          "Alert nearby farmers as airborne spores can infect their crops within hours."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Water early to ensure foliage dries thoroughly before nightfall.",
          "Harvest remaining salvageable potatoes and tomatoes immediately."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Apply copper fungicide sprays weekly during damp, high-risk periods."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Plant resistant cultivars (e.g., 'Mountain Merit' tomatoes).",
          "Destroy volunteer potato tubers from the soil after winter to break the cycle."
        ]
      }
    ],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA47vUT7G9DLAZve3kfU9WvX8zff7yiNhUi9zQl4xYc_6udywEl-8IE9UR9uNsjJLqPHJzkvAh0q4qOav182SXpJCTHaqaLZMCKfJ6IZrGOuWHchAY7rBocN9D4oag6mwwS6u-s_jhe9-jefoQ-UQr7ZYrnSejB5zDpXXuOffFn8Si9aMXXnFO7BxOMfI9teI8A4ELTe5C1xUAfNUvzVFLX2YzT_do6sz5Rx1OjYryFbT-GTBqTZB4KpUctF5jlpxJpOxi-vXAzSWM"
  },
  {
    id: "leaf_mold",
    name: "Leaf Mold",
    scientificName: "Passalora fulva",
    crop: "Tomato",
    severity: "Moderate",
    description: "A disease occurring mainly in high-humidity greenhouses or plastic hoop tunnels. Spores germinate on wet leaves, creating yellow spots and fuzzy velvet growth underneath, restricting photosynthesis.",
    symptoms: [
      "Light yellow spots with diffuse margins on upper leaf surfaces",
      "Olive-green to grey-velvet fuzzy growth on the lower surface",
      "Leaf curling, death, and drop, starting from the oldest leaves"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Open greenhouse doors and install air-circulating fans to lower humidity below 80%.",
          "Remove leaves with thick velvety backing to reduce spore density."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Space plants widely and prune sucker stems to encourage light and air penetration.",
          "Water plants strictly through ground-level drip lines."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Apply preventative sprays of Bacillus amyloliquefaciens or sulfur fungicides."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Sterilize greenhouse interiors (frames, posts, tools) thoroughly before replanting.",
          "Select tomato seed varieties with specific Ff (Cladosporium) resistance."
        ]
      }
    ],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC32x5wbTLJmTU_fEq01LsmLQ78hIINEJEeZnPAhXTFGNvayVb4v2K0HMvg-ME4hIbzWv7p5pzErtvHQ2d6sz3e6SMynvUhbhOskBbKVDbXhNGHio4_SUpkOb_s6ycw68nsTKsC5qtApmKsz_7KbdV2jzcMd03AwMXXMgRocLWv1b1N5RklosVSynQOvgCOzAbnsyMQGjKjC48VJKeT2OTcPLlOppj8jOrle113zaUO9jPzi65Y72L2-oj_VcGIB4Bd-fEEHIV1TRI"
  },
  {
    id: "bacterial_spot",
    name: "Bacterial Spot",
    scientificName: "Xanthomonas species",
    crop: "Pepper / Tomato",
    severity: "Moderate",
    description: "A bacterial infection causing small, water-soaked, black lesions on the leaves, stems, and fruits. It spreads via wind-driven rain and overhead watering, severely defoliating plants in hot, humid summers.",
    symptoms: [
      "Small, angular, greasy dark lesions on leaf undersides",
      "Yellow halos surrounding necrotic spots",
      "Scabby raised lesions on mature pepper and tomato fruit",
      "Severe leaf loss exposing fruit to direct sunscald"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Avoid touching, pruning, or picking crops when foliage is wet.",
          "Strip heavily spotted leaves only on dry, sunny afternoons."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Eradicate nightshade weed varieties that serve as bacterial reservoirs.",
          "Clean all harvest crates, stakes, and tools with disinfectants."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Use a combination of copper spray and double-strength microbial biopesticides.",
          "Spray copper hydroxide in early vegetative stages before disease expands."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Use hot-water treated or certified disease-free seeds.",
          "Maintain a 2-year rotation cycle away from Solanaceae hosts."
        ]
      }
    ],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmlaZPnsldJGIugWrfFRgZiPsybOxnPkGJXNSezO5wz8Rq0r8XKbXCLba9Arse2ZUySFouqqERSmfQx2_8AEXZVkAEoG7Eb4R_F00fn2KM8Ctd44fLt8WAUXcPaK2xS0u7Pw-ZrZFqIs0DhjaD7qOJ51NgIH8D1RmCauJhX-4n9HT_mLlV26WrTrLKLxpAFpL7uhL4HJ4gCYBBqCKEXHqRdS_h24KecJdc2u2u8gOQuGfTHc9UhbRUScNuDXl8nn3ki23iznD05VY"
  },
  {
    id: "bacterial_wilt",
    name: "Bacterial Wilt",
    scientificName: "Ralstonia solanacearum",
    crop: "Tomato / Potato",
    severity: "High",
    description: "A very harmful soil bacteria that enters roots and blocks water flow inside the plant. It causes the plant to wilt and die very quickly, even while leaves are still green.",
    symptoms: [
      "Rapid wilting of leaves starting during the warm afternoon",
      "Stems become limp and can ooze a sticky whitish liquid when cut and squeezed",
      "Internal browning of the stem chambers"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Pull out the wilting plants immediately and burn them. Do not let them rot in the soil."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Do not plant tomatoes, potatoes, or peppers in that same spot for at least 4 years."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Apply Pseudomonas fluorescens or Trichoderma viride to soil before planting to block the disease."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Always use healthy, disease-free seed potatoes.",
          "Keep garden tools clean with soap and water."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "rhizobium_bacteria",
    name: "Rhizobium (Beneficial Bacteria)",
    scientificName: "Rhizobium species",
    crop: "Legumes / Soil",
    severity: "Low",
    description: "A friendly and extremely helpful soil bacteria that lives on the roots of beans, peas, and lentils. It takes nitrogen gas from the air and turns it into natural food (fertilizer) for the plant, making the soil rich.",
    symptoms: [
      "Small, round, pinkish bumps (nodules) on the plant's roots",
      "Leaves look deep green and healthy instead of pale yellow",
      "Surrounding soil becomes richer in nitrogen for future crops"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "No cure needed, this is highly beneficial! Let them grow and multiply."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Mix legume crops like beans with other crops to share the natural nitrogen fertilizer."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Buy Rhizobium inoculant powder to coat legume seeds before planting them to boost root nodules."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Avoid using strong chemical nitrogen fertilizers, as they can stop these friendly bacteria from working."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "potato_scab",
    name: "Potato Scab",
    scientificName: "Streptomyces scabies",
    crop: "Potato",
    severity: "Low",
    description: "A common soil-dwelling bacterium that attacks growing potato tubers. While the potato is still safe to eat after peeling, it creates ugly, rough, corky skin patches that reduce market value.",
    symptoms: [
      "Rough, raised, brown corky spots on potato skins",
      "Pit-like dark lesions on the potato tubers",
      "No clear symptoms on the above-ground leaves"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Keep the soil moist during potato tuber growth to reduce scab bacteria activity."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Maintain acidic soil (pH below 5.2) where potatoes grow, as scab bacteria hate acid."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spread sulfur on the soil to lower pH, and add plenty of cow dung compost."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Plant scab-resistant potato varieties.",
          "Do not use fresh animal manure right before planting."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "crown_gall",
    name: "Crown Gall",
    scientificName: "Agrobacterium tumefaciens",
    crop: "Fruit / Tomato",
    severity: "Moderate",
    description: "A harmful bacterium that enters plants through root wounds and forces the plant to grow large, tumor-like swollen balls near the soil line. This drains the plant's energy and blocks food flow.",
    symptoms: [
      "Large, rough, dark brown woody swollen balls (galls) on roots or lower stems",
      "Stunted growth and weak branches",
      "Yellowing leaves and lower fruit production"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Prune off small galls using sterile tools, or remove heavily infected plants completely."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Avoid wounding the roots or lower stems during weeding or digging."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Wash tools in disinfectant between plants. Apply beneficial Agrobacterium radiobacter to protect plant wounds."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Always inspect roots of new plants for swollen bumps before putting them in your soil."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bacillus_subtilis",
    name: "Bacillus Subtilis (Beneficial Shield)",
    scientificName: "Bacillus subtilis",
    crop: "Soil / All Crops",
    severity: "Low",
    description: "A friendly, beneficial bacterium found naturally in healthy soil. It wraps itself around plant roots like a shield to protect them from bad fungi and helps the plant grow stronger.",
    symptoms: [
      "Strong, white, hairy and highly active root systems",
      "Healthy leaves that easily resist common spot diseases",
      "Rapid seed germination and seedling growth"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "No treatment needed! Encourage these helper bacteria."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Keep soil moist, aerated, and full of organic compost to feed these bacteria."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Mix Bacillus subtilis liquid or powder with irrigation water or use it as a leaf spray."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Avoid spraying chemical fungicides on soil, as they can harm beneficial microbes."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1463171359079-3d19a6be17b6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "damping_off",
    name: "Root Rot & Damping Off",
    scientificName: "Pythium & Rhizoctonia species",
    crop: "Seedlings / Soil",
    severity: "High",
    description: "A very harmful soil-borne problem where seeds rot before sprouting, or young seedlings suddenly fall over and die at the soil line due to excess water and poor air flow.",
    symptoms: [
      "Seedlings falling over flat on the soil with thin, mushy pinched stems",
      "Seeds rotting directly inside the soil and failing to grow",
      "Root systems of larger plants turning brown, mushy, and smelly"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Stop watering immediately. Remove dead seedlings and let the soil surface dry in the sun."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Use clean, well-draining soil and do not water too much. Ensure trays have drain holes."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Dust wood ash on the soil surface to dry it, or spray with mild chamomile tea to fight rot."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Keep seedling trays warm with good air movement.",
          "Avoid sowing seeds too close together."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fusarium_wilt",
    name: "Fusarium Wilt",
    scientificName: "Fusarium oxysporum",
    crop: "Tomato / Pepper",
    severity: "High",
    description: "A harmful soil-dwelling fungus that enters the roots and travels up the stem's water pipes. It blocks water, causing leaves to turn yellow and wilt from the bottom up, often on just one side of the plant.",
    symptoms: [
      "Lower leaves turn bright yellow, often starting on only one branch or one side",
      "Leaves and branches wilt on warm days but seem to recover slightly at night",
      "Stem interiors show dark brown streaks when cut open lengthwise"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Pull out the infected plant to prevent the fungus from multiplying in your soil."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Grow crops in raised beds or clean pots to keep them away from infected garden soil."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Mix beneficial Trichoderma viride or Bacillus subtilis powders into your soil before planting to crowd out the wilt."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Plant resistant varieties (labeled with an 'F' code). Keep soil pH around 6.5 to 7.0."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "rice_blast",
    name: "Rice Blast (धान का झोंका रोग)",
    scientificName: "Magnaporthe oryzae",
    crop: "Rice / Paddy",
    severity: "High",
    description: "One of the most destructive diseases of rice in India, especially during wet and warm weather. It causes spindle-shaped spots on leaves, and can choke the neck of the rice panicle, causing it to fall over.",
    symptoms: [
      "Spindle-shaped spots on leaves with gray centers and brown borders",
      "Brownish lesions on the neck of the panicle (neck blast)",
      "Blank or half-filled grain heads that turn white and droop"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Stop heavy nitrogen feeding and keep the field drained of stagnant warm water."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Burn infected crop stubble after harvest to clear spores. Rotate with non-grass crops."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray with Pseudomonas fluorescens or bio-fungicide Trichoderma harzianum. Dust with wood ash."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Plant blast-resistant rice varieties like Pusa Basmati or IR-64. Avoid over-watering in early stages."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cotton_leaf_curl",
    name: "Cotton Leaf Curl (कपास का पत्ता मरोड़)",
    scientificName: "Cotton leaf curl virus",
    crop: "Cotton",
    severity: "High",
    description: "A viral disease spread by tiny whiteflies, very common in Northern and Western India. It causes cotton leaves to curl upwards and grow thick leafy outgrowths underneath, severely reducing cotton boll yields.",
    symptoms: [
      "Upward or downward curling of leaf margins",
      "Thickening of leaf veins on the underside",
      "Cup-like leafy structures (enations) on leaf bottoms",
      "Stunted plant growth and fewer cotton bolls"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Pull out and destroy infected cotton plants immediately to stop the virus from spreading."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Eradicate local weeds like Kanghi (Sida acuta) that harbor the virus and whiteflies."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray Neem Oil (5% concentration) or sour buttermilk solution to repel whiteflies."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Plant whitefly-resistant Bt Cotton varieties. Set up yellow sticky traps to catch whiteflies."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "citrus_canker",
    name: "Citrus Canker (नींबू का कैंकर रोग)",
    scientificName: "Xanthomonas axonopodis pv. citri",
    crop: "Lemon / Lime / Orange",
    severity: "Moderate",
    description: "A highly infectious bacterial disease affecting acid limes (Kagzi lime) and oranges across India. It causes rough, corky, raised brown spots on leaves, twigs, and fruits, causing fruit drop.",
    symptoms: [
      "Small, round, raised brown spots surrounded by a bright yellow halo on leaves",
      "Rough, crater-like corky lesions on citrus fruits",
      "Twig dieback and premature fruit dropping"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Prune off infected citrus twigs and branches during dry weather and burn them."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Prune the canopy to allow plenty of sunlight and wind flow to dry leaves quickly."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray copper-based fungicides or Bordeaux mixture (1%) after pruning."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Always use disease-free nursery saplings. Avoid working with trees when leaves are wet."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "black_scurf_potato",
    name: "Black Scurf of Potato (आलू का ब्लैक स्कर्फ)",
    scientificName: "Rhizoctonia solani",
    crop: "Potato",
    severity: "Moderate",
    description: "A major soil-borne fungal disease in India that leaves hard, black, dirt-like crusts (sclerotia) on potato skins. It also kills rising potato sprouts in early spring.",
    symptoms: [
      "Hard, blackish-brown dirt-like crusts on potato skins that won't wash off",
      "Brown sunken lesions on underground stems and sprouts",
      "Aerial green tubers forming on the plant joints above the soil line"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Avoid late harvesting, as scab/scurf grows thicker the longer potatoes stay in wet soil."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Rotate potato fields with maize or green manure crops like Sunn hemp."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Treat potato seed tubers with Trichoderma viride powder before planting."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Plant only clean, unblemished seed potatoes. Ensure shallow planting in warm, moist soil for fast sprout rise."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1508747703725-719ae2c73ee8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "black_rust_wheat",
    name: "Black Rust of Wheat (गेहूं का काला किट्ट)",
    scientificName: "Puccinia graminis f. sp. tritici",
    crop: "Wheat",
    severity: "High",
    description: "Also known as stem rust, this devastating fungal disease has a long history in India (especially Central and Southern India). It produces reddish-brown powdery pustules on wheat stems and leaves, causing the wheat to lodge (fall over).",
    symptoms: [
      "Reddish-brown, oblong pustules (spots) that release dusty powdery spores on stems and leaf sheaths",
      "Black pustules appearing later in the season as the plant matures",
      "Shriveled grains and dry, brittle stems that break easily"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Apply sulfur dust or organic propiconazole sprays at the very first sign of rust."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Avoid late sowing of wheat, which exposes the crop to warm spring weather favored by rust."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray a mixture of sour whey/buttermilk and cow urine to suppress spore germination."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Plant stem rust-resistant wheat varieties recommended for Indian regions (e.g., DBW series)."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "chilli_leaf_curl",
    name: "Chilli Leaf Curl Virus (मिर्च का मरोड़िया)",
    scientificName: "Chilli leaf curl virus",
    crop: "Chilli / Pepper",
    severity: "High",
    description: "An extremely common viral disease in India affecting chilli peppers, spread by whiteflies. It causes leaves to curl tightly upwards and shrivel, turning the chilli plant bushy and completely barren.",
    symptoms: [
      "Leaves curling upwards, puckering, and bunching together tightly",
      "Severe stunting of plants with crowded, miniature leaves (bushy appearance)",
      "Dropping of flowers and fruits failing to form or turning out tiny and deformed"
    ],
    treatments: [
      {
        category: "Immediate Actions",
        steps: [
          "Pull out infected shriveled plants and bury them immediately to prevent further insect transmission."
        ]
      },
      {
        category: "Cultural Controls",
        steps: [
          "Maintain a weed-free field. Clear nightshade weeds from surrounding edges."
        ]
      },
      {
        category: "Organic Solutions",
        steps: [
          "Spray with diluted garlic-onion extract or Neem Seed Kernel Extract (NSKE) to control the whitefly carriers."
        ]
      },
      {
        category: "Prevention",
        steps: [
          "Grow barrier crops like maize or sorghum around chilli fields. Use silver/reflective plastic mulches to repel whiteflies."
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1588252393731-80a15141ef53?auto=format&fit=crop&w=800&q=80"
  }
];
