// AgriAssist Client-Side Application Engine
const API_BASE = "http://localhost:4343/api";

// Application State
let appState = {
  mode: "simple",
  activeTab: "advisor",
  currentLang: "en",
  metadata: null,
  recommendations: [],
  selectedForComparison: [],
  activeCategory: "All",
  searchQuery: "",
  apiOnline: false,
  weatherData: null,
  currentlySpeakingId: null
};

// Bilingual Dictionary
const TRANSLATIONS = {
  en: {
    tagline: "Decision Support",
    subtitle: "Kisan Fasal Salahkaar • Empowering Indian Agriculture",
    detectLocation: "Detect Weather",
    tabAdvisor: "Crop Sowing Advisor",
    tabRotation: "1-Year Rotation Planner",
    tabFertilizer: "Fertilizer & Soil Doctor",
    heroTitle: "What Should You Sow This Season?",
    heroDesc: "Make confident, high-yield planting decisions. Tell us about your soil, season, and irrigation, and AgriAssist will rank the most profitable, climate-resilient crops with exact fertilizer bags, cost estimates, and stage-wise agronomic guidance.",
    formTitle: "Enter Your Farming Parameters",
    formSubtitle: "Provide field conditions to calculate matching crop suitability, fertilizer bags, and profit",
    modeSimple: "Simple / Quick Mode",
    modeAdvanced: "Advanced (Lab Soil Card)",
    labelSoilType: "Soil Type",
    labelSeason: "Sowing Season",
    labelWater: "Water Availability",
    labelLandSize: "Land Area (Acres)",
    labelTopography: "Land Topography",
    labelGoal: "Investment & Return Goal",
    btnGetRecommendations: "Get Crop Recommendations",
    btnPrintAdvisory: "Download / Print Advisory",
    noResults: "No matching crops found",
    langSwitch: "हिन्दी में देखें"
  },
  hi: {
    tagline: "कृषि निर्णय प्रणाली",
    subtitle: "किसान फसल सलाहकार • भारतीय कृषि सशक्तिकरण",
    detectLocation: "मौसम जांचें",
    tabAdvisor: "फसल बुवाई सलाहकार",
    tabRotation: "1-वर्षीय फसल चक्र योजना",
    tabFertilizer: "खाद एवं मृदा डॉक्टर",
    heroTitle: "इस मौसम में कौन सी फसल बोएं?",
    heroDesc: "वैज्ञानिक एवं सटीक फसल निर्णय लें। अपनी मिट्टी, मौसम और सिंचाई की जानकारी दें, और एग्रीअसिस्ट आपको अधिकतम मुनाफे वाली, उपयुक्त फसलों की सिफारिश के साथ सटीक खाद की बोरी, लागत और पैदावार का हिसाब देगा।",
    formTitle: "अपने खेत की जानकारी दर्ज करें",
    formSubtitle: "फसल अनुकूलता, उर्वरक की खुराक और मुनाफे के आकलन हेतु विवरण भरें",
    modeSimple: "सरल / त्वरित मोड",
    modeAdvanced: "उन्नत (मृदा स्वास्थ्य कार्ड)",
    labelSoilType: "मिट्टी का प्रकार",
    labelSeason: "बुवाई का मौसम",
    labelWater: "सिंचाई एवं पानी की सुविधा",
    labelLandSize: "जमीन का रकबा (एकड़)",
    labelTopography: "जमीन का ढलान",
    labelGoal: "खेती का उद्देश्य एवं बजट",
    btnGetRecommendations: "फसल सुझाव प्राप्त करें",
    btnPrintAdvisory: "सलाहकार कार्ड डाउनलोड / प्रिंट करें",
    noResults: "कोई उपयुक्त फसल नहीं मिली",
    langSwitch: "View in English"
  }
};

// Complete 28 Crops Local Knowledge Base (Guarantees 100% Offline Resilience)
const LOCAL_CROPS_DB = [
  { id: "rice", name: "Rice (Paddy)", hindi_name: "धान", scientific_name: "Oryza sativa", category: "Cereal", seasons: ["Kharif", "Zaid"], suitable_soils: ["Clay Loam Soil", "Alluvial Soil"], duration_days: "115 - 145 days", water_requirement: "High", estimated_yield_per_acre: "22 - 28 Quintals", investment_level: "Moderate", profit_potential: "Moderate to High", msp_price: 2300, seed_rate: 15, seed_cost: 75, cult_cost: 16000, yield_avg: 25, ideal_n: 100, ideal_p: 50, ideal_k: 50, sowing_window: "June - July (Kharif)", sowing_tips: "Seed treatment with Carbendazim. Maintain 2-3 cm standing water during tillering.", fertilizer_advice: "Split N in 3 doses (basal, tillering, panicle). Apply full P & K at transplanting.", soil_notes: "Clay loams with high water retention are ideal.", companion_crops: ["Azolla", "Border marigolds"] },
  { id: "wheat", name: "Wheat", hindi_name: "गेहूं", scientific_name: "Triticum aestivum", category: "Cereal", seasons: ["Rabi"], suitable_soils: ["Alluvial Soil", "Clay Loam Soil", "Black Soil (Regur)"], duration_days: "110 - 130 days", water_requirement: "Medium", estimated_yield_per_acre: "18 - 24 Quintals", investment_level: "Moderate", profit_potential: "Moderate", msp_price: 2400, seed_rate: 40, seed_cost: 45, cult_cost: 13500, yield_avg: 21, ideal_n: 120, ideal_p: 60, ideal_k: 40, sowing_window: "Nov 1st - Nov 25th", sowing_tips: "Sow at 4-5 cm depth. First irrigation at 21 days (CRI stage) is critical.", fertilizer_advice: "Half N with full P and K at sowing; remaining half N at 1st irrigation.", soil_notes: "Well-drained fertile loam; avoid water stagnation.", companion_crops: ["Mustard", "Chickpea"] },
  { id: "maize", name: "Maize (Corn)", hindi_name: "मक्का", scientific_name: "Zea mays", category: "Cereal", seasons: ["Kharif", "Rabi", "Zaid"], suitable_soils: ["Alluvial Soil", "Red Soil", "Sandy Loam Soil", "Black Soil (Regur)"], duration_days: "85 - 110 days", water_requirement: "Medium", estimated_yield_per_acre: "24 - 32 Quintals", investment_level: "Moderate", profit_potential: "High", msp_price: 2225, seed_rate: 8, seed_cost: 250, cult_cost: 14000, yield_avg: 28, ideal_n: 120, ideal_p: 60, ideal_k: 40, sowing_window: "June - July or Oct - Nov", sowing_tips: "Spacing 60x20 cm. Avoid waterlogging during initial 30 days.", fertilizer_advice: "Split N into 3 doses: basal, knee-high, and tasseling. Apply Zinc.", soil_notes: "Deep well-drained loam; sensitive to waterlogging.", companion_crops: ["Soybean", "Cowpea"] },
  { id: "pearl_millet", name: "Pearl Millet (Bajra)", hindi_name: "बाजरा", scientific_name: "Pennisetum glaucum", category: "Cereal", seasons: ["Kharif"], suitable_soils: ["Sandy Loam Soil", "Red Soil", "Alluvial Soil"], duration_days: "75 - 90 days", water_requirement: "Low", estimated_yield_per_acre: "12 - 18 Quintals", investment_level: "Low", profit_potential: "Moderate", msp_price: 2625, seed_rate: 2, seed_cost: 180, cult_cost: 8500, yield_avg: 15, ideal_n: 80, ideal_p: 40, ideal_k: 30, sowing_window: "June - July", sowing_tips: "Shallow 2-3 cm depth. Thrives in drought-prone areas.", fertilizer_advice: "Modest NPK requirement. Apply full P and half N basal.", soil_notes: "Thrives in sandy and low fertility soils.", companion_crops: ["Cowpea", "Green Gram"] },
  { id: "sorghum", name: "Sorghum (Jowar)", hindi_name: "ज्वार", scientific_name: "Sorghum bicolor", category: "Cereal", seasons: ["Kharif", "Rabi"], suitable_soils: ["Black Soil (Regur)", "Alluvial Soil", "Red Soil"], duration_days: "100 - 115 days", water_requirement: "Low to Medium", estimated_yield_per_acre: "10 - 16 Quintals", investment_level: "Low", profit_potential: "Moderate", msp_price: 3371, seed_rate: 4, seed_cost: 120, cult_cost: 9000, yield_avg: 13, ideal_n: 80, ideal_p: 40, ideal_k: 40, sowing_window: "June - July or Sept - Oct", sowing_tips: "Drought-hardy. Excellent grain plus livestock fodder.", fertilizer_advice: "Balanced NPK. Apply Sulfur for drought resistance.", soil_notes: "Deep black soil or fertile loam.", companion_crops: ["Pigeon Pea", "Soybean"] },
  { id: "finger_millet", name: "Finger Millet (Ragi)", hindi_name: "रागी", scientific_name: "Eleusine coracana", category: "Cereal", seasons: ["Kharif"], suitable_soils: ["Red Soil", "Laterite Soil", "Sandy Loam Soil"], duration_days: "105 - 120 days", water_requirement: "Low", estimated_yield_per_acre: "10 - 15 Quintals", investment_level: "Low", profit_potential: "High", msp_price: 4290, seed_rate: 4, seed_cost: 90, cult_cost: 9500, yield_avg: 12.5, ideal_n: 60, ideal_p: 30, ideal_k: 30, sowing_window: "July - August", sowing_tips: "Superfood grain packed with Calcium. Transplant 21-day seedlings.", fertilizer_advice: "Apply FYM liberally plus moderate NPK.", soil_notes: "Red and lateritic soils.", companion_crops: ["Field bean", "Mustard"] },
  { id: "chickpea", name: "Chickpea (Gram / Chana)", hindi_name: "चना", scientific_name: "Cicer arietinum", category: "Pulse", seasons: ["Rabi"], suitable_soils: ["Black Soil (Regur)", "Alluvial Soil", "Sandy Loam Soil"], duration_days: "95 - 120 days", water_requirement: "Low", estimated_yield_per_acre: "8 - 12 Quintals", investment_level: "Low to Moderate", profit_potential: "High", msp_price: 5600, seed_rate: 30, seed_cost: 95, cult_cost: 11000, yield_avg: 10, ideal_n: 20, ideal_p: 50, ideal_k: 20, sowing_window: "Oct 15th - Nov 15th", sowing_tips: "Sow deep (7-10 cm). Rhizobium inoculation improves nodulation.", fertilizer_advice: "Focus on Phosphorus (DAP). Biological N fixation supplies nitrogen.", soil_notes: "Deep, well-aerated soil without waterlogging.", companion_crops: ["Mustard", "Wheat"] },
  { id: "pigeon_pea", name: "Pigeon Pea (Arhar / Tur)", hindi_name: "अरहर (तुअर)", scientific_name: "Cajanus cajan", category: "Pulse", seasons: ["Kharif"], suitable_soils: ["Black Soil (Regur)", "Red Soil", "Alluvial Soil"], duration_days: "150 - 180 days", water_requirement: "Low to Medium", estimated_yield_per_acre: "7 - 10 Quintals", investment_level: "Moderate", profit_potential: "Very High", msp_price: 7550, seed_rate: 6, seed_cost: 160, cult_cost: 12000, yield_avg: 8.5, ideal_n: 25, ideal_p: 50, ideal_k: 20, sowing_window: "June - July", sowing_tips: "Deep taproot breaks hardpans. Excellent for intercropping with soybean/cotton.", fertilizer_advice: "Apply basal DAP and Gypsum for Sulfur requirement.", soil_notes: "Deep well-drained soils; sensitive to waterlogging.", companion_crops: ["Soybean", "Cotton", "Sorghum"] },
  { id: "green_gram", name: "Green Gram (Moong)", hindi_name: "मूंग", scientific_name: "Vigna radiata", category: "Pulse", seasons: ["Kharif", "Zaid"], suitable_soils: ["Alluvial Soil", "Sandy Loam Soil", "Black Soil (Regur)"], duration_days: "60 - 75 days", water_requirement: "Low", estimated_yield_per_acre: "5 - 8 Quintals", investment_level: "Low", profit_potential: "High", msp_price: 8682, seed_rate: 8, seed_cost: 130, cult_cost: 8500, yield_avg: 6.5, ideal_n: 20, ideal_p: 40, ideal_k: 20, sowing_window: "March - April (Zaid) or June - July (Kharif)", sowing_tips: "Fast 60-day catch crop. Fixes 35 kg biological N per ha.", fertilizer_advice: "DAP basal dose. Foliar spray of 2% DAP at flowering.", soil_notes: "Light to medium loams.", companion_crops: ["Maize", "Cotton"] },
  { id: "black_gram", name: "Black Gram (Urad)", hindi_name: "उड़द", scientific_name: "Vigna mungo", category: "Pulse", seasons: ["Kharif", "Zaid"], suitable_soils: ["Black Soil (Regur)", "Alluvial Soil"], duration_days: "70 - 85 days", water_requirement: "Low", estimated_yield_per_acre: "5 - 8 Quintals", investment_level: "Low", profit_potential: "High", msp_price: 7400, seed_rate: 8, seed_cost: 125, cult_cost: 8500, yield_avg: 6.5, ideal_n: 20, ideal_p: 40, ideal_k: 20, sowing_window: "June - July or Feb - March", sowing_tips: "Rhizobium seed treatment. Protect from yellow mosaic virus.", fertilizer_advice: "Apply Phosphorus and moderate Potash.", soil_notes: "Deep black or alluvial soils.", companion_crops: ["Cotton", "Pigeon Pea"] },
  { id: "lentil", name: "Lentil (Masoor)", hindi_name: "मसूर", scientific_name: "Lens culinaris", category: "Pulse", seasons: ["Rabi"], suitable_soils: ["Alluvial Soil", "Clay Loam Soil"], duration_days: "100 - 120 days", water_requirement: "Low", estimated_yield_per_acre: "6 - 10 Quintals", investment_level: "Low", profit_potential: "Moderate to High", msp_price: 6700, seed_rate: 15, seed_cost: 110, cult_cost: 9000, yield_avg: 8, ideal_n: 20, ideal_p: 40, ideal_k: 20, sowing_window: "October - November", sowing_tips: "Requires cold winter nights. Minimal irrigation needed.", fertilizer_advice: "Basal DAP dose.", soil_notes: "Clay to loam soils.", companion_crops: ["Mustard", "Barley"] },
  { id: "mustard", name: "Mustard / Rapeseed", hindi_name: "सरसों", scientific_name: "Brassica juncea", category: "Oilseed", seasons: ["Rabi"], suitable_soils: ["Alluvial Soil", "Sandy Loam Soil", "Black Soil (Regur)"], duration_days: "100 - 125 days", water_requirement: "Low to Medium", estimated_yield_per_acre: "8 - 12 Quintals", investment_level: "Low", profit_potential: "High", msp_price: 5950, seed_rate: 2, seed_cost: 220, cult_cost: 9500, yield_avg: 10, ideal_n: 80, ideal_p: 40, ideal_k: 40, sowing_window: "Sept 25th - Oct 20th", sowing_tips: "Thin seedlings to 12cm. Apply Sulfur for high oil yield.", fertilizer_advice: "Apply 20 kg Sulfur per acre along with NPK.", soil_notes: "Light to medium alluvial loam.", companion_crops: ["Wheat (9:1 ratio)", "Chickpea"] },
  { id: "soybean", name: "Soybean", hindi_name: "सोयाबीन", scientific_name: "Glycine max", category: "Oilseed", seasons: ["Kharif"], suitable_soils: ["Black Soil (Regur)", "Clay Loam Soil"], duration_days: "90 - 105 days", water_requirement: "Medium", estimated_yield_per_acre: "8 - 12 Quintals", investment_level: "Moderate", profit_potential: "High", msp_price: 4892, seed_rate: 25, seed_cost: 95, cult_cost: 12500, yield_avg: 10, ideal_n: 30, ideal_p: 60, ideal_k: 40, sowing_window: "June 20th - July 10th", sowing_tips: "Sow on broad bed furrows (BBF) to prevent water stagnation.", fertilizer_advice: "Bradyrhizobium seed coating. Apply high Phosphorus.", soil_notes: "Deep black clay soils.", companion_crops: ["Pigeon Pea", "Maize"] },
  { id: "groundnut", name: "Groundnut (Peanut)", hindi_name: "मूंगफली", scientific_name: "Arachis hypogaea", category: "Oilseed", seasons: ["Kharif", "Zaid"], suitable_soils: ["Sandy Loam Soil", "Red Soil"], duration_days: "105 - 125 days", water_requirement: "Medium", estimated_yield_per_acre: "10 - 15 Quintals", investment_level: "Moderate", profit_potential: "High", msp_price: 6783, seed_rate: 40, seed_cost: 115, cult_cost: 15000, yield_avg: 12.5, ideal_n: 25, ideal_p: 50, ideal_k: 40, sowing_window: "June - July or Jan - Feb", sowing_tips: "Light friable soil essential for peg penetration. Apply Gypsum at 45 days.", fertilizer_advice: "Gypsum @ 150 kg/acre supplies Calcium for pod filling.", soil_notes: "Sandy loam or friable red soil.", companion_crops: ["Pigeon Pea", "Castor"] },
  { id: "sunflower", name: "Sunflower", hindi_name: "सूरजमुखी", scientific_name: "Helianthus annuus", category: "Oilseed", seasons: ["Rabi", "Zaid", "Kharif"], suitable_soils: ["Black Soil (Regur)", "Alluvial Soil", "Red Soil"], duration_days: "85 - 100 days", water_requirement: "Medium", estimated_yield_per_acre: "8 - 12 Quintals", investment_level: "Moderate", profit_potential: "Moderate to High", msp_price: 7280, seed_rate: 3, seed_cost: 350, cult_cost: 11500, yield_avg: 10, ideal_n: 60, ideal_p: 60, ideal_k: 40, sowing_window: "Flexible year-round", sowing_tips: "Ensure honeybee activity for cross-pollination.", fertilizer_advice: "Apply Boron at ray floret stage to prevent chaffy seeds.", soil_notes: "Medium to deep fertile soils.", companion_crops: ["Groundnut", "Chickpea"] },
  { id: "cotton", name: "Cotton", hindi_name: "कपास", scientific_name: "Gossypium hirsutum", category: "Fiber", seasons: ["Kharif"], suitable_soils: ["Black Soil (Regur)", "Alluvial Soil"], duration_days: "150 - 180 days", water_requirement: "Medium to High", estimated_yield_per_acre: "10 - 16 Quintals", investment_level: "High", profit_potential: "Very High", msp_price: 7121, seed_rate: 1.5, seed_cost: 950, cult_cost: 22000, yield_avg: 13, ideal_n: 120, ideal_p: 60, ideal_k: 60, sowing_window: "May - June (Irrigated) or June - July (Rainfed)", sowing_tips: "Spacing 90x60 cm. Install pheromone traps for pink bollworm.", fertilizer_advice: "Split N into 3 doses. Foliar Potash spray during boll development.", soil_notes: "Deep black regur soil with high water holding capacity.", companion_crops: ["Cowpea", "Green Gram", "Marigold"] },
  { id: "sugarcane", name: "Sugarcane", hindi_name: "गन्ना", scientific_name: "Saccharum officinarum", category: "Cash Crop", seasons: ["Kharif", "All Season / Flexible"], suitable_soils: ["Clay Loam Soil", "Alluvial Soil", "Black Soil (Regur)"], duration_days: "300 - 365 days", water_requirement: "High", estimated_yield_per_acre: "350 - 500 Quintals", investment_level: "High", profit_potential: "Very High", msp_price: 340, seed_rate: 30, seed_cost: 35, cult_cost: 35000, yield_avg: 425, ideal_n: 250, ideal_p: 100, ideal_k: 120, sowing_window: "Oct - Nov (Autumn) or Feb - March (Spring)", sowing_tips: "Dip setts in Carbendazim. Trench or ring pit method.", fertilizer_advice: "Heavy feeder: 250kg N split in 4 doses. Heavy earthing up.", soil_notes: "Deep fertile clay loam; perennially irrigated.", companion_crops: ["Potato", "Mustard (Autumn)"] },
  { id: "jute", name: "Jute (Golden Fiber)", hindi_name: "पटसन (जूट)", scientific_name: "Corchorus olitorius", category: "Fiber", seasons: ["Kharif"], suitable_soils: ["Alluvial Soil", "Clay Loam Soil"], duration_days: "110 - 130 days", water_requirement: "High", estimated_yield_per_acre: "12 - 16 Quintals", investment_level: "Moderate", profit_potential: "Moderate", msp_price: 5335, seed_rate: 3, seed_cost: 140, cult_cost: 13000, yield_avg: 14, ideal_n: 60, ideal_p: 30, ideal_k: 30, sowing_window: "March - May", sowing_tips: "Tolerates standing flood water in eastern plains. Harvest at 50% flowering.", fertilizer_advice: "Top-dress Nitrogen at 3-4 weeks.", soil_notes: "River basin alluvial soils.", companion_crops: ["Paddy rotation"] },
  { id: "tomato", name: "Tomato", hindi_name: "टमाटर", scientific_name: "Solanum lycopersicum", category: "Vegetable", seasons: ["Rabi", "Kharif", "Zaid"], suitable_soils: ["Sandy Loam Soil", "Red Soil", "Alluvial Soil"], duration_days: "90 - 120 days", water_requirement: "Medium", estimated_yield_per_acre: "160 - 240 Quintals", investment_level: "High", profit_potential: "Very High", msp_price: 1600, seed_rate: 0.15, seed_cost: 6000, cult_cost: 26000, yield_avg: 200, ideal_n: 100, ideal_p: 60, ideal_k: 60, sowing_window: "Year-round with nursery", sowing_tips: "Raised beds with drip fertigation and silver-black mulch.", fertilizer_advice: "Drip fertigation with Calcium Nitrate & Boron.", soil_notes: "Well-drained loam rich in organic matter.", companion_crops: ["Marigold (nematode repellent)"] },
  { id: "potato", name: "Potato", hindi_name: "आलू", scientific_name: "Solanum tuberosum", category: "Vegetable", seasons: ["Rabi"], suitable_soils: ["Alluvial Soil", "Sandy Loam Soil"], duration_days: "85 - 110 days", water_requirement: "Medium", estimated_yield_per_acre: "120 - 180 Quintals", investment_level: "High", profit_potential: "Very High", msp_price: 1300, seed_rate: 12, seed_cost: 40, cult_cost: 28000, yield_avg: 150, ideal_n: 150, ideal_p: 80, ideal_k: 100, sowing_window: "October 15th - November 10th", sowing_tips: "Plant pre-sprouted seed tubers in ridges. Earthing up prevents tuber greening.", fertilizer_advice: "High Potash requirement (Sulfate of Potash).", soil_notes: "Loose, well-aerated sandy loam.", companion_crops: ["Mustard", "Sugarcane"] },
  { id: "onion", name: "Onion", hindi_name: "प्याज़", scientific_name: "Allium cepa", category: "Vegetable", seasons: ["Rabi", "Kharif"], suitable_soils: ["Alluvial Soil", "Sandy Loam Soil", "Black Soil (Regur)"], duration_days: "110 - 135 days", water_requirement: "Medium", estimated_yield_per_acre: "100 - 160 Quintals", investment_level: "High", profit_potential: "Very High", msp_price: 1800, seed_rate: 4, seed_cost: 1200, cult_cost: 24000, yield_avg: 130, ideal_n: 100, ideal_p: 50, ideal_k: 60, sowing_window: "Nov - Dec (Rabi) or June - July (Kharif)", sowing_tips: "Shallow root system requires frequent light irrigations.", fertilizer_advice: "Apply Sulfur (15 kg/acre) for bulb pungency and storage shelf-life.", soil_notes: "Friable loam with high organic matter.", companion_crops: ["Coriander", "Garlic"] },
  { id: "chilli", name: "Chilli / Red Pepper", hindi_name: "मिर्च", scientific_name: "Capsicum annuum", category: "Spices", seasons: ["Kharif", "Rabi"], suitable_soils: ["Black Soil (Regur)", "Red Soil", "Sandy Loam Soil"], duration_days: "120 - 170 days", water_requirement: "Medium", estimated_yield_per_acre: "10 - 18 Quintals", investment_level: "High", profit_potential: "Very High", msp_price: 14000, seed_rate: 0.5, seed_cost: 5000, cult_cost: 28000, yield_avg: 14, ideal_n: 120, ideal_p: 60, ideal_k: 60, sowing_window: "June - July or Oct - Nov", sowing_tips: "Transplant on raised beds with drip irrigation.", fertilizer_advice: "Split N in multiple fertigations. Spray Micronutrients (Zinc, Boron).", soil_notes: "Well-drained loam; sensitive to root rot.", companion_crops: ["Onion", "Marigold"] },
  { id: "turmeric", name: "Turmeric", hindi_name: "हल्दी", scientific_name: "Curcuma longa", category: "Spices", seasons: ["Kharif"], suitable_soils: ["Red Soil", "Alluvial Soil", "Clay Loam Soil"], duration_days: "210 - 270 days", water_requirement: "Medium to High", estimated_yield_per_acre: "20 - 30 Quintals", investment_level: "High", profit_potential: "Very High", msp_price: 11500, seed_rate: 8, seed_cost: 60, cult_cost: 35000, yield_avg: 25, ideal_n: 120, ideal_p: 60, ideal_k: 90, sowing_window: "May - June", sowing_tips: "Heavy green-leaf mulching at planting doubles yield.", fertilizer_advice: "High organic matter (FYM @ 10 tons/acre) plus balanced NPK.", soil_notes: "Friable, well-drained loam or clay loam.", companion_crops: ["Maize", "Chilli"] },
  { id: "watermelon", name: "Watermelon", hindi_name: "तरबूज", scientific_name: "Citrullus lanatus", category: "Vegetable", seasons: ["Zaid"], suitable_soils: ["Sandy Loam Soil", "Alluvial Soil"], duration_days: "80 - 95 days", water_requirement: "Medium", estimated_yield_per_acre: "120 - 200 Quintals", investment_level: "Moderate", profit_potential: "High", msp_price: 900, seed_rate: 1.5, seed_cost: 1800, cult_cost: 18000, yield_avg: 160, ideal_n: 80, ideal_p: 50, ideal_k: 70, sowing_window: "January - March (Summer)", sowing_tips: "Riverbed or channel irrigation. Drip fertigation with silver mulch.", fertilizer_advice: "Boost Potash during fruit development for sweetness (TSS).", soil_notes: "Warm sandy loam soils.", companion_crops: ["Muskmelon", "Bottle gourd"] },
  { id: "cowpea", name: "Cowpea (Lobia)", hindi_name: "लोबिया", scientific_name: "Vigna unguiculata", category: "Pulse", seasons: ["Kharif", "Zaid"], suitable_soils: ["Sandy Loam Soil", "Alluvial Soil", "Red Soil"], duration_days: "60 - 75 days", water_requirement: "Low", estimated_yield_per_acre: "6 - 10 Quintals", investment_level: "Low", profit_potential: "Moderate to High", msp_price: 7500, seed_rate: 8, seed_cost: 120, cult_cost: 8500, yield_avg: 8, ideal_n: 20, ideal_p: 40, ideal_k: 20, sowing_window: "Feb - March or June - July", sowing_tips: "Fast-growing catch crop and green manure. Inoculate with Rhizobium.", fertilizer_advice: "Single Superphosphate (SSP) basal dose.", soil_notes: "Tolerates poor sandy soils with good drainage.", companion_crops: ["Maize", "Pearl Millet"] },
  { id: "garlic", name: "Garlic", hindi_name: "लहसुन", scientific_name: "Allium sativum", category: "Spices", seasons: ["Rabi"], suitable_soils: ["Alluvial Soil", "Clay Loam Soil", "Black Soil (Regur)"], duration_days: "120 - 140 days", water_requirement: "Medium", estimated_yield_per_acre: "35 - 50 Quintals", investment_level: "Moderate to High", profit_potential: "Very High", msp_price: 8500, seed_rate: 2, seed_cost: 350, cult_cost: 26000, yield_avg: 42.5, ideal_n: 100, ideal_p: 50, ideal_k: 50, sowing_window: "October - November", sowing_tips: "Plant bold outer cloves in raised beds. Straw mulching.", fertilizer_advice: "Apply Sulfur (20 kg/acre) for pungency and firm bulb storage.", soil_notes: "Rich humic loam.", companion_crops: ["Mustard", "Coriander"] },
  { id: "ginger", name: "Ginger", hindi_name: "अदरक", scientific_name: "Zingiber officinale", category: "Spices", seasons: ["Kharif"], suitable_soils: ["Red Soil", "Laterite Soil", "Sandy Loam Soil"], duration_days: "210 - 240 days", water_requirement: "Medium to High", estimated_yield_per_acre: "60 - 90 Quintals", investment_level: "High", profit_potential: "Very High", msp_price: 7500, seed_rate: 6, seed_cost: 180, cult_cost: 38000, yield_avg: 75, ideal_n: 75, ideal_p: 50, ideal_k: 50, sowing_window: "April - May", sowing_tips: "Plant disease-free seed rhizomes. Heavy green leaf mulching.", fertilizer_advice: "High organic manure plus balanced NPK.", soil_notes: "Loose, well-drained humic loam.", companion_crops: ["Pigeon Pea", "Maize"] },
  { id: "coriander", name: "Coriander", hindi_name: "धनिया", scientific_name: "Coriandrum sativum", category: "Spices", seasons: ["Rabi", "All Season / Flexible"], suitable_soils: ["Black Soil (Regur)", "Alluvial Soil", "Sandy Loam Soil"], duration_days: "80 - 100 days", water_requirement: "Low to Medium", estimated_yield_per_acre: "6 - 10 Quintals", investment_level: "Low", profit_potential: "High", msp_price: 6500, seed_rate: 6, seed_cost: 120, cult_cost: 9500, yield_avg: 8, ideal_n: 40, ideal_p: 30, ideal_k: 20, sowing_window: "October 15th - November 15th", sowing_tips: "Split seeds gently before sowing. Shallow 2cm drill.", fertilizer_advice: "Basal DAP and Potash.", soil_notes: "Medium black or alluvial loam.", companion_crops: ["Chickpea", "Mustard"] }
];

// Fallback Soil Benchmarks
const FALLBACK_SOIL_BENCHMARKS = {
  "Black Soil (Regur)": { n: 180, p: 35, k: 320, ph: 7.8, temp: 28, rain: 800, desc: "Clay-rich volcanic soil with high moisture retention." },
  "Alluvial Soil": { n: 220, p: 45, k: 280, ph: 7.0, temp: 26, rain: 850, desc: "Fertile river basin soil rich in potash and lime." },
  "Red Soil": { n: 160, p: 25, k: 190, ph: 6.2, temp: 27, rain: 700, desc: "Porous and aerated soil developed over crystalline rocks." },
  "Sandy Loam Soil": { n: 140, p: 28, k: 160, ph: 6.5, temp: 29, rain: 500, desc: "Well-aerated, fast draining soil ideal for groundnut & millets." },
  "Clay Loam Soil": { n: 240, p: 48, k: 260, ph: 7.3, temp: 25, rain: 1100, desc: "Nutrient-dense soil with high water retention for paddy & sugarcane." },
  "Laterite Soil": { n: 130, p: 18, k: 140, ph: 5.4, temp: 28, rain: 1400, desc: "Naturally acidic tropical leached soil for plantation crops." }
};

// ----------------- DOM ELEMENTS -----------------
const apiStatusBadge = document.getElementById("apiStatusBadge");
const apiStatusText = document.getElementById("apiStatusText");
const detectWeatherBtn = document.getElementById("detectWeatherBtn");
const weatherBtnText = document.getElementById("weatherBtnText");
const weatherAlertBanner = document.getElementById("weatherAlertBanner");
const langToggleBtn = document.getElementById("langToggleBtn");
const langToggleText = document.getElementById("langToggleText");

const tabAdvisorBtn = document.getElementById("tabAdvisorBtn");
const tabRotationBtn = document.getElementById("tabRotationBtn");
const tabFertilizerBtn = document.getElementById("tabFertilizerBtn");
const advisorTabContent = document.getElementById("advisorTabContent");
const rotationTabContent = document.getElementById("rotationTabContent");
const fertilizerTabContent = document.getElementById("fertilizerTabContent");

const modeSimpleBtn = document.getElementById("modeSimpleBtn");
const modeAdvancedBtn = document.getElementById("modeAdvancedBtn");
const advancedParamsPanel = document.getElementById("advancedParamsPanel");
const recommendForm = document.getElementById("recommendForm");
const submitBtn = document.getElementById("submitBtn");
const btnSpinner = document.getElementById("btnSpinner");
const printReportBtn = document.getElementById("printReportBtn");

const soilTypeSelect = document.getElementById("soilTypeSelect");
const soilTypeHint = document.getElementById("soilTypeHint");
const seasonSelect = document.getElementById("seasonSelect");
const seasonHint = document.getElementById("seasonHint");
const waterSelect = document.getElementById("waterSelect");
const waterHint = document.getElementById("waterHint");
const landSizeInput = document.getElementById("landSizeInput");
const landTypeSelect = document.getElementById("landTypeSelect");
const budgetSelect = document.getElementById("budgetSelect");

const advN = document.getElementById("advN");
const advP = document.getElementById("advP");
const advK = document.getElementById("advK");
const advPH = document.getElementById("advPH");
const advTemp = document.getElementById("advTemp");
const advRain = document.getElementById("advRain");

const resultsSection = document.getElementById("resultsSection");
const summarySoilTitle = document.getElementById("summarySoilTitle");
const summarySoilDesc = document.getElementById("summarySoilDesc");
const summaryNPKBadge = document.getElementById("summaryNPKBadge");
const summaryPHBadge = document.getElementById("summaryPHBadge");
const summaryDrainageBadge = document.getElementById("summaryDrainageBadge");

const totalCropsCount = document.getElementById("totalCropsCount");
const cropSearchInput = document.getElementById("cropSearchInput");
const categoryChips = document.getElementById("categoryChips");
const topPickCard = document.getElementById("topPickCard");
const cropsGrid = document.getElementById("cropsGrid");
const noResultsState = document.getElementById("noResultsState");

const compareBar = document.getElementById("compareBar");
const compareCount = document.getElementById("compareCount");
const compareBadges = document.getElementById("compareBadges");
const clearCompareBtn = document.getElementById("clearCompareBtn");
const openCompareModalBtn = document.getElementById("openCompareModalBtn");
const compareModal = document.getElementById("compareModal");
const closeCompareModalBtn = document.getElementById("closeCompareModalBtn");
const compareModalContent = document.getElementById("compareModalContent");

// Rotation Elements
const rotSoilSelect = document.getElementById("rotSoilSelect");
const rotWaterSelect = document.getElementById("rotWaterSelect");
const rotLandInput = document.getElementById("rotLandInput");
const generateRotationBtn = document.getElementById("generateRotationBtn");
const rotationPlansContainer = document.getElementById("rotationPlansContainer");

// Fertilizer Elements
const fertCropSelect = document.getElementById("fertCropSelect");
const fertSoilN = document.getElementById("fertSoilN");
const fertSoilP = document.getElementById("fertSoilP");
const fertSoilK = document.getElementById("fertSoilK");
const fertSoilPH = document.getElementById("fertSoilPH");
const fertLandAcres = document.getElementById("fertLandAcres");
const calcFertilizerBtn = document.getElementById("calcFertilizerBtn");
const fertPrescriptionResult = document.getElementById("fertPrescriptionResult");


// ----------------- INITIALIZATION -----------------

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  registerServiceWorker();
  populateFertilizerCropOptions();
  checkApiHealth();
  updateSoilPresets();
  executeRecommendation();
});

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(err => {
      console.log("Service worker registration skipped:", err);
    });
  }
}

function populateFertilizerCropOptions() {
  if (!fertCropSelect) return;
  fertCropSelect.innerHTML = LOCAL_CROPS_DB.map(c => `
    <option value="${c.id}">${c.name}${c.hindi_name ? ` (${c.hindi_name})` : ""}</option>
  `).join("");
}

function setupEventListeners() {
  // Navigation Tabs
  tabAdvisorBtn.addEventListener("click", () => switchTab("advisor"));
  tabRotationBtn.addEventListener("click", () => switchTab("rotation"));
  tabFertilizerBtn.addEventListener("click", () => switchTab("fertilizer"));

  // Weather detection
  detectWeatherBtn.addEventListener("click", detectLocationAndWeather);
  const closeWeatherAlertBtn = document.getElementById("closeWeatherAlertBtn");
  if (closeWeatherAlertBtn) {
    closeWeatherAlertBtn.addEventListener("click", () => {
      weatherAlertBanner.classList.add("hidden");
    });
  }

  // Language toggle
  langToggleBtn.addEventListener("click", toggleLanguage);

  // Print report
  printReportBtn.addEventListener("click", () => {
    const printDateEl = document.getElementById("printDateStamp");
    if (printDateEl) {
      printDateEl.textContent = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + " • Soil: " + soilTypeSelect.value + " • " + seasonSelect.value;
    }
    window.print();
  });

  // Input change updates
  modeSimpleBtn.addEventListener("click", () => setMode("simple"));
  modeAdvancedBtn.addEventListener("click", () => setMode("advanced"));
  soilTypeSelect.addEventListener("change", updateSoilPresets);
  seasonSelect.addEventListener("change", updateSeasonHint);
  waterSelect.addEventListener("change", updateWaterHint);

  // Form submit
  recommendForm.addEventListener("submit", (e) => {
    e.preventDefault();
    executeRecommendation();
  });

  // Rotation trigger
  generateRotationBtn.addEventListener("click", executeRotationPlan);

  // Fertilizer Doctor trigger
  calcFertilizerBtn.addEventListener("click", executeFertilizerDoctor);

  // Search input
  cropSearchInput.addEventListener("input", (e) => {
    appState.searchQuery = e.target.value.trim().toLowerCase();
    filterAndRenderCrops();
  });

  // Category filter chips with clean border toggle
  categoryChips.querySelectorAll(".cat-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      categoryChips.querySelectorAll(".cat-chip").forEach(c => {
        c.classList.remove("active", "bg-brand-700", "text-white", "border-brand-700");
        c.classList.add("bg-white", "text-slate-700", "border-slate-200");
      });
      chip.classList.add("active", "bg-brand-700", "text-white", "border-brand-700");
      chip.classList.remove("bg-white", "text-slate-700", "border-slate-200");
      appState.activeCategory = chip.getAttribute("data-category");
      filterAndRenderCrops();
    });
  });

  // Comparison modal
  clearCompareBtn.addEventListener("click", clearComparison);
  openCompareModalBtn.addEventListener("click", openComparisonModal);
  closeCompareModalBtn.addEventListener("click", closeComparisonModal);
  compareModal.addEventListener("click", (e) => {
    if (e.target === compareModal) closeComparisonModal();
  });

  // Escape key closes modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !compareModal.classList.contains("hidden")) {
      closeComparisonModal();
    }
  });
}

function switchTab(tab) {
  appState.activeTab = tab;
  [tabAdvisorBtn, tabRotationBtn, tabFertilizerBtn].forEach(btn => {
    btn.classList.remove("active", "bg-brand-800", "text-white", "border-brand-800", "shadow-sm");
    btn.classList.add("text-slate-600", "hover:bg-slate-100", "border-transparent");
  });

  advisorTabContent.classList.add("hidden");
  rotationTabContent.classList.add("hidden");
  fertilizerTabContent.classList.add("hidden");

  let activeBtn = tabAdvisorBtn;
  let activeContent = advisorTabContent;

  if (tab === "rotation") {
    activeBtn = tabRotationBtn;
    activeContent = rotationTabContent;
    if (rotationPlansContainer.children.length === 0) {
      executeRotationPlan();
    }
  } else if (tab === "fertilizer") {
    activeBtn = tabFertilizerBtn;
    activeContent = fertilizerTabContent;
    if (fertPrescriptionResult.classList.contains("hidden")) {
      executeFertilizerDoctor();
    }
  }

  activeBtn.classList.add("active", "bg-brand-800", "text-white", "border-brand-800", "shadow-sm");
  activeBtn.classList.remove("text-slate-600", "hover:bg-slate-100", "border-transparent");
  activeContent.classList.remove("hidden");
}

function toggleLanguage() {
  appState.currentLang = appState.currentLang === "en" ? "hi" : "en";
  const dict = TRANSLATIONS[appState.currentLang];
  langToggleText.textContent = dict.langSwitch;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Re-render top pick and crops with new language preferences
  if (appState.topPick) {
    renderTopPick(appState.topPick);
  }
  filterAndRenderCrops();
}

// ----------------- LIVE WEATHER & GEOLOCATION (Open-Meteo) -----------------

async function detectLocationAndWeather() {
  weatherBtnText.textContent = "Detecting...";
  detectWeatherBtn.disabled = true;

  if (!navigator.geolocation) {
    fetchWeatherByCoords(18.52, 73.85, "Maharashtra Region (Central)");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetchWeatherByCoords(lat, lon, `Field GPS (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`);
    },
    (err) => {
      console.warn("Geolocation permission denied or timed out. Falling back to regional baseline:", err);
      fetchWeatherByCoords(21.14, 79.08, "Central Agricultural Zone (Nagpur/Vidarbha)");
    },
    { timeout: 8000 }
  );
}

async function fetchWeatherByCoords(lat, lon, locationLabel) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=precipitation_sum,temperature_2m_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather service unreachable");
    const data = await res.json();

    const currentTemp = Math.round(data.current?.temperature_2m || 28);
    const humidity = Math.round(data.current?.relative_humidity_2m || 65);
    const weatherCode = data.current?.weather_code ?? 1;
    const rainForecast7Day = Math.round(
      (data.daily?.precipitation_sum || []).slice(0, 7).reduce((a, b) => a + b, 0)
    );

    appState.weatherData = {
      location: locationLabel,
      temp: currentTemp,
      humidity: humidity,
      rain7d: rainForecast7Day,
      code: weatherCode
    };

    // WMO Weather interpretation
    let weatherEmoji = "⛅";
    let weatherConditionText = "Partly Cloudy";
    if (weatherCode === 0) {
      weatherEmoji = "☀️";
      weatherConditionText = "Clear & Sunny";
    } else if ([1, 2, 3].includes(weatherCode)) {
      weatherEmoji = "⛅";
      weatherConditionText = "Partly Cloudy";
    } else if ([45, 48].includes(weatherCode)) {
      weatherEmoji = "🌫️";
      weatherConditionText = "Foggy";
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
      weatherEmoji = "🌧️";
      weatherConditionText = "Rain Showers";
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      weatherEmoji = "❄️";
      weatherConditionText = "Cold / Frost";
    } else if ([95, 96, 99].includes(weatherCode)) {
      weatherEmoji = "⛈️";
      weatherConditionText = "Thunderstorms";
    }

    // Update UI Elements
    document.getElementById("weatherIcon").textContent = weatherEmoji;
    document.getElementById("weatherLocationName").textContent = locationLabel;
    document.getElementById("weatherCondition").textContent = `${weatherConditionText} • ${currentTemp}°C`;
    document.getElementById("weatherHumidity").textContent = `${humidity}%`;
    document.getElementById("weatherForecastRain").textContent = `${rainForecast7Day} mm`;

    const readinessEl = document.getElementById("weatherSowingReadiness");
    if (rainForecast7Day >= 25) {
      readinessEl.textContent = `✓ ${rainForecast7Day}mm Rain Expected: Prime Soil Moisture for Sowing`;
      readinessEl.className = "bg-emerald-900/80 text-emerald-200 px-3 py-1 rounded-lg font-semibold border border-emerald-600";
    } else if (rainForecast7Day < 5) {
      readinessEl.textContent = "⚠️ Dry Spell: Assured Pre-Sowing Irrigation Needed";
      readinessEl.className = "bg-amber-900/80 text-amber-200 px-3 py-1 rounded-lg font-semibold border border-amber-600";
    } else {
      readinessEl.textContent = "✓ Moderate Weather: Good for Standard Sowing Window";
      readinessEl.className = "bg-blue-900/80 text-blue-200 px-3 py-1 rounded-lg font-semibold border border-blue-600";
    }

    weatherAlertBanner.classList.remove("hidden");
    weatherBtnText.textContent = `${weatherEmoji} ${currentTemp}°C`;

    // Populate advanced fields
    advTemp.value = currentTemp;
    advRain.value = Math.max(rainForecast7Day * 12, 600); // Projected seasonal benchmark
  } catch (err) {
    console.warn("Could not fetch Open-Meteo weather:", err);
    weatherBtnText.textContent = "Weather Offline";
  } finally {
    detectWeatherBtn.disabled = false;
  }
}

// ----------------- TEXT-TO-SPEECH (TTS) AUDIO READOUT -----------------

function speakCropAdvice(cropId) {
  if (!("speechSynthesis" in window)) {
    alert("Audio readout is not supported on this browser.");
    return;
  }

  // Toggle off if already speaking this crop
  if (appState.currentlySpeakingId === cropId) {
    window.speechSynthesis.cancel();
    appState.currentlySpeakingId = null;
    document.querySelectorAll(".voice-btn").forEach(b => b.classList.remove("audio-speaking"));
    return;
  }

  window.speechSynthesis.cancel();
  appState.currentlySpeakingId = cropId;

  const crop = appState.recommendations.find(c => c.crop_id === cropId) || (appState.topPick?.crop_id === cropId ? appState.topPick : null);
  if (!crop) return;

  const isHindi = appState.currentLang === "hi";
  let script = "";

  if (isHindi) {
    const hindiTitle = crop.hindi_name ? crop.hindi_name : crop.name;
    const netProfit = crop.financials ? Math.round(crop.financials.profit_per_acre_inr).toLocaleString("en-IN") : "";
    const urea = crop.fertilizer_prescription ? crop.fertilizer_prescription.urea_bags_50kg : "";
    const dap = crop.fertilizer_prescription ? crop.fertilizer_prescription.dap_bags_50kg : "";

    script = `${hindiTitle} की फसल। अनुकूलता स्कोर ${crop.suitability_score} प्रतिशत है। अनुमानित शुद्ध लाभ ${netProfit} रुपये प्रति एकड़। खाद की आवश्यकता: यूरिया ${urea} बोरी, डीएपी ${dap} बोरी। मुख्य बुवाई सलाह: ${crop.sowing_tips}।`;
  } else {
    const netProfit = crop.financials ? Math.round(crop.financials.profit_per_acre_inr).toLocaleString("en-IN") : "";
    const urea = crop.fertilizer_prescription ? crop.fertilizer_prescription.urea_bags_50kg : "";
    const dap = crop.fertilizer_prescription ? crop.fertilizer_prescription.dap_bags_50kg : "";

    script = `Crop recommendation for ${crop.name}. Suitability match is ${crop.suitability_score} percent, ${crop.suitability_level}. Estimated net profit is rupees ${netProfit} per acre. Fertilizer recommendation: ${urea} bags of Urea, and ${dap} bags of DAP. Agronomic tip: ${crop.sowing_tips}.`;
  }

  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = 0.95;

  // Find appropriate voice
  const voices = window.speechSynthesis.getVoices();
  const targetLangCode = isHindi ? "hi" : "en";
  const voice = voices.find(v => v.lang.startsWith(targetLangCode));
  if (voice) utterance.voice = voice;

  // Highlight all voice buttons for this crop (spotlight + grid)
  document.querySelectorAll(`.voice-btn[data-crop-id="${cropId}"]`).forEach(btn => {
    btn.classList.add("audio-speaking");
  });

  utterance.onend = () => {
    appState.currentlySpeakingId = null;
    document.querySelectorAll(`.voice-btn[data-crop-id="${cropId}"]`).forEach(btn => {
      btn.classList.remove("audio-speaking");
    });
  };

  utterance.onerror = () => {
    appState.currentlySpeakingId = null;
    document.querySelectorAll(`.voice-btn[data-crop-id="${cropId}"]`).forEach(btn => {
      btn.classList.remove("audio-speaking");
    });
  };

  window.speechSynthesis.speak(utterance);
}

// ----------------- WHATSAPP SHARE GENERATOR -----------------

function shareOnWhatsApp(cropId) {
  const crop = appState.recommendations.find(c => c.crop_id === cropId);
  if (!crop) return;

  const netProfit = crop.financials ? `₹${Math.round(crop.financials.profit_per_acre_inr).toLocaleString("en-IN")}` : "High";
  const urea = crop.fertilizer_prescription ? `${crop.fertilizer_prescription.urea_bags_50kg} bags` : "2 bags";
  const dap = crop.fertilizer_prescription ? `${crop.fertilizer_prescription.dap_bags_50kg} bags` : "1 bag";

  const message = `🌾 *AgriAssist Crop Advisory for ${crop.name} (${crop.hindi_name || ""})*\n` +
    `*Suitability Match:* ${crop.suitability_score}% (${crop.suitability_level})\n` +
    `*Est. Net Profit:* ${netProfit}/acre (MSP: ₹${crop.financials?.msp_or_market_price_per_quintal || "Market rate"}/Qtl)\n` +
    `*Growth Duration:* ${crop.duration_days} | *Water:* ${crop.water_requirement}\n` +
    `*Fertilizer Dose:* Urea: ${urea}, DAP: ${dap}\n` +
    `*Sowing Tip:* ${crop.sowing_tips}\n\n` +
    `_Generated by AgriAssist Smart Farming Engine_`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// ----------------- FORM CONTROLS & MODES -----------------

function setMode(mode) {
  appState.mode = mode;
  if (mode === "simple") {
    modeSimpleBtn.classList.add("bg-white", "text-brand-800", "shadow-sm");
    modeSimpleBtn.classList.remove("text-slate-600");
    modeAdvancedBtn.classList.remove("bg-white", "text-brand-800", "shadow-sm");
    modeAdvancedBtn.classList.add("text-slate-600");
    advancedParamsPanel.classList.add("hidden");
  } else {
    modeAdvancedBtn.classList.add("bg-white", "text-brand-800", "shadow-sm");
    modeAdvancedBtn.classList.remove("text-slate-600");
    modeSimpleBtn.classList.remove("bg-white", "text-brand-800", "shadow-sm");
    modeSimpleBtn.classList.add("text-slate-600");
    advancedParamsPanel.classList.remove("hidden");
  }
}

function updateSoilPresets() {
  const selectedSoil = soilTypeSelect.value;
  const benchmark = FALLBACK_SOIL_BENCHMARKS[selectedSoil] || FALLBACK_SOIL_BENCHMARKS["Alluvial Soil"];
  soilTypeHint.textContent = benchmark.desc;

  advN.value = benchmark.n;
  advP.value = benchmark.p;
  advK.value = benchmark.k;
  advPH.value = benchmark.ph;
  advTemp.value = benchmark.temp;
  advRain.value = benchmark.rain;
}

function updateSeasonHint() {
  const season = seasonSelect.value;
  if (season === "Kharif") {
    seasonHint.textContent = "Onset of South-West monsoon. Warm and humid (June - July).";
  } else if (season === "Rabi") {
    seasonHint.textContent = "Cooler winter climate, post-monsoon (Oct - Nov).";
  } else if (season === "Zaid") {
    seasonHint.textContent = "Hot, dry summer season. Strictly needs assured irrigation (March - April).";
  } else {
    seasonHint.textContent = "Year-round or flexible sowing season.";
  }
}

function updateWaterHint() {
  const water = waterSelect.value;
  if (water.includes("Low")) {
    waterHint.textContent = "High-risk for thirsty crops like Rice/Cane. Prioritizes drought-hardy millets & pulses.";
  } else if (water.includes("Moderate")) {
    waterHint.textContent = "Adequate for most cereals, pulses, and oilseeds with 2-4 irrigations.";
  } else {
    waterHint.textContent = "Supports high-water cash crops (Sugarcane, Paddy, Vegetables) without stress.";
  }
}

// ----------------- API INTERACTION -----------------

async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    if (res.ok) {
      appState.apiOnline = true;
      apiStatusBadge.className = "flex items-center space-x-1.5 text-xs bg-emerald-900/90 px-3 py-1.5 rounded-full border border-emerald-600";
      apiStatusText.textContent = "Backend Online • FastAPI";
    } else {
      throw new Error("API not healthy");
    }
  } catch (err) {
    appState.apiOnline = false;
    apiStatusBadge.className = "flex items-center space-x-1.5 text-xs bg-amber-900/90 px-3 py-1.5 rounded-full border border-amber-600";
    apiStatusText.textContent = "Local Offline Mode (Port 4343)";
  }
}

async function executeRecommendation() {
  submitBtn.disabled = true;
  btnSpinner.classList.remove("hidden");

  const payload = {
    mode: appState.mode,
    soil_type: soilTypeSelect.value,
    season: seasonSelect.value,
    water_availability: waterSelect.value,
    land_size_acres: parseFloat(landSizeInput.value) || 1.0,
    land_type: landTypeSelect.value,
    budget_preference: budgetSelect.value,
    nitrogen: appState.mode === "advanced" && advN.value ? parseFloat(advN.value) : null,
    phosphorus: appState.mode === "advanced" && advP.value ? parseFloat(advP.value) : null,
    potassium: appState.mode === "advanced" && advK.value ? parseFloat(advK.value) : null,
    ph: appState.mode === "advanced" && advPH.value ? parseFloat(advPH.value) : null,
    temperature_c: appState.mode === "advanced" && advTemp.value ? parseFloat(advTemp.value) : null,
    rainfall_mm: appState.mode === "advanced" && advRain.value ? parseFloat(advRain.value) : null
  };

  try {
    const res = await fetch(`${API_BASE}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    handleRecommendationResponse(data);
    appState.apiOnline = true;
    apiStatusText.textContent = "Backend Online • FastAPI";
  } catch (err) {
    console.warn("Backend API unreachable, using full local offline algorithm:", err);
    apiStatusText.textContent = "Local Offline Mode";
    handleFullLocalRecommendation(payload);
  } finally {
    submitBtn.disabled = false;
    btnSpinner.classList.add("hidden");
  }
}

function handleRecommendationResponse(data) {
  appState.recommendations = data.recommendations || [];
  appState.topPick = data.top_pick || null;
  totalCropsCount.textContent = appState.recommendations.length;

  const s = data.soil_summary || {};
  summarySoilTitle.textContent = `${s.soil_type || soilTypeSelect.value} Profile`;
  summarySoilDesc.textContent = s.description || "Evaluated against regional agronomic benchmarks.";
  summaryNPKBadge.textContent = s.benchmark_npk || "NPK Benchmark Applied";
  summaryPHBadge.textContent = `pH: ${s.benchmark_ph || "Neutral"}`;
  summaryDrainageBadge.textContent = `Drainage: ${s.drainage || "Moderate"}`;

  const printDateEl = document.getElementById("printDateStamp");
  if (printDateEl) {
    printDateEl.textContent = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + " • Soil: " + (s.soil_type || soilTypeSelect.value) + " • " + seasonSelect.value;
  }

  if (data.top_pick) {
    renderTopPick(data.top_pick);
  }

  filterAndRenderCrops();
}

// ----------------- FULL LOCAL OFFLINE SCORING ENGINE (28 CROPS) -----------------

function handleFullLocalRecommendation(payload) {
  const benchmark = FALLBACK_SOIL_BENCHMARKS[payload.soil_type] || FALLBACK_SOIL_BENCHMARKS["Alluvial Soil"];
  const acres = payload.land_size_acres || 1.0;
  const evaluated = [];

  LOCAL_CROPS_DB.forEach(c => {
    let score = 50.0;
    const reasons = [];
    const warnings = [];

    // Season match
    if (c.seasons.includes(payload.season) || c.seasons.includes("All Season / Flexible")) {
      score += 25.0;
      reasons.push(`Optimal sowing season in ${payload.season}.`);
    } else {
      score -= 25.0;
      warnings.push(`Typically not sown in ${payload.season}. Recommended: ${c.seasons.join(", ")}.`);
    }

    // Soil compatibility
    if (c.suitable_soils.some(s => payload.soil_type.includes(s.split(" ")[0]))) {
      score += 20.0;
      reasons.push(`Highly compatible with ${payload.soil_type}.`);
    } else {
      score += 5.0;
      warnings.push(`Soil conditioning recommended for ${payload.soil_type}.`);
    }

    // Water alignment
    if (payload.water_availability.includes("Low")) {
      if (c.water_requirement === "Low") {
        score += 20.0;
        reasons.push("Low water need ensures safe yields under water stress.");
      } else if (c.water_requirement === "High") {
        score -= 30.0;
        warnings.push("High water demand; severe drought risk.");
      }
    } else if (payload.water_availability.includes("High")) {
      score += 15.0;
      reasons.push("Assured water enables maximum genetic yield.");
    }

    const finalScore = Math.max(10, Math.min(100, Math.round(score)));
    let level = "Moderately Suitable";
    if (finalScore >= 80) level = "Highly Recommended";
    else if (finalScore >= 65) level = "Recommended";
    else if (finalScore < 45) level = "Marginal / High Risk";

    // Financials
    const totalCost = (c.seed_rate * c.seed_cost * acres) + (c.cult_cost * acres) + (3500 * acres);
    const grossRev = c.yield_avg * acres * c.msp_price;
    const netProfit = grossRev - totalCost;

    // Fertilizer bags (stoichiometric estimation)
    const deltaN = Math.max(0, c.ideal_n - benchmark.n) * (acres / 2.471);
    const deltaP = Math.max(0, c.ideal_p - benchmark.p) * (acres / 2.471);
    const deltaK = Math.max(0, c.ideal_k - benchmark.k) * (acres / 2.471);

    const dapKg = Math.max(10 * acres, deltaP / 0.46);
    const ureaKg = Math.max(15 * acres, (deltaN - (dapKg * 0.18)) / 0.46);
    const mopKg = Math.max(10 * acres, deltaK / 0.60);

    evaluated.push({
      crop_id: c.id,
      name: c.name,
      hindi_name: c.hindi_name,
      scientific_name: c.scientific_name,
      category: c.category,
      suitability_score: finalScore,
      suitability_level: level,
      sowing_window: c.sowing_window,
      duration_days: c.duration_days,
      water_requirement: c.water_requirement,
      estimated_yield_per_acre: c.estimated_yield_per_acre,
      investment_level: c.investment_level,
      profit_potential: c.profit_potential,
      reasons: reasons,
      warnings: warnings,
      sowing_tips: c.sowing_tips,
      fertilizer_advice: c.fertilizer_advice,
      soil_notes: c.soil_notes,
      companion_crops: c.companion_crops,
      financials: {
        land_size_acres: acres,
        msp_or_market_price_per_quintal: c.msp_price,
        profit_per_acre_inr: Math.round(netProfit / acres),
        gross_revenue_inr: Math.round(grossRev),
        net_profit_inr: Math.round(netProfit),
        roi_percentage: Math.round((netProfit / totalCost) * 100)
      },
      fertilizer_prescription: {
        urea_bags_50kg: Math.round((ureaKg / 50) * 10) / 10,
        dap_bags_50kg: Math.round((dapKg / 50) * 10) / 10,
        mop_bags_50kg: Math.round((mopKg / 50) * 10) / 10,
        amendment_type: benchmark.ph < 6 ? "Agricultural Lime" : (benchmark.ph > 8 ? "Gypsum" : "None Required")
      }
    });
  });

  evaluated.sort((a, b) => b.suitability_score - a.suitability_score);

  handleRecommendationResponse({
    total_crops_evaluated: evaluated.length,
    recommendations: evaluated,
    top_pick: evaluated[0],
    soil_summary: {
      soil_type: payload.soil_type,
      description: benchmark.desc,
      drainage: "Standard Regional",
      benchmark_npk: `N: ${benchmark.n}, P: ${benchmark.p}, K: ${benchmark.k} kg/ha`,
      benchmark_ph: `${benchmark.ph}`
    }
  });
}

// ----------------- RENDERING & UI -----------------

function renderTopPick(top) {
  topPickCard.classList.remove("hidden");
  const isHi = appState.currentLang === "hi";
  const hindi = top.hindi_name ? `<span class="text-base text-emerald-800 font-normal">(${top.hindi_name})</span>` : "";
  const netProfit = top.financials ? `₹${Math.round(top.financials.profit_per_acre_inr).toLocaleString("en-IN")}` : "High";
  const roi = top.financials && top.financials.roi_percentage ? `(${top.financials.roi_percentage}% ROI)` : "";
  const urea = top.fertilizer_prescription ? `${top.fertilizer_prescription.urea_bags_50kg} bags` : "2.0 bags";
  const dap = top.fertilizer_prescription ? `${top.fertilizer_prescription.dap_bags_50kg} bags` : "1.0 bags";
  const isCompared = appState.selectedForComparison.some(c => c.crop_id === top.crop_id);

  const reasonsList = (top.reasons || []).map(r => `
    <li class="flex items-start gap-1.5">
      <span class="text-emerald-600 font-bold">✓</span>
      <span>${r}</span>
    </li>
  `).join("");

  const warningsList = (top.warnings || []).length > 0 ? (top.warnings || []).map(w => `
    <li class="flex items-start gap-1.5 text-amber-800">
      <span class="font-bold">⚠️</span>
      <span>${w}</span>
    </li>
  `).join("") : "";

  const growthStages = top.growth_stages || [
    { day_range: "Day 0-20", stage_name: "Establishment", activities: "Seed treatment and shallow sowing.", pest_warning: "Damping off" },
    { day_range: "Day 20-50", stage_name: "Vegetative", activities: "First top dressing and weeding.", pest_warning: "Defoliating pests" },
    { day_range: "Day 50-80", stage_name: "Flowering", activities: "Moisture maintenance and pest check.", pest_warning: "Pod borers" },
    { day_range: "Day 80+", stage_name: "Harvest", activities: "Cut at physiological maturity.", pest_warning: "Storage insects" }
  ];

  topPickCard.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <div class="text-3xl sm:text-4xl bg-white p-3 rounded-2xl shadow-sm border border-emerald-200">
          🏆
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              #1 Top Recommended
            </span>
            <span class="text-xs text-emerald-800 font-medium">${top.category}</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
            ${top.name} ${hindi}
          </h3>
          <p class="text-xs text-emerald-800 italic">${top.scientific_name}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Text-to-Speech Button -->
        <button type="button" class="voice-btn bg-white hover:bg-emerald-100 text-emerald-800 p-2.5 rounded-xl border border-emerald-300 shadow-sm transition" data-crop-id="${top.crop_id}" title="Listen to recommendation" aria-label="Listen audio advisory">
          🔊
        </button>
        <!-- WhatsApp Button -->
        <button type="button" class="whatsapp-btn bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow-sm transition" data-crop-id="${top.crop_id}" title="Share on WhatsApp" aria-label="Share advisory on WhatsApp">
          💬
        </button>
        <!-- Compare Checkbox -->
        <label class="flex items-center space-x-1.5 text-xs text-emerald-900 cursor-pointer select-none bg-white/90 px-3 py-2 rounded-xl border border-emerald-300 hover:bg-emerald-50">
          <input type="checkbox" data-crop-id="${top.crop_id}" class="compare-checkbox rounded text-brand-600" ${isCompared ? "checked" : ""}>
          <span class="text-[11px] font-semibold">Compare</span>
        </label>
        <div class="text-right ml-2">
          <div class="text-3xl sm:text-4xl font-black text-emerald-700">${top.suitability_score}%</div>
          <div class="text-xs font-semibold text-emerald-800 uppercase tracking-wider">${top.suitability_level}</div>
        </div>
      </div>
    </div>

    <!-- Financials & Fertilizer Badges Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-200/60 text-xs">
      <div class="bg-white/85 p-2.5 rounded-xl border border-emerald-200">
        <span class="text-emerald-800 block font-semibold">Net Profit / Acre</span>
        <span class="font-extrabold text-emerald-950 text-sm">${netProfit} <span class="text-[10px] text-emerald-700 font-normal">${roi}</span></span>
      </div>
      <div class="bg-white/85 p-2.5 rounded-xl border border-emerald-200">
        <span class="text-emerald-800 block font-semibold">Fertilizer Requirement</span>
        <span class="font-bold text-slate-800">Urea: ${urea} | DAP: ${dap}</span>
      </div>
      <div class="bg-white/85 p-2.5 rounded-xl border border-emerald-200">
        <span class="text-emerald-800 block font-semibold">Duration & Water</span>
        <span class="font-bold text-slate-800">${top.duration_days} • ${top.water_requirement}</span>
      </div>
      <div class="bg-white/85 p-2.5 rounded-xl border border-emerald-200">
        <span class="text-emerald-800 block font-semibold">Estimated Yield</span>
        <span class="font-bold text-slate-800">${top.estimated_yield_per_acre}</span>
      </div>
    </div>

    <!-- Sowing tips preview -->
    <div class="mt-4 text-xs space-y-1.5">
      <div class="font-bold text-emerald-900 flex items-center gap-1.5">
        <span>💡</span> Primary Match:
        <span class="font-normal text-slate-800">${top.reasons && top.reasons[0] ? top.reasons[0] : "Exceptional suitability with field parameters."}</span>
      </div>
      <div class="font-bold text-emerald-900 flex items-center gap-1.5">
        <span>🌱</span> Sowing Advice:
        <span class="font-normal text-slate-800">${top.sowing_tips}</span>
      </div>
    </div>

    <!-- Expandable Detailed Advice for Top Pick -->
    <div class="top-pick-expanded-details hidden space-y-3 pt-4 mt-4 border-t border-emerald-200/80 text-xs text-slate-700">
      ${warningsList ? `
        <div class="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
          <div class="font-bold text-amber-900 mb-1">Cautions & Risks:</div>
          <ul class="space-y-1">${warningsList}</ul>
        </div>
      ` : ""}

      <div>
        <div class="font-bold text-slate-900 mb-1">🧪 Fertilizer & Nutrient Schedule:</div>
        <p class="text-slate-600 leading-relaxed">${top.fertilizer_advice}</p>
      </div>

      <!-- Growth Timeline for Top Pick -->
      <div class="pt-2 border-t border-emerald-100">
        <div class="font-bold text-slate-800 text-[11px] mb-2 flex items-center gap-1">
          <span>📅</span> 4-Stage Growth Timeline & IPM Calendar:
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[10px]">
          ${growthStages.map(st => `
            <div class="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
              <span class="text-brand-700 font-bold block">${st.day_range}</span>
              <strong class="text-slate-900 block truncate">${st.stage_name}</strong>
              <p class="text-slate-600 text-[9px] mt-0.5 leading-tight">${st.activities}</p>
              ${st.pest_warning ? `<span class="text-amber-800 block text-[9px] mt-1 font-semibold">⚠️ ${st.pest_warning}</span>` : ""}
            </div>
          `).join("")}
        </div>
      </div>

      ${top.companion_crops && top.companion_crops.length > 0 ? `
        <div>
          <div class="font-bold text-slate-900 mb-1">🤝 Recommended Companion Intercrops:</div>
          <div class="flex flex-wrap gap-1">
            ${top.companion_crops.map(c => `<span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium">${c}</span>`).join("")}
          </div>
        </div>
      ` : ""}
    </div>

    <!-- Toggle button for Top Pick Details -->
    <div class="pt-3 mt-2 border-t border-emerald-200/60 no-print text-center">
      <button type="button" class="top-pick-toggle-btn text-xs font-bold text-emerald-800 hover:text-emerald-950 py-1 px-4 hover:bg-emerald-100/60 rounded-xl transition">
        ${isHi ? "विस्तृत सलाह देखें ▼" : "View Complete Agronomic Advice ▼"}
      </button>
    </div>
  `;

  // Attach voice, whatsapp, compare, and details listener to top pick
  topPickCard.querySelector(".voice-btn")?.addEventListener("click", () => speakCropAdvice(top.crop_id));
  topPickCard.querySelector(".whatsapp-btn")?.addEventListener("click", () => shareOnWhatsApp(top.crop_id));
  topPickCard.querySelector(".compare-checkbox")?.addEventListener("change", (e) => {
    toggleCropComparison(top.crop_id, e.target.checked);
  });
  topPickCard.querySelector(".top-pick-toggle-btn")?.addEventListener("click", (e) => {
    const details = topPickCard.querySelector(".top-pick-expanded-details");
    const isHidden = details.classList.contains("hidden");
    details.classList.toggle("hidden");
    const isHindiNow = appState.currentLang === "hi";
    if (isHindiNow) {
      e.target.textContent = isHidden ? "सलाह छिपाएं ▲" : "विस्तृत सलाह देखें ▼";
    } else {
      e.target.textContent = isHidden ? "Hide Complete Advice ▲" : "View Complete Agronomic Advice ▼";
    }
  });
}

function filterAndRenderCrops() {
  const filtered = appState.recommendations.filter(crop => {
    const matchesCategory = appState.activeCategory === "All" || crop.category === appState.activeCategory;
    const matchesSearch = !appState.searchQuery ||
      crop.name.toLowerCase().includes(appState.searchQuery) ||
      (crop.hindi_name && crop.hindi_name.toLowerCase().includes(appState.searchQuery)) ||
      crop.category.toLowerCase().includes(appState.searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Manage Top Pick Card visibility based on search and category
  if (appState.topPick) {
    const topMatchesCategory = appState.activeCategory === "All" || appState.topPick.category === appState.activeCategory;
    const topMatchesSearch = !appState.searchQuery ||
      appState.topPick.name.toLowerCase().includes(appState.searchQuery) ||
      (appState.topPick.hindi_name && appState.topPick.hindi_name.toLowerCase().includes(appState.searchQuery)) ||
      appState.topPick.category.toLowerCase().includes(appState.searchQuery);

    if (filtered.length > 0 && topMatchesCategory && topMatchesSearch) {
      renderTopPick(appState.topPick);
    } else {
      topPickCard.classList.add("hidden");
    }
  }

  if (filtered.length === 0) {
    cropsGrid.innerHTML = "";
    noResultsState.classList.remove("hidden");
    return;
  }

  noResultsState.classList.add("hidden");
  cropsGrid.innerHTML = filtered.map(crop => createCropCardHTML(crop)).join("");

  // Attach listeners
  cropsGrid.querySelectorAll(".card-toggle-details").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".crop-card");
      const details = card.querySelector(".card-expanded-details");
      const isHidden = details.classList.contains("hidden");
      details.classList.toggle("hidden");
      const isHi = appState.currentLang === "hi";
      if (isHi) {
        btn.textContent = isHidden ? "सलाह छिपाएं ▲" : "कृषि सलाह देखें ▼";
      } else {
        btn.textContent = isHidden ? "Hide Agronomic Advice ▲" : "View Agronomic Advice ▼";
      }
    });
  });

  cropsGrid.querySelectorAll(".voice-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cropId = btn.getAttribute("data-crop-id");
      speakCropAdvice(cropId);
    });
  });

  cropsGrid.querySelectorAll(".whatsapp-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cropId = btn.getAttribute("data-crop-id");
      shareOnWhatsApp(cropId);
    });
  });

  cropsGrid.querySelectorAll(".compare-checkbox").forEach(cb => {
    cb.addEventListener("change", () => {
      const cropId = cb.getAttribute("data-crop-id");
      toggleCropComparison(cropId, cb.checked);
    });
  });
}

function createCropCardHTML(crop) {
  const isCompared = appState.selectedForComparison.some(c => c.crop_id === crop.crop_id);
  const hindi = crop.hindi_name ? `<span class="text-xs text-slate-500 font-normal">(${crop.hindi_name})</span>` : "";

  let scoreBadgeClass = "badge-score-high";
  if (crop.suitability_score < 65) scoreBadgeClass = "badge-score-low";
  else if (crop.suitability_score < 80) scoreBadgeClass = "badge-score-med";

  const netProfit = crop.financials ? `₹${Math.round(crop.financials.profit_per_acre_inr).toLocaleString("en-IN")}` : "High";
  const roi = crop.financials && crop.financials.roi_percentage ? `(${crop.financials.roi_percentage}% ROI)` : "";
  const urea = crop.fertilizer_prescription ? `${crop.fertilizer_prescription.urea_bags_50kg} bags` : "2.0 bags";
  const dap = crop.fertilizer_prescription ? `${crop.fertilizer_prescription.dap_bags_50kg} bags` : "1.0 bags";

  const reasonsList = (crop.reasons || []).map(r => `
    <li class="flex items-start gap-1.5">
      <span class="text-emerald-600 font-bold">✓</span>
      <span>${r}</span>
    </li>
  `).join("");

  const warningsList = (crop.warnings || []).length > 0 ? (crop.warnings || []).map(w => `
    <li class="flex items-start gap-1.5 text-amber-800">
      <span class="font-bold">⚠️</span>
      <span>${w}</span>
    </li>
  `).join("") : "";

  // Growth timeline stages (Clean 2-column grid to avoid squeeze)
  const growthStages = crop.growth_stages || [
    { day_range: "Day 0-20", stage_name: "Establishment", activities: "Seed treatment and shallow sowing.", pest_warning: "Damping off" },
    { day_range: "Day 20-50", stage_name: "Vegetative", activities: "First top dressing and weeding.", pest_warning: "Defoliating pests" },
    { day_range: "Day 50-80", stage_name: "Flowering", activities: "Moisture maintenance and pest check.", pest_warning: "Pod borers" },
    { day_range: "Day 80+", stage_name: "Harvest", activities: "Cut at physiological maturity.", pest_warning: "Storage insects" }
  ];

  const timelineHTML = `
    <div class="mt-2 pt-2 border-t border-slate-100">
      <div class="font-bold text-slate-800 text-[11px] mb-2 flex items-center gap-1">
        <span>📅</span> Growth Timeline & IPM Pest Calendar:
      </div>
      <div class="grid grid-cols-2 gap-2 text-[10px]">
        ${growthStages.map(st => `
          <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span class="text-brand-700 font-bold block">${st.day_range}</span>
            <strong class="text-slate-900 block truncate" title="${st.stage_name}">${st.stage_name}</strong>
            <p class="text-slate-600 text-[9px] mt-0.5 leading-tight">${st.activities}</p>
            ${st.pest_warning ? `<span class="text-amber-800 block text-[9px] mt-1 font-semibold">⚠️ ${st.pest_warning}</span>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  `;

  const isHi = appState.currentLang === "hi";

  return `
    <div class="crop-card bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between" data-crop-id="${crop.crop_id}">
      <div>
        <!-- Top header row -->
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full">
            ${crop.category}
          </span>
          <div class="flex items-center space-x-1.5">
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${scoreBadgeClass}">
              ${crop.suitability_score}% Match
            </span>
          </div>
        </div>

        <!-- Crop Title -->
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 class="font-bold text-slate-900 text-lg leading-snug">
              ${crop.name} ${hindi}
            </h4>
            <p class="text-xs text-slate-500 italic mb-2">${crop.scientific_name}</p>
          </div>
          <div class="flex items-center space-x-1 shrink-0">
            <button type="button" class="voice-btn bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 p-1.5 rounded-lg border border-slate-200 transition text-xs" data-crop-id="${crop.crop_id}" title="Listen audio advice" aria-label="Listen audio advice">
              🔊
            </button>
            <button type="button" class="whatsapp-btn bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 p-1.5 rounded-lg border border-slate-200 transition text-xs" data-crop-id="${crop.crop_id}" title="Share on WhatsApp" aria-label="Share on WhatsApp">
              💬
            </button>
            <label class="flex items-center space-x-1 text-xs text-slate-500 cursor-pointer select-none bg-slate-50 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 ml-0.5">
              <input type="checkbox" data-crop-id="${crop.crop_id}" class="compare-checkbox rounded text-brand-600" ${isCompared ? "checked" : ""}>
              <span class="text-[10px] font-semibold">Compare</span>
            </label>
          </div>
        </div>

        <!-- Profit & Fertilizer Pill Strip -->
        <div class="flex flex-wrap items-center gap-1.5 my-2">
          <span class="bg-emerald-50 text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-emerald-200">
            Net Profit: ${netProfit}/acre ${roi}
          </span>
          <span class="bg-blue-50 text-blue-900 text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-blue-200">
            Urea: ${urea} | DAP: ${dap}
          </span>
        </div>

        <!-- Metric Grid -->
        <div class="grid grid-cols-2 gap-2 text-xs py-2 my-1 border-y border-slate-100">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
            <span class="font-bold text-slate-800">${crop.duration_days}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Water Need</span>
            <span class="font-bold text-slate-800">${crop.water_requirement}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Est. Yield / Acre</span>
            <span class="font-bold text-slate-800">${crop.estimated_yield_per_acre}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Sowing Window</span>
            <span class="font-bold text-slate-800 text-[11px] leading-tight block" title="${crop.sowing_window}">${crop.sowing_window}</span>
          </div>
        </div>

        <!-- Expandable Details -->
        <div class="card-expanded-details hidden space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
          <div>
            <div class="font-bold text-slate-900 mb-1">Why This Crop:</div>
            <ul class="space-y-1 text-slate-600">${reasonsList}</ul>
          </div>

          ${warningsList ? `
            <div class="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <div class="font-bold text-amber-900 mb-1">Cautions & Risks:</div>
              <ul class="space-y-1">${warningsList}</ul>
            </div>
          ` : ""}

          <div>
            <div class="font-bold text-slate-900 mb-1">🌾 Seed & Sowing Tips:</div>
            <p class="text-slate-600 leading-relaxed">${crop.sowing_tips}</p>
          </div>

          <div>
            <div class="font-bold text-slate-900 mb-1">🧪 Fertilizer & Nutrient Schedule:</div>
            <p class="text-slate-600 leading-relaxed">${crop.fertilizer_advice}</p>
          </div>

          ${timelineHTML}

          ${crop.companion_crops && crop.companion_crops.length > 0 ? `
            <div>
              <div class="font-bold text-slate-900 mb-1">🤝 Recommended Companion Intercrops:</div>
              <div class="flex flex-wrap gap-1">
                ${crop.companion_crops.map(c => `<span class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">${c}</span>`).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      </div>

      <!-- Action Button to Expand -->
      <div class="pt-3 mt-2 border-t border-slate-100 no-print">
        <button type="button" class="card-toggle-details w-full py-1.5 text-center text-xs font-bold text-brand-700 hover:text-brand-800 hover:bg-emerald-50 rounded-xl transition">
          ${isHi ? "कृषि सलाह देखें ▼" : "View Agronomic Advice ▼"}
        </button>
      </div>
    </div>
  `;
}

// ----------------- TAB 2: 1-YEAR ROTATION PLANNER -----------------

async function executeRotationPlan() {
  generateRotationBtn.disabled = true;
  generateRotationBtn.textContent = "Generating Plans...";

  const payload = {
    soil_type: rotSoilSelect.value,
    water_availability: rotWaterSelect.value,
    budget_preference: "Balanced",
    land_size_acres: parseFloat(rotLandInput.value) || 2.0
  };

  try {
    const res = await fetch(`${API_BASE}/rotation-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();
    renderRotationPlans(data.plans || []);
  } catch (err) {
    console.warn("Using offline rotation fallback:", err);
    // Offline local rotation generator
    renderOfflineRotationPlans(payload);
  } finally {
    generateRotationBtn.disabled = false;
    generateRotationBtn.textContent = "Generate 1-Year Rotation Plans 🔄";
  }
}

function renderRotationPlans(plans) {
  if (!plans || plans.length === 0) {
    rotationPlansContainer.innerHTML = `<div class="p-6 bg-white rounded-2xl border text-center text-slate-500">No rotation plans available.</div>`;
    return;
  }

  rotationPlansContainer.innerHTML = plans.map((plan, idx) => `
    <div class="bg-white border-2 ${idx === 0 ? 'border-brand-500 shadow-md' : 'border-slate-200'} rounded-2xl p-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="bg-brand-100 text-brand-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full">${plan.badge}</span>
            <span class="text-xs text-slate-500">Plan #${idx + 1}</span>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mt-1">${plan.title}</h3>
          <p class="text-xs text-slate-600 mt-0.5">${plan.description}</p>
        </div>

        <div class="text-right">
          <div class="text-2xl font-black text-brand-800">₹${Math.round(plan.total_annual_net_profit_inr).toLocaleString("en-IN")}</div>
          <div class="text-xs text-slate-500 font-semibold">Total Annual Net Profit (₹${Math.round(plan.annual_net_profit_per_acre_inr).toLocaleString("en-IN")}/acre)</div>
        </div>
      </div>

      <!-- 3 Seasons Sequence Flow -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
        ${plan.crops.map((c, cIdx) => `
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
            <div class="flex items-center justify-between text-[11px] font-bold text-brand-700 mb-1">
              <span>Season ${cIdx + 1}: ${c.season}</span>
              <span class="text-slate-500">${c.duration}</span>
            </div>
            <div class="text-sm font-black text-slate-900">${c.crop_name}</div>
            <p class="text-[11px] text-slate-500 mt-1">${c.role}</p>
            <div class="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Net Return:</span>
              <strong class="text-emerald-700 font-bold">₹${c.net_profit_per_acre.toLocaleString("en-IN")}/acre</strong>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Soil Health & Biological Benefits -->
      <div class="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <div class="font-bold text-emerald-950 flex items-center gap-1.5">
            <span>🌿</span> Nitrogen & Fertility Impact:
            <span class="font-normal text-slate-700">${plan.nitrogen_fixation_benefit}</span>
          </div>
          <div class="font-bold text-emerald-950 flex items-center gap-1.5">
            <span>🛡️</span> Pest & Disease Disruption:
            <span class="font-normal text-slate-700">${plan.pest_break_benefit}</span>
          </div>
        </div>
        <div class="bg-white px-3 py-1.5 rounded-lg border border-emerald-300 font-bold text-emerald-800 text-xs">
          Soil Health Index: ${plan.soil_health_index}/100
        </div>
      </div>
    </div>
  `).join("");
}

function renderOfflineRotationPlans(payload) {
  const acres = payload.land_size_acres || 2.0;
  const mockPlans = [
    {
      plan_id: "plan_1",
      title: "Soil-Restorative Cereal & Legume Rotation",
      badge: "Highest Soil Health Index",
      description: "Balanced rotation restoring nitrogen and breaking weed cycles.",
      soil_health_index: 94,
      nitrogen_fixation_benefit: "Fixes ~35 kg biological N/ha naturally, reducing subsequent Urea need by 25%.",
      pest_break_benefit: "Alternating grass cereals with broadleaf legumes eliminates soilborne pupation.",
      total_annual_net_profit_inr: 86000 * acres,
      annual_net_profit_per_acre_inr: 86000,
      crops: [
        { season: "Kharif", crop_name: "Maize (Corn)", duration: "95 days", role: "High-tonnage cereal", net_profit_per_acre: 31000 },
        { season: "Rabi", crop_name: "Mustard", duration: "115 days", role: "High-oil cash crop", net_profit_per_acre: 36000 },
        { season: "Zaid", crop_name: "Green Gram (Moong)", duration: "65 days", role: "Biological N fixer", net_profit_per_acre: 19000 }
      ]
    },
    {
      plan_id: "plan_2",
      title: "Commercial Cash Crop High-Revenue Trilogy",
      badge: "Maximum Market Return",
      description: "Optimized for maximum market prices in heavy fertile soil.",
      soil_health_index: 85,
      nitrogen_fixation_benefit: "Legume inclusion buffers soil structure after heavy cash crop uptake.",
      pest_break_benefit: "Disrupts nematode and fungal build-up.",
      total_annual_net_profit_inr: 104000 * acres,
      annual_net_profit_per_acre_inr: 104000,
      crops: [
        { season: "Kharif", crop_name: "Cotton", duration: "160 days", role: "High-profit fiber", net_profit_per_acre: 46000 },
        { season: "Rabi", crop_name: "Chickpea", duration: "95 days", role: "Soil recovery pulse", net_profit_per_acre: 29000 },
        { season: "Zaid", crop_name: "Summer Watermelon", duration: "75 days", role: "Fast cash fruit", net_profit_per_acre: 35000 }
      ]
    }
  ];
  renderRotationPlans(mockPlans);
}

// ----------------- TAB 3: FERTILIZER & SOIL DOCTOR -----------------

async function executeFertilizerDoctor() {
  calcFertilizerBtn.disabled = true;
  calcFertilizerBtn.textContent = "Calculating...";

  const payload = {
    crop_id: fertCropSelect.value,
    soil_n: parseFloat(fertSoilN.value) || 140,
    soil_p: parseFloat(fertSoilP.value) || 30,
    soil_k: parseFloat(fertSoilK.value) || 180,
    soil_ph: parseFloat(fertSoilPH.value) || 7.0,
    land_size_acres: parseFloat(fertLandAcres.value) || 2.0
  };

  try {
    const res = await fetch(`${API_BASE}/fertilizer-prescription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Fertilizer prescription error");
    const data = await res.json();
    renderFertilizerDoctorResult(data, payload);
  } catch (err) {
    console.warn("Using offline fertilizer doctor calculation:", err);
    // Offline local calculation
    renderOfflineFertilizerResult(payload);
  } finally {
    calcFertilizerBtn.disabled = false;
    calcFertilizerBtn.textContent = "Calculate Fertilizer Prescription 🧪";
  }
}

function renderFertilizerDoctorResult(data, payload) {
  fertPrescriptionResult.classList.remove("hidden");

  fertPrescriptionResult.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h4 class="font-bold text-slate-900 text-base flex items-center gap-2">
          <span>🩺</span> Agronomic Prescription for ${payload.land_size_acres} Acres
        </h4>
        <span class="text-xs text-slate-500 font-semibold">Est. Subsidized Fertilizer Cost: ₹${(data.approx_fertilizer_cost_inr || 0).toLocaleString("en-IN")}</span>
      </div>

      <!-- Fertilizer Bags Metric Row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <div class="text-xs font-bold text-blue-900">Urea (46% N)</div>
          <div class="text-3xl font-black text-blue-700 my-1">${data.urea_bags_50kg} <span class="text-sm font-normal text-slate-600">bags (50kg)</span></div>
          <div class="text-[11px] text-blue-800">${data.urea_kg} kg total for vegetative canopy</div>
        </div>

        <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl">
          <div class="text-xs font-bold text-amber-900">DAP (18-46-0)</div>
          <div class="text-3xl font-black text-amber-700 my-1">${data.dap_bags_50kg} <span class="text-sm font-normal text-slate-600">bags (50kg)</span></div>
          <div class="text-[11px] text-amber-800">${data.dap_kg} kg total for root development</div>
        </div>

        <div class="bg-rose-50 border border-rose-200 p-4 rounded-xl">
          <div class="text-xs font-bold text-rose-900">MOP (60% K2O)</div>
          <div class="text-3xl font-black text-rose-700 my-1">${data.mop_bags_50kg} <span class="text-sm font-normal text-slate-600">bags (50kg)</span></div>
          <div class="text-[11px] text-rose-800">${data.mop_kg} kg total for disease resistance</div>
        </div>
      </div>

      <!-- Soil Amendment Recommendation (Lime / Gypsum) -->
      <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-1">
        <div class="font-bold text-slate-900 flex items-center gap-1.5">
          <span>🧪</span> Soil pH Diagnosis & Amendment:
          <span class="text-brand-700">${data.amendment_type}</span>
        </div>
        <p class="text-slate-600">${data.amendment_advice}</p>
      </div>

      <!-- Application Schedule -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2">
        <div class="font-bold text-slate-900">🗓️ Recommended Application Stages:</div>
        <ul class="space-y-1.5 text-slate-600">
          ${(data.application_schedule || []).map(s => `
            <li class="flex items-start gap-2">
              <span class="text-brand-600 font-bold">•</span>
              <div><strong class="text-slate-800">${s.stage}:</strong> ${s.advice}</div>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderOfflineFertilizerResult(payload) {
  const acres = payload.land_size_acres || 2.0;
  const dapKg = Math.round(25 * acres);
  const ureaKg = Math.round(45 * acres);
  const mopKg = Math.round(20 * acres);

  const mockPresc = {
    urea_kg: ureaKg,
    urea_bags_50kg: Math.round((ureaKg / 50) * 10) / 10,
    dap_kg: dapKg,
    dap_bags_50kg: Math.round((dapKg / 50) * 10) / 10,
    mop_kg: mopKg,
    mop_bags_50kg: Math.round((mopKg / 50) * 10) / 10,
    approx_fertilizer_cost_inr: Math.round((ureaKg * 5.4) + (dapKg * 27) + (mopKg * 34)),
    amendment_type: payload.soil_ph < 6 ? "Agricultural Lime" : (payload.soil_ph > 8 ? "Gypsum" : "None Required"),
    amendment_advice: payload.soil_ph < 6 ?
      `Soil is acidic (pH ${payload.soil_ph}). Apply ${(6.5 - payload.soil_ph) * 350 * acres} kg Agricultural Lime before sowing.` :
      (payload.soil_ph > 8 ? `Soil is alkaline (pH ${payload.soil_ph}). Apply ${(payload.soil_ph - 7.5) * 450 * acres} kg Gypsum.` : "Soil pH is balanced."),
    application_schedule: [
      { stage: "Basal (At Sowing)", advice: "Full DAP + Full MOP + 1/3rd Urea at sowing time." },
      { stage: "Vegetative Stage (25-30 Days)", advice: "1/3rd Urea during first irrigation or weeding." },
      { stage: "Flowering Stage (50-60 Days)", advice: "Remaining 1/3rd Urea." }
    ]
  };

  renderFertilizerDoctorResult(mockPresc, payload);
}

// ----------------- COMPARISON MODAL -----------------

function toggleCropComparison(cropId, isChecked) {
  const crop = appState.recommendations.find(c => c.crop_id === cropId);
  if (!crop) return;

  if (isChecked) {
    if (appState.selectedForComparison.length >= 3) {
      alert("You can compare up to 3 crops at once.");
      const cb = cropsGrid.querySelector(`input[data-crop-id="${cropId}"]`);
      if (cb) cb.checked = false;
      return;
    }
    appState.selectedForComparison.push(crop);
  } else {
    appState.selectedForComparison = appState.selectedForComparison.filter(c => c.crop_id !== cropId);
  }

  updateComparisonBar();
}

function updateComparisonBar() {
  const count = appState.selectedForComparison.length;
  compareCount.textContent = count;

  if (count > 0) {
    compareBar.classList.remove("hidden");
    compareBadges.innerHTML = appState.selectedForComparison.map(c => `
      <span class="bg-brand-100 text-brand-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-brand-300 flex items-center gap-1">
        ${c.name}
      </span>
    `).join("");
  } else {
    compareBar.classList.add("hidden");
  }
}

function clearComparison() {
  appState.selectedForComparison = [];
  cropsGrid.querySelectorAll(".compare-checkbox").forEach(cb => cb.checked = false);
  updateComparisonBar();
}

function openComparisonModal() {
  if (appState.selectedForComparison.length === 0) return;

  const crops = appState.selectedForComparison;

  let headersHTML = `<th class="p-3 text-left font-bold text-slate-700 bg-slate-100 w-1/4">Feature / Metric</th>`;
  crops.forEach(c => {
    headersHTML += `
      <th class="p-3 text-left bg-slate-50 border-l border-slate-200">
        <div class="text-base font-bold text-slate-900">${c.name}</div>
        <div class="text-xs text-brand-700 font-semibold">${c.suitability_score}% Match (${c.suitability_level})</div>
      </th>
    `;
  });

  const row = (title, keyExtractor) => `
    <tr class="border-t border-slate-200">
      <td class="p-3 font-semibold text-slate-700 bg-slate-50">${title}</td>
      ${crops.map(c => `<td class="p-3 text-slate-800 border-l border-slate-200">${keyExtractor(c)}</td>`).join("")}
    </tr>
  `;

  compareModalContent.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
        <thead>
          <tr>${headersHTML}</tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          ${row("Category", c => `<span class="bg-slate-100 px-2 py-0.5 rounded font-bold">${c.category}</span>`)}
          ${row("Net Profit / Acre", c => c.financials ? `<strong>₹${Math.round(c.financials.profit_per_acre_inr).toLocaleString("en-IN")}</strong> (${c.financials.roi_percentage}% ROI)` : "High")}
          ${row("Fertilizer Prescription", c => c.fertilizer_prescription ? `Urea: ${c.fertilizer_prescription.urea_bags_50kg} bags | DAP: ${c.fertilizer_prescription.dap_bags_50kg} bags` : "Standard")}
          ${row("Growth Duration", c => c.duration_days)}
          ${row("Water Requirement", c => `<strong>${c.water_requirement}</strong>`)}
          ${row("Est. Yield / Acre", c => c.estimated_yield_per_acre)}
          ${row("Sowing Window", c => c.sowing_window)}
          ${row("Key Sowing Advice", c => c.sowing_tips)}
          ${row("Fertilizer Advice", c => c.fertilizer_advice)}
          ${row("Soil Considerations", c => c.soil_notes)}
        </tbody>
      </table>
    </div>
  `;

  compareModal.classList.remove("hidden");
}

function closeComparisonModal() {
  compareModal.classList.add("hidden");
}
