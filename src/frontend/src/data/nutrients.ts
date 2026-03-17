export interface Nutrient {
  name: string;
  fact: string;
  rda: string;
}

export const nutrients: Nutrient[] = [
  {
    name: "Collagen",
    fact: "The most abundant protein in your body, forming the structure of skin, bones, and connective tissue. It keeps skin firm and joints flexible.",
    rda: "2.5–15g/day (supplement range)",
  },
  {
    name: "Vitamin A",
    fact: "Essential for vision, immune function, and skin health. It supports cell growth and is a powerful antioxidant.",
    rda: "700–900 mcg RAE/day",
  },
  {
    name: "Vitamin B1 (Thiamine)",
    fact: "Converts food into energy and supports nerve function. Critical for brain and muscle health.",
    rda: "1.1–1.2 mg/day",
  },
  {
    name: "Vitamin B2 (Riboflavin)",
    fact: "Plays a key role in energy production and cellular function. It also helps the body absorb other B vitamins.",
    rda: "1.1–1.3 mg/day",
  },
  {
    name: "Vitamin B3 (Niacin)",
    fact: "Supports DNA repair, energy metabolism, and reduces cholesterol. Essential for skin and nerve health.",
    rda: "14–16 mg NE/day",
  },
  {
    name: "Vitamin B5 (Pantothenic Acid)",
    fact: "Vital for synthesizing CoA, which drives fat and carbohydrate metabolism. Found in nearly every food.",
    rda: "5 mg/day",
  },
  {
    name: "Vitamin B6",
    fact: "Involved in over 100 enzyme reactions. Supports brain health, immune function, and red blood cell formation.",
    rda: "1.3–1.7 mg/day",
  },
  {
    name: "Vitamin B7 (Biotin)",
    fact: "Essential for fat, carbohydrate, and protein metabolism. Popularly known for supporting healthy hair and nails.",
    rda: "30 mcg/day",
  },
  {
    name: "Vitamin B9 (Folate)",
    fact: "Critical for DNA synthesis and cell division. Especially important during pregnancy for neural tube development.",
    rda: "400 mcg DFE/day",
  },
  {
    name: "Vitamin B12",
    fact: "Needed for nerve function, DNA synthesis, and red blood cell formation. Found only in animal products.",
    rda: "2.4 mcg/day",
  },
  {
    name: "Vitamin C",
    fact: "A powerful antioxidant that boosts immunity, collagen synthesis, and iron absorption. Fights free radicals.",
    rda: "75–90 mg/day",
  },
  {
    name: "Vitamin D",
    fact: "Regulates calcium and phosphorus absorption. Essential for bone health, immune support, and mood regulation.",
    rda: "600–800 IU/day",
  },
  {
    name: "Vitamin E",
    fact: "A fat-soluble antioxidant that protects cells from damage and supports immune function and skin health.",
    rda: "15 mg/day",
  },
  {
    name: "Vitamin K",
    fact: "Essential for blood clotting and bone metabolism. K2 specifically directs calcium to bones, not arteries.",
    rda: "90–120 mcg/day",
  },
  {
    name: "Calcium",
    fact: "The most abundant mineral in the body. Builds and maintains strong bones and teeth, and supports muscle contraction.",
    rda: "1,000–1,200 mg/day",
  },
  {
    name: "Iron",
    fact: "Carries oxygen in red blood cells via hemoglobin. Deficiency causes fatigue and weakened immunity.",
    rda: "8–18 mg/day",
  },
  {
    name: "Magnesium",
    fact: "Involved in 300+ biochemical reactions including muscle function, nerve signals, and energy production.",
    rda: "310–420 mg/day",
  },
  {
    name: "Zinc",
    fact: "Supports immune function, wound healing, DNA synthesis, and taste and smell perception.",
    rda: "8–11 mg/day",
  },
  {
    name: "Potassium",
    fact: "Regulates fluid balance, nerve signals, and muscle contractions. Counteracts sodium to manage blood pressure.",
    rda: "2,600–3,400 mg/day",
  },
  {
    name: "Phosphorus",
    fact: "Works with calcium to build bones and teeth. Also essential for energy production (ATP) and cell membrane structure.",
    rda: "700 mg/day",
  },
  {
    name: "Sodium",
    fact: "Maintains fluid balance and blood pressure, and enables nerve transmission and muscle contraction.",
    rda: "<2,300 mg/day",
  },
  {
    name: "Selenium",
    fact: "A trace mineral with powerful antioxidant properties. Supports thyroid function and protects against cell damage.",
    rda: "55 mcg/day",
  },
  {
    name: "Copper",
    fact: "Aids in iron absorption, energy production, and nerve function. Also vital for forming connective tissue and red blood cells.",
    rda: "900 mcg/day",
  },
  {
    name: "Manganese",
    fact: "Supports bone formation, blood clotting, and reduces inflammation. Acts as a cofactor for many enzymes.",
    rda: "1.8–2.3 mg/day",
  },
  {
    name: "Chromium",
    fact: "Enhances the action of insulin and is involved in carbohydrate, fat, and protein metabolism.",
    rda: "25–35 mcg/day",
  },
  {
    name: "Iodine",
    fact: "Essential for thyroid hormone production which regulates metabolism, growth, and brain development.",
    rda: "150 mcg/day",
  },
  {
    name: "Fluoride",
    fact: "Strengthens tooth enamel and helps prevent cavities. Also supports bone health.",
    rda: "3–4 mg/day",
  },
  {
    name: "Molybdenum",
    fact: "A trace mineral that helps break down harmful sulfites and metabolize certain amino acids.",
    rda: "45 mcg/day",
  },
  {
    name: "Chloride",
    fact: "Helps maintain fluid balance, produces stomach acid (HCl), and supports nerve impulse transmission.",
    rda: "1,800–2,300 mg/day",
  },
  {
    name: "Omega-3 Fatty Acids",
    fact: "Anti-inflammatory fats crucial for brain function, heart health, and reducing triglycerides. EPA and DHA are most bioactive.",
    rda: "1.1–1.6 g ALA/day (250–500 mg EPA+DHA recommended)",
  },
  {
    name: "Omega-6 Fatty Acids",
    fact: "Essential fats for brain function and normal growth. Must be balanced with omega-3s to reduce inflammation.",
    rda: "11–17 g/day",
  },
  {
    name: "Protein",
    fact: "Made of amino acids, it builds and repairs muscles, organs, and tissues. Also makes enzymes, hormones, and antibodies.",
    rda: "0.8–1.2 g/kg body weight/day",
  },
  {
    name: "Leucine",
    fact: "A branched-chain amino acid (BCAA) that directly stimulates muscle protein synthesis. Key for muscle recovery.",
    rda: "~2.7 g/day (as part of complete protein)",
  },
  {
    name: "Isoleucine",
    fact: "A BCAA involved in muscle metabolism and energy regulation. Helps maintain blood sugar during exercise.",
    rda: "~1.4 g/day",
  },
  {
    name: "Valine",
    fact: "A BCAA that supports muscle tissue repair, energy, and nitrogen balance in the body.",
    rda: "~1.7 g/day",
  },
  {
    name: "Lysine",
    fact: "An essential amino acid vital for collagen formation, calcium absorption, and immune function.",
    rda: "~2.1 g/day",
  },
  {
    name: "Methionine",
    fact: "A sulfur-containing amino acid important for metabolism, detoxification, and initiation of protein synthesis.",
    rda: "~1.1 g/day",
  },
  {
    name: "Phenylalanine",
    fact: "Precursor to tyrosine and neurotransmitters like dopamine and norepinephrine. Affects mood and focus.",
    rda: "~1.7 g/day",
  },
  {
    name: "Threonine",
    fact: "Supports immune function, fat metabolism, and collagen and elastin production in skin and connective tissue.",
    rda: "~1.0 g/day",
  },
  {
    name: "Tryptophan",
    fact: "Precursor to serotonin and melatonin. Promotes mood stability, sleep quality, and appetite control.",
    rda: "~0.28 g/day",
  },
  {
    name: "Histidine",
    fact: "Essential for tissue repair, immune response, and production of histamine which regulates gut and immune response.",
    rda: "~0.7 g/day",
  },
  {
    name: "Arginine",
    fact: "Precursor to nitric oxide which relaxes blood vessels. Supports circulation, healing, and immune function.",
    rda: "Conditionally essential; ~3–6 g/day for performance",
  },
  {
    name: "Glutamine",
    fact: "The most abundant amino acid in the body. Fuels immune cells and intestinal cells; supports recovery after intense exercise.",
    rda: "~5 g/day for athletes",
  },
  {
    name: "Carbohydrates",
    fact: "The body's primary fuel source. Complex carbs provide sustained energy while simple carbs offer quick fuel.",
    rda: "130 g/day minimum; 45–65% of total calories",
  },
  {
    name: "Dietary Fiber",
    fact: "Supports digestive health, regulates blood sugar, lowers cholesterol, and feeds beneficial gut bacteria.",
    rda: "25–38 g/day",
  },
  {
    name: "Soluble Fiber",
    fact: "Dissolves in water to form a gel, slowing digestion and lowering blood cholesterol and glucose levels.",
    rda: "Part of total 25–38 g fiber/day",
  },
  {
    name: "Insoluble Fiber",
    fact: "Adds bulk to stool, promotes regular bowel movements, and helps prevent constipation.",
    rda: "Part of total 25–38 g fiber/day",
  },
  {
    name: "Water",
    fact: "Essential for every bodily function — regulating temperature, transporting nutrients, and flushing waste.",
    rda: "2.7–3.7 L/day total (including food sources)",
  },
  {
    name: "Electrolytes",
    fact: "Minerals like sodium, potassium, and magnesium that regulate hydration, nerve signals, and muscle contractions.",
    rda: "Varies per mineral",
  },
  {
    name: "Probiotics",
    fact: "Beneficial bacteria that support gut health, immunity, and even mood via the gut-brain axis.",
    rda: "1–10 billion CFU/day (varies by strain)",
  },
  {
    name: "Prebiotics",
    fact: "Non-digestible fibers that feed beneficial gut bacteria. Found in garlic, onions, bananas, and oats.",
    rda: "5–20 g/day",
  },
  {
    name: "Choline",
    fact: "Supports liver function, brain development, nerve signaling, and fat transport. Often grouped with B vitamins.",
    rda: "425–550 mg/day",
  },
  {
    name: "Inositol",
    fact: "A carbohydrate that supports cell membrane function, mental health, and insulin signaling.",
    rda: "Not established; 1–4 g/day used therapeutically",
  },
  {
    name: "Coenzyme Q10 (CoQ10)",
    fact: "An antioxidant that powers cellular energy production in mitochondria. Supports heart health and slows aging.",
    rda: "100–300 mg/day (therapeutic range)",
  },
  {
    name: "Alpha-Lipoic Acid",
    fact: "A versatile antioxidant that regenerates other antioxidants and helps convert glucose into energy.",
    rda: "200–600 mg/day (therapeutic)",
  },
  {
    name: "Glutathione",
    fact: "The body's master antioxidant, protecting cells from damage and supporting detoxification in the liver.",
    rda: "Not established; produced internally",
  },
  {
    name: "Curcumin",
    fact: "The active compound in turmeric with potent anti-inflammatory and antioxidant properties. Supports joint and brain health.",
    rda: "500–1,000 mg/day (with piperine for absorption)",
  },
  {
    name: "Resveratrol",
    fact: "A polyphenol found in grapes and berries that mimics calorie restriction and supports heart and brain health.",
    rda: "150–500 mg/day (supplement)",
  },
  {
    name: "Beta-Carotene",
    fact: "A precursor to vitamin A. Acts as an antioxidant and gives orange and yellow fruits their color.",
    rda: "No set RDA; 3–6 mg/day from food",
  },
  {
    name: "Lycopene",
    fact: "A red pigment in tomatoes and watermelon with strong antioxidant effects. Linked to reduced prostate cancer risk.",
    rda: "8–21 mg/day from food",
  },
  {
    name: "Lutein",
    fact: "A carotenoid that protects eyes from blue light and reduces risk of macular degeneration and cataracts.",
    rda: "10 mg/day",
  },
  {
    name: "Zeaxanthin",
    fact: "Works alongside lutein to protect the macula of the eye and maintain sharp central vision.",
    rda: "2 mg/day",
  },
  {
    name: "Quercetin",
    fact: "A flavonoid with anti-inflammatory, antihistamine, and antioxidant effects. Supports immune and cardiovascular health.",
    rda: "500–1,000 mg/day (supplement)",
  },
  {
    name: "Flavonoids",
    fact: "A large family of plant compounds with antioxidant and anti-inflammatory effects. Found in fruits, tea, and cocoa.",
    rda: "Not established; 200–400 mg/day estimated from diet",
  },
  {
    name: "Anthocyanins",
    fact: "Pigments in blueberries and purple foods that fight oxidative stress, support brain health, and reduce inflammation.",
    rda: "Not established; 40–200 mg/day from diet",
  },
  {
    name: "Polyphenols",
    fact: "Plant compounds that act as antioxidants, protect against heart disease, improve gut health, and reduce cancer risk.",
    rda: "Not established; 1–2 g/day from varied plant diet",
  },
  {
    name: "Phytosterols",
    fact: "Plant compounds structurally similar to cholesterol that block cholesterol absorption and lower LDL levels.",
    rda: "2 g/day for cholesterol-lowering effect",
  },
  {
    name: "Lecithin",
    fact: "A fatty substance that supports cell membrane integrity, liver health, and acts as an emulsifier in the body.",
    rda: "~1.2 g/day (from food)",
  },
  {
    name: "Taurine",
    fact: "An amino sulfonic acid that supports heart function, bile salt formation, and brain and eye development.",
    rda: "500–2,000 mg/day (supplement range)",
  },
  {
    name: "Carnitine",
    fact: "Transports long-chain fatty acids into mitochondria for energy production. Supports fat metabolism and exercise recovery.",
    rda: "500–2,000 mg/day (supplement)",
  },
  {
    name: "Creatine",
    fact: "Stored in muscles and used for rapid energy during high-intensity exercise. Improves strength and muscle mass.",
    rda: "3–5 g/day (maintenance)",
  },
  {
    name: "Beta-Alanine",
    fact: "Increases carnosine in muscles, buffering acid build-up during intense exercise and reducing fatigue.",
    rda: "3.2–6.4 g/day",
  },
  {
    name: "Citrulline",
    fact: "Boosts nitric oxide production, improves blood flow, and enhances exercise performance and recovery.",
    rda: "3–6 g/day",
  },
  {
    name: "Berberine",
    fact: "A plant alkaloid that activates AMPK, improving blood sugar, cholesterol, and gut health similarly to metformin.",
    rda: "500 mg 2–3x/day (therapeutic)",
  },
  {
    name: "Ashwagandha",
    fact: "An adaptogen that reduces cortisol, combats stress, boosts testosterone, and enhances physical performance.",
    rda: "300–600 mg/day (KSM-66 extract)",
  },
  {
    name: "Rhodiola Rosea",
    fact: "An adaptogenic herb that fights fatigue, improves mental performance, and enhances stress resilience.",
    rda: "200–600 mg/day",
  },
  {
    name: "Ginseng",
    fact: "Boosts energy, reduces fatigue, enhances brain function, and has anti-inflammatory and immune-boosting effects.",
    rda: "200–400 mg/day",
  },
  {
    name: "Spirulina",
    fact: "A blue-green algae rich in protein, B vitamins, iron, and antioxidants. One of the most nutrient-dense foods on earth.",
    rda: "1–8 g/day",
  },
  {
    name: "Chlorella",
    fact: "A freshwater algae loaded with chlorophyll, protein, and nutrients. Helps detoxify heavy metals from the body.",
    rda: "3–10 g/day",
  },
  {
    name: "Wheatgrass",
    fact: "Rich in vitamins A, C, E, iron, and chlorophyll. Supports detoxification and alkalizes the body.",
    rda: "1–4 g/day (powder)",
  },
  {
    name: "Glucosamine",
    fact: "A natural compound in cartilage that supports joint health and slows the breakdown of cartilage in osteoarthritis.",
    rda: "1,500 mg/day",
  },
  {
    name: "Chondroitin",
    fact: "Often paired with glucosamine, it helps retain water in cartilage, improving joint cushioning and flexibility.",
    rda: "800–1,200 mg/day",
  },
  {
    name: "Hyaluronic Acid",
    fact: "Holds moisture in skin and joints. As a supplement, it improves skin hydration and reduces joint pain.",
    rda: "120–240 mg/day",
  },
  {
    name: "MSM (Methylsulfonylmethane)",
    fact: "A sulfur-containing compound that reduces inflammation and oxidative stress, supporting joint and muscle recovery.",
    rda: "1,500–6,000 mg/day",
  },
  {
    name: "Boron",
    fact: "A trace mineral that supports bone health, brain function, and testosterone production. Often overlooked.",
    rda: "1–3 mg/day",
  },
  {
    name: "Silicon",
    fact: "Supports collagen synthesis, bone mineralization, and connective tissue strength. Found in grains and beer.",
    rda: "10–25 mg/day",
  },
  {
    name: "Vanadium",
    fact: "A trace element that may mimic insulin's action, helping regulate blood sugar. Found in black pepper and mushrooms.",
    rda: "1.8 mg/day (estimated)",
  },
  {
    name: "Nickel",
    fact: "A trace element involved in enzyme function, iron absorption, and possibly DNA stability. Needed in tiny amounts.",
    rda: "<1 mg/day",
  },
  {
    name: "Cobalt",
    fact: "A component of vitamin B12. Necessary for red blood cell formation and nerve function.",
    rda: "As part of B12: 2.4 mcg/day",
  },
  {
    name: "Lithium",
    fact: "A trace mineral that may support brain health, mood stability, and neurological function in very small amounts.",
    rda: "Not established; ~1 mg/day from diet",
  },
  {
    name: "Tin",
    fact: "A trace element with unclear human function, though it may play a role in growth and protein synthesis.",
    rda: "Not established",
  },
  {
    name: "Strontium",
    fact: "Structurally similar to calcium, it supports bone density and may reduce fracture risk when used therapeutically.",
    rda: "Not established; ~2 mg/day from diet",
  },
  {
    name: "Medium Chain Triglycerides (MCTs)",
    fact: "Fats rapidly converted to ketones for brain and body energy. Popular for keto diets and cognitive performance.",
    rda: "15–30 g/day",
  },
  {
    name: "Saturated Fat",
    fact: "Needed for hormone production, cell membrane stability, and fat-soluble vitamin absorption. Moderation is key.",
    rda: "<10% of total calories",
  },
  {
    name: "Monounsaturated Fat",
    fact: "Heart-healthy fats found in olive oil and avocados that lower bad LDL cholesterol and reduce inflammation.",
    rda: "15–20% of total calories",
  },
  {
    name: "Trans Fat",
    fact: "Artificially hydrogenated fats that raise LDL, lower HDL, and dramatically increase cardiovascular disease risk.",
    rda: "0 g/day (avoid completely)",
  },
  {
    name: "Cholesterol",
    fact: "A structural component of cell membranes and precursor to hormones and vitamin D. Made by the liver.",
    rda: "<300 mg/day (dietary)",
  },
  {
    name: "Anthocyanidins",
    fact: "The absorbable form of anthocyanins after digestion. Provide antioxidant protection and support vascular health.",
    rda: "Not established",
  },
  {
    name: "Epicatechin",
    fact: "A flavonoid in dark chocolate and green tea that improves nitric oxide levels, blood flow, and muscle endurance.",
    rda: "~50 mg/day from food",
  },
  {
    name: "EGCG (Epigallocatechin Gallate)",
    fact: "The most potent catechin in green tea. Boosts metabolism, burns fat, and has powerful anti-cancer antioxidant effects.",
    rda: "200–400 mg/day",
  },
  {
    name: "Caffeine",
    fact: "A stimulant that blocks adenosine receptors, increasing alertness, focus, metabolic rate, and athletic performance.",
    rda: "<400 mg/day for adults",
  },
  {
    name: "L-Theanine",
    fact: "An amino acid in green tea that promotes calm focus without drowsiness. Works synergistically with caffeine.",
    rda: "100–200 mg/day",
  },
  {
    name: "GABA",
    fact: "The brain's main inhibitory neurotransmitter. Reduces stress, promotes relaxation, and improves sleep quality.",
    rda: "100–300 mg/day (supplement)",
  },
  {
    name: "5-HTP",
    fact: "A precursor to serotonin that improves mood, reduces anxiety, and supports healthy sleep cycles.",
    rda: "50–300 mg/day",
  },
  {
    name: "Melatonin",
    fact: "The sleep hormone that regulates the circadian rhythm. Supplementing helps with jet lag and sleep onset.",
    rda: "0.5–5 mg before bed",
  },
  {
    name: "Phosphatidylserine",
    fact: "A phospholipid in brain cell membranes that supports memory, cognition, and cortisol regulation under stress.",
    rda: "100–300 mg/day",
  },
  {
    name: "Acetyl-L-Carnitine",
    fact: "Crosses the blood-brain barrier to boost cognitive function, energy metabolism, and neurological health.",
    rda: "500–2,000 mg/day",
  },
  {
    name: "Bacopa Monnieri",
    fact: "An Ayurvedic herb shown to improve memory, reduce anxiety, and enhance brain cell communication.",
    rda: "300–600 mg/day",
  },
  {
    name: "Lion's Mane Mushroom",
    fact: "Stimulates nerve growth factor (NGF) synthesis, improving memory, focus, and neurological health.",
    rda: "500–3,000 mg/day",
  },
  {
    name: "Reishi Mushroom",
    fact: "Adaptogenic mushroom that boosts immunity, reduces fatigue, and has anti-cancer and anti-inflammatory properties.",
    rda: "1.5–9 g/day (dried)",
  },
  {
    name: "Astragalus",
    fact: "An herb that boosts immunity, extends telomere length, and has anti-aging and adaptogenic properties.",
    rda: "250–500 mg/day",
  },
  {
    name: "Milk Thistle (Silymarin)",
    fact: "Protects liver cells from damage, supports detoxification, and may regenerate liver tissue.",
    rda: "140 mg 3x/day",
  },
  {
    name: "N-Acetyl Cysteine (NAC)",
    fact: "Precursor to glutathione, the body's master antioxidant. Supports lung health, detoxification, and brain function.",
    rda: "600–1,800 mg/day",
  },
  {
    name: "Betaine (TMG)",
    fact: "Supports methylation, liver function, and homocysteine metabolism. Found in beets and spinach.",
    rda: "500–1,000 mg/day",
  },
  {
    name: "Inulin",
    fact: "A prebiotic fiber from chicory root that feeds beneficial gut bacteria and supports digestive and immune health.",
    rda: "5–15 g/day",
  },
  {
    name: "Digestive Enzymes",
    fact: "Proteins like amylase, lipase, and protease that break down food into absorbable nutrients. Support digestion.",
    rda: "Varies by enzyme blend",
  },
  {
    name: "Butyrate",
    fact: "A short-chain fatty acid produced by gut bacteria that fuels colon cells and reduces intestinal inflammation.",
    rda: "150–300 mg/day (supplement)",
  },
  {
    name: "Vitamin D3",
    fact: "The most bioavailable form of vitamin D, synthesized from sunlight. Works with K2 for optimal calcium metabolism.",
    rda: "1,000–4,000 IU/day",
  },
  {
    name: "Vitamin K2 (MK-7)",
    fact: "Directs calcium to bones and teeth, away from arteries. Works synergistically with vitamin D3 for bone and heart health.",
    rda: "90–120 mcg/day",
  },
  {
    name: "Zinc Carnosine",
    fact: "A chelated form of zinc that specifically protects and repairs the gut lining. Reduces ulcer risk and leaky gut.",
    rda: "75 mg/day",
  },
  {
    name: "Bone Broth Protein",
    fact: "Rich in collagen, glycine, and proline. Supports gut healing, joint health, and skin elasticity.",
    rda: "20–40 g/day",
  },
  {
    name: "Keratin",
    fact: "Structural protein forming hair, nails, and skin surface. Supplements may improve nail strength and hair quality.",
    rda: "~500 mg/day (supplement)",
  },
  {
    name: "Elastin",
    fact: "A protein that gives skin and lungs elasticity — the ability to stretch and return to shape. Diminishes with age.",
    rda: "Not established",
  },
  {
    name: "Fibronectin",
    fact: "A glycoprotein involved in cell adhesion, wound healing, and maintaining the structure of the extracellular matrix.",
    rda: "Produced endogenously",
  },
  {
    name: "Sulfur",
    fact: "Found in amino acids methionine and cysteine. Supports detoxification, joint health, and antioxidant production.",
    rda: "Not established; ~900 mg/day from food",
  },
  {
    name: "Glycine",
    fact: "A non-essential amino acid abundant in collagen. Supports sleep, gut lining, muscle repair, and liver detox.",
    rda: "3–5 g/day",
  },
  {
    name: "Proline",
    fact: "An amino acid critical for collagen structure. Supports wound healing, skin firmness, and joint cartilage.",
    rda: "~2 g/day (from diet)",
  },
  {
    name: "Hydroxyproline",
    fact: "A modified amino acid formed from proline in the presence of vitamin C. Stabilizes collagen's triple helix structure.",
    rda: "Not established; produced internally",
  },
  {
    name: "Serine",
    fact: "Involved in DNA metabolism, immune function, and synthesis of tryptophan and phospholipids.",
    rda: "~2.3 g/day",
  },
  {
    name: "Tyrosine",
    fact: "Precursor to dopamine, norepinephrine, epinephrine, and thyroid hormones. Supports cognition under stress.",
    rda: "500–2,000 mg/day (supplement)",
  },
  {
    name: "Cysteine",
    fact: "A sulfur amino acid that is a precursor to glutathione. Supports detoxification and antioxidant defense.",
    rda: "~1.1 g/day",
  },
  {
    name: "Aspartate",
    fact: "Plays a role in the urea cycle and neurotransmission. Helps remove ammonia and participates in energy metabolism.",
    rda: "~6 g/day",
  },
  {
    name: "Glutamate",
    fact: "The brain's primary excitatory neurotransmitter and a key molecule in protein and energy metabolism.",
    rda: "~7 g/day from diet",
  },
  {
    name: "Alanine",
    fact: "An amino acid involved in glucose production via the alanine cycle during exercise. Supports energy during fasting.",
    rda: "~3 g/day",
  },
];
