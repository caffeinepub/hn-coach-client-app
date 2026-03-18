export interface Nutrient {
  name: string;
  fact: string;
  rda: string;
  category: "macro" | "micro";
}

export const nutrients: Nutrient[] = [
  // ── MACRONUTRIENTS (5) ──
  {
    name: "Protein",
    category: "macro",
    fact: "Made of amino acids, it builds and repairs muscles, organs, and tissues. Also makes enzymes, hormones, and antibodies. Essential for every body process.",
    rda: "0.8–1.2 g/kg body weight/day",
  },
  {
    name: "Carbohydrates",
    category: "macro",
    fact: "The body's primary and preferred fuel source. Complex carbs like oats and rice provide sustained energy while simple carbs offer quick fuel during workouts.",
    rda: "130 g/day minimum; 45–65% of total calories",
  },
  {
    name: "Dietary Fats",
    category: "macro",
    fact: "Essential for hormone production, brain health, and absorbing fat-soluble vitamins (A, D, E, K). Healthy fats from avocado, nuts, and olive oil support the heart.",
    rda: "20–35% of total daily calories",
  },
  {
    name: "Dietary Fiber",
    category: "macro",
    fact: "Supports digestive health, regulates blood sugar, lowers cholesterol, and feeds beneficial gut bacteria. Reduces risk of type 2 diabetes and heart disease.",
    rda: "25–38 g/day",
  },
  {
    name: "Water",
    category: "macro",
    fact: "Essential for every bodily function — regulating temperature, transporting nutrients, lubricating joints, and flushing waste. Dehydration impairs performance fast.",
    rda: "2.7–3.7 L/day total (including food sources)",
  },
  // ── MICRONUTRIENTS (23) ──
  {
    name: "Vitamin A",
    category: "micro",
    fact: "Essential for vision, immune function, and skin health. It supports cell growth and is a powerful antioxidant. Found in carrots, sweet potatoes, and leafy greens.",
    rda: "700–900 mcg RAE/day",
  },
  {
    name: "Vitamin B1 (Thiamine)",
    category: "micro",
    fact: "Converts food into energy and supports nerve function. Critical for brain and muscle health. Deficiency causes fatigue and neurological issues.",
    rda: "1.1–1.2 mg/day",
  },
  {
    name: "Vitamin B2 (Riboflavin)",
    category: "micro",
    fact: "Plays a key role in energy production and cellular function. It also helps the body absorb other B vitamins and supports eye health.",
    rda: "1.1–1.3 mg/day",
  },
  {
    name: "Vitamin B3 (Niacin)",
    category: "micro",
    fact: "Supports DNA repair, energy metabolism, and reduces LDL cholesterol. Essential for skin and nerve health. Found in meat, fish, and peanuts.",
    rda: "14–16 mg NE/day",
  },
  {
    name: "Vitamin B6",
    category: "micro",
    fact: "Involved in over 100 enzyme reactions. Supports brain health, immune function, and red blood cell formation. Helps convert protein to energy.",
    rda: "1.3–1.7 mg/day",
  },
  {
    name: "Vitamin B9 (Folate)",
    category: "micro",
    fact: "Critical for DNA synthesis and cell division. Especially important during pregnancy for neural tube development. Found in leafy greens and legumes.",
    rda: "400 mcg DFE/day",
  },
  {
    name: "Vitamin B12",
    category: "micro",
    fact: "Needed for nerve function, DNA synthesis, and red blood cell formation. Found only in animal products — vegans must supplement to avoid deficiency.",
    rda: "2.4 mcg/day",
  },
  {
    name: "Vitamin C",
    category: "micro",
    fact: "A powerful antioxidant that boosts immunity, collagen synthesis, and iron absorption. Fights free radicals and speeds wound healing.",
    rda: "75–90 mg/day",
  },
  {
    name: "Vitamin D",
    category: "micro",
    fact: "Regulates calcium and phosphorus absorption. Essential for bone health, immune support, and mood regulation. Most people are deficient — get sunlight daily!",
    rda: "600–800 IU/day (many need 2,000+ IU)",
  },
  {
    name: "Vitamin E",
    category: "micro",
    fact: "A fat-soluble antioxidant that protects cells from oxidative damage and supports immune function and skin health. Found in nuts and seeds.",
    rda: "15 mg/day",
  },
  {
    name: "Vitamin K",
    category: "micro",
    fact: "Essential for blood clotting and bone metabolism. K2 specifically directs calcium to bones rather than arteries, protecting cardiovascular health.",
    rda: "90–120 mcg/day",
  },
  {
    name: "Calcium",
    category: "micro",
    fact: "The most abundant mineral in the body. Builds and maintains strong bones and teeth, and is essential for muscle contraction and nerve signaling.",
    rda: "1,000–1,200 mg/day",
  },
  {
    name: "Iron",
    category: "micro",
    fact: "Carries oxygen in red blood cells via hemoglobin. Deficiency causes fatigue, weakness, and weakened immunity. Athletes and women need more iron.",
    rda: "8–18 mg/day",
  },
  {
    name: "Magnesium",
    category: "micro",
    fact: "Involved in 300+ biochemical reactions including muscle function, nerve signals, energy production, and protein synthesis. Most people are mildly deficient.",
    rda: "310–420 mg/day",
  },
  {
    name: "Zinc",
    category: "micro",
    fact: "Supports immune function, wound healing, DNA synthesis, testosterone production, and taste and smell perception. Found in meat, shellfish, and legumes.",
    rda: "8–11 mg/day",
  },
  {
    name: "Potassium",
    category: "micro",
    fact: "Regulates fluid balance, nerve signals, and muscle contractions. Counteracts sodium to manage blood pressure. Prevents muscle cramps during exercise.",
    rda: "2,600–3,400 mg/day",
  },
  {
    name: "Phosphorus",
    category: "micro",
    fact: "Works with calcium to build bones and teeth. Also essential for energy production (ATP) and forming cell membranes. Found in nearly all protein foods.",
    rda: "700 mg/day",
  },
  {
    name: "Sodium",
    category: "micro",
    fact: "Maintains fluid balance and blood pressure, and enables nerve transmission and muscle contraction. Important during intense exercise to replace sweat losses.",
    rda: "<2,300 mg/day",
  },
  {
    name: "Selenium",
    category: "micro",
    fact: "A trace mineral with powerful antioxidant properties. Supports thyroid function and protects against cell damage. A single Brazil nut provides a full day's dose.",
    rda: "55 mcg/day",
  },
  {
    name: "Iodine",
    category: "micro",
    fact: "Essential for thyroid hormone production which regulates metabolism, growth, and brain development. Deficiency causes goiter and sluggish metabolism.",
    rda: "150 mcg/day",
  },
  {
    name: "Copper",
    category: "micro",
    fact: "Aids in iron absorption, energy production, and nerve function. Vital for forming connective tissue, collagen, and red blood cells. Found in nuts and seeds.",
    rda: "900 mcg/day",
  },
  {
    name: "Manganese",
    category: "micro",
    fact: "Supports bone formation, blood clotting, and reduces inflammation. Acts as a cofactor for antioxidant enzymes and carbohydrate metabolism.",
    rda: "1.8–2.3 mg/day",
  },
  {
    name: "Chromium",
    category: "micro",
    fact: "Enhances the action of insulin and is involved in carbohydrate, fat, and protein metabolism. Helps maintain stable blood sugar levels.",
    rda: "25–35 mcg/day",
  },
];
