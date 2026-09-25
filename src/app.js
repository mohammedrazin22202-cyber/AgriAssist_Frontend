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
// Multi-Language Dictionary (English, Hindi, Marathi, Punjabi, Gujarati)
const TRANSLATIONS = {
  en: {
    tagline: "Decision Support",
    subtitle: "Kisan Fasal Salahkaar • Empowering Indian Agriculture",
    detectLocation: "Detect Weather",
    landConverterBtn: "Land Converter",
    fieldWalkBtn: "GPS Walk-Meter",
    tabAdvisor: "Crop Sowing Advisor",
    tabSeed: "Seed & Spacing",
    tabDoctor: "Plant Doctor (IPM)",
    tabMandi: "Mandi Prices & Trends",
    tabSprayer: "Sprayer & Dilution",
    tabIrrigation: "Smart Irrigation",
    tabSolar: "Solar Pump (KUSUM)",
    tabOrganic: "Organic / Jaivik Kheti",
    tabIntercrop: "Intercropping Matrix",
    tabStorage: "Grain Storage Doctor",
    tabRotation: "1-Year Rotation",
    tabFertilizer: "Fertilizer Doctor",
    tabYojana: "Kisan Yojana Hub",
    tabKhata: "Kisan Bahi-Khata",
    tabLivestock: "Dairy & Livestock",
    livestockHeroTitle: "🐄 Dairy & Livestock Husbandry Doctor (पशुपालन एवं दुग्ध सलाहकार)",
    livestockHeroDesc: "Smallholder dairy intelligence. Calculate scientific daily cattle feed rations (Green fodder, Bhusa, and Concentrate balanced against milk yield), track 21-day heat cycles and calving pregnancy calendars, and access validated Ethno-Veterinary Herbal Remedies (EVM) for mastitis, bloat, and wounds.",
    rationTitle: "Scientific Daily Feed & Ration Calculator (संतुलित पशु आहार)",
    gestationTitle: "Heat Cycle & Gestation Pregnancy Tracker (गर्भावधि एवं प्रसव कैलेंडर)",
    evmTitle: "Ethno-Veterinary Herbal Remedies (EVM / देसी प्राकृतिक पशु चिकित्सा)",
    heroTitle: "What Should You Sow This Season?",
    heroDesc: "Make confident, high-yield planting decisions. Tell us about your soil, season, and irrigation, and AgriAssist will rank the most profitable, climate-resilient crops with exact fertilizer bags, cost estimates, and stage-wise agronomic guidance.",
    seedHeroTitle: "🌱 Seed Rate & Plant Geometry Calculator",
    seedHeroDesc: "Precision planting density and seed requirements. Calculate exact seed weight in kg, optimal row-to-row and plant-to-plant spacing, germination compensation, and bio-seed treatment recipes.",
    sprayerHeroTitle: "🚜 Knapsack Sprayer & Chemical Dilution Calculator",
    sprayerHeroDesc: "Eliminate crop leaf burn and chemical wastage. Calculate exact milliliters or grams to pour into each 15L or 16L spray pump, total tanks needed for your acreage, and essential protective safety guidelines.",
    solarHeroTitle: "☀️ Solar Ag-Pump Sizing & PM-KUSUM Subsidy Estimator",
    solarHeroDesc: "Free yourself from erratic electricity and rising diesel costs. Size the right 2 HP to 7.5 HP solar water pump for your borewell or canal and calculate up to 70% PM-KUSUM Component-B government subsidies.",
    intercropHeroTitle: "🌿 Intercropping & Companion Crop Matrix",
    intercropHeroDesc: "Multiply farm yield and reduce climate risk with biological companion planting. Discover scientifically validated Indian crop combinations with 20% to 40% Land Equivalent Ratio (LER) boosts, natural nitrogen fixation, and biological pest trap crops.",
    storageHeroTitle: "📦 Post-Harvest Grain Storage & Moisture Doctor",
    storageHeroDesc: "Stop losing 15-20% of your harvest to fungal rot and grain weevils. Check safe moisture limits, get zero-cost organic preservation recipes, and learn how to get bank pledge loans against e-NWR warehouse receipts.",
    doctorHeroTitle: "🩺 Kisan Plant Doctor & Pest Diagnostic",
    doctorHeroDesc: "Identify crop pests, fungal diseases, and nutrient deficiencies. Get biological Integrated Pest Management (IPM) recipes, exact chemical dosages, and Pre-Harvest Interval (PHI) waiting periods.",
    mandiHeroTitle: "📈 Mandi Market Prices & Trend Analytics",
    mandiHeroDesc: "Check live modal rates across major APMCs, monitor 30-day price trajectories, compare prices against official Government MSP, and get strategic 'Best Time to Sell' advisories.",
    irrigHeroTitle: "💧 Smart Irrigation & Water Budgeting Scheduler",
    irrigHeroDesc: "Calculate exact crop water depth, total volume in Liters, electric pump run hours, and irrigation frequency based on crop growth phase and real-time rainfall forecast.",
    organicHeroTitle: "🌿 Organic & Natural Farming (Jaivik Kheti / ZBNF)",
    organicHeroDesc: "Zero-chemical biological prescriptions. Calculate exact volumes of Jeevamrutha, Beejamrit seed treatment, Ghanjeevamrit solid manure, and botanical pest repellents tailored to your acreage.",
    yojanaHeroTitle: "🏛️ Kisan Yojana Hub (Government Schemes & Subsidies)",
    yojanaHeroDesc: "Maximize your government entitlements. Calculate PM Fasal Bima crop insurance premiums, check subsidized Kisan Credit Card (KCC) loan limits, PM-KISAN cash support, and PMKSY drip irrigation subsidies.",
    khataHeroTitle: "📒 Kisan Bahi-Khata (Farm Diary & Expense Tracker)",
    khataHeroDesc: "Your private, 100% offline farm account book. Record seed costs, labor, fertilizers, and crop sale receipts directly on your phone or computer. Calculate real net profit season-over-season.",
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
    langSwitch: "🌐 Language / भाषा",
    viewAdvice: "View Agronomic Advice ▼",
    hideAdvice: "Hide Agronomic Advice ▲",
    viewCompleteAdvice: "View Complete Agronomic Advice ▼",
    hideCompleteAdvice: "Hide Complete Advice ▲"
  },
  hi: {
    tagline: "कृषि निर्णय प्रणाली",
    subtitle: "किसान फसल सलाहकार • भारतीय कृषि सशक्तिकरण",
    detectLocation: "मौसम जांचें",
    landConverterBtn: "भूमि मापक",
    fieldWalkBtn: "जीपीएस खेत मापक",
    tabAdvisor: "फसल बुवाई सलाहकार",
    tabSeed: "बीज एवं दूरी",
    tabDoctor: "प्लांट डॉक्टर (कीट-रोग)",
    tabMandi: "मंडी भाव एवं रुझान",
    tabSprayer: "स्प्रेयर एवं दवा",
    tabIrrigation: "सटीक सिंचाई योजना",
    tabSolar: "सोलर पंप (कुसुम)",
    tabOrganic: "जैविक / प्राकृतिक खेती",
    tabIntercrop: "मिश्रित फसल",
    tabStorage: "अनाज भंडारण डॉक्टर",
    tabRotation: "1-वर्षीय फसल चक्र",
    tabFertilizer: "खाद एवं मृदा डॉक्टर",
    tabYojana: "किसान योजना हब",
    tabKhata: "किसान बही-खाता",
    tabLivestock: "पशुपालन एवं दुग्ध",
    livestockHeroTitle: "🐄 पशुपालन एवं दुग्ध सलाहकार (डेयरी डॉक्टर)",
    livestockHeroDesc: "वैज्ञानिक पशुपालन मार्गदर्शन। दुग्ध उत्पादन व शारीरिक वजन अनुसार संतुलित दैनिक आहार (हरा चारा, सूखा भूसा व दाना), 21-दिवसीय मद चक्र व प्रसव कैलेंडर और थनैला, अफारा व खुरपका रोगों के लिए प्रमाणित देसी हर्बल (EVM) उपचार।",
    rationTitle: "संतुलित दैनिक आहार कैलकुलेटर (पशु पोषण)",
    gestationTitle: "मद चक्र एवं गर्भावधि कैलेंडर (प्रसव ट्रैकर)",
    evmTitle: "देसी प्राकृतिक पशु चिकित्सा (EVM हर्बल उपचार)",
    heroTitle: "इस मौसम में कौन सी फसल बोएं?",
    heroDesc: "वैज्ञानिक एवं सटीक फसल निर्णय लें। अपनी मिट्टी, मौसम और सिंचाई की जानकारी दें, और एग्रीअसिस्ट आपको अधिकतम मुनाफे वाली, उपयुक्त फसलों की सिफारिश के साथ सटीक खाद की बोरी, लागत और पैदावार का हिसाब देगा।",
    seedHeroTitle: "🌱 बीज दर एवं पौध दूरी कैलकुलेटर",
    seedHeroDesc: "सटीक पौध संख्या एवं बीज आवश्यकता। एकड़ के अनुसार सही बीज की मात्रा (किलो), कतार-से-कतार व पौधे-से-पौधे की दूरी और जैविक बीज उपचार जानें।",
    sprayerHeroTitle: "🚜 नैपसैक स्प्रेयर एवं कीटनाशक घोल कैलकुलेटर",
    sprayerHeroDesc: "फसल जलने और दवा की बर्बादी से बचें। प्रत्येक 15 या 16 लीटर स्प्रे पंप में दवा की सही मात्रा (मिलीलीटर/ग्राम), आवश्यक कुल पंप और सुरक्षा नियम जानें।",
    solarHeroTitle: "☀️ सोलर पंप क्षमता एवं पीएम-कुसुम सब्सिडी",
    solarHeroDesc: "डीजल खर्च और बिजली कटौती से मुक्ति। अपने बोरवेल या कुएं के लिए सही सोलर पंप (2 से 7.5 HP) चुनें और 70% तक सरकारी सब्सिडी का हिसाब लगाएं।",
    intercropHeroTitle: "🌿 मिश्रित एवं सहफसली खेती मैट्रिक्स",
    intercropHeroDesc: "एक साथ दो फसलें लेकर मुनाफा बढ़ाएं और जोखिम घटाएं। वैज्ञानिक रूप से प्रमाणित भारतीय सहफसली जोड़ियां, भूमि उपयोग अनुपात (LER) और नाइट्रोजन लाभ जानें।",
    storageHeroTitle: "📦 फसल कटाई उपरांत अनाज भंडारण डॉक्टर",
    storageHeroDesc: "फफूंद, घुन और सड़न से 20% फसल नुकसान रोकें। सुरक्षित नमी प्रतिशत, मुफ्त देसी जैविक संरक्षण उपाय और e-NWR वेयरहाउस रसीद पर बैंक ऋण की जानकारी।",
    doctorHeroTitle: "🩺 किसान प्लांट डॉक्टर एवं कीट निदान",
    doctorHeroDesc: "फसल के रोगों और कीटों की तुरंत पहचान करें। जैविक (IPM) उपचार, सटीक रासायनिक कीटनाशक खुराक और फसल कटाई से पहले सुरक्षित प्रतीक्षा अवधि (PHI) जानें।",
    mandiHeroTitle: "📈 मंडी भाव एवं मूल्य विश्लेषण",
    mandiHeroDesc: "प्रमुख कृषि उपज मंडियों के ताजा मॉडल भाव देखें, 30 दिनों का मूल्य रुझान समझें, न्यूनतम समर्थन मूल्य (MSP) से तुलना करें और फसल बेचने का सही समय जानें।",
    irrigHeroTitle: "💧 सटीक सिंचाई एवं जल प्रबंधन",
    irrigHeroDesc: "फसल अवस्था के अनुसार आवश्यक पानी की मात्रा (लीटर), मोटर पंप चलने का समय (घंटे) और बारिश के पूर्वानुमान के आधार पर सिंचाई का सही समय निर्धारित करें।",
    organicHeroTitle: "🌿 जैविक एवं प्राकृतिक खेती (जीरो बजट)",
    organicHeroDesc: "रसायन मुक्त प्राकृतिक खेती। अपनी जमीन के रकबे के अनुसार जीवामृत, बीजामृत, घनजीवामृत और जैविक कीटनाशक (नीमास्त्र) की सही मात्रा और बनाने की विधि जानें।",
    yojanaHeroTitle: "🏛️ किसान योजना हब (सरकारी अनुदान एवं ऋण)",
    yojanaHeroDesc: "प्रधानमंत्री फसल बीमा योजना (PMFBY) का प्रीमियम निकालें, किसान क्रेडिट कार्ड (KCC) ऋण सीमा और ड्रिप सिंचाई पर 55% तक सरकारी सब्सिडी का हिसाब लगाएं।",
    khataHeroTitle: "📒 किसान बही-खाता (डिजिटल कृषि डायरी)",
    khataHeroDesc: "आपकी निजी, पूर्णतः ऑफलाइन कृषि बही-खाता। बीज, खाद, मजदूरी और फसल बिक्री का हर हिसाब अपने मोबाइल पर सुरक्षित रखें और वास्तविक शुद्ध मुनाफे का आकलन करें।",
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
    langSwitch: "🌐 भाषा / Language",
    viewAdvice: "कृषि सलाह देखें ▼",
    hideAdvice: "सलाह छिपाएं ▲",
    viewCompleteAdvice: "विस्तृत सलाह देखें ▼",
    hideCompleteAdvice: "सलाह छिपाएं ▲"
  },
  mr: {
    tagline: "कृषी निर्णय प्रणाली",
    subtitle: "शेतकरी पीक सल्लागार • प्रगत शेती मार्गदर्शन",
    detectLocation: "हवामान तपासा",
    landConverterBtn: "जमीन मापक",
    fieldWalkBtn: "जीपीएस शेत मापक",
    tabAdvisor: "पीक पेरणी सल्लागार",
    tabSeed: "बियाणे व अंतर",
    tabDoctor: "प्लँट डॉक्टर (रोग व कीड)",
    tabMandi: "बाजारभाव व कल",
    tabSprayer: "स्प्रेअर व औषध",
    tabIrrigation: "पाणी व्यवस्थापन",
    tabSolar: "सौर पंप (कुसुम)",
    tabOrganic: "सेंद्रिय / नैसर्गिक शेती",
    tabIntercrop: "आंतरपीक मॅट्रिक्स",
    tabStorage: "धान्य साठवणूक डॉक्टर",
    tabRotation: "१-वर्षीय पीक फेरपालट",
    tabFertilizer: "खत व माती डॉक्टर",
    tabYojana: "शासकीय योजना केंद्र",
    tabKhata: "शेतकरी वही-खाते",
    tabLivestock: "दुग्ध व पशुपालन",
    livestockHeroTitle: "🐄 दुग्ध व पशुपालन डॉक्टर (डेअरी सल्लागार)",
    livestockHeroDesc: "शास्त्रीय पद्धतीने जनावरांचा दैनिक संतुलित आहार, २१-दिवसीय माज चक्र व गाभण तपासणी आणि थनैला, पोटफुगीसाठी प्रमाणित देशी (EVM) उपचार.",
    rationTitle: "संतुलित दैनिक पशु आहार कॅल्क्युलेटर",
    gestationTitle: "माज चक्र व गाभण तपासणी कॅलेंडर",
    evmTitle: "देशी नैसर्गिक पशु चिकित्सा (EVM हर्बल उपचार)",
    heroTitle: "ह्या हंगामात कोणते पीक घ्यावे?",
    heroDesc: "शास्त्रीय पद्धतीने पीक निवड करा. माती, हवामान आणि पाण्याचे नियोजन करून योग्य पिकांची शिफारस आणि खतांचे अचूक प्रमाण मिळवा.",
    seedHeroTitle: "🌱 बियाणे दर व झाडांमधील अंतर कॅल्क्युलेटर",
    seedHeroDesc: "शास्त्रीय पद्धतीने बियाण्याचे प्रमाण (किलो), दोन ओळींतील व दोन रोपांतील योग्य अंतर, उगवण क्षमता व बीजप्रक्रिया पद्धती मोजा.",
    sprayerHeroTitle: "🚜 स्प्रेअर पंप व औषध प्रमाण कॅल्क्युलेटर",
    sprayerHeroDesc: "औषधाचा अपव्यय व पिकांचे नुकसान टाळा. प्रति १५-१६ लिटर पंपात लागणारे अचूक औषध आणि एकूण लागणारे पंप मोजा.",
    solarHeroTitle: "☀️ सौर कृषी पंप व पीएम-कुसुम अनुदान",
    solarHeroDesc: "विजेच्या लपंडावापासून मुक्ती मिळवा. आपल्या विहिरीसाठी किंवा बोअरवेलसाठी योग्य सौर पंप (२ HP ते ७.५ HP) व शासकीय अनुदान मोजा.",
    intercropHeroTitle: "🌿 आंतरपीक व मिश्र पीक पद्धती",
    intercropHeroDesc: "नैसर्गिक पद्धतीने जमिनीची सुपीकता वाढवा आणि एकाच वेळी दोन पिकांचे फायदेशीर उत्पादन मिळवा.",
    storageHeroTitle: "📦 काढणीपश्चात धान्य साठवणूक व आर्द्रता डॉक्टर",
    storageHeroDesc: "बुरशी व किडींपासून धान्याचे होणारे १५-२०% नुकसान टाळा. सुरक्षित साठवणुकीसाठी योग्य आर्द्रता मर्यादा व उपाय जाणून घ्या.",
    doctorHeroTitle: "🩺 शेतकरी प्लँट डॉक्टर व कीड नियंत्रण",
    doctorHeroDesc: "पिकांवरील रोग व किडींचे अचूक निदान, सेंद्रिय (IPM) व रासायनिक औषधांचे योग्य प्रमाण आणि सुरक्षित काढणी कालावधी (PHI).",
    mandiHeroTitle: "📈 कृषी उत्पन्न बाजारभाव व कल",
    mandiHeroDesc: "महाराष्ट्रातील प्रमुख बाजार समित्यांचे चालू भाव, ३० दिवसांचा बाजाराचा कल आणि किमान आधारभूत किंमत (MSP) तुलना.",
    irrigHeroTitle: "💧 सूक्ष्म सिंचन व पाणी नियोजन",
    irrigHeroDesc: "पिकांच्या वाढीच्या टप्प्यानुसार पाण्याची गरज (लिटर), पंप चालवण्याचे तास आणि पावसाच्या अंदाजानुसार योग्य नियोजन.",
    organicHeroTitle: "🌿 सेंद्रिय व नैसर्गिक शेती पद्धती",
    organicHeroDesc: "जीवामृत, बीजामृत, घनजीवामृत आणि निमास्त्राचे प्रमाण आणि घरच्या घरी तयार करण्याची सोपी पद्धत.",
    yojanaHeroTitle: "🏛️ शासकीय कृषी योजना व अनुदान",
    yojanaHeroDesc: "पंतप्रधान पीक विमा योजना (PMFBY), किसान क्रेडिट कार्ड (KCC) आणि ठिबक सिंचनावरील ५५% पर्यंतचे अनुदान.",
    khataHeroTitle: "📒 शेतकरी डिजिटल वही-खाते",
    khataHeroDesc: "बियाणे, खते, मजुरी आणि पीक विक्रीचा संपूर्ण हिशोब १००% ऑफलाइन आपल्या फोनवर सुरक्षित ठेवा.",
    formTitle: "शेताची माहिती भरा",
    formSubtitle: "योग्य पीक, खतांची मात्रा आणि नफा मोजण्यासाठी माहिती प्रविष्ट करा",
    modeSimple: "सोपी पद्धत",
    modeAdvanced: "प्रगत (मृदा आरोग्य पत्रिका)",
    labelSoilType: "मातीचा प्रकार",
    labelSeason: "पेरणीचा हंगाम",
    labelWater: "पाण्याची उपलब्धता",
    labelLandSize: "जमिनीचे क्षेत्र (एकर)",
    labelTopography: "जमिनीचा उतार",
    labelGoal: "गुंतवणूक व नफ्याचे उद्दिष्ट",
    btnGetRecommendations: "पीक शिफारसी मिळवा",
    btnPrintAdvisory: "सल्लागार पत्रक प्रिंट करा",
    noResults: "योग्य पीक आढळले नाही",
    langSwitch: "🌐 भाषा निवडा",
    viewAdvice: "कृषी सल्ला पहा ▼",
    hideAdvice: "सल्ला लपवा ▲",
    viewCompleteAdvice: "सविस्तर सल्ला पहा ▼",
    hideCompleteAdvice: "सल्ला लपवा ▲"
  },
  pa: {
    tagline: "ਖੇਤੀ ਫੈਸਲਾ ਪ੍ਰਣਾਲੀ",
    subtitle: "ਕਿਸਾਨ ਫਸਲ ਸਲਾਹਕਾਰ • ਪੰਜਾਬ ਤੇ ਹਰਿਆਣਾ ਖੇਤੀਬਾੜੀ",
    detectLocation: "ਮੌਸਮ ਵੇਖੋ",
    landConverterBtn: "ਜ਼ਮੀਨ ਮਾਪਕ",
    fieldWalkBtn: "ਜੀਪੀਐਸ ਖੇਤ ਮਾਪਕ",
    tabAdvisor: "ਫਸਲ ਬਿਜਾਈ ਸਲਾਹਕਾਰ",
    tabSeed: "ਬੀਜ ਤੇ ਦੂਰੀ",
    tabDoctor: "ਪਲਾਂਟ ਡਾਕਟਰ (ਕੀੜੇ ਤੇ ਬਿਮਾਰੀਆਂ)",
    tabMandi: "ਮੰਡੀ ਭਾਅ ਤੇ ਰੁਝਾਨ",
    tabSprayer: "ਸਪਰੇਅਰ ਤੇ ਦਵਾਈ",
    tabIrrigation: "ਸਿੰਚਾਈ ਪ੍ਰਬੰਧਨ",
    tabSolar: "ਸੋਲਰ ਪੰਪ (ਕੁਸੁਮ)",
    tabOrganic: "ਕੁਦਰਤੀ / ਜੈਵਿਕ ਖੇਤੀ",
    tabIntercrop: "ਅੰਤਰ-ਫਸਲੀ ਮੈਟ੍ਰਿਕਸ",
    tabStorage: "ਅਨਾਜ ਭੰਡਾਰਨ ਡਾਕਟਰ",
    tabRotation: "੧-ਸਾਲਾ ਫਸਲੀ ਚੱਕਰ",
    tabFertilizer: "ਖਾਦ ਤੇ ਮਿੱਟੀ ਡਾਕਟਰ",
    tabYojana: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਕੇਂਦਰ",
    tabKhata: "ਕਿਸਾਨ ਬਹੀ-ਖਾਤਾ",
    tabLivestock: "ਡੇਅਰੀ ਤੇ ਪਸ਼ੂ ਪਾਲਣ",
    livestockHeroTitle: "🐄 ਡੇਅਰੀ ਅਤੇ ਪਸ਼ੂ ਪਾਲਣ ਡਾਕਟਰ",
    livestockHeroDesc: "ਦੁੱਧ ਉਤਪਾਦਨ ਅਨੁਸਾਰ ਰੋਜ਼ਾਨਾ ਸੰਤੁਲਿਤ ਖੁਰਾਕ, ਗਰਭ ਠਹਿਰਣ ਕੈਲੰਡਰ ਅਤੇ ਦੇਸੀ (EVM) ਜੜੀ-ਬੂਟੀਆਂ ਦੇ ਨੁਸਖੇ।",
    rationTitle: "ਸੰਤੁਲਿਤ ਰੋਜ਼ਾਨਾ ਪਸ਼ੂ ਖੁਰਾਕ ਕੈਲਕੁਲੇਟਰ",
    gestationTitle: "ਗਰਭ ਅਵਸਥਾ ਅਤੇ ਜਣੇਪਾ ਕੈਲੰਡਰ",
    evmTitle: "ਦੇਸੀ ਕੁਦਰਤੀ ਪਸ਼ੂ ਇਲਾਜ (EVM ਜੜੀ-ਬੂਟੀਆਂ)",
    heroTitle: "ਇਸ ਸੀਜ਼ਨ ਕਿਹੜੀ ਫਸਲ ਬੀਜੀਏ?",
    heroDesc: "ਵਿਗਿਆਨਕ ਅਤੇ ਸਹੀ ਫਸਲ ਫੈਸਲੇ ਲਓ। ਆਪਣੀ ਜ਼ਮੀਨ ਅਤੇ ਪਾਣੀ ਅਨੁਸਾਰ ਵੱਧ ਮੁਨਾਫਾ ਦੇਣ ਵਾਲੀਆਂ ਫਸਲਾਂ ਅਤੇ ਖਾਦ ਦੀ ਸਹੀ ਮਾਤਰਾ ਜਾਣੋ।",
    seedHeroTitle: "🌱 ਬੀਜ ਦੀ ਮਾਤਰਾ ਅਤੇ ਫਾਸਲਾ ਕੈਲਕੁਲੇਟਰ",
    seedHeroDesc: "ਪ੍ਰਤੀ ਏਕੜ ਬੀਜ ਦੀ ਸਹੀ ਮਾਤਰਾ (ਕਿਲੋ), ਲਾਈਨਾਂ ਅਤੇ ਬੂਟਿਆਂ ਵਿਚਲਾ ਫਾਸਲਾ ਅਤੇ ਬੀਜ ਸੋਧ ਦੇ ਨੁਸਖੇ ਜਾਣੋ।",
    sprayerHeroTitle: "🚜 ਸਪਰੇਅ ਪੰਪ ਅਤੇ ਦਵਾਈ ਮਾਤਰਾ ਕੈਲਕੁਲੇਟਰ",
    sprayerHeroDesc: "ਫਸਲ ਦੇ ਨੁਕਸਾਨ ਅਤੇ ਵਾਧੂ ਦਵਾਈ ਤੋਂ ਬਚੋ। ਪ੍ਰਤੀ ੧੫-੧੬ ਲੀਟਰ ਟੈਂਕੀ ਲਈ ਸਹੀ ਦਵਾਈ ਅਤੇ ਕੁੱਲ ਟੈਂਕੀਆਂ ਦਾ ਹਿਸਾਬ ਲਗਾਓ।",
    solarHeroTitle: "☀️ ਸੋਲਰ ਪੰਪ ਅਤੇ ਪੀਐਮ-ਕੁਸੁਮ ਸਬਸਿਡੀ",
    solarHeroDesc: "ਬਿਜਲੀ ਕੱਟਾਂ ਅਤੇ ਡੀਜ਼ਲ ਖਰਚੇ ਤੋਂ ਛੁਟਕਾਰਾ ਪਾਓ। ਆਪਣੇ ਬੋਰਵੈਲ ਲਈ ਸਹੀ ਸੋਲਰ ਪੰਪ ਚੁਣੋ ਅਤੇ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਵੇਖੋ।",
    intercropHeroTitle: "🌿 ਰਲਵੀਂ ਖੇਤੀ ਅਤੇ ਅੰਤਰ-ਫਸਲ ਪ੍ਰਣਾਲੀ",
    intercropHeroDesc: "ਜ਼ਮੀਨ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਵਧਾਓ ਅਤੇ ਇਕੋ ਸਮੇਂ ਦੋ ਫਸਲਾਂ ਤੋਂ ਵੱਧ ਮੁਨਾਫਾ ਕਮਾਓ।",
    storageHeroTitle: "📦 ਵਾਢੀ ਉਪਰੰਤ ਅਨਾਜ ਸਾਂਭ-ਸੰਭਾਲ ਡਾਕਟਰ",
    storageHeroDesc: "ਸਿੱਲ੍ਹ ਅਤੇ ਕੀੜਿਆਂ ਤੋਂ ਅਨਾਜ ਨੂੰ ਬਚਾਓ। ਸੁਰੱਖਿਅਤ ਨਮੀ ਦਾ ਪੱਧਰ ਅਤੇ ਦੇਸੀ ਸਾਂਭ-ਸੰਭਾਲ ਦੇ ਤਰੀਕੇ ਜਾਣੋ।",
    doctorHeroTitle: "🩺 ਕਿਸਾਨ ਪਲਾਂਟ ਡਾਕਟਰ",
    doctorHeroDesc: "ਫਸਲਾਂ ਦੇ ਕੀੜਿਆਂ ਤੇ ਬਿਮਾਰੀਆਂ ਦੀ ਪਛਾਣ, ਜੈਵਿਕ ਅਤੇ ਰਸਾਇਣਕ ਰੋਕਥਾਮ ਦੀ ਸਹੀ ਖੁਰਾਕ ਅਤੇ ਸੁਚੇਤ ਸਪਰੇਅ ਸਮਾਂ।",
    mandiHeroTitle: "📈 ਮੰਡੀ ਭਾਅ ਅਤੇ ਰੁਝਾਨ",
    mandiHeroDesc: "ਪੰਜਾਬ ਅਤੇ ਨੇੜਲੀਆਂ ਮੰਡੀਆਂ ਦੇ ਤਾਜ਼ਾ ਭਾਅ, MSP ਨਾਲ ਤੁਲਨਾ ਅਤੇ ਫਸਲ ਵੇਚਣ ਦਾ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਸਮਾਂ।",
    irrigHeroTitle: "💧 ਸਮਾਰਟ ਸਿੰਚਾਈ ਤੇ ਪਾਣੀ ਬਜਟ",
    irrigHeroDesc: "ਫਸਲ ਦੀ ਸਟੇਜ ਅਨੁਸਾਰ ਪਾਣੀ ਦੀ ਲੋੜ (ਲੀਟਰ), ਮੋਟਰ ਪੰਪ ਚੱਲਣ ਦਾ ਸਮਾਂ ਅਤੇ ਬਾਰਿਸ਼ ਦੇ ਮੁਤਾਬਕ ਸਹੀ ਸਮਾਂ।",
    organicHeroTitle: "🌿 ਕੁਦਰਤੀ ਅਤੇ ਦੇਸੀ ਖੇਤੀ",
    organicHeroDesc: "ਜੀਵਾਮ੍ਰਿਤ, ਬੀਜਾਮ੍ਰਿਤ, ਘਣਜੀਵਾਮ੍ਰਿਤ ਅਤੇ ਨਿੰਮਾਸਤਰ ਬਣਾਉਣ ਦੀ ਵਿਧੀ ਅਤੇ ਜ਼ਮੀਨ ਅਨੁਸਾਰ ਸਹੀ ਮਾਤਰਾ।",
    yojanaHeroTitle: "🏛️ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ",
    yojanaHeroDesc: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ (PMFBY), ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC) ਅਤੇ ਤੁਪਕਾ ਸਿੰਚਾਈ ਸਬਸਿਡੀ।",
    khataHeroTitle: "📒 ਕਿਸਾਨ ਡਿਜੀਟਲ ਬਹੀ-ਖਾਤਾ",
    khataHeroDesc: "ਬੀਜ, ਖਾਦ, ਲੇਬਰ ਅਤੇ ਮੰਡੀ ਵਿਕਰੀ ਦਾ ਸਾਰਾ ਹਿਸਾਬ ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਆਪਣੇ ਮੋਬਾਈਲ 'ਤੇ ਦਰਜ ਕਰੋ।",
    formTitle: "ਖੇਤ ਦੇ ਵੇਰਵੇ ਦਰਜ ਕਰੋ",
    formSubtitle: "ਫਸਲ ਅਨੁਕੂਲਤਾ ਅਤੇ ਮੁਨਾਫੇ ਦੀ ਗਣਨਾ ਲਈ ਜਾਣਕਾਰੀ ਭਰੋ",
    modeSimple: "ਸੌਖਾ ਮੋਡ",
    modeAdvanced: "ਐਡਵਾਂਸਡ ਮੋਡ",
    labelSoilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
    labelSeason: "ਬਿਜਾਈ ਦਾ ਸੀਜ਼ਨ",
    labelWater: "ਪਾਣੀ ਦੀ ਸਹੂਲਤ",
    labelLandSize: "ਜ਼ਮੀਨ ਦਾ ਰਕਬਾ (ਏਕੜ)",
    labelTopography: "ਜ਼ਮੀਨ ਦੀ ਢਲਾਨ",
    labelGoal: "ਖੇਤੀ ਦਾ ਟੀਚਾ ਤੇ ਬਜਟ",
    btnGetRecommendations: "ਫਸਲ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰੋ",
    btnPrintAdvisory: "ਸਲਾਹਕਾਰ ਕਾਰਡ ਪ੍ਰਿੰਟ ਕਰੋ",
    noResults: "ਕੋਈ ਫਸਲ ਨਹੀਂ ਮਿਲੀ",
    langSwitch: "🌐 ਭਾਸ਼ਾ ਚੁਣੋ",
    viewAdvice: "ਖੇਤੀ ਸਲਾਹ ਵੇਖੋ ▼",
    hideAdvice: "ਸਲਾਹ ਲੁਕਾਓ ▲",
    viewCompleteAdvice: "ਵਿਸਤ੍ਰਿਤ ਸਲਾਹ ਵੇਖੋ ▼",
    hideCompleteAdvice: "ਸਲਾਹ ਲੁਕਾਓ ▲"
  },
  gu: {
    tagline: "કૃષિ નિર્ણય પ્રણાલી",
    subtitle: "ખેડૂત પાક સલાહકાર • ગુજરાત કૃષિ વિકાસ",
    detectLocation: "હવામાન તપાસો",
    landConverterBtn: "જમીન માપક",
    fieldWalkBtn: "જીપીએસ ખેતર માપક",
    tabAdvisor: "પાક વાવણી સલાહકાર",
    tabSeed: "બિયારણ અને અંતર",
    tabDoctor: "પ્લાન્ટ ડૉક્ટર (રોગ-જીવાત)",
    tabMandi: "બજારભાવ અને વલણ",
    tabSprayer: "સ્પ્રેયર અને દવા",
    tabIrrigation: "સ્માર્ટ પિયત વ્યવસ્થાપન",
    tabSolar: "સોલર પંપ (કુસુમ)",
    tabOrganic: "પ્રાકૃતિક / જૈવિક ખેતી",
    tabIntercrop: "મિશ્ર પાક પદ્ધતિ",
    tabStorage: "અનાજ સંગ્રહ ડૉક્ટર",
    tabRotation: "૧-વાર્ષિક પાક ચક્ર",
    tabFertilizer: "ખાતર અને જમીન ડૉક્ટર",
    tabYojana: "સરકારી યોજના કેન્દ્ર",
    tabKhata: "ખેડૂત વહી-ખાતું",
    tabLivestock: "પશુપાલન અને ડેરી",
    livestockHeroTitle: "🐄 પશુપાલન અને ડેરી સલાહકાર",
    livestockHeroDesc: "દૈનિક સંતુલિત પશુ આહાર, ૨૧-દિવસીય ગાભણ ચક્ર અને દેશી આયુર્વેદિક (EVM) ઉપચાર.",
    rationTitle: "સંતુલિત દૈનિક પશુ આહાર કેલ્ક્યુલેટર",
    gestationTitle: "ગાભણ ચક્ર અને વિયાણ કૅલેન્ડર",
    evmTitle: "દેશી આયુર્વેદિક પશુ ચિકિત્સા (EVM ઉપચાર)",
    heroTitle: "આ સીઝનમાં કયો પાક વાવવો?",
    heroDesc: "વૈજ્ઞાનિક રીતે સાચી પાક પસંદગી કરો. જમીન, ઋતુ અને પાણીની સુવિધા મુજબ સૌથી વધુ નફાકારક પાકની ભલામણ મેળવો.",
    seedHeroTitle: "🌱 બિયારણ દર અને અંતર કેલ્ક્યુલેટર",
    seedHeroDesc: "એકર દીઠ બિયારણનો ચોક્કસ જથ્થો (કિલો), બે હાર અને છોડ વચ્ચેનું સાચું અંતર અને બીજ માવજત પદ્ધતિઓ જાણો.",
    sprayerHeroTitle: "🚜 સ્પ્રે પંપ અને દવા માપ કેલ્ક્યુલેટર",
    sprayerHeroDesc: "પાકના પાન બળતા અટકાવો અને દવાનો બગાડ રોકો. ૧૫-૧૬ લીટરના પંપ દીઠ દવાનો સાચો ડોઝ અને કુલ પંપની ગણતરી કરો.",
    solarHeroTitle: "☀️ સોલર કૃષિ પંપ અને પીએમ-કુસુમ સહાય",
    solarHeroDesc: "વીજળી કાપ અને ડીઝલ ખર્ચથી મુક્તિ મેળવો. તમારા બોરવેલ કે કુવા માટે યોગ્ય સોલર પંપ અને સરકારી સબસિડી ગણો.",
    intercropHeroTitle: "🌿 મિશ્ર પાક અને આંતરપાક વ્યવસ્થા",
    intercropHeroDesc: "જમીનની ફળદ્રુપતા વધારો અને કુદરતી રીતે રોગ-જીવાત નિયંત્રણ સાથે બમણો નફો મેળવો.",
    storageHeroTitle: "📦 પાક લણણી પછી અનાજ સંગ્રહ ડૉક્ટર",
    storageHeroDesc: "ભેજ અને ધનેડાથી થતું અનાજનું નુકસાન અટકાવો. સુરક્ષિત ભેજ મર્યાદા અને સાચવણીના દેશી ઉપાયો જાણો.",
    doctorHeroTitle: "🩺 ખેડૂત પ્લાન્ટ ડૉક્ટર",
    doctorHeroDesc: "પાકના રોગ અને જીવાતનું સચોટ નિદાન, જૈવિક ઉપચાર અને દવા છંટકાવનો યોગ્ય ડોઝ.",
    mandiHeroTitle: "📈 માર્કેટ યાર્ડ બજારભાવ",
    mandiHeroDesc: "ગુજરાત માર્કેટિંગ યાર્ડના લાઈવ ભાવ, ૩૦ દિવસનું વલણ અને ટેકાના ભાવ (MSP) સાથે સરખામણી.",
    irrigHeroTitle: "💧 સ્માર્ટ પિયત અને પાણી આયોજન",
    irrigHeroDesc: "પાકના વિકાસના તબક્કા મુજબ પાણીની જરૂરિયાત (લીટર), મોટર પંપ ચલાવવાનો સમય અને વરસાદ અનુસાર આયોજન.",
    organicHeroTitle: "🌿 ગાય આધારિત પ્રાકૃતિક ખેતી",
    organicHeroDesc: "જીવામૃત, બીજામૃત, ઘનજીવામૃત અને નીમાસ્ત્ર બનાવવાની સાચી રીત અને માપ.",
    yojanaHeroTitle: "🏛️ સરકારી સહાય અને યોજનાઓ",
    yojanaHeroDesc: "પ્રધાનમંત્રી ફસલ બીમા યોજના, કિસાન ક્રેડિટ કાર્ડ (KCC) અને ડ્રિપ ઈરીગેશન પર ૫૫% સબસિડી.",
    khataHeroTitle: "📒 ખેડૂત ડિજિટલ વહી-ખાતું",
    khataHeroDesc: "બિયારણ, ખાતર, મજૂરી અને પાક વેચાણનો સંપૂર્ણ હિસાબ ઇન્ટરનેટ વગર મોબાઇલમાં રાખો.",
    formTitle: "ખેતરની વિગત દાખલ કરો",
    formSubtitle: "પાક અનુકૂળતા અને નફાની ગણતરી માટે વિગત ભરો",
    modeSimple: "સરળ મોડ",
    modeAdvanced: "ઉન્નત મોડ",
    labelSoilType: "જમીનનો પ્રકાર",
    labelSeason: "વાવણીની ઋતુ",
    labelWater: "પાણીની સુવિધા",
    labelLandSize: "જમીનનું ક્ષેત્રફળ (એકર)",
    labelTopography: "જમીનનો ઢોળાવ",
    labelGoal: "ખેતીનો હેતુ અને બજેટ",
    btnGetRecommendations: "પાક ભલામણ મેળવો",
    btnPrintAdvisory: "સલાહકાર કાર્ડ પ્રિન્ટ કરો",
    noResults: "કોઈ પાક મળ્યો નથી",
    langSwitch: "🌐 ભાષા પસંદ કરો",
    viewAdvice: "ખેતી સલાહ જુઓ ▼",
    hideAdvice: "સલાહ છુપાવો ▲",
    viewCompleteAdvice: "સંપૂર્ણ સલાહ જુઓ ▼",
    hideCompleteAdvice: "સલાહ છુપાવો ▲"
  }
};


// Complete 100 Crops Local Knowledge Base (Guarantees 100% Offline Resilience)
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
  { id: "coriander", name: "Coriander", hindi_name: "धनिया", scientific_name: "Coriandrum sativum", category: "Spices", seasons: ["Rabi", "All Season / Flexible"], suitable_soils: ["Black Soil (Regur)", "Alluvial Soil", "Sandy Loam Soil"], duration_days: "80 - 100 days", water_requirement: "Low to Medium", estimated_yield_per_acre: "6 - 10 Quintals", investment_level: "Low", profit_potential: "High", msp_price: 6500, seed_rate: 6, seed_cost: 120, cult_cost: 9500, yield_avg: 8, ideal_n: 40, ideal_p: 30, ideal_k: 20, sowing_window: "October 15th - November 15th", sowing_tips: "Split seeds gently before sowing. Shallow 2cm drill.", fertilizer_advice: "Basal DAP and Potash.", soil_notes: "Medium black or alluvial loam.", companion_crops: ["Chickpea", "Mustard"] },
  {"id": "barley", "name": "Barley (Jau)", "hindi_name": "जौ", "scientific_name": "Hordeum vulgare", "category": "Cereal", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil"], "duration_days": "110 - 125 days", "water_requirement": "Low", "estimated_yield_per_acre": "16 - 22 Quintals", "investment_level": "Low", "profit_potential": "Moderate", "msp_price": 1980, "seed_rate": 35.0, "seed_cost": 40, "cult_cost": 10500, "yield_avg": 19.0, "ideal_n": 60, "ideal_p": 30, "ideal_k": 20, "sowing_window": "October 20 - November 15", "sowing_tips": "Sow at 4-5 cm depth. Exceptional tolerance to soil salinity and drought compared to wheat.", "fertilizer_advice": "Apply half N and full P & K at sowing; remaining half N at first irrigation (30 days).", "soil_notes": "Thrives on well-drained loams; possesses high salinity and alkalinity tolerance.", "companion_crops": ["Mustard", "Chickpea"]},
  {"id": "oats", "name": "Oats (Jai)", "hindi_name": "जई", "scientific_name": "Avena sativa", "category": "Cereal", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil"], "duration_days": "100 - 120 days", "water_requirement": "Medium", "estimated_yield_per_acre": "14 - 18 Quintals", "investment_level": "Low to Moderate", "profit_potential": "Moderate to High", "msp_price": 2250, "seed_rate": 35.0, "seed_cost": 55, "cult_cost": 11000, "yield_avg": 16.0, "ideal_n": 80, "ideal_p": 40, "ideal_k": 30, "sowing_window": "October 15 - November 20", "sowing_tips": "Excellent dual-purpose crop for nutrient-rich grain and succulent green fodder.", "fertilizer_advice": "Apply 40kg N basal + full P/K; top dress remaining N after each fodder cut.", "soil_notes": "Prefers moist, friable loam soils with good organic matter content.", "companion_crops": ["Berseem", "Mustard"]},
  {"id": "foxtail_millet", "name": "Foxtail Millet (Kangni / Kakum)", "hindi_name": "कंगनी", "scientific_name": "Setaria italica", "category": "Cereal", "seasons": ["Kharif", "Zaid"], "suitable_soils": ["Red Soil", "Sandy Loam Soil", "Laterite Soil"], "duration_days": "70 - 85 days", "water_requirement": "Low", "estimated_yield_per_acre": "8 - 12 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 3600, "seed_rate": 3.0, "seed_cost": 90, "cult_cost": 7500, "yield_avg": 10.0, "ideal_n": 40, "ideal_p": 20, "ideal_k": 20, "sowing_window": "June - July (Monsoon) or February (Summer)", "sowing_tips": "Low-GI super-millet. Sow at 2-3 cm shallow depth. Thinning at 15 days is critical.", "fertilizer_advice": "Modest fertility: apply 5 tons FYM/acre with half N and full P basal.", "soil_notes": "Well-drained shallow to medium soils; thrives in drought-prone upland terrain.", "companion_crops": ["Pigeon Pea", "Cowpea"]},
  {"id": "kodo_millet", "name": "Kodo Millet (Kodon)", "hindi_name": "कोदो", "scientific_name": "Paspalum scrobiculatum", "category": "Cereal", "seasons": ["Kharif"], "suitable_soils": ["Red Soil", "Laterite Soil", "Sandy Loam Soil"], "duration_days": "100 - 115 days", "water_requirement": "Low", "estimated_yield_per_acre": "7 - 11 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 3800, "seed_rate": 4.0, "seed_cost": 85, "cult_cost": 7000, "yield_avg": 9.0, "ideal_n": 40, "ideal_p": 20, "ideal_k": 20, "sowing_window": "June 15 - July 15", "sowing_tips": "Ancient climate-resilient grain with high fiber and antioxidant profile.", "fertilizer_advice": "Apply organic compost or FYM @ 3 tons/acre with modest basal DAP.", "soil_notes": "Survives on degraded, stony, and nutrient-exhausted red soils.", "companion_crops": ["Black Gram", "Soybean"]},
  {"id": "little_millet", "name": "Little Millet (Kutki)", "hindi_name": "कुटकी", "scientific_name": "Panicum sumatrense", "category": "Cereal", "seasons": ["Kharif"], "suitable_soils": ["Red Soil", "Laterite Soil", "Sandy Loam Soil"], "duration_days": "75 - 90 days", "water_requirement": "Low", "estimated_yield_per_acre": "6 - 10 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 3900, "seed_rate": 3.5, "seed_cost": 85, "cult_cost": 6800, "yield_avg": 8.0, "ideal_n": 30, "ideal_p": 20, "ideal_k": 20, "sowing_window": "June 15 - July 20", "sowing_tips": "Extremely fast growing and drought resistant. Ideal insurance crop for short monsoons.", "fertilizer_advice": "Requires very little chemical fertilizer; 2-3 tons FYM per acre is sufficient.", "soil_notes": "Performs well even in infertile, stony upland terrain.", "companion_crops": ["Pigeon Pea", "Horse Gram"]},
  {"id": "barnyard_millet", "name": "Barnyard Millet (Sanwa / Jhangora)", "hindi_name": "सांवा", "scientific_name": "Echinochloa frumentacea", "category": "Cereal", "seasons": ["Kharif"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Red Soil"], "duration_days": "70 - 85 days", "water_requirement": "Low", "estimated_yield_per_acre": "8 - 14 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 3750, "seed_rate": 4.0, "seed_cost": 90, "cult_cost": 7200, "yield_avg": 11.0, "ideal_n": 40, "ideal_p": 20, "ideal_k": 20, "sowing_window": "May - June (Hills) or June - July (Plains)", "sowing_tips": "Fastest growing among millets; popular Navratri fasting grain (Vrat ke chawal).", "fertilizer_advice": "Basal application of 3-4 tons FYM with 20 kg DAP per acre.", "soil_notes": "Adapts from warm plains to cold Himalayan foothills up to 2000m altitude.", "companion_crops": ["Soybean", "Cowpea"]},
  {"id": "proso_millet", "name": "Proso Millet (Cheena / Barri)", "hindi_name": "चीना", "scientific_name": "Panicum miliaceum", "category": "Cereal", "seasons": ["Zaid", "Kharif"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil", "Red Soil"], "duration_days": "60 - 75 days", "water_requirement": "Low", "estimated_yield_per_acre": "7 - 10 Quintals", "investment_level": "Low", "profit_potential": "Moderate to High", "msp_price": 3650, "seed_rate": 4.0, "seed_cost": 80, "cult_cost": 6500, "yield_avg": 8.5, "ideal_n": 30, "ideal_p": 20, "ideal_k": 20, "sowing_window": "March 15 - April 15 (Summer) or July (Kharif)", "sowing_tips": "Short 60-day catch crop between Rabi harvest and Kharif sowing.", "fertilizer_advice": "Modest basal dose of DAP @ 25 kg/acre. Requires very low nitrogen.", "soil_notes": "Well-drained light loams; highly vulnerable to waterlogging.", "companion_crops": ["Green Gram", "Cowpea"]},
  {"id": "buckwheat", "name": "Buckwheat (Kuttu)", "hindi_name": "कुट्टू", "scientific_name": "Fagopyrum esculentum", "category": "Cereal", "seasons": ["Kharif", "Rabi"], "suitable_soils": ["Sandy Loam Soil", "Laterite Soil", "Alluvial Soil"], "duration_days": "70 - 85 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "6 - 10 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 4500, "seed_rate": 15.0, "seed_cost": 95, "cult_cost": 8000, "yield_avg": 8.0, "ideal_n": 30, "ideal_p": 30, "ideal_k": 30, "sowing_window": "August - September (Plains) or May - June (Hills)", "sowing_tips": "Nutrient-dense pseudo-cereal loaded with Rutin. Excellent pollinator attractor.", "fertilizer_advice": "Avoid excess Nitrogen which causes excessive foliage and lodging.", "soil_notes": "Prefers well-drained acidic to neutral light loams in temperate/cool climates.", "companion_crops": ["Mustard", "Apple orchard intercrop"]},
  {"id": "amaranth_grain", "name": "Grain Amaranth (Rajgira / Ramdana)", "hindi_name": "राजगिरा", "scientific_name": "Amaranthus hypochondriacus", "category": "Cereal", "seasons": ["Rabi", "Kharif"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Red Soil"], "duration_days": "90 - 115 days", "water_requirement": "Low", "estimated_yield_per_acre": "7 - 12 Quintals", "investment_level": "Low", "profit_potential": "Very High", "msp_price": 5200, "seed_rate": 1.5, "seed_cost": 180, "cult_cost": 8500, "yield_avg": 9.5, "ideal_n": 50, "ideal_p": 30, "ideal_k": 20, "sowing_window": "Oct - Nov (Plains) or May - June (Hills)", "sowing_tips": "Mix tiny seeds with dry sand (1:5 ratio) for uniform shallow broadcasting.", "fertilizer_advice": "Apply FYM @ 5 tons/acre basal with moderate DAP. Top-dress N once at 30 days.", "soil_notes": "Wide adaptation; thrives in fertile well-drained loamy soils.", "companion_crops": ["Chickpea", "Lentil"]}
,
  {"id": "field_pea", "name": "Field Pea / Dry Pea (Matar)", "hindi_name": "मटर", "scientific_name": "Pisum sativum var. arvense", "category": "Pulse", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Clay Loam Soil", "Sandy Loam Soil"], "duration_days": "100 - 120 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "8 - 14 Quintals", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 5400, "seed_rate": 30.0, "seed_cost": 85, "cult_cost": 11500, "yield_avg": 11.0, "ideal_n": 20, "ideal_p": 50, "ideal_k": 20, "sowing_window": "October 15 - November 15", "sowing_tips": "Inoculate seeds with Rhizobium leguminosarum. Sow at 5-7 cm depth.", "fertilizer_advice": "DAP basal dose @ 50 kg/acre. Legume fixes its own Nitrogen.", "soil_notes": "Well-drained fertile loam; extremely sensitive to soil acidity and water stagnation.", "companion_crops": ["Mustard", "Wheat"]},
  {"id": "kidney_beans", "name": "Kidney Beans (Rajma)", "hindi_name": "राजमा", "scientific_name": "Phaseolus vulgaris", "category": "Pulse", "seasons": ["Rabi", "Kharif"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil"], "duration_days": "110 - 130 days", "water_requirement": "Medium", "estimated_yield_per_acre": "8 - 12 Quintals", "investment_level": "Moderate", "profit_potential": "Very High", "msp_price": 7800, "seed_rate": 35.0, "seed_cost": 140, "cult_cost": 15000, "yield_avg": 10.0, "ideal_n": 80, "ideal_p": 60, "ideal_k": 40, "sowing_window": "Oct 15 - Nov 10 (Plains) or May - June (Hills)", "sowing_tips": "Unlike other pulses, Rajma lacks native nodulation in plains and requires full Nitrogen application.", "fertilizer_advice": "Apply 40kg N + full P & K basal; top dress remaining 40kg N in two equal splits.", "soil_notes": "Deep fertile, well-drained loam with high organic matter; sensitive to waterlogging.", "companion_crops": ["Maize (in hills)", "Coriander"]},
  {"id": "moth_bean", "name": "Moth Bean (Matki)", "hindi_name": "मोठ", "scientific_name": "Vigna aconitifolia", "category": "Pulse", "seasons": ["Kharif"], "suitable_soils": ["Sandy Loam Soil", "Red Soil"], "duration_days": "65 - 80 days", "water_requirement": "Low", "estimated_yield_per_acre": "4 - 7 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 7200, "seed_rate": 5.0, "seed_cost": 110, "cult_cost": 6000, "yield_avg": 5.5, "ideal_n": 15, "ideal_p": 30, "ideal_k": 15, "sowing_window": "July 1 - July 25", "sowing_tips": "Most drought-tolerant legume in the world. Thrives in the Thar desert with single rainfall.", "fertilizer_advice": "SSP @ 30 kg/acre basal. Fixes abundant atmospheric Nitrogen.", "soil_notes": "Well-drained sandy or light gravelly soils; prevents wind erosion.", "companion_crops": ["Pearl Millet (Bajra)", "Cluster Bean (Guar)"]},
  {"id": "horse_gram", "name": "Horse Gram (Kulthi)", "hindi_name": "कुलथी", "scientific_name": "Macrotyloma uniflorum", "category": "Pulse", "seasons": ["Kharif", "Rabi"], "suitable_soils": ["Red Soil", "Laterite Soil", "Sandy Loam Soil"], "duration_days": "110 - 130 days", "water_requirement": "Low", "estimated_yield_per_acre": "5 - 8 Quintals", "investment_level": "Low", "profit_potential": "Moderate to High", "msp_price": 6400, "seed_rate": 10.0, "seed_cost": 80, "cult_cost": 5500, "yield_avg": 6.5, "ideal_n": 15, "ideal_p": 30, "ideal_k": 15, "sowing_window": "August - September (Late Kharif / Semi-dry)", "sowing_tips": "Excellent emergency / contingent crop when main rains fail. High iron and medicinal value.", "fertilizer_advice": "Basal DAP @ 25 kg/acre. Extremely efficient at extracting nutrients from poor soil.", "soil_notes": "Tolerates severe acidity and degraded, eroded soils.", "companion_crops": ["Finger Millet", "Castor"]},
  {"id": "cluster_bean", "name": "Cluster Bean (Guar)", "hindi_name": "ग्वार", "scientific_name": "Cyamopsis tetragonoloba", "category": "Pulse", "seasons": ["Kharif"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil", "Red Soil"], "duration_days": "90 - 115 days", "water_requirement": "Low", "estimated_yield_per_acre": "6 - 10 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 5800, "seed_rate": 6.0, "seed_cost": 95, "cult_cost": 7500, "yield_avg": 8.0, "ideal_n": 15, "ideal_p": 40, "ideal_k": 20, "sowing_window": "June 25 - July 20", "sowing_tips": "Major industrial cash pulse; source of high-demand Guar Gum for food and drilling.", "fertilizer_advice": "DAP @ 30-40 kg/acre basal. Deep taproot enriches soil with biological Nitrogen.", "soil_notes": "Well-drained alluvial and sandy loams; alkaline soils are well tolerated.", "companion_crops": ["Pearl Millet", "Moth Bean"]},
  {"id": "broad_bean", "name": "Broad Bean / Faba Bean (Bakla)", "hindi_name": "बाकला", "scientific_name": "Vicia faba", "category": "Pulse", "seasons": ["Rabi"], "suitable_soils": ["Clay Loam Soil", "Alluvial Soil", "Black Soil (Regur)"], "duration_days": "115 - 135 days", "water_requirement": "Medium", "estimated_yield_per_acre": "10 - 15 Quintals", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 5100, "seed_rate": 35.0, "seed_cost": 70, "cult_cost": 11000, "yield_avg": 12.5, "ideal_n": 25, "ideal_p": 50, "ideal_k": 30, "sowing_window": "October 15 - November 15", "sowing_tips": "Cold-hardy heavy-yielding winter legume. Excellent biological nitrogen fixer.", "fertilizer_advice": "Apply DAP @ 50 kg/acre basal with Potash. Treat seed with Rhizobium leguminosarum.", "soil_notes": "Heavy loams and clays with high moisture holding capacity.", "companion_crops": ["Barley", "Wheat"]},
  {"id": "grass_pea", "name": "Grass Pea / Khesari (Khesari Dal)", "hindi_name": "खेसारी", "scientific_name": "Lathyrus sativus", "category": "Pulse", "seasons": ["Rabi"], "suitable_soils": ["Clay Loam Soil", "Alluvial Soil", "Black Soil (Regur)"], "duration_days": "110 - 125 days", "water_requirement": "Low", "estimated_yield_per_acre": "6 - 10 Quintals", "investment_level": "Low", "profit_potential": "Moderate to High", "msp_price": 5450, "seed_rate": 25.0, "seed_cost": 65, "cult_cost": 5000, "yield_avg": 8.0, "ideal_n": 15, "ideal_p": 35, "ideal_k": 20, "sowing_window": "October - November (often broadcast into standing paddy)", "sowing_tips": "Supreme relay / utera crop in eastern rice fallows; uses residual paddy moisture without tillage.", "fertilizer_advice": "No tillage or basal fertilizer needed when sown as utera; fixes 50 kg N/ha.", "soil_notes": "Heavy clay and alluvial soils; survives extreme drought as well as temporary water stagnation.", "companion_crops": ["Paddy (relay/paira)", "Mustard"]}
,
  {"id": "sesamum", "name": "Sesame / Gingelly (Til)", "hindi_name": "तिल", "scientific_name": "Sesamum indicum", "category": "Oilseed", "seasons": ["Kharif", "Zaid"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil", "Red Soil"], "duration_days": "80 - 95 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "4 - 7 Quintals", "investment_level": "Low", "profit_potential": "Very High", "msp_price": 9267, "seed_rate": 2.0, "seed_cost": 220, "cult_cost": 8500, "yield_avg": 5.5, "ideal_n": 40, "ideal_p": 25, "ideal_k": 20, "sowing_window": "June - July (Kharif) or February - March (Summer)", "sowing_tips": "Mix tiny seeds with dry sand (1:4) for uniform shallow drilling. Thin to 15cm at 15 days.", "fertilizer_advice": "Apply Sulfur @ 15 kg/acre to boost oil content (>50%) and aroma.", "soil_notes": "Well-drained light loams; extremely sensitive to standing water and soil crusting.", "companion_crops": ["Pigeon Pea", "Groundnut"]},
  {"id": "castor", "name": "Castor (Arandi)", "hindi_name": "अरंडी", "scientific_name": "Ricinus communis", "category": "Oilseed", "seasons": ["Kharif"], "suitable_soils": ["Sandy Loam Soil", "Red Soil", "Alluvial Soil"], "duration_days": "150 - 180 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "10 - 16 Quintals", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 6800, "seed_rate": 4.0, "seed_cost": 250, "cult_cost": 12500, "yield_avg": 13.0, "ideal_n": 80, "ideal_p": 40, "ideal_k": 30, "sowing_window": "July 15 - August 15", "sowing_tips": "Wide planting geometry (120x60 cm). Deep taproot breaks subsoil hardpans.", "fertilizer_advice": "Split Nitrogen into 3 doses: basal, 40 days, and 70 days at secondary spike initiation.", "soil_notes": "Well-drained sandy loams and red loamy soils. Susceptible to water stagnation.", "companion_crops": ["Groundnut", "Pigeon Pea"]},
  {"id": "linseed", "name": "Linseed / Flaxseed (Alsi)", "hindi_name": "अलसी", "scientific_name": "Linum usitatissimum", "category": "Oilseed", "seasons": ["Rabi"], "suitable_soils": ["Clay Loam Soil", "Alluvial Soil", "Black Soil (Regur)"], "duration_days": "115 - 130 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "6 - 10 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 6200, "seed_rate": 12.0, "seed_cost": 85, "cult_cost": 8500, "yield_avg": 8.0, "ideal_n": 50, "ideal_p": 30, "ideal_k": 20, "sowing_window": "October 15 - November 15", "sowing_tips": "High Omega-3 super-oilseed. Shallow 2-3 cm drilling. Also provides valuable bast fiber.", "fertilizer_advice": "Basal application of DAP and Potash. Top-dress half Urea at first irrigation (35 days).", "soil_notes": "Moisture-retentive black and clayey soils. Excellent relay crop in eastern rice fields.", "companion_crops": ["Chickpea", "Wheat"]},
  {"id": "safflower", "name": "Safflower (Kardi / Kusum)", "hindi_name": "कुसुम", "scientific_name": "Carthamus tinctorius", "category": "Oilseed", "seasons": ["Rabi"], "suitable_soils": ["Black Soil (Regur)", "Clay Loam Soil"], "duration_days": "125 - 145 days", "water_requirement": "Low", "estimated_yield_per_acre": "6 - 10 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 5800, "seed_rate": 5.0, "seed_cost": 95, "cult_cost": 8000, "yield_avg": 8.0, "ideal_n": 40, "ideal_p": 40, "ideal_k": 20, "sowing_window": "October 1 - October 30", "sowing_tips": "Deep taproot (up to 2-3 meters) draws moisture from subsoil; ideal dryland black soil oilseed.", "fertilizer_advice": "Apply DAP @ 40 kg/acre basal. Highly responsive to deep Phosphorus placement.", "soil_notes": "Deep black vertisols with high clay content and moisture storage capacity.", "companion_crops": ["Chickpea", "Wheat (intercrop 3:1)"]},
  {"id": "niger_seed", "name": "Niger Seed (Ramtil / Kala Til)", "hindi_name": "रामतिल", "scientific_name": "Guizotia abyssinica", "category": "Oilseed", "seasons": ["Kharif"], "suitable_soils": ["Red Soil", "Laterite Soil", "Sandy Loam Soil"], "duration_days": "95 - 110 days", "water_requirement": "Low", "estimated_yield_per_acre": "3 - 5 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 8717, "seed_rate": 3.0, "seed_cost": 120, "cult_cost": 5500, "yield_avg": 4.0, "ideal_n": 25, "ideal_p": 25, "ideal_k": 15, "sowing_window": "July 15 - August 15", "sowing_tips": "Valuable tribal highland oilseed; thrives on poorest slopes with zero chemical inputs.", "fertilizer_advice": "Organic compost @ 2 tons/acre with modest basal DAP @ 20 kg/acre.", "soil_notes": "Infertile, shallow, gravelly and marginal acidic hill soils.", "companion_crops": ["Finger Millet", "Pigeon Pea"]},
  {"id": "canola", "name": "Canola / Gobhi Sarson", "hindi_name": "गोभी", "scientific_name": "Brassica napus", "category": "Oilseed", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Clay Loam Soil", "Sandy Loam Soil"], "duration_days": "140 - 160 days", "water_requirement": "Medium", "estimated_yield_per_acre": "9 - 14 Quintals", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 6100, "seed_rate": 2.0, "seed_cost": 240, "cult_cost": 10500, "yield_avg": 11.5, "ideal_n": 80, "ideal_p": 40, "ideal_k": 30, "sowing_window": "October 10 - October 30", "sowing_tips": "Long-duration high-oil Brassica (42-44% oil with low erucic acid). Tender leaves usable as saag.", "fertilizer_advice": "Apply Sulfur @ 20 kg/acre along with NPK; split Nitrogen into two top dressings.", "soil_notes": "Fertile alluvial and clay loams with good drainage.", "companion_crops": ["Wheat", "Gram"]}
,
  {"id": "sunn_hemp", "name": "Sunn Hemp (Sanai)", "hindi_name": "सनई", "scientific_name": "Crotalaria juncea", "category": "Fiber", "seasons": ["Kharif"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Red Soil"], "duration_days": "75 - 90 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "8 - 12 Quintals (Fiber) or 100 Qtl (Green manure)", "investment_level": "Low", "profit_potential": "Moderate to High", "msp_price": 5200, "seed_rate": 20.0, "seed_cost": 65, "cult_cost": 6500, "yield_avg": 10.0, "ideal_n": 15, "ideal_p": 40, "ideal_k": 20, "sowing_window": "April - May (Pre-monsoon) or June", "sowing_tips": "Dual-purpose miracle legume: high-tensile cordage fiber and fixes 80-100 kg N/ha as green manure.", "fertilizer_advice": "DAP @ 30 kg/acre basal. Inoculate with Rhizobium for massive root nodulation.", "soil_notes": "Well-drained light loamy soils. Suppresses root-knot nematodes naturally.", "companion_crops": ["Sugarcane (green manure before planting)", "Paddy"]},
  {"id": "mesta", "name": "Mesta / Kenaf (Patsan)", "hindi_name": "पटसन", "scientific_name": "Hibiscus cannabinus", "category": "Fiber", "seasons": ["Kharif"], "suitable_soils": ["Alluvial Soil", "Red Soil", "Laterite Soil"], "duration_days": "120 - 140 days", "water_requirement": "Medium", "estimated_yield_per_acre": "10 - 15 Quintals", "investment_level": "Low to Moderate", "profit_potential": "Moderate", "msp_price": 5050, "seed_rate": 6.0, "seed_cost": 90, "cult_cost": 9000, "yield_avg": 12.5, "ideal_n": 50, "ideal_p": 25, "ideal_k": 25, "sowing_window": "May - June", "sowing_tips": "Hardy substitute for jute in drier, less waterlogged soils. Used for burlap, rope, and paper pulp.", "fertilizer_advice": "Apply 50% N + full P & K basal; top dress remaining N at 30 days.", "soil_notes": "Tolerates lower rainfall and less fertile soils than true jute.", "companion_crops": ["Paddy", "Groundnut"]},
  {"id": "sisal", "name": "Sisal (Agave)", "hindi_name": "रामबांस", "scientific_name": "Agave sisalana", "category": "Fiber", "seasons": ["All Season / Flexible"], "suitable_soils": ["Red Soil", "Sandy Loam Soil", "Laterite Soil"], "duration_days": "Perennial (Harvest starts Year 3)", "water_requirement": "Low", "estimated_yield_per_acre": "12 - 18 Quintals (Dry Fiber/yr)", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 7500, "seed_rate": 2000.0, "seed_cost": 2, "cult_cost": 14000, "yield_avg": 15.0, "ideal_n": 40, "ideal_p": 20, "ideal_k": 40, "sowing_window": "July - August (Planting bulbils / suckers)", "sowing_tips": "Hardy perennial succulent providing durable maritime rope fiber. Living bio-fence against wild animals.", "fertilizer_advice": "Apply organic mulch and modest Potash annually; returns leaf waste to soil.", "soil_notes": "Survives on arid, eroded, stony wastelands where no other crop grows.", "companion_crops": ["Live fence border", "Stylosanthes pasture intercrop"]}
,
  {"id": "cumin", "name": "Cumin (Jeera)", "hindi_name": "जीरा", "scientific_name": "Cuminum cyminum", "category": "Spices", "seasons": ["Rabi"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil"], "duration_days": "100 - 115 days", "water_requirement": "Low", "estimated_yield_per_acre": "4 - 6 Quintals", "investment_level": "Moderate", "profit_potential": "Very High", "msp_price": 22000, "seed_rate": 5.0, "seed_cost": 350, "cult_cost": 16000, "yield_avg": 5.0, "ideal_n": 30, "ideal_p": 25, "ideal_k": 20, "sowing_window": "November 1 - November 25", "sowing_tips": "High-value arid spice. Soak seeds 8 hours before sowing. Extremely delicate root system.", "fertilizer_advice": "Avoid excessive Nitrogen which triggers devastating blight and powdery mildew.", "soil_notes": "Well-drained sandy loam rich in organic matter with neutral to mildly alkaline pH.", "companion_crops": ["Mustard (border crop)", "Fenugreek"]},
  {"id": "fennel", "name": "Fennel (Saunf)", "hindi_name": "सौंफ", "scientific_name": "Foeniculum vulgare", "category": "Spices", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Black Soil (Regur)"], "duration_days": "150 - 180 days", "water_requirement": "Medium", "estimated_yield_per_acre": "8 - 12 Quintals", "investment_level": "Moderate", "profit_potential": "Very High", "msp_price": 14500, "seed_rate": 3.0, "seed_cost": 250, "cult_cost": 16500, "yield_avg": 10.0, "ideal_n": 50, "ideal_p": 30, "ideal_k": 25, "sowing_window": "October 1 - October 25 (Transplanting nursery: Sept)", "sowing_tips": "Transplanting 45-day nursery seedlings gives 30% higher seed yield than direct sowing.", "fertilizer_advice": "Split Nitrogen into 3 doses (basal, 45 days, and 75 days).", "soil_notes": "Deep fertile alluvial or medium black loam with good aeration.", "companion_crops": ["Garlic", "Coriander"]},
  {"id": "fenugreek_seed", "name": "Fenugreek (Methi Dana)", "hindi_name": "मेथी", "scientific_name": "Trigonella foenum-graecum", "category": "Spices", "seasons": ["Rabi"], "suitable_soils": ["Clay Loam Soil", "Alluvial Soil", "Sandy Loam Soil"], "duration_days": "100 - 120 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "7 - 11 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 7200, "seed_rate": 10.0, "seed_cost": 90, "cult_cost": 9000, "yield_avg": 9.0, "ideal_n": 20, "ideal_p": 40, "ideal_k": 20, "sowing_window": "October 15 - November 15", "sowing_tips": "Dual spice & medicinal seed crop; fixes rich soil Nitrogen. Treat seed with Rhizobium meliloti.", "fertilizer_advice": "DAP @ 40 kg/acre basal. Avoid excess Nitrogen which induces fungal diseases.", "soil_notes": "Well-drained fertile loamy soils; sensitive to water stagnation.", "companion_crops": ["Chickpea", "Coriander"]},
  {"id": "black_pepper", "name": "Black Pepper (Kali Mirch)", "hindi_name": "काली", "scientific_name": "Piper nigrum", "category": "Spices", "seasons": ["All Season / Flexible"], "suitable_soils": ["Red Soil", "Laterite Soil", "Clay Loam Soil"], "duration_days": "Perennial (Harvest starts Year 3)", "water_requirement": "High", "estimated_yield_per_acre": "8 - 14 Quintals (Dry berries)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 58000, "seed_rate": 450.0, "seed_cost": 40, "cult_cost": 35000, "yield_avg": 11.0, "ideal_n": 100, "ideal_p": 40, "ideal_k": 120, "sowing_window": "May - June (Pre-monsoon planting of rooted cuttings)", "sowing_tips": "King of Spices. Train perennial vines on shade trees (Arecanut, Silver Oak).", "fertilizer_advice": "Apply FYM @ 10 kg/vine + NPK (100:40:140g) in two splits (May-June & Sept-Oct).", "soil_notes": "Well-drained virgin forest laterite or red loam rich in organic leaf humus.", "companion_crops": ["Arecanut (intercrop)", "Coffee", "Cardamom"]},
  {"id": "cardamom_small", "name": "Small Cardamom (Chhoti Elaichi)", "hindi_name": "छोटी", "scientific_name": "Elettaria cardamomum", "category": "Spices", "seasons": ["All Season / Flexible"], "suitable_soils": ["Laterite Soil", "Red Soil", "Forest Humus Loam"], "duration_days": "Perennial (Harvest starts Year 3)", "water_requirement": "High", "estimated_yield_per_acre": "1.5 - 3.5 Quintals (Dry capsules)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 180000, "seed_rate": 800.0, "seed_cost": 35, "cult_cost": 45000, "yield_avg": 2.5, "ideal_n": 75, "ideal_p": 50, "ideal_k": 100, "sowing_window": "June - July (Monsoon planting of suckers)", "sowing_tips": "Queen of Spices. Requires filtered forest shade (50-60%) and cool humid mountain climate.", "fertilizer_advice": "Heavy application of decomposed compost plus balanced NPK split in 3 doses.", "soil_notes": "Deep, well-drained loamy soil rich in organic leaf litter in Western Ghats altitudes (800-1500m).", "companion_crops": ["Coffee shade canopy", "Black Pepper"]},
  {"id": "cardamom_large", "name": "Large Cardamom (Badi Elaichi)", "hindi_name": "बड़ी", "scientific_name": "Amomum subulatum", "category": "Spices", "seasons": ["All Season / Flexible"], "suitable_soils": ["Laterite Soil", "Red Soil", "Clay Loam Soil"], "duration_days": "Perennial (Harvest starts Year 3)", "water_requirement": "High", "estimated_yield_per_acre": "2 - 4 Quintals (Dry capsules)", "investment_level": "Moderate to High", "profit_potential": "Very High", "msp_price": 95000, "seed_rate": 600.0, "seed_cost": 40, "cult_cost": 30000, "yield_avg": 3.0, "ideal_n": 60, "ideal_p": 40, "ideal_k": 80, "sowing_window": "May - June (Sikkim & Himalayan foothills)", "sowing_tips": "Native pride of Eastern Himalayas. Cultivated along shaded mountain stream beds (Alnus nepalensis canopy).", "fertilizer_advice": "Natural leaf mulch from Himalayan Alder tree supplies all organic nitrogen.", "soil_notes": "Moist, acidic, humic hill slope soils with perennial seepage.", "companion_crops": ["Alnus nepalensis (Utis shade tree)", "Mandarin orange"]},
  {"id": "clove", "name": "Clove (Laung)", "hindi_name": "लौंग", "scientific_name": "Syzygium aromaticum", "category": "Spices", "seasons": ["All Season / Flexible"], "suitable_soils": ["Red Soil", "Laterite Soil", "Clay Loam Soil"], "duration_days": "Perennial Tree (Harvest starts Year 7-8)", "water_requirement": "High", "estimated_yield_per_acre": "4 - 8 Quintals (Dry unopened buds)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 75000, "seed_rate": 160.0, "seed_cost": 80, "cult_cost": 28000, "yield_avg": 6.0, "ideal_n": 80, "ideal_p": 40, "ideal_k": 100, "sowing_window": "June - August (Monsoon planting of saplings)", "sowing_tips": "Aromatic unopened flower buds. Requires warm humid coastal / mid-elevation tropical microclimate.", "fertilizer_advice": "Apply 50kg compost + 300g N, 250g P, 750g K per adult tree annually in two doses.", "soil_notes": "Deep, fertile red and laterite loams with high water retention and no subsoil hardpan.", "companion_crops": ["Coconut", "Arecanut", "Nutmeg"]},
  {"id": "cinnamon", "name": "Cinnamon (Dalchini)", "hindi_name": "दालचीनी", "scientific_name": "Cinnamomum verum", "category": "Spices", "seasons": ["All Season / Flexible"], "suitable_soils": ["Sandy Loam Soil", "Laterite Soil", "Red Soil"], "duration_days": "Perennial (Coppicing starts Year 3)", "water_requirement": "Medium to High", "estimated_yield_per_acre": "3 - 6 Quintals (Dry quills)", "investment_level": "Moderate", "profit_potential": "Very High", "msp_price": 45000, "seed_rate": 800.0, "seed_cost": 25, "cult_cost": 22000, "yield_avg": 4.5, "ideal_n": 50, "ideal_p": 25, "ideal_k": 50, "sowing_window": "June - July (Monsoon planting of seedlings)", "sowing_tips": "True Ceylon cinnamon bark. Coppiced bush form produces straight tender shoots for premium quills.", "fertilizer_advice": "Apply 20 kg FYM + NPK (20:18:25g) per bush annually after coppicing.", "soil_notes": "Sandy loam or lateritic gravelly soil rich in humus; poor soil gives finer sweet aroma.", "companion_crops": ["Coconut", "Arecanut"]},
  {"id": "ajwain", "name": "Carom Seeds (Ajwain)", "hindi_name": "अजवाइन", "scientific_name": "Trachyspermum ammi", "category": "Spices", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Black Soil (Regur)", "Clay Loam Soil"], "duration_days": "130 - 150 days", "water_requirement": "Low", "estimated_yield_per_acre": "5 - 8 Quintals", "investment_level": "Low", "profit_potential": "Very High", "msp_price": 12000, "seed_rate": 2.0, "seed_cost": 200, "cult_cost": 9500, "yield_avg": 6.5, "ideal_n": 40, "ideal_p": 30, "ideal_k": 20, "sowing_window": "October 15 - November 15", "sowing_tips": "Thymol-rich medicinal spice. Extremely tiny seeds; mix with soil/sand for shallow broadcasting.", "fertilizer_advice": "Apply DAP @ 30 kg/acre basal. Top-dress Urea once at first irrigation (30 days).", "soil_notes": "Well-drained black clay soils or fertile alluvial loams; possesses high sodicity tolerance.", "companion_crops": ["Chickpea", "Coriander"]},
  {"id": "nutmeg", "name": "Nutmeg / Mace (Jaiphal)", "hindi_name": "जायफल", "scientific_name": "Myristica fragrans", "category": "Spices", "seasons": ["All Season / Flexible"], "suitable_soils": ["Red Soil", "Laterite Soil", "Clay Loam Soil"], "duration_days": "Perennial Tree (Harvest starts Year 7-8)", "water_requirement": "Medium to High", "estimated_yield_per_acre": "4 - 7 Quintals (Nutmeg seed + Mace)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 48000, "seed_rate": 120.0, "seed_cost": 150, "cult_cost": 26000, "yield_avg": 5.5, "ideal_n": 75, "ideal_p": 40, "ideal_k": 90, "sowing_window": "June - August (Monsoon planting)", "sowing_tips": "Yields two distinct high-value spices: Nutmeg (seed) and crimson Mace (aril). Dioecious tree (use grafted plants).", "fertilizer_advice": "Apply 50 kg organic manure + 500g N, 250g P, 1000g K per adult tree annually.", "soil_notes": "Deep fertile humic lateritic and alluvial river valley loams with excellent drainage.", "companion_crops": ["Coconut", "Arecanut", "Clove"]},
  {"id": "mint", "name": "Field Mint / Mentha (Pudina)", "hindi_name": "मेंथा", "scientific_name": "Mentha arvensis", "category": "Spices", "seasons": ["Zaid", "Kharif"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil"], "duration_days": "100 - 120 days (2 cuttings)", "water_requirement": "Medium to High", "estimated_yield_per_acre": "50 - 75 kg (Mentha Oil)", "investment_level": "Moderate", "profit_potential": "Very High", "msp_price": 105000, "seed_rate": 200.0, "seed_cost": 25, "cult_cost": 18000, "yield_avg": 0.7, "ideal_n": 80, "ideal_p": 40, "ideal_k": 30, "sowing_window": "January 15 - February 25 (Sucker planting)", "sowing_tips": "India is the global leader in Menthol mint oil. Plant root suckers in furrows at 45cm distance.", "fertilizer_advice": "Apply half N + full P/K basal; top-dress N after first cutting at 75 days.", "soil_notes": "Moist, fertile, deep alluvial loams with plenty of organic matter.", "companion_crops": ["Sugarcane (intercropped in early spring)", "Wheat rotation"]}
,
  {"id": "tea", "name": "Tea (Chai)", "hindi_name": "चाय", "scientific_name": "Camellia sinensis", "category": "Cash Crop", "seasons": ["All Season / Flexible"], "suitable_soils": ["Laterite Soil", "Red Soil", "Forest Humus Loam"], "duration_days": "Perennial (Productive for 50+ years)", "water_requirement": "High", "estimated_yield_per_acre": "80 - 120 Quintals (Green leaf/yr)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 2200, "seed_rate": 4000.0, "seed_cost": 12, "cult_cost": 40000, "yield_avg": 100.0, "ideal_n": 120, "ideal_p": 40, "ideal_k": 80, "sowing_window": "April - June (Spring / Early Monsoon)", "sowing_tips": "Requires strictly acidic, high-organic hill soils and cool, misty mountain slopes.", "fertilizer_advice": "Apply NPK (2:1:2 ratio) in 3-4 split applications during plucking season.", "soil_notes": "Deep, well-drained acidic laterites with high aluminum and organic leaf litter.", "companion_crops": ["Albizia chinensis (shade tree)", "Silver oak"]},
  {"id": "coffee_arabica", "name": "Coffee (Arabica)", "hindi_name": "कॉफ़ी", "scientific_name": "Coffea arabica", "category": "Cash Crop", "seasons": ["All Season / Flexible"], "suitable_soils": ["Red Soil", "Laterite Soil", "Clay Loam Soil"], "duration_days": "Perennial (First commercial harvest Year 4)", "water_requirement": "Medium to High", "estimated_yield_per_acre": "6 - 10 Quintals (Clean parchment)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 32000, "seed_rate": 800.0, "seed_cost": 35, "cult_cost": 35000, "yield_avg": 8.0, "ideal_n": 80, "ideal_p": 60, "ideal_k": 80, "sowing_window": "June - July (Monsoon planting of basket plants)", "sowing_tips": "Shade-grown premium mountain coffee. Requires two-tier forest canopy and blossom showers in March.", "fertilizer_advice": "Apply NPK (120:90:120 kg/ha) in 3 splits (pre-monsoon, mid-monsoon, post-monsoon).", "soil_notes": "Deep, fertile, friable volcanic or lateritic loam rich in humus on high slopes (1000-1500m).", "companion_crops": ["Black Pepper (trained on shade trees)", "Cardamom", "Silver Oak"]},
  {"id": "rubber", "name": "Natural Rubber", "hindi_name": "रबर", "scientific_name": "Hevea brasiliensis", "category": "Cash Crop", "seasons": ["All Season / Flexible"], "suitable_soils": ["Laterite Soil", "Red Soil", "Clay Loam Soil"], "duration_days": "Perennial (Tapping starts Year 7, lasts 25-30 years)", "water_requirement": "High", "estimated_yield_per_acre": "8 - 14 Quintals (Dry sheet rubber/yr)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 18500, "seed_rate": 200.0, "seed_cost": 120, "cult_cost": 30000, "yield_avg": 11.0, "ideal_n": 40, "ideal_p": 40, "ideal_k": 35, "sowing_window": "June - July (South-West Monsoon)", "sowing_tips": "Major industrial plantation crop. Plant budded polybag plants on contour terraces with cover crops.", "fertilizer_advice": "Apply NPK 10:10:10 mixture along with Magnesium for high latex yield.", "soil_notes": "Deep, well-drained acidic laterites and red loams with depth > 1 meter.", "companion_crops": ["Mucuna bracteata (nitrogen cover crop)", "Pineapple (first 3 years)"]},
  {"id": "tobacco", "name": "Tobacco (Tambaku)", "hindi_name": "तंबाकू", "scientific_name": "Nicotiana tabacum", "category": "Cash Crop", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Black Soil (Regur)"], "duration_days": "110 - 130 days", "water_requirement": "Medium", "estimated_yield_per_acre": "8 - 14 Quintals (Cured leaf)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 18000, "seed_rate": 0.2, "seed_cost": 4000, "cult_cost": 24000, "yield_avg": 11.0, "ideal_n": 50, "ideal_p": 40, "ideal_k": 80, "sowing_window": "October - November (Transplanting nursery)", "sowing_tips": "High commercial value. Requires strict control of soil chlorides to prevent burning defects.", "fertilizer_advice": "Never use MOP (Chloride ruins burn quality); always use Potassium Sulfate (SOP).", "soil_notes": "Well-aerated sandy loam (for light flue-cured VFC) or heavy black soil (for bidi/natu).", "companion_crops": ["Castor (trap crop)", "Groundnut rotation"]},
  {"id": "coconut", "name": "Coconut (Nariyal)", "hindi_name": "नारियल", "scientific_name": "Cocos nucifera", "category": "Cash Crop", "seasons": ["All Season / Flexible"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil", "Red Soil", "Laterite Soil"], "duration_days": "Perennial Palm (Harvest starts Year 5-6, productive for 60+ years)", "water_requirement": "Medium to High", "estimated_yield_per_acre": "3500 - 5500 Nuts / acre / yr", "investment_level": "High", "profit_potential": "Very High", "msp_price": 3200, "seed_rate": 70.0, "seed_cost": 150, "cult_cost": 25000, "yield_avg": 45.0, "ideal_n": 500, "ideal_p": 320, "ideal_k": 1200, "sowing_window": "May - June (Onset of monsoon)", "sowing_tips": "Kalpavriksha - tree of life. Plant 1-year vigorous seedlings in 1x1x1m pits filled with sand & manure.", "fertilizer_advice": "Apply 500g N, 320g P, 1200g K per adult palm annually in two split doses (May & Sept).", "soil_notes": "Well-drained coastal sands, alluvial riverbanks, and red loams with high water table (1-2m).", "companion_crops": ["Black Pepper", "Cocoa", "Banana", "Nutmeg (multi-tier farming)"]},
  {"id": "arecanut", "name": "Arecanut / Betel Nut (Supari)", "hindi_name": "सुपारी", "scientific_name": "Areca catechu", "category": "Cash Crop", "seasons": ["All Season / Flexible"], "suitable_soils": ["Laterite Soil", "Red Soil", "Clay Loam Soil"], "duration_days": "Perennial Palm (Bearing starts Year 5-6)", "water_requirement": "High", "estimated_yield_per_acre": "8 - 14 Quintals (Dry chali/supari)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 42000, "seed_rate": 550.0, "seed_cost": 45, "cult_cost": 35000, "yield_avg": 11.0, "ideal_n": 100, "ideal_p": 40, "ideal_k": 140, "sowing_window": "May - July (South-West Monsoon)", "sowing_tips": "High commercial value palm. Plant at 2.7 x 2.7 m spacing. Extremely sensitive to drought and sunscald.", "fertilizer_advice": "Apply 100g N, 40g P, 140g K per bearing palm per year along with green leaf manure.", "soil_notes": "Deep fertile red clay loams and laterites with high organic matter and perennial moisture.", "companion_crops": ["Black Pepper (vines on palms)", "Banana", "Vanilla", "Cocoa"]},
  {"id": "betel_vine", "name": "Betel Vine (Paan)", "hindi_name": "पान", "scientific_name": "Piper betle", "category": "Cash Crop", "seasons": ["All Season / Flexible"], "suitable_soils": ["Alluvial Soil", "Clay Loam Soil", "Red Soil"], "duration_days": "Perennial Vine (Plucking every 15-20 days)", "water_requirement": "High", "estimated_yield_per_acre": "25 - 45 Lakh Leaves / acre / yr", "investment_level": "High", "profit_potential": "Very High", "msp_price": 25000, "seed_rate": 35000.0, "seed_cost": 0, "cult_cost": 60000, "yield_avg": 40.0, "ideal_n": 150, "ideal_p": 80, "ideal_k": 100, "sowing_window": "September - October or March - April", "sowing_tips": "Grown under covered thatched conservatories (bareja/pan-baroj) providing 70% shade and high humidity.", "fertilizer_advice": "Heavy feeder of mustard oil cake and well-rotted FYM. Avoid harsh chemical nitrogen.", "soil_notes": "Rich, friable loams with exceptional drainage; water stagnation causes swift foot rot.", "companion_crops": ["Sesbania grandiflora (Agathi as live stake)"]},
  {"id": "ashwagandha", "name": "Ashwagandha (Indian Ginseng)", "hindi_name": "अश्वगंधा", "scientific_name": "Withania somnifera", "category": "Cash Crop", "seasons": ["Kharif", "Rabi"], "suitable_soils": ["Sandy Loam Soil", "Red Soil", "Black Soil (Regur)"], "duration_days": "150 - 180 days", "water_requirement": "Low", "estimated_yield_per_acre": "3 - 5 Quintals (Dry roots) + 50 kg Seeds", "investment_level": "Low to Moderate", "profit_potential": "Very High", "msp_price": 32000, "seed_rate": 4.0, "seed_cost": 350, "cult_cost": 12000, "yield_avg": 4.0, "ideal_n": 30, "ideal_p": 30, "ideal_k": 20, "sowing_window": "August 15 - September 15 (Late Kharif)", "sowing_tips": "High-demand Ayurvedic adaptogen. Low input dryland crop; excessive irrigation degrades root alkaloid quality.", "fertilizer_advice": "Apply organic compost @ 3 tons/acre basal with modest DAP. Avoid high synthetic Nitrogen.", "soil_notes": "Well-drained sandy loam or light red soil with alkaline pH (7.5-8.0).", "companion_crops": ["Senna", "Isabgol"]},
  {"id": "isabgol", "name": "Psyllium Husk (Isabgol)", "hindi_name": "ईसबगोल", "scientific_name": "Plantago ovata", "category": "Cash Crop", "seasons": ["Rabi"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil"], "duration_days": "110 - 125 days", "water_requirement": "Low", "estimated_yield_per_acre": "4 - 7 Quintals", "investment_level": "Low", "profit_potential": "Very High", "msp_price": 16000, "seed_rate": 3.0, "seed_cost": 220, "cult_cost": 8500, "yield_avg": 5.5, "ideal_n": 30, "ideal_p": 25, "ideal_k": 20, "sowing_window": "October 20 - November 15", "sowing_tips": "Source of natural dietary fiber husk. High export value; requires completely dry weather during maturity.", "fertilizer_advice": "DAP @ 25 kg/acre basal + 15 kg Urea at 30 days. Minimal fertilizer needed.", "soil_notes": "Well-drained light sandy loam; moderately tolerant to soil salinity.", "companion_crops": ["Cumin", "Mustard border"]},
  {"id": "lemongrass", "name": "Lemongrass", "hindi_name": "नींबू", "scientific_name": "Cymbopogon flexuosus", "category": "Cash Crop", "seasons": ["Kharif", "All Season / Flexible"], "suitable_soils": ["Red Soil", "Sandy Loam Soil", "Laterite Soil"], "duration_days": "Perennial (3-4 cuttings per year for 4-5 years)", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "60 - 90 kg (Essential Oil/yr)", "investment_level": "Low to Moderate", "profit_potential": "High", "msp_price": 140000, "seed_rate": 20000.0, "seed_cost": 0, "cult_cost": 15000, "yield_avg": 0.8, "ideal_n": 60, "ideal_p": 30, "ideal_k": 30, "sowing_window": "June - July (Planting rooted slips)", "sowing_tips": "Aromatic grass providing citral-rich essential oil for pharma and perfumes. Animal-proof (not eaten by cattle).", "fertilizer_advice": "Apply 30kg N basal + full P & K; top-dress 15kg Nitrogen after each grass cut.", "soil_notes": "Hardy perennial grass; performs remarkably on barren, undulating, and degraded wasteland soils.", "companion_crops": ["Live erosion hedge on contours"]},
  {"id": "safed_musli", "name": "Safed Musli", "hindi_name": "सफेद", "scientific_name": "Chlorophytum borivilianum", "category": "Cash Crop", "seasons": ["Kharif"], "suitable_soils": ["Sandy Loam Soil", "Red Soil"], "duration_days": "90 - 105 days (Foliage) / 180 days (Tuber maturation)", "water_requirement": "Medium", "estimated_yield_per_acre": "4 - 6 Quintals (Dry peeled fingers)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 120000, "seed_rate": 400.0, "seed_cost": 250, "cult_cost": 45000, "yield_avg": 5.0, "ideal_n": 40, "ideal_p": 40, "ideal_k": 40, "sowing_window": "June 15 - July 15", "sowing_tips": "White Gold of herbal medicine. Plant crown-attached finger tubers on raised beds (BBF) with drip irrigation.", "fertilizer_advice": "Strictly organic: apply 10 tons FYM/acre + 2 tons vermicompost and neem cake. Chemical N causes tuber rot.", "soil_notes": "Light, friable sandy loam rich in organic carbon with exceptional natural drainage.", "companion_crops": ["Pigeon Pea (as border shade)"]},
  {"id": "stevia", "name": "Stevia (Meethi Tulsi)", "hindi_name": "स्टीविया", "scientific_name": "Stevia rebaudiana", "category": "Cash Crop", "seasons": ["All Season / Flexible"], "suitable_soils": ["Red Soil", "Sandy Loam Soil", "Alluvial Soil"], "duration_days": "Perennial (3-4 leaf cuts per year for 4-5 years)", "water_requirement": "Medium", "estimated_yield_per_acre": "12 - 18 Quintals (Dry green leaves/yr)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 22000, "seed_rate": 25000.0, "seed_cost": 2, "cult_cost": 35000, "yield_avg": 15.0, "ideal_n": 50, "ideal_p": 40, "ideal_k": 50, "sowing_window": "February - March or September - October", "sowing_tips": "Zero-calorie natural sweetener (300x sweeter than sugar). Raised beds with micro-sprinklers / drip.", "fertilizer_advice": "Apply vermicompost liberally with moderate NPK. Avoid high nitrogen which reduces stevioside sweetness.", "soil_notes": "Well-drained red or sandy loam; plants cannot withstand standing water even for 6 hours.", "companion_crops": ["Orchard intercrop under light shade"]},
  {"id": "vanilla", "name": "Vanilla", "hindi_name": "वैनिला", "scientific_name": "Vanilla planifolia", "category": "Cash Crop", "seasons": ["All Season / Flexible"], "suitable_soils": ["Red Soil", "Laterite Soil", "Forest Humus Loam"], "duration_days": "Perennial Orchid (Harvest starts Year 3)", "water_requirement": "Medium to High", "estimated_yield_per_acre": "1.5 - 3.0 Quintals (Cured beans)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 220000, "seed_rate": 1000.0, "seed_cost": 45, "cult_cost": 50000, "yield_avg": 2.2, "ideal_n": 40, "ideal_p": 30, "ideal_k": 60, "sowing_window": "August - October (Planting rooted vine cuttings)", "sowing_tips": "Second most expensive spice in the world. Semi-epiphytic orchid requiring hand pollination of each flower at dawn.", "fertilizer_advice": "Surface organic mulch of decomposed leaves, compost, and wood ash. Avoid synthetic fertilizer contact with roots.", "soil_notes": "Well-drained forest loam with heavy organic leaf mulch; sensitive to waterlogging.", "companion_crops": ["Glyricidia (live trellis support)", "Arecanut", "Coconut"]},
  {"id": "mushroom_button", "name": "Button Mushroom (Khumb)", "hindi_name": "बटन", "scientific_name": "Agaricus bisporus", "category": "Cash Crop", "seasons": ["Rabi", "All Season / Flexible"], "suitable_soils": ["Alluvial Soil", "Composted Wheat Straw"], "duration_days": "60 - 75 days", "water_requirement": "Medium", "estimated_yield_per_acre": "60 - 90 Quintals (Per 1000 sq ft room)", "investment_level": "Moderate to High", "profit_potential": "Very High", "msp_price": 12000, "seed_rate": 80.0, "seed_cost": 120, "cult_cost": 30000, "yield_avg": 75.0, "ideal_n": 60, "ideal_p": 30, "ideal_k": 30, "sowing_window": "October - March (Seasonal hut) or Year-Round (AC)", "sowing_tips": "High-profit indoor vertical cash crop. Spawn mixed into pasteurized wheat/paddy straw compost with coir casing layer.", "fertilizer_advice": "No field soil needed; grown on pasteurized compost formulated with wheat straw, poultry manure, and gypsum.", "soil_notes": "Grown in dark cropping rooms or insulated straw-thatched huts on sterilized casing soil.", "companion_crops": ["Indoor seasonal crop utilizing crop straw residues"]}
,
  {"id": "brinjal", "name": "Brinjal / Eggplant (Baingan)", "hindi_name": "बैंगन", "scientific_name": "Solanum melongena", "category": "Vegetable", "seasons": ["Kharif", "Rabi", "Zaid"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil", "Black Soil (Regur)"], "duration_days": "120 - 150 days", "water_requirement": "Medium", "estimated_yield_per_acre": "140 - 220 Quintals", "investment_level": "Moderate", "profit_potential": "Very High", "msp_price": 1400, "seed_rate": 0.2, "seed_cost": 4500, "cult_cost": 22000, "yield_avg": 180.0, "ideal_n": 100, "ideal_p": 60, "ideal_k": 60, "sowing_window": "June - July (Kharif), Oct - Nov (Rabi), or Feb (Summer)", "sowing_tips": "Transplant 30-day seedlings on raised beds (75x60cm). Install pheromone traps for shoot and fruit borer.", "fertilizer_advice": "Apply 50% N + full P/K basal; split remaining N in two top-dressings at 30 and 60 days.", "soil_notes": "Deep, fertile, well-drained silt loams and clay loams rich in humus.", "companion_crops": ["Marigold", "Coriander"]},
  {"id": "okra", "name": "Okra / Lady's Finger (Bhindi)", "hindi_name": "भिंडी", "scientific_name": "Abelmoschus esculentus", "category": "Vegetable", "seasons": ["Kharif", "Zaid"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil", "Red Soil"], "duration_days": "90 - 110 days", "water_requirement": "Medium", "estimated_yield_per_acre": "40 - 65 Quintals", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 2200, "seed_rate": 4.0, "seed_cost": 650, "cult_cost": 18000, "yield_avg": 52.5, "ideal_n": 80, "ideal_p": 50, "ideal_k": 50, "sowing_window": "Feb - March (Summer) or June - July (Kharif)", "sowing_tips": "Soak seeds in water for 12 hours before sowing. Ridge and furrow planting (45x30cm).", "fertilizer_advice": "Apply half N + full P & K basal; top-dress remaining N in two splits during picking.", "soil_notes": "Well-drained fertile sandy loam to clay loam rich in organic matter.", "companion_crops": ["Cowpea", "French Beans"]},
  {"id": "cabbage", "name": "Cabbage (Patta Gobhi)", "hindi_name": "पत्ता", "scientific_name": "Brassica oleracea var. capitata", "category": "Vegetable", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Clay Loam Soil", "Sandy Loam Soil"], "duration_days": "80 - 105 days", "water_requirement": "Medium", "estimated_yield_per_acre": "120 - 180 Quintals", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 1200, "seed_rate": 0.15, "seed_cost": 5500, "cult_cost": 19000, "yield_avg": 150.0, "ideal_n": 100, "ideal_p": 60, "ideal_k": 60, "sowing_window": "September - October (Nursery transplant)", "sowing_tips": "Cool season crucifer. Transplant 25-day seedlings on ridges (45x45cm). Uniform moisture prevents head splitting.", "fertilizer_advice": "Heavy feeder: apply FYM @ 10 tons/acre + 50% N and full P/K basal; top-dress N in two splits.", "soil_notes": "Deep fertile loams and clay loams with good water holding capacity.", "companion_crops": ["Mustard (as trap crop for DBM)", "Tomato"]},
  {"id": "cauliflower", "name": "Cauliflower (Phool Gobhi)", "hindi_name": "फूल", "scientific_name": "Brassica oleracea var. botrytis", "category": "Vegetable", "seasons": ["Rabi", "Kharif"], "suitable_soils": ["Alluvial Soil", "Clay Loam Soil", "Sandy Loam Soil"], "duration_days": "80 - 110 days", "water_requirement": "Medium", "estimated_yield_per_acre": "100 - 160 Quintals", "investment_level": "Moderate to High", "profit_potential": "Very High", "msp_price": 1500, "seed_rate": 0.15, "seed_cost": 6000, "cult_cost": 21000, "yield_avg": 130.0, "ideal_n": 100, "ideal_p": 60, "ideal_k": 80, "sowing_window": "Early: May-June; Main: Sept-Oct; Late: Nov", "sowing_tips": "Blanching (covering curds with outer leaves) prevents yellowing by direct sun.", "fertilizer_advice": "Apply Borax @ 5 kg/acre (prevents brown rot / hollow stem) and Ammonium Molybdate (whip tail).", "soil_notes": "Fertile, loamy soils rich in organic matter with excellent moisture retention.", "companion_crops": ["Mustard (trap crop)", "Spinach"]},
  {"id": "carrot", "name": "Carrot (Gajar)", "hindi_name": "गाजर", "scientific_name": "Daucus carota", "category": "Vegetable", "seasons": ["Rabi"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil"], "duration_days": "80 - 100 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "100 - 150 Quintals", "investment_level": "Low to Moderate", "profit_potential": "High", "msp_price": 1300, "seed_rate": 3.0, "seed_cost": 450, "cult_cost": 15000, "yield_avg": 125.0, "ideal_n": 50, "ideal_p": 40, "ideal_k": 60, "sowing_window": "September 15 - October 30", "sowing_tips": "Direct sowing on raised beds or ridges. Requires deep friable loose soil for straight, un-forked root growth.", "fertilizer_advice": "Avoid fresh un-decomposed manure (causes hairy, forked roots). Boost Potash for sweet deep red color.", "soil_notes": "Deep, stone-free sandy loams without hardpan; stones cause root splitting and forking.", "companion_crops": ["Radish", "Coriander", "Onion"]},
  {"id": "radish", "name": "Radish (Mooli)", "hindi_name": "मूली", "scientific_name": "Raphanus sativus", "category": "Vegetable", "seasons": ["Rabi", "All Season / Flexible"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil"], "duration_days": "35 - 55 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "80 - 130 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 900, "seed_rate": 4.0, "seed_cost": 280, "cult_cost": 11000, "yield_avg": 105.0, "ideal_n": 40, "ideal_p": 30, "ideal_k": 40, "sowing_window": "Year-round (Asiatic types) or Oct - Dec (European)", "sowing_tips": "Fast-growing cash root crop (ready in 40 days). Sow on ridges 30cm apart.", "fertilizer_advice": "DAP @ 30 kg/acre basal + top-dress Urea at 20 days. Fast turnaround requires quick nutrients.", "soil_notes": "Friable, light sandy loam with good aeration; heavy clay causes malformed roots.", "companion_crops": ["Carrot", "Spinach", "Cauliflower border"]},
  {"id": "bottle_gourd", "name": "Bottle Gourd (Lauki / Ghiya)", "hindi_name": "लौकी", "scientific_name": "Lagenaria siceraria", "category": "Vegetable", "seasons": ["Zaid", "Kharif"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil", "Clay Loam Soil"], "duration_days": "75 - 95 days", "water_requirement": "Medium", "estimated_yield_per_acre": "120 - 180 Quintals", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 1200, "seed_rate": 1.5, "seed_cost": 600, "cult_cost": 16000, "yield_avg": 150.0, "ideal_n": 60, "ideal_p": 40, "ideal_k": 40, "sowing_window": "February - March (Summer) or June - July (Kharif)", "sowing_tips": "Channel & bower / trellis system keeps cylindrical fruits straight, blemish-free, and doubles yield.", "fertilizer_advice": "Apply 5 kg compost per pit along with basal DAP. Top-dress Urea during vine elongation.", "soil_notes": "Well-drained rich sandy loam or silt loam; sensitive to root asphyxiation in waterlogged soil.", "companion_crops": ["Maize", "Cowpea"]},
  {"id": "bitter_gourd", "name": "Bitter Gourd (Karela)", "hindi_name": "करेला", "scientific_name": "Momordica charantia", "category": "Vegetable", "seasons": ["Zaid", "Kharif"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil", "Clay Loam Soil"], "duration_days": "75 - 100 days", "water_requirement": "Medium", "estimated_yield_per_acre": "60 - 90 Quintals", "investment_level": "Moderate to High", "profit_potential": "Very High", "msp_price": 2600, "seed_rate": 1.8, "seed_cost": 1200, "cult_cost": 20000, "yield_avg": 75.0, "ideal_n": 60, "ideal_p": 40, "ideal_k": 40, "sowing_window": "January - March (Summer) or June - July (Kharif)", "sowing_tips": "High medicinal value cucurbit. Trellis training on wire-mesh pavilions prevents soil contact rots.", "fertilizer_advice": "Basal DAP and Potash in pits; side dress Urea at 30 and 50 days.", "soil_notes": "Well-aerated sandy loam with abundant organic compost; dislikes waterlogging.", "companion_crops": ["Maize border", "Marigold"]},
  {"id": "ridge_gourd", "name": "Ridge Gourd (Turai)", "hindi_name": "तुरई", "scientific_name": "Luffa acutangula", "category": "Vegetable", "seasons": ["Kharif", "Zaid"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil", "Clay Loam Soil"], "duration_days": "70 - 90 days", "water_requirement": "Medium", "estimated_yield_per_acre": "50 - 80 Quintals", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 2000, "seed_rate": 1.5, "seed_cost": 850, "cult_cost": 16000, "yield_avg": 65.0, "ideal_n": 50, "ideal_p": 30, "ideal_k": 30, "sowing_window": "February - March or June - July", "sowing_tips": "Angled ribbed tender gourd. Grow on wire trellises; yellow evening blooms attract honeybees.", "fertilizer_advice": "Apply FYM @ 5 tons/acre + basal DAP; top-dress Urea every 3 weeks.", "soil_notes": "Well-drained warm sandy loam to alluvial loam rich in organic matter.", "companion_crops": ["Cowpea", "Maize"]},
  {"id": "sponge_gourd", "name": "Sponge Gourd (Gilki / Nenua)", "hindi_name": "गिलकी", "scientific_name": "Luffa aegyptiaca", "category": "Vegetable", "seasons": ["Kharif", "Zaid"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil"], "duration_days": "70 - 90 days", "water_requirement": "Medium", "estimated_yield_per_acre": "60 - 90 Quintals", "investment_level": "Low to Moderate", "profit_potential": "High", "msp_price": 1800, "seed_rate": 1.5, "seed_cost": 750, "cult_cost": 15000, "yield_avg": 75.0, "ideal_n": 50, "ideal_p": 30, "ideal_k": 30, "sowing_window": "Feb - March (Summer) or June - July (Monsoon)", "sowing_tips": "Smooth-skinned, high-yielding gourd. Extremely popular home vegetable; mature dried gourds yield luffa bath sponges.", "fertilizer_advice": "DAP @ 30 kg/acre basal with organic compost; side dress Nitrogen during fruiting.", "soil_notes": "Well-drained alluvial and loam soils; tolerates heavier rains than bitter gourd.", "companion_crops": ["Maize", "Okra"]},
  {"id": "cucumber", "name": "Cucumber (Kheera)", "hindi_name": "खीरा", "scientific_name": "Cucumis sativus", "category": "Vegetable", "seasons": ["Zaid", "Kharif"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil"], "duration_days": "60 - 75 days", "water_requirement": "Medium", "estimated_yield_per_acre": "80 - 130 Quintals", "investment_level": "Moderate", "profit_potential": "Very High", "msp_price": 1600, "seed_rate": 1.0, "seed_cost": 2200, "cult_cost": 18000, "yield_avg": 105.0, "ideal_n": 60, "ideal_p": 40, "ideal_k": 50, "sowing_window": "Feb - March (Summer) or June - July (Rainy)", "sowing_tips": "Fast-turnaround salad vegetable. Drip fertigation with silver-black mulch delivers highest grade straight fruits.", "fertilizer_advice": "Apply Potash generously for crisp texture and fruit firmness. Split N in 3 doses.", "soil_notes": "Warm, light, well-drained sandy loam rich in organic humus.", "companion_crops": ["Sweet corn", "Sunflowers"]},
  {"id": "pumpkin", "name": "Pumpkin (Kaddu / Sitaphal)", "hindi_name": "कद्दू", "scientific_name": "Cucurbita moschata", "category": "Vegetable", "seasons": ["Kharif", "Zaid"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil"], "duration_days": "100 - 125 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "100 - 160 Quintals", "investment_level": "Low to Moderate", "profit_potential": "High", "msp_price": 1000, "seed_rate": 1.5, "seed_cost": 650, "cult_cost": 14000, "yield_avg": 130.0, "ideal_n": 60, "ideal_p": 40, "ideal_k": 40, "sowing_window": "January - March or June - July", "sowing_tips": "Vigorous spreading vine yielding long-storing orange fruits packed with Vitamin A. Wide pit spacing (3x2m).", "fertilizer_advice": "Apply FYM @ 5 kg per pit with basal DAP; top-dress Urea before vines sprawl.", "soil_notes": "Deep fertile sandy loam to clay loam; excellent on riverbeds.", "companion_crops": ["Maize", "Beans (Three Sisters guild)"]},
  {"id": "sweet_potato", "name": "Sweet Potato (Shakarkand)", "hindi_name": "शकरकंद", "scientific_name": "Ipomoea batatas", "category": "Vegetable", "seasons": ["Kharif", "Rabi"], "suitable_soils": ["Sandy Loam Soil", "Red Soil", "Laterite Soil"], "duration_days": "105 - 125 days", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "70 - 110 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 1600, "seed_rate": 25000.0, "seed_cost": 0, "cult_cost": 15000, "yield_avg": 90.0, "ideal_n": 40, "ideal_p": 40, "ideal_k": 80, "sowing_window": "June - July (Rainy) or September - October (Winter)", "sowing_tips": "Nutrient-dense tuber crop. Plant terminal vine cuttings (20-25cm) on ridges with ends exposed.", "fertilizer_advice": "High Potash requirement (MOP/SOP) for tuber bulking; avoid excess Nitrogen which only produces leaves.", "soil_notes": "Loose, well-drained sandy loam or light red loam; clay soils cause misshapen tubers.", "companion_crops": ["Pigeon Pea", "Maize"]},
  {"id": "beetroot", "name": "Beetroot (Chukandar)", "hindi_name": "चुकंदर", "scientific_name": "Beta vulgaris", "category": "Vegetable", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil"], "duration_days": "75 - 90 days", "water_requirement": "Medium", "estimated_yield_per_acre": "80 - 120 Quintals", "investment_level": "Low to Moderate", "profit_potential": "High", "msp_price": 1500, "seed_rate": 3.0, "seed_cost": 550, "cult_cost": 14000, "yield_avg": 100.0, "ideal_n": 50, "ideal_p": 40, "ideal_k": 50, "sowing_window": "October 1 - November 15", "sowing_tips": "Each seed ball contains 2-3 seeds; thinning to single seedling at 10cm is mandatory at 15 days.", "fertilizer_advice": "Apply Boron (Borax @ 4 kg/acre); prevents heart rot / internal black spot.", "soil_notes": "Deep fertile loams; exhibits superior salinity tolerance among all vegetables.", "companion_crops": ["Onion", "Cabbage", "Lettuce"]},
  {"id": "elephant_foot_yam", "name": "Elephant Foot Yam (Jimikand / Suran)", "hindi_name": "जिमीकंद", "scientific_name": "Amorphophallus paeoniifolius", "category": "Vegetable", "seasons": ["Kharif"], "suitable_soils": ["Alluvial Soil", "Red Soil", "Sandy Loam Soil", "Clay Loam Soil"], "duration_days": "210 - 240 days", "water_requirement": "Medium to High", "estimated_yield_per_acre": "140 - 220 Quintals", "investment_level": "High", "profit_potential": "Very High", "msp_price": 2500, "seed_rate": 2500.0, "seed_cost": 22, "cult_cost": 40000, "yield_avg": 180.0, "ideal_n": 80, "ideal_p": 60, "ideal_k": 100, "sowing_window": "April - May (Pre-monsoon planting of corm sets)", "sowing_tips": "Massive cash-yielding underground corm (Gajendra variety has no acridity). Plant 500g corm pieces in 60x60cm pits.", "fertilizer_advice": "Heavy application of FYM (10-12 tons/acre) plus NPK split in 3 doses with heavy earthing up.", "soil_notes": "Deep, loose, fertile sandy loam or alluvial loam with high organic carbon.", "companion_crops": ["Turmeric", "Ginger", "Maize"]},
  {"id": "colocasia", "name": "Taro / Colocasia (Arbi)", "hindi_name": "अरबी", "scientific_name": "Colocasia esculenta", "category": "Vegetable", "seasons": ["Kharif", "Zaid"], "suitable_soils": ["Alluvial Soil", "Clay Loam Soil", "Sandy Loam Soil"], "duration_days": "140 - 170 days", "water_requirement": "Medium to High", "estimated_yield_per_acre": "70 - 110 Quintals (Corms) + Leaves", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 2400, "seed_rate": 350.0, "seed_cost": 35, "cult_cost": 22000, "yield_avg": 90.0, "ideal_n": 60, "ideal_p": 40, "ideal_k": 60, "sowing_window": "Feb - March (Summer) or June - July (Monsoon)", "sowing_tips": "Dual vegetable: underground cormels (Arbi) and green leaves (Patra). Loves moisture and tolerates shade.", "fertilizer_advice": "Apply FYM @ 8 tons/acre + DAP basal; top-dress Potash and Nitrogen at 45 days.", "soil_notes": "Heavy moist loams and clay loams with high water holding capacity.", "companion_crops": ["Banana orchard intercrop", "Maize border"]},
  {"id": "capsicum", "name": "Bell Pepper / Capsicum (Shimla Mirch)", "hindi_name": "शिमला", "scientific_name": "Capsicum annuum var. grossum", "category": "Vegetable", "seasons": ["Rabi", "Kharif"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil", "Red Soil"], "duration_days": "100 - 130 days", "water_requirement": "Medium to High", "estimated_yield_per_acre": "90 - 150 Quintals (Open field) / 300+ (Polyhouse)", "investment_level": "High", "profit_potential": "Very High", "msp_price": 3200, "seed_rate": 0.15, "seed_cost": 18000, "cult_cost": 35000, "yield_avg": 120.0, "ideal_n": 100, "ideal_p": 60, "ideal_k": 80, "sowing_window": "Sept - Oct (Plains) or March - April (Hills/Polyhouse)", "sowing_tips": "High-value salad vegetable. Raised beds with drip fertigation and black mulch deliver export-grade bell peppers.", "fertilizer_advice": "Drip fertigation with Calcium Nitrate, Potassium Nitrate, and Boron to prevent blossom end rot.", "soil_notes": "Well-drained fertile loam rich in organic matter; extremely sensitive to standing water.", "companion_crops": ["Marigold", "Onion"]},
  {"id": "french_beans", "name": "French Beans (Phasli)", "hindi_name": "फ्रेंच", "scientific_name": "Phaseolus vulgaris", "category": "Vegetable", "seasons": ["Rabi", "Kharif"], "suitable_soils": ["Alluvial Soil", "Sandy Loam Soil", "Clay Loam Soil"], "duration_days": "65 - 80 days", "water_requirement": "Medium", "estimated_yield_per_acre": "40 - 70 Quintals", "investment_level": "Moderate", "profit_potential": "High", "msp_price": 3200, "seed_rate": 25.0, "seed_cost": 140, "cult_cost": 17000, "yield_avg": 55.0, "ideal_n": 50, "ideal_p": 50, "ideal_k": 40, "sowing_window": "Sept - Oct (Plains) or March - April (Hills)", "sowing_tips": "Bush and pole types available. Quick 65-day turnaround; succulent stringless green pods fetch premium winter prices.", "fertilizer_advice": "Unlike other legumes, French bean requires moderate Nitrogen application as nodulation is low.", "soil_notes": "Well-drained light loams with high organic content; sensitive to soil salinity and waterlogging.", "companion_crops": ["Carrot", "Cauliflower", "Maize"]},
  {"id": "spinach", "name": "Spinach (Palak)", "hindi_name": "पालक", "scientific_name": "Spinacia oleracea", "category": "Vegetable", "seasons": ["Rabi", "All Season / Flexible"], "suitable_soils": ["Alluvial Soil", "Clay Loam Soil", "Sandy Loam Soil"], "duration_days": "30 - 45 days (Multiple cuttings)", "water_requirement": "Low to Medium", "estimated_yield_per_acre": "60 - 90 Quintals", "investment_level": "Low", "profit_potential": "High", "msp_price": 1100, "seed_rate": 10.0, "seed_cost": 140, "cult_cost": 10000, "yield_avg": 75.0, "ideal_n": 50, "ideal_p": 30, "ideal_k": 30, "sowing_window": "Year-round (Main: September - November)", "sowing_tips": "Fastest iron-rich leafy vegetable (first cutting in 30 days; gives 4-5 cuttings).", "fertilizer_advice": "Top-dress Nitrogen (Urea @ 15 kg/acre) after each leaf cut followed by light irrigation.", "soil_notes": "Fertile alluvial and clay loams rich in organic matter; tolerates mild salinity well.", "companion_crops": ["Radish", "Onion", "Cabbage"]},
  {"id": "fenugreek_greens", "name": "Fenugreek Greens (Kasoori Methi)", "hindi_name": "कसूरी", "scientific_name": "Trigonella foenum-graecum", "category": "Vegetable", "seasons": ["Rabi"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil", "Clay Loam Soil"], "duration_days": "35 - 50 days (First cut)", "water_requirement": "Low", "estimated_yield_per_acre": "40 - 70 Quintals (Green) or 8-12 Qtl (Dry Kasoori leaves)", "investment_level": "Low", "profit_potential": "Very High", "msp_price": 2200, "seed_rate": 8.0, "seed_cost": 160, "cult_cost": 11000, "yield_avg": 55.0, "ideal_n": 30, "ideal_p": 30, "ideal_k": 20, "sowing_window": "September 15 - November 15", "sowing_tips": "Famous fragrant Nagaur Kasoori Methi. Multi-cut leafy crop; dried shade leaves command astronomical spice prices.", "fertilizer_advice": "Basal DAP; top-dress light Urea after each green leaf harvest.", "soil_notes": "Well-drained light loams and sandy loams with good calcium content.", "companion_crops": ["Carrot", "Garlic", "Radish"]},
  {"id": "muskmelon", "name": "Muskmelon (Kharbooja)", "hindi_name": "खरबूजा", "scientific_name": "Cucumis melo", "category": "Vegetable", "seasons": ["Zaid"], "suitable_soils": ["Sandy Loam Soil", "Alluvial Soil"], "duration_days": "75 - 90 days", "water_requirement": "Medium", "estimated_yield_per_acre": "80 - 140 Quintals", "investment_level": "Moderate", "profit_potential": "Very High", "msp_price": 1800, "seed_rate": 1.2, "seed_cost": 2800, "cult_cost": 18000, "yield_avg": 110.0, "ideal_n": 60, "ideal_p": 40, "ideal_k": 60, "sowing_window": "January 15 - March 15", "sowing_tips": "Sweet summer dessert melon. Riverbed cultivation (diara land) or drip fertigation on silver-black mulch.", "fertilizer_advice": "Apply Potash generously during fruit netting to elevate sugar content (TSS > 12° Brix).", "soil_notes": "Warm sandy riverbeds and sandy loam with high drainage.", "companion_crops": ["Watermelon", "Bottle gourd"]},
  {"id": "green_peas", "name": "Green Garden Peas (Hari Matar)", "hindi_name": "हरी", "scientific_name": "Pisum sativum", "category": "Vegetable", "seasons": ["Rabi"], "suitable_soils": ["Alluvial Soil", "Clay Loam Soil", "Sandy Loam Soil"], "duration_days": "65 - 85 days", "water_requirement": "Medium", "estimated_yield_per_acre": "35 - 55 Quintals (Green pods)", "investment_level": "Moderate", "profit_potential": "Very High", "msp_price": 3600, "seed_rate": 35.0, "seed_cost": 110, "cult_cost": 17000, "yield_avg": 45.0, "ideal_n": 25, "ideal_p": 50, "ideal_k": 30, "sowing_window": "Early: October 1-15; Main: Oct 20 - Nov 15", "sowing_tips": "Premium winter vegetable. Early crop (GS-10, Arkel) in October commands premium prices in metropolitan mandis.", "fertilizer_advice": "DAP @ 50 kg/acre basal; inoculate seeds with Rhizobium leguminosarum.", "soil_notes": "Well-drained fertile loam; avoid waterlogged heavy clays.", "companion_crops": ["Mustard", "Wheat", "Coriander"]}

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

// ==============================================================================
// OFFLINE RESILIENT DATABASES (Pests, Mandi, Organic, Schemes, Districts)
// ==============================================================================
const LOCAL_PESTS_DB = [
  {
    id: "rice_blast",
    crop_id: "rice",
    crop_name: "Rice (Paddy)",
    name: "Rice Blast (Pyricularia oryzae)",
    hindi_name: "धान का झुलसा रोग (ब्लास्ट)",
    type: "Fungal",
    affected_parts: ["Leaf", "Stem", "Fruit/Grain"],
    symptoms: ["Spindle-shaped lesions with grayish centers and brown borders", "Neck rot breaking panicles", "Whitish-gray nodes turning black"],
    severity: "High",
    biological_control: ["Seed treatment with Pseudomonas fluorescens @ 10g/kg", "Spray Trichoderma viride @ 5g/L water", "Avoid excessive chemical nitrogen"],
    chemical_control: ["Tricyclazole 75% WP @ 0.6g/L water", "Isoprothiolane 40% EC @ 1.5ml/L"],
    chemical_dosage: "Tricyclazole 75% WP @ 120g in 200L water per acre",
    pre_harvest_interval_days: 21,
    prevention_tips: ["Burn diseased stubbles", "Maintain field drainage", "Use blast-resistant varieties like IR64"]
  },
  {
    id: "rice_stem_borer",
    crop_id: "rice",
    crop_name: "Rice (Paddy)",
    name: "Yellow Stem Borer (Scirpophaga incertulas)",
    hindi_name: "धान का तना छेदक कीट",
    type: "Pest",
    affected_parts: ["Stem", "Fruit/Grain"],
    symptoms: ["Dead hearts in vegetative tillers that pull out easily", "White ears (empty white panicles) at maturity", "Holes near stem base with frass"],
    severity: "Critical",
    biological_control: ["Install Pheromone traps @ 8-10 traps/acre", "Release Trichogramma japonicum egg parasitoids @ 40,000/acre", "Clip seedling tips before transplanting"],
    chemical_control: ["Chlorantraniliprole 0.4% G (Ferterra) @ 4 kg/acre", "Cartap hydrochloride 4% G @ 7.5 kg/acre"],
    chemical_dosage: "Cartap Hydrochloride 50% SP @ 400g/acre in 200L water",
    pre_harvest_interval_days: 19,
    prevention_tips: ["Avoid deep standing water early on", "Avoid excessive urea", "Harvest stubbles near ground level"]
  },
  {
    id: "wheat_yellow_rust",
    crop_id: "wheat",
    crop_name: "Wheat",
    name: "Yellow / Stripe Rust (Puccinia striiformis)",
    hindi_name: "गेहूं का पीला रतुआ",
    type: "Fungal",
    affected_parts: ["Leaf"],
    symptoms: ["Bright yellow powdery pustules arranged in linear stripes on leaves", "Leaves dry up and turn yellow-brown", "Severe yield drop up to 40% if untreated"],
    severity: "Critical",
    biological_control: ["Sow early in November to escape late cool humidity", "Spray garlic clove extract (2%) as preventive"],
    chemical_control: ["Propiconazole 25% EC (Tilt) @ 1 ml/L", "Tebuconazole 25.9% EC @ 1 ml/L"],
    chemical_dosage: "Propiconazole 25% EC @ 200 ml in 200L water per acre",
    pre_harvest_interval_days: 30,
    prevention_tips: ["Cultivate rust-resistant varieties (HD-3086, DBW-187)", "Regular field scouting in Jan-Feb"]
  },
  {
    id: "wheat_aphid",
    crop_id: "wheat",
    crop_name: "Wheat",
    name: "Wheat Aphids (Rhopalosiphum padi)",
    hindi_name: "गेहूं का माहू / चेपा कीट",
    type: "Pest",
    affected_parts: ["Leaf", "Fruit/Grain"],
    symptoms: ["Colonies of green/brown insects clustering on earheads", "Honeydew secretion attracting sooty mold", "Shrinkage of developing grains"],
    severity: "Moderate",
    biological_control: ["Conserve ladybird beetles", "Spray 5% Neem Seed Kernel Extract (NSKE)", "Yellow sticky traps @ 6-8/acre"],
    chemical_control: ["Thiamethoxam 25% WG @ 0.2g/L", "Imidacloprid 17.8% SL @ 0.3ml/L"],
    chemical_dosage: "Thiamethoxam 25% WG @ 40g in 150L water per acre",
    pre_harvest_interval_days: 21,
    prevention_tips: ["Avoid late irrigation during warming winds", "Maintain recommended seed density"]
  },
  {
    id: "cotton_pink_bollworm",
    crop_id: "cotton",
    crop_name: "Cotton",
    name: "Pink Bollworm (Pectinophora gossypiella)",
    hindi_name: "कपास की गुलाबी सूंडी",
    type: "Pest",
    affected_parts: ["Fruit/Grain"],
    symptoms: ["Rosetted flowers that fail to open normally", "Small exit holes on developing bolls", "Interlocked fiber seeds and stained poor quality lint"],
    severity: "Critical",
    biological_control: ["Pheromone traps (Gossyplure) @ 8/acre for monitoring, 20/acre for disruption", "Trichogramma bactrae @ 60,000/acre releases"],
    chemical_control: ["Emamectin benzoate 5% SG @ 0.5g/L", "Spinetoram 11.7% SC @ 1ml/L", "Chlorantraniliprole 18.5% SC @ 0.3ml/L"],
    chemical_dosage: "Emamectin Benzoate 5% SG @ 100g in 200L water per acre",
    pre_harvest_interval_days: 15,
    prevention_tips: ["Avoid extending cotton crop past 150-160 days", "Prompt destruction of stalks after last picking"]
  },
  {
    id: "cotton_whitefly",
    crop_id: "cotton",
    crop_name: "Cotton",
    name: "Whitefly & Leaf Curl Virus (Bemisia tabaci)",
    hindi_name: "कपास की सफेद मक्खी एवं मरोड़िया रोग",
    type: "Pest",
    affected_parts: ["Leaf"],
    symptoms: ["Tiny white flying insects under leaves", "Upward curling and thickening of leaf veins", "Sticky leaf surface with black sooty mold"],
    severity: "High",
    biological_control: ["Yellow sticky traps @ 12-15 traps/acre", "Spray Neem oil 1500 ppm @ 3-5 ml/L"],
    chemical_control: ["Diafenthiuron 50% WP @ 1.2g/L", "Pyriproxyfen 10% EC @ 2ml/L"],
    chemical_dosage: "Diafenthiuron 50% WP @ 250g in 200L water per acre",
    pre_harvest_interval_days: 20,
    prevention_tips: ["Do not plant alternate weed hosts (Congress grass)", "Avoid excessive synthetic pyrethroids"]
  },
  {
    id: "maize_fall_armyworm",
    crop_id: "maize",
    crop_name: "Maize (Corn)",
    name: "Fall Armyworm (Spodoptera frugiperda)",
    hindi_name: "मक्के का फाल आर्मीवर्म कीट",
    type: "Pest",
    affected_parts: ["Leaf", "Stem", "Fruit/Grain"],
    symptoms: ["Papery feeding windows on leaf whorls", "Heavy sawdust-like fecal matter inside central whorl", "Severely shredded skeletonized leaves"],
    severity: "Critical",
    biological_control: ["Release Trichogramma pretiosum @ 50,000/acre", "Spray Bacillus thuringiensis (Bt) kurstaki @ 2g/L", "Soil/ash dusting into whorl"],
    chemical_control: ["Chlorantraniliprole 18.5% SC @ 0.4ml/L", "Spinetoram 11.7% SC @ 0.5ml/L"],
    chemical_dosage: "Chlorantraniliprole 18.5% SC @ 80 ml in 200L water per acre into whorl",
    pre_harvest_interval_days: 14,
    prevention_tips: ["Intercrop with Desmodium or cowpea", "Deep summer plowing to expose pupae to birds"]
  },
  {
    id: "chickpea_pod_borer",
    crop_id: "chickpea",
    crop_name: "Chickpea (Gram / Chana)",
    name: "Gram Pod Borer (Helicoverpa armigera)",
    hindi_name: "चने की इल्ली / फली छेदक",
    type: "Pest",
    affected_parts: ["Leaf", "Fruit/Grain"],
    symptoms: ["Circular bore-holes in chickpea green pods with seeds half eaten", "Larva with body protruding out of pod while feeding", "Skeletonized foliage"],
    severity: "High",
    biological_control: ["Erect bird perches @ 15-20/acre", "Spray HaNPV @ 250 LE/acre", "Pheromone traps @ 5-8/acre"],
    chemical_control: ["Emamectin benzoate 5% SG @ 0.5g/L", "Chlorantraniliprole 18.5% SC @ 0.3ml/L"],
    chemical_dosage: "Emamectin Benzoate 5% SG @ 90g in 180L water per acre",
    pre_harvest_interval_days: 14,
    prevention_tips: ["Intercrop with mustard or coriander", "Spray in evening during early larval instars"]
  },
  {
    id: "chickpea_fusarium_wilt",
    crop_id: "chickpea",
    crop_name: "Chickpea (Gram / Chana)",
    name: "Chickpea Fusarium Wilt (Fusarium oxysporum)",
    hindi_name: "चने का उकठा रोग (विल्ट)",
    type: "Fungal",
    affected_parts: ["Root", "Stem", "Whole Plant"],
    symptoms: ["Sudden drooping of petioles and leaves without yellowing initially", "Dark brown internal vascular discoloration in root", "Patchy drying across field"],
    severity: "Critical",
    biological_control: ["Seed treatment with Trichoderma viride @ 5-10g/kg", "Trichoderma enriched FYM @ 250 kg/acre basal", "3-year crop rotation"],
    chemical_control: ["Carbendazim 50% WP @ 2g/kg seed treatment", "Carboxin + Thiram @ 2.5g/kg seed"],
    chemical_dosage: "Preventive seed treatment: Carbendazim 50% WP @ 2.5g per kg seed",
    pre_harvest_interval_days: 35,
    prevention_tips: ["Deep summer plowing", "Avoid sowing in hot soil (>25°C in late October)", "Use resistant cultivars (JG-11)"]
  },
  {
    id: "mustard_aphids",
    crop_id: "mustard",
    crop_name: "Mustard / Rapeseed",
    name: "Mustard Aphid (Lipaphis erysimi)",
    hindi_name: "सरसों का चेपा / माहू कीट",
    type: "Pest",
    affected_parts: ["Stem", "Leaf", "Fruit/Grain"],
    symptoms: ["Dense greenish-yellow insects sucking sap from inflorescence and pods", "Curled sickly leaves and stunted pods", "Abundant sticky honeydew"],
    severity: "High",
    biological_control: ["Conserve Ladybird beetles", "Spray Neem seed kernel extract (NSKE) 5% in morning", "Sow early before Oct 15"],
    chemical_control: ["Dimethoate 30% EC @ 1.5ml/L", "Thiamethoxam 25% WG @ 0.2g/L"],
    chemical_dosage: "Dimethoate 30% EC @ 250 ml in 200L water per acre",
    pre_harvest_interval_days: 15,
    prevention_tips: ["Early sowing by October 10 escapes 80% aphid infestation", "Spray when 10% twigs show colonies"]
  },
  {
    id: "soybean_girdle_beetle",
    crop_id: "soybean",
    crop_name: "Soybean",
    name: "Soybean Girdle Beetle (Obereopsis brevis)",
    hindi_name: "सोयाबीन का चक्र भृंग (गर्डल बीटल)",
    type: "Pest",
    affected_parts: ["Stem", "Leaf"],
    symptoms: ["Two parallel circular cuts/rings on petiole or stem", "Sudden drooping and drying of leaves above girdle", "Stem hollowed out by larva"],
    severity: "High",
    biological_control: ["Remove and bury girdled stems", "Spray Beauveria bassiana @ 5g/L"],
    chemical_control: ["Thiamethoxam + Lambda-cyhalothrin @ 0.4ml/L", "Chlorantraniliprole 18.5% SC @ 0.3ml/L"],
    chemical_dosage: "Thiamethoxam + Lambda-cyhalothrin @ 80 ml in 150L water per acre",
    pre_harvest_interval_days: 21,
    prevention_tips: ["Spray promptly once 10% plants show cuts", "Deep tillage destroys overwintering pupae"]
  },
  {
    id: "tomato_early_blight",
    crop_id: "tomato",
    crop_name: "Tomato",
    name: "Tomato Early Blight (Alternaria solani)",
    hindi_name: "टमाटर का अगेती झुलसा",
    type: "Fungal",
    affected_parts: ["Leaf", "Stem", "Fruit/Grain"],
    symptoms: ["Concentric target-board rings on older leaves with yellow halo", "Sunken dark cankers on stems near soil", "Fruit drop with dark leathery lesions"],
    severity: "Moderate to High",
    biological_control: ["Spray Trichoderma harzianum @ 5g/L", "Plastic or straw mulch to stop soil splash"],
    chemical_control: ["Mancozeb 75% WP @ 2.5g/L", "Difenoconazole 25% EC @ 1ml/L"],
    chemical_dosage: "Mancozeb 75% WP @ 500g in 200L water per acre",
    pre_harvest_interval_days: 7,
    prevention_tips: ["Prune lower foliage touching wet soil", "Use drip irrigation instead of overhead sprinklers"]
  },
  {
    id: "potato_late_blight",
    crop_id: "potato",
    crop_name: "Potato",
    name: "Late Blight of Potato (Phytophthora infestans)",
    hindi_name: "आलू का पछेती झुलसा",
    type: "Fungal",
    affected_parts: ["Leaf", "Stem", "Fruit/Grain"],
    symptoms: ["Water-soaked dark lesions spreading rapidly during cool fog", "White powdery fungal growth under leaves in morning", "Tubers show dry brown rot beneath skin"],
    severity: "Critical",
    biological_control: ["Certified disease-free seed tubers only", "Spray Bacillus subtilis @ 3g/L", "Earthing up soil to 15cm thickness"],
    chemical_control: ["Cymoxanil + Mancozeb @ 2.5g/L", "Metalaxyl + Mancozeb @ 2.5g/L"],
    chemical_dosage: "Cymoxanil + Mancozeb @ 600g in 250L water per acre",
    pre_harvest_interval_days: 10,
    prevention_tips: ["Continuous cool fog (<20°C) with RH >90% triggers epidemics", "Destroy volunteer tubers and cull piles"]
  },
  {
    id: "onion_purple_blotch",
    crop_id: "onion",
    crop_name: "Onion",
    name: "Purple Blotch (Alternaria porri)",
    hindi_name: "प्याज़ का बैंगनी धब्बा रोग",
    type: "Fungal",
    affected_parts: ["Leaf", "Stem"],
    symptoms: ["Small water-soaked sunken lesions with reddish-purple centers", "Leaves turn yellow and collapse prematurely", "Severe reduction in bulb diameter"],
    severity: "High",
    biological_control: ["Seed treatment with Trichoderma viride @ 5g/kg", "Spray fermented buttermilk (Chhachh) @ 50ml/L"],
    chemical_control: ["Mancozeb 75% WP @ 2.5g/L", "Tebuconazole 25.9% EC @ 1ml/L"],
    chemical_dosage: "Mancozeb @ 500g in 200L water per acre with agricultural sticker",
    pre_harvest_interval_days: 15,
    prevention_tips: ["Always mix surfactant because onion leaves are waxy", "Avoid overhead irrigation during bulb stage"]
  },
  {
    id: "chilli_anthracnose",
    crop_id: "chilli",
    crop_name: "Chilli / Red Pepper",
    name: "Chilli Anthracnose & Fruit Rot (Colletotrichum capsici)",
    hindi_name: "मिर्च का फल सड़न एवं एन्थ्रेक्नोज़",
    type: "Fungal",
    affected_parts: ["Fruit/Grain", "Leaf", "Stem"],
    symptoms: ["Sunken circular water-soaked lesions on ripe fruits with black rings", "Die-back of twigs from tip downward", "Fruits dry prematurely and turn straw colored"],
    severity: "High",
    biological_control: ["Seed treatment with Trichoderma harzianum @ 10g/kg", "Spray Pseudomonas fluorescens @ 5g/L", "Collect and burn infected fruits"],
    chemical_control: ["Copper Oxychloride 50% WP @ 3g/L", "Saaf (Carbendazim + Mancozeb) @ 2g/L"],
    chemical_dosage: "Saaf @ 400g in 200L water per acre",
    pre_harvest_interval_days: 10,
    prevention_tips: ["Transplant on raised beds with silver-black mulch", "Spray before fruit ripening stage under rain"]
  }
];

const LOCAL_MANDI_DB = [
  {
    crop_id: "wheat",
    crop_name: "Wheat",
    commodity: "Wheat (Lokwan / Dara)",
    state: "Punjab",
    district: "Ludhiana",
    market_apmc: "Khanna Mandi",
    modal_price_per_quintal: 2480.0,
    min_price: 2400.0,
    max_price: 2560.0,
    msp_price: 2400.0,
    trend: "Rising / Bullish",
    selling_advice: "Favorable Selling Window: ₹80 premium above MSP due to strong mill procurement.",
    historical_30d: [
      { date: "-30d", modal_price: 2390 }, { date: "-25d", modal_price: 2400 },
      { date: "-20d", modal_price: 2415 }, { date: "-15d", modal_price: 2440 },
      { date: "-10d", modal_price: 2465 }, { date: "-5d", modal_price: 2475 },
      { date: "Today", modal_price: 2480 }
    ]
  },
  {
    crop_id: "wheat",
    crop_name: "Wheat",
    commodity: "Wheat (Sharbati Premium)",
    state: "Madhya Pradesh",
    district: "Indore",
    market_apmc: "Indore APMC Mandi",
    modal_price_per_quintal: 2620.0,
    min_price: 2450.0,
    max_price: 2780.0,
    msp_price: 2400.0,
    trend: "Rising / Bullish",
    selling_advice: "Strong Market Premium: Sharbati grain quality commanding ₹220 premium over official MSP.",
    historical_30d: [
      { date: "-30d", modal_price: 2510 }, { date: "-25d", modal_price: 2535 },
      { date: "-20d", modal_price: 2560 }, { date: "-15d", modal_price: 2580 },
      { date: "-10d", modal_price: 2600 }, { date: "-5d", modal_price: 2610 },
      { date: "Today", modal_price: 2620 }
    ]
  },
  {
    crop_id: "rice",
    crop_name: "Rice (Paddy)",
    commodity: "Paddy (Basmati 1121)",
    state: "Haryana",
    district: "Karnal",
    market_apmc: "Karnal Grain Market",
    modal_price_per_quintal: 3650.0,
    min_price: 3400.0,
    max_price: 3850.0,
    msp_price: 2300.0,
    trend: "Stable",
    selling_advice: "High Value Window: Basmati arrivals are steady. Premium grade fetching above ₹3,600/qtl.",
    historical_30d: [
      { date: "-30d", modal_price: 3580 }, { date: "-25d", modal_price: 3600 },
      { date: "-20d", modal_price: 3640 }, { date: "-15d", modal_price: 3660 },
      { date: "-10d", modal_price: 3650 }, { date: "-5d", modal_price: 3645 },
      { date: "Today", modal_price: 3650 }
    ]
  },
  {
    crop_id: "cotton",
    crop_name: "Cotton",
    commodity: "Medium-Staple Raw Cotton (Kapas)",
    state: "Gujarat",
    district: "Rajkot",
    market_apmc: "Rajkot Yard APMC",
    modal_price_per_quintal: 7450.0,
    min_price: 7100.0,
    max_price: 7800.0,
    msp_price: 7121.0,
    trend: "Rising / Bullish",
    selling_advice: "Favorable Selling Opportunity: Ginning mill buying is aggressive. Good time to sell dry stocks.",
    historical_30d: [
      { date: "-30d", modal_price: 7150 }, { date: "-25d", modal_price: 7220 },
      { date: "-20d", modal_price: 7280 }, { date: "-15d", modal_price: 7350 },
      { date: "-10d", modal_price: 7400 }, { date: "-5d", modal_price: 7430 },
      { date: "Today", modal_price: 7450 }
    ]
  },
  {
    crop_id: "soybean",
    crop_name: "Soybean",
    commodity: "Yellow Soybean (Meal Grade)",
    state: "Maharashtra",
    district: "Latur",
    market_apmc: "Latur APMC Mandi",
    modal_price_per_quintal: 4920.0,
    min_price: 4650.0,
    max_price: 5050.0,
    msp_price: 4892.0,
    trend: "Stable",
    selling_advice: "Hold or Stagger Sales: Prices hover right at MSP. Crushing margins are tight.",
    historical_30d: [
      { date: "-30d", modal_price: 4850 }, { date: "-25d", modal_price: 4870 },
      { date: "-20d", modal_price: 4880 }, { date: "-15d", modal_price: 4900 },
      { date: "-10d", modal_price: 4915 }, { date: "-5d", modal_price: 4925 },
      { date: "Today", modal_price: 4920 }
    ]
  },
  {
    crop_id: "mustard",
    crop_name: "Mustard / Rapeseed",
    commodity: "Mustard Seed (42% Oil Content)",
    state: "Rajasthan",
    district: "Alwar",
    market_apmc: "Alwar Krishi Upaj Mandi",
    modal_price_per_quintal: 6120.0,
    min_price: 5850.0,
    max_price: 6300.0,
    msp_price: 5950.0,
    trend: "Rising / Bullish",
    selling_advice: "Strong Market: Local oil expellers offering attractive premium for clean seed >40% oil.",
    historical_30d: [
      { date: "-30d", modal_price: 5880 }, { date: "-25d", modal_price: 5920 },
      { date: "-20d", modal_price: 5970 }, { date: "-15d", modal_price: 6020 },
      { date: "-10d", modal_price: 6070 }, { date: "-5d", modal_price: 6100 },
      { date: "Today", modal_price: 6120 }
    ]
  },
  {
    crop_id: "chickpea",
    crop_name: "Chickpea (Gram / Chana)",
    commodity: "Desi Chana / Gram",
    state: "Madhya Pradesh",
    district: "Vidisha",
    market_apmc: "Vidisha Krishi Mandi",
    modal_price_per_quintal: 6250.0,
    min_price: 5900.0,
    max_price: 6450.0,
    msp_price: 5600.0,
    trend: "Rising / Bullish",
    selling_advice: "Excellent Selling Rate: Trading ₹650 above MSP due to festive season pulse demand.",
    historical_30d: [
      { date: "-30d", modal_price: 5750 }, { date: "-25d", modal_price: 5850 },
      { date: "-20d", modal_price: 5980 }, { date: "-15d", modal_price: 6100 },
      { date: "-10d", modal_price: 6180 }, { date: "-5d", modal_price: 6220 },
      { date: "Today", modal_price: 6250 }
    ]
  },
  {
    crop_id: "onion",
    crop_name: "Onion",
    commodity: "Nashik Red Onion (Pol / Garva)",
    state: "Maharashtra",
    district: "Nashik",
    market_apmc: "Lasalgaon APMC (Asia's Largest)",
    modal_price_per_quintal: 2450.0,
    min_price: 1800.0,
    max_price: 3100.0,
    msp_price: 1800.0,
    trend: "Volatile / Rising",
    selling_advice: "Sell Graded Produce: High spread between small and bold bulbs. Grade properly to secure ₹2,800+ rates.",
    historical_30d: [
      { date: "-30d", modal_price: 1750 }, { date: "-25d", modal_price: 1880 },
      { date: "-20d", modal_price: 2050 }, { date: "-15d", modal_price: 2200 },
      { date: "-10d", modal_price: 2350 }, { date: "-5d", modal_price: 2420 },
      { date: "Today", modal_price: 2450 }
    ]
  },
  {
    crop_id: "tomato",
    crop_name: "Tomato",
    commodity: "Hybrid Table Tomato",
    state: "Karnataka",
    district: "Kolar",
    market_apmc: "Kolar APMC Mandi",
    modal_price_per_quintal: 1850.0,
    min_price: 1400.0,
    max_price: 2200.0,
    msp_price: 1600.0,
    trend: "Stable",
    selling_advice: "Steady Inter-State Dispatches: Good arrivals to Chennai and Bengaluru markets.",
    historical_30d: [
      { date: "-30d", modal_price: 1600 }, { date: "-25d", modal_price: 1680 },
      { date: "-20d", modal_price: 1740 }, { date: "-15d", modal_price: 1800 },
      { date: "-10d", modal_price: 1840 }, { date: "-5d", modal_price: 1860 },
      { date: "Today", modal_price: 1850 }
    ]
  },
  {
    crop_id: "potato",
    crop_name: "Potato",
    commodity: "Kufri Bahar / Pukhraj",
    state: "Uttar Pradesh",
    district: "Agra",
    market_apmc: "Fatehabad Road Mandi, Agra",
    modal_price_per_quintal: 1420.0,
    min_price: 1200.0,
    max_price: 1650.0,
    msp_price: 1300.0,
    trend: "Rising / Bullish",
    selling_advice: "Gradual Cold Storage Offloading: Cold storage releases are fetching sound prices as open market supply tapers.",
    historical_30d: [
      { date: "-30d", modal_price: 1280 }, { date: "-25d", modal_price: 1310 },
      { date: "-20d", modal_price: 1340 }, { date: "-15d", modal_price: 1370 },
      { date: "-10d", modal_price: 1400 }, { date: "-5d", modal_price: 1410 },
      { date: "Today", modal_price: 1420 }
    ]
  },
  {
    crop_id: "chilli",
    crop_name: "Chilli / Red Pepper",
    commodity: "Dry Red Chilli (Teja / 334)",
    state: "Andhra Pradesh",
    district: "Guntur",
    market_apmc: "Guntur Mirchi Yard",
    modal_price_per_quintal: 16800.0,
    min_price: 14500.0,
    max_price: 19200.0,
    msp_price: 14000.0,
    trend: "Rising / Bullish",
    selling_advice: "Strong Export Demand: Oleoresin processors bidding actively for high-color dry chillies.",
    historical_30d: [
      { date: "-30d", modal_price: 15400 }, { date: "-25d", modal_price: 15800 },
      { date: "-20d", modal_price: 16100 }, { date: "-15d", modal_price: 16400 },
      { date: "-10d", modal_price: 16650 }, { date: "-5d", modal_price: 16750 },
      { date: "Today", modal_price: 16800 }
    ]
  }
];

const LOCAL_ORGANIC_RECIPES = [
  {
    id: "jeevamrutha",
    name: "Jeevamrutha (Liquid Microbial Culture)",
    hindi_name: "जीवामृत (तरल जैविक खाद)",
    purpose: "Promotes explosive multiplication of beneficial aerobic and anaerobic soil microbes, converting locked nutrients into plant-available ionic form.",
    ingredients: [
      "10 kg Fresh Indigenous (Desi) Cow Dung",
      "5 - 10 Litres Desi Cow Urine",
      "1 - 2 kg Organic Jaggery (Gur)",
      "1 - 2 kg Pulse Flour (Besan e.g., gram/pigeon pea)",
      "A handful of virgin living soil from farm bund",
      "200 Litres Clean Water"
    ],
    preparation_steps: [
      "In a 200-litre barrel placed under shade, mix 10 kg cow dung and 10 L cow urine thoroughly.",
      "Add crushed jaggery and pulse flour. Add the handful of virgin forest/bund soil.",
      "Fill with water up to 200 L and stir clockwise for 5 minutes.",
      "Cover with a breathable jute gunny bag. Keep away from direct sunlight.",
      "Stir with a stick twice daily (morning & evening) for 1-2 minutes.",
      "Culture is ready for application in 48 to 72 hours in summer (5-7 days in winter). Use within 7 days of fermentation."
    ],
    application_method: "Apply 200 Litres per acre via drip fertigation or flood irrigation channel.",
    application_timing: "Twice a month: 1st during vegetative stage, 2nd during pre-flowering.",
    dosage_per_acre: "200 Litres per acre per application"
  },
  {
    id: "beejamrit",
    name: "Beejamrit (Biological Seed Treatment)",
    hindi_name: "बीजामृत (जैविक बीज संस्कार)",
    purpose: "Protects seeds and seedling roots from soil-borne and seed-borne fungal pathogens; accelerates germination speed and root vigor.",
    ingredients: [
      "5 kg Fresh Desi Cow Dung (in a cloth pouch)",
      "5 Litres Desi Cow Urine",
      "50 grams Edible Slaked Lime (Chuna)",
      "A handful of living virgin bund soil",
      "20 Litres Clean Water"
    ],
    preparation_steps: [
      "Suspend the 5 kg cow dung cloth pouch into 20 L water for 12 hours.",
      "Squeeze the pouch continuously so microbial extract dissolves into liquid.",
      "Dissolve 50g lime in 1 liter of water separately, then stir it in.",
      "Add 5 L cow urine and the handful of living soil; mix thoroughly.",
      "Dip seeds or coat seed tubers gently. Spread on cloth in shade for 30 minutes to dry before sowing."
    ],
    application_method: "Seed coating / root dipping for transplants before sowing in soil.",
    application_timing: "Immediately 1-2 hours prior to sowing/planting.",
    dosage_per_acre: "Sufficient to treat 20-50 kg seeds for 1 to 2 acres"
  },
  {
    id: "ghanjeevamrit",
    name: "Ghanjeevamrit (Solid Bio-Manure Cake)",
    hindi_name: "घनजीवामृत (ठोस जैविक खाद)",
    purpose: "Ideal basal solid organic manure for slow release of nutrients throughout crop life, conditioning soil humus.",
    ingredients: [
      "100 kg Dry Desi Cow Dung",
      "2 kg Jaggery (Gur)",
      "2 kg Pulse Flour (Besan)",
      "1 kg Living Soil",
      "5 Litres Cow Urine"
    ],
    preparation_steps: [
      "Spread dry cow dung evenly on a shaded clean floor.",
      "Mix jaggery, besan, and soil into the cow urine.",
      "Sprinkle this liquid mixture uniformly over the dry cow dung.",
      "Turn the heap thoroughly with a shovel so moisture is evenly distributed.",
      "Cover with a moist gunny bag and allow it to ferment for 48 hours.",
      "Sun dry and store in dry bags. Remains biologically active for up to 6 months."
    ],
    application_method: "Broadcast over plowed field prior to final harrowing or in seed furrows.",
    application_timing: "At final land preparation (Basal dose).",
    dosage_per_acre: "100 - 150 kg per acre at sowing"
  },
  {
    id: "neemastra",
    name: "Neemastra (Botanical Pest Repellent)",
    hindi_name: "नीमास्त्र (जैविक कीटनाशक)",
    purpose: "Potent broad-spectrum repellent and anti-feedant against sucking pests (aphids, jassids, thrips, whiteflies) and small young larvae.",
    ingredients: [
      "5 kg Crushed Fresh Neem Leaves",
      "5 kg Crushed Neem Seed Kernels (or pulp)",
      "5 Litres Desi Cow Urine",
      "2 kg Fresh Cow Dung",
      "100 Litres Clean Water"
    ],
    preparation_steps: [
      "In a drum, mix 100 L water, 5 L cow urine, and 2 kg cow dung.",
      "Add finely crushed neem leaves and pounded neem kernels.",
      "Stir clockwise with a wooden pole.",
      "Cover with gunny bag and let ferment in shade for 48 hours, stirring twice daily.",
      "Filter the solution through a thin muslin cloth into your knapsack sprayer."
    ],
    application_method: "Foliar spray with knapsack sprayer covering undersides of leaves.",
    application_timing: "Early morning or late afternoon at first sighting of insect pests.",
    dosage_per_acre: "100 Litres unfiltered decoction diluted in 100 L water (1:1 ratio) per acre"
  }
];

const LOCAL_DISTRICTS_REGISTRY = {
  "Punjab": [
    { district: "Ludhiana", state: "Punjab", soil_type: "Alluvial Soil", annual_rainfall_mm: 680, avg_temp_c: 24.5, priority_crops: ["wheat", "rice", "potato", "maize"] },
    { district: "Bathinda", state: "Punjab", soil_type: "Sandy Loam Soil", annual_rainfall_mm: 410, avg_temp_c: 25.0, priority_crops: ["cotton", "wheat", "mustard", "pearl_millet"] },
    { district: "Amritsar", state: "Punjab", soil_type: "Alluvial Soil", annual_rainfall_mm: 720, avg_temp_c: 23.8, priority_crops: ["rice", "wheat", "potato"] }
  ],
  "Haryana": [
    { district: "Karnal", state: "Haryana", soil_type: "Alluvial Soil", annual_rainfall_mm: 750, avg_temp_c: 24.0, priority_crops: ["rice", "wheat", "sugarcane", "mustard"] },
    { district: "Hisar", state: "Haryana", soil_type: "Sandy Loam Soil", annual_rainfall_mm: 450, avg_temp_c: 25.5, priority_crops: ["cotton", "wheat", "mustard", "chickpea"] },
    { district: "Sirsa", state: "Haryana", soil_type: "Sandy Loam Soil", annual_rainfall_mm: 380, avg_temp_c: 25.2, priority_crops: ["cotton", "wheat", "mustard"] }
  ],
  "Uttar Pradesh": [
    { district: "Agra", state: "Uttar Pradesh", soil_type: "Alluvial Soil", annual_rainfall_mm: 650, avg_temp_c: 26.0, priority_crops: ["potato", "wheat", "mustard", "pearl_millet"] },
    { district: "Varanasi", state: "Uttar Pradesh", soil_type: "Alluvial Soil", annual_rainfall_mm: 1050, avg_temp_c: 26.2, priority_crops: ["rice", "wheat", "chickpea", "tomato"] },
    { district: "Meerut", state: "Uttar Pradesh", soil_type: "Alluvial Soil", annual_rainfall_mm: 840, avg_temp_c: 24.8, priority_crops: ["sugarcane", "wheat", "potato", "mustard"] }
  ],
  "Maharashtra": [
    { district: "Nashik", state: "Maharashtra", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 810, avg_temp_c: 25.0, priority_crops: ["onion", "tomato", "soybean", "wheat"] },
    { district: "Latur", state: "Maharashtra", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 790, avg_temp_c: 26.5, priority_crops: ["soybean", "pigeon_pea", "chickpea", "sorghum"] },
    { district: "Nagpur", state: "Maharashtra", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 1100, avg_temp_c: 27.0, priority_crops: ["cotton", "soybean", "pigeon_pea", "wheat"] }
  ],
  "Madhya Pradesh": [
    { district: "Indore", state: "Madhya Pradesh", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 950, avg_temp_c: 25.2, priority_crops: ["soybean", "wheat", "chickpea", "potato"] },
    { district: "Ujjain", state: "Madhya Pradesh", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 910, avg_temp_c: 25.4, priority_crops: ["soybean", "wheat", "garlic", "chickpea"] },
    { district: "Vidisha", state: "Madhya Pradesh", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 1050, avg_temp_c: 25.8, priority_crops: ["chickpea", "wheat", "soybean", "lentil"] }
  ],
  "Rajasthan": [
    { district: "Alwar", state: "Rajasthan", soil_type: "Alluvial Soil", annual_rainfall_mm: 620, avg_temp_c: 26.0, priority_crops: ["mustard", "pearl_millet", "wheat", "onion"] },
    { district: "Kota", state: "Rajasthan", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 880, avg_temp_c: 26.5, priority_crops: ["soybean", "wheat", "mustard", "coriander"] },
    { district: "Bikaner", state: "Rajasthan", soil_type: "Sandy Loam Soil", annual_rainfall_mm: 260, avg_temp_c: 27.2, priority_crops: ["pearl_millet", "chickpea", "groundnut"] }
  ],
  "Gujarat": [
    { district: "Rajkot", state: "Gujarat", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 590, avg_temp_c: 26.8, priority_crops: ["cotton", "groundnut", "wheat", "sesame"] },
    { district: "Surat", state: "Gujarat", soil_type: "Clay Loam Soil", annual_rainfall_mm: 1200, avg_temp_c: 27.4, priority_crops: ["sugarcane", "rice", "banana", "cotton"] }
  ],
  "Karnataka": [
    { district: "Kolar", state: "Karnataka", soil_type: "Red Soil", annual_rainfall_mm: 740, avg_temp_c: 24.2, priority_crops: ["tomato", "finger_millet", "groundnut", "potato"] },
    { district: "Belagavi", state: "Karnataka", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 850, avg_temp_c: 24.8, priority_crops: ["sugarcane", "soybean", "maize", "cotton"] }
  ],
  "Andhra Pradesh": [
    { district: "Guntur", state: "Andhra Pradesh", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 890, avg_temp_c: 28.5, priority_crops: ["chilli", "cotton", "rice", "tobacco"] },
    { district: "Kurnool", state: "Andhra Pradesh", soil_type: "Red Soil", annual_rainfall_mm: 670, avg_temp_c: 28.8, priority_crops: ["groundnut", "cotton", "sorghum"] }
  ],
  "Telangana": [
    { district: "Warangal", state: "Telangana", soil_type: "Red Soil", annual_rainfall_mm: 990, avg_temp_c: 27.6, priority_crops: ["cotton", "rice", "chilli", "maize"] },
    { district: "Nizamabad", state: "Telangana", soil_type: "Black Soil (Regur)", annual_rainfall_mm: 1020, avg_temp_c: 27.2, priority_crops: ["turmeric", "rice", "soybean", "maize"] }
  ]
};

// ----------------- DOM ELEMENTS -----------------
const apiStatusBadge = document.getElementById("apiStatusBadge");
const apiStatusText = document.getElementById("apiStatusText");
const detectWeatherBtn = document.getElementById("detectWeatherBtn");
const weatherBtnText = document.getElementById("weatherBtnText");
const weatherAlertBanner = document.getElementById("weatherAlertBanner");
const langToggleBtn = document.getElementById("langToggleBtn");
const langToggleText = document.getElementById("langToggleText");

// Navigation Tabs
const tabAdvisorBtn = document.getElementById("tabAdvisorBtn");
const tabDoctorBtn = document.getElementById("tabDoctorBtn");
const tabMandiBtn = document.getElementById("tabMandiBtn");
const tabIrrigationBtn = document.getElementById("tabIrrigationBtn");
const tabOrganicBtn = document.getElementById("tabOrganicBtn");
const tabRotationBtn = document.getElementById("tabRotationBtn");
const tabFertilizerBtn = document.getElementById("tabFertilizerBtn");
const tabYojanaBtn = document.getElementById("tabYojanaBtn");
const tabKhataBtn = document.getElementById("tabKhataBtn");

// 6 New Navigation Tabs & Content
const tabSeedBtn = document.getElementById("tabSeedBtn");
const tabSprayerBtn = document.getElementById("tabSprayerBtn");
const tabSolarBtn = document.getElementById("tabSolarBtn");
const tabIntercropBtn = document.getElementById("tabIntercropBtn");
const tabStorageBtn = document.getElementById("tabStorageBtn");
const tabLivestockBtn = document.getElementById("tabLivestockBtn");

const advisorTabContent = document.getElementById("advisorTabContent");
const doctorTabContent = document.getElementById("doctorTabContent");
const mandiTabContent = document.getElementById("mandiTabContent");
const irrigationTabContent = document.getElementById("irrigationTabContent");
const organicTabContent = document.getElementById("organicTabContent");
const rotationTabContent = document.getElementById("rotationTabContent");
const fertilizerTabContent = document.getElementById("fertilizerTabContent");
const yojanaTabContent = document.getElementById("yojanaTabContent");
const khataTabContent = document.getElementById("khataTabContent");

const seedTabContent = document.getElementById("seedTabContent");
const sprayerTabContent = document.getElementById("sprayerTabContent");
const solarTabContent = document.getElementById("solarTabContent");
const intercropTabContent = document.getElementById("intercropTabContent");
const storageTabContent = document.getElementById("storageTabContent");
const livestockTabContent = document.getElementById("livestockTabContent");

// Quick Header Actions
const voiceSearchBtn = document.getElementById("voiceSearchBtn");
const openSatelliteMapBtn = document.getElementById("openSatelliteMapBtn");
const closeSatelliteMapBtn = document.getElementById("closeSatelliteMapBtn");
const satelliteMapModal = document.getElementById("satelliteMapModal");
const satLocateBtn = document.getElementById("satLocateBtn");
const satClearPolygonBtn = document.getElementById("satClearPolygonBtn");
const applySatAcresBtn = document.getElementById("applySatAcresBtn");
const fenceTypeSelect = document.getElementById("fenceTypeSelect");
const fencePoleSpacing = document.getElementById("fencePoleSpacing");
const fencePoleType = document.getElementById("fencePoleType");
const cropCalendarModal = document.getElementById("cropCalendarModal");
const closeCropCalendarBtn = document.getElementById("closeCropCalendarBtn");
const downloadIcsBtn = document.getElementById("downloadIcsBtn");

// 10 Ag-Tech Sub-feature Action Buttons
const calcLivestockRationBtn = document.getElementById("calcLivestockRationBtn");
const calcGestationBtn = document.getElementById("calcGestationBtn");
const calcMandiArbitrageBtn = document.getElementById("calcMandiArbitrageBtn");
const calcMicronutrientsBtn = document.getElementById("calcMicronutrientsBtn");
const calcFarmPondBtn = document.getElementById("calcFarmPondBtn");
const calcMachineryBtn = document.getElementById("calcMachineryBtn");
const leafPhotoInput = document.getElementById("leafPhotoInput");

// Quick Header Actions
const openLandConverterBtn = document.getElementById("openLandConverterBtn");
const closeLandConverterBtn = document.getElementById("closeLandConverterBtn");
const landConverterModal = document.getElementById("landConverterModal");
const converterStateSelect = document.getElementById("converterStateSelect");
const converterInputValue = document.getElementById("converterInputValue");
const converterUnitSelect = document.getElementById("converterUnitSelect");
const applyConverterToFormsBtn = document.getElementById("applyConverterToFormsBtn");

const openFieldWalkBtn = document.getElementById("openFieldWalkBtn");
const closeFieldMeterBtn = document.getElementById("closeFieldMeterBtn");
const fieldMeterModal = document.getElementById("fieldMeterModal");
const gpsStatusDot = document.getElementById("gpsStatusDot");
const gpsStatusText = document.getElementById("gpsStatusText");
const gpsAccuracyText = document.getElementById("gpsAccuracyText");
const gpsStartBtn = document.getElementById("gpsStartBtn");
const gpsAddPointBtn = document.getElementById("gpsAddPointBtn");
const gpsFinishBtn = document.getElementById("gpsFinishBtn");
const gpsResetBtn = document.getElementById("gpsResetBtn");
const toggleManualDimsBtn = document.getElementById("toggleManualDimsBtn");
const manualDimsBox = document.getElementById("manualDimsBox");
const manualFieldLength = document.getElementById("manualFieldLength");
const manualFieldWidth = document.getElementById("manualFieldWidth");
const calcManualAreaBtn = document.getElementById("calcManualAreaBtn");
const fieldCanvas = document.getElementById("fieldCanvas");
const canvasPointsCount = document.getElementById("canvasPointsCount");
const walkCalculatedAcres = document.getElementById("walkCalculatedAcres");
const walkCalculatedGuntha = document.getElementById("walkCalculatedGuntha");
const walkCalculatedBigha = document.getElementById("walkCalculatedBigha");
const walkCalculatedPerimeter = document.getElementById("walkCalculatedPerimeter");
const applyWalkAcresBtn = document.getElementById("applyWalkAcresBtn");

// Voice Search Elements
const voiceCropBtn = document.getElementById("voiceCropBtn");
const voiceDoctorBtn = document.getElementById("voiceDoctorBtn");
const voiceMandiBtn = document.getElementById("voiceMandiBtn");
const voiceStatusPill = document.getElementById("voiceStatusPill");
const voiceStatusTitle = document.getElementById("voiceStatusTitle");
const voiceTranscriptPreview = document.getElementById("voiceTranscriptPreview");
const closeVoiceBtn = document.getElementById("closeVoiceBtn");

// Seed Elements
const seedForm = document.getElementById("seedForm");
const seedCropSelect = document.getElementById("seedCropSelect");
const seedLandAcres = document.getElementById("seedLandAcres");
const seedGerminationPct = document.getElementById("seedGerminationPct");
const seedSowingMethod = document.getElementById("seedSowingMethod");
const seedCustomSpacingCheck = document.getElementById("seedCustomSpacingCheck");
const seedCustomSpacingBox = document.getElementById("seedCustomSpacingBox");
const seedRowSpacingCm = document.getElementById("seedRowSpacingCm");
const seedPlantSpacingCm = document.getElementById("seedPlantSpacingCm");
const calcSeedBtn = document.getElementById("calcSeedBtn");
const seedResultContainer = document.getElementById("seedResultContainer");

// Sprayer Elements
const sprayerForm = document.getElementById("sprayerForm");
const sprayTankCap = document.getElementById("sprayTankCap");
const sprayLandAcres = document.getElementById("sprayLandAcres");
const sprayDosageMode = document.getElementById("sprayDosageMode");
const sprayChemForm = document.getElementById("sprayChemForm");
const sprayDoseAmount = document.getElementById("sprayDoseAmount");
const sprayDoseHint = document.getElementById("sprayDoseHint");
const sprayWaterRate = document.getElementById("sprayWaterRate");
const calcSprayerBtn = document.getElementById("calcSprayerBtn");
const sprayerResultContainer = document.getElementById("sprayerResultContainer");

// Solar Pump Elements
const solarForm = document.getElementById("solarForm");
const solarWaterSource = document.getElementById("solarWaterSource");
const solarDepthFeet = document.getElementById("solarDepthFeet");
const solarLandAcres = document.getElementById("solarLandAcres");
const solarIrrigType = document.getElementById("solarIrrigType");
const solarFarmerCategory = document.getElementById("solarFarmerCategory");
const calcSolarBtn = document.getElementById("calcSolarBtn");
const solarResultContainer = document.getElementById("solarResultContainer");

// Intercropping Elements
const intercropFilterSelect = document.getElementById("intercropFilterSelect");
const intercropCount = document.getElementById("intercropCount");
const intercropGrid = document.getElementById("intercropGrid");

// Storage Elements
const storageRiskForm = document.getElementById("storageRiskForm");
const storageCropSelect = document.getElementById("storageCropSelect");
const storageMoistureInput = document.getElementById("storageMoistureInput");
const storageMethodSelect = document.getElementById("storageMethodSelect");
const storageDurationInput = document.getElementById("storageDurationInput");
const checkStorageRiskBtn = document.getElementById("checkStorageRiskBtn");
const storageRiskResultContainer = document.getElementById("storageRiskResultContainer");
const storageCatalogTableBody = document.getElementById("storageCatalogTableBody");

// District Preset Elements
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const districtPresetStatus = document.getElementById("districtPresetStatus");

// Plant Doctor Elements
const doctorCropSelect = document.getElementById("doctorCropSelect");
const doctorPartSelect = document.getElementById("doctorPartSelect");
const doctorSearchInput = document.getElementById("doctorSearchInput");
const doctorResultsGrid = document.getElementById("doctorResultsGrid");
const doctorResetBtn = document.getElementById("doctorResetBtn");

// Mandi Elements
const mandiCommoditySelect = document.getElementById("mandiCommoditySelect");
const mandiStateFilter = document.getElementById("mandiStateFilter");
const mandiSearchInput = document.getElementById("mandiSearchInput");
const mandiCardsContainer = document.getElementById("mandiCardsContainer");

// Irrigation Elements
const irrigCropSelect = document.getElementById("irrigCropSelect");
const irrigStageSelect = document.getElementById("irrigStageSelect");
const irrigSoilSelect = document.getElementById("irrigSoilSelect");
const irrigLandInput = document.getElementById("irrigLandInput");
const irrigPumpInput = document.getElementById("irrigPumpInput");
const calcIrrigationBtn = document.getElementById("calcIrrigationBtn");
const irrigationResultContainer = document.getElementById("irrigationResultContainer");

// Organic Elements
const organicCropSelect = document.getElementById("organicCropSelect");
const organicLandInput = document.getElementById("organicLandInput");
const calcOrganicBtn = document.getElementById("calcOrganicBtn");
const organicResultContainer = document.getElementById("organicResultContainer");

// Yojana Elements
const yojanaCropSelect = document.getElementById("yojanaCropSelect");
const yojanaLandInput = document.getElementById("yojanaLandInput");
const yojanaCategorySelect = document.getElementById("yojanaCategorySelect");
const calcYojanaBtn = document.getElementById("calcYojanaBtn");
const yojanaResultContainer = document.getElementById("yojanaResultContainer");
const kccLoanAmount = document.getElementById("kccLoanAmount");
const kccLoanAmountDisplay = document.getElementById("kccLoanAmountDisplay");
const kccLoanTenure = document.getElementById("kccLoanTenure");
const kccPromptRepayCheck = document.getElementById("kccPromptRepayCheck");
const kccGrossInterest = document.getElementById("kccGrossInterest");
const kccSubventionSavings = document.getElementById("kccSubventionSavings");
const kccNetInterest = document.getElementById("kccNetInterest");
const kccTotalPayable = document.getElementById("kccTotalPayable");
const schemeSearchInput = document.getElementById("schemeSearchInput");
const schemesDirectoryGrid = document.getElementById("schemesDirectoryGrid");
let activeSchemeCategory = "All";


// Khata Elements
const khataForm = document.getElementById("khataForm");
const khataType = document.getElementById("khataType");
const khataCategory = document.getElementById("khataCategory");
const khataAmount = document.getElementById("khataAmount");
const khataNotes = document.getElementById("khataNotes");
const khataTotalExpense = document.getElementById("khataTotalExpense");
const khataTotalRevenue = document.getElementById("khataTotalRevenue");
const khataNetBalance = document.getElementById("khataNetBalance");
const khataTableBody = document.getElementById("khataTableBody");
const khataEntryCount = document.getElementById("khataEntryCount");
const clearKhataBtn = document.getElementById("clearKhataBtn");
const khataFilterCategory = document.getElementById("khataFilterCategory");
const exportKhataCsvBtn = document.getElementById("exportKhataCsvBtn");
const backupKhataJsonBtn = document.getElementById("backupKhataJsonBtn");
const restoreKhataBtn = document.getElementById("restoreKhataBtn");
const restoreKhataInput = document.getElementById("restoreKhataInput");
const khataCategoryBreakdown = document.getElementById("khataCategoryBreakdown");


// Language Modal Elements
const langModal = document.getElementById("langModal");
const closeLangModalBtn = document.getElementById("closeLangModalBtn");

// Form & Results Elements
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



// ----------------- TOAST NOTIFICATIONS SYSTEM -----------------

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  const icons = {
    success: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️"
  };
  const icon = icons[type] || "ℹ️";
  const bgColors = {
    success: "bg-emerald-900/95 border-emerald-500 text-white",
    warning: "bg-amber-900/95 border-amber-500 text-white",
    error: "bg-rose-900/95 border-rose-500 text-white",
    info: "bg-slate-900/95 border-slate-700 text-white"
  };
  const colorClass = bgColors[type] || bgColors.info;

  toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs font-semibold backdrop-blur-md transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto ${colorClass}`;
  toast.innerHTML = `<span>${icon}</span><span class="flex-1">${message}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}
window.showToast = showToast;

// ----------------- INITIALIZATION -----------------

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  registerServiceWorker();
  populateFertilizerCropOptions();
  initDistrictSelector();
  initKisanKhata();
  updateKhataCategoryOptions();
  calculateKccLoanEstimator();
  renderSchemesDirectory();
  checkApiHealth();
  updateSoilPresets();
  executeRecommendation();

  // 5 New Ag-Tech Features Initialization
  populateSeedCropOptions();
  populateMicronutrientCropOptions();
  initLandConverter();
  recalculateLandConverter();
  renderGrainStorageCatalog();

  // Contingency Protocol (Code Name: Plastic Man) - Hidden Owner Verification
  initContingencyProtocol();

  // Load saved language or default to en
  const savedLang = localStorage.getItem("agriassist_lang");
  setLanguage(savedLang && TRANSLATIONS[savedLang] ? savedLang : "en");
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
  // Navigation Tabs (All 15 Modules)
  tabAdvisorBtn?.addEventListener("click", () => switchTab("advisor"));
  tabDoctorBtn?.addEventListener("click", () => switchTab("doctor"));
  tabMandiBtn?.addEventListener("click", () => switchTab("mandi"));
  tabIrrigationBtn?.addEventListener("click", () => switchTab("irrigation"));
  tabOrganicBtn?.addEventListener("click", () => switchTab("organic"));
  tabRotationBtn?.addEventListener("click", () => switchTab("rotation"));
  tabFertilizerBtn?.addEventListener("click", () => switchTab("fertilizer"));
  tabYojanaBtn?.addEventListener("click", () => switchTab("yojana"));
  tabKhataBtn?.addEventListener("click", () => switchTab("khata"));

  // 6 Extended Feature Tabs
  tabSeedBtn?.addEventListener("click", () => switchTab("seed"));
  tabSprayerBtn?.addEventListener("click", () => switchTab("sprayer"));
  tabSolarBtn?.addEventListener("click", () => switchTab("solar"));
  tabIntercropBtn?.addEventListener("click", () => switchTab("intercrop"));
  tabStorageBtn?.addEventListener("click", () => switchTab("storage"));
  tabLivestockBtn?.addEventListener("click", () => switchTab("livestock"));

  // Header Quick Actions: Land Converter Modal
  openLandConverterBtn?.addEventListener("click", openLandConverterModal);
  closeLandConverterBtn?.addEventListener("click", closeLandConverterModal);
  landConverterModal?.addEventListener("click", (e) => {
    if (e.target === landConverterModal) closeLandConverterModal();
  });
  converterStateSelect?.addEventListener("change", recalculateLandConverter);
  converterInputValue?.addEventListener("input", recalculateLandConverter);
  converterUnitSelect?.addEventListener("change", recalculateLandConverter);
  applyConverterToFormsBtn?.addEventListener("click", applyConvertedAcresToForms);
  document.querySelectorAll(".open-land-converter-trigger").forEach(btn => {
    btn.addEventListener("click", openLandConverterModal);
  });

  // Header Quick Actions: GPS Field Walk-Meter Modal
  openFieldWalkBtn?.addEventListener("click", openFieldMeterModal);
  closeFieldMeterBtn?.addEventListener("click", closeFieldMeterModal);
  fieldMeterModal?.addEventListener("click", (e) => {
    if (e.target === fieldMeterModal) closeFieldMeterModal();
  });
  gpsStartBtn?.addEventListener("click", startFieldWalking);
  gpsAddPointBtn?.addEventListener("click", recordFieldPoint);
  gpsFinishBtn?.addEventListener("click", finishFieldWalking);
  gpsResetBtn?.addEventListener("click", resetFieldMeter);
  toggleManualDimsBtn?.addEventListener("click", () => {
    manualDimsBox?.classList.toggle("hidden");
  });
  calcManualAreaBtn?.addEventListener("click", calculateManualFieldArea);
  applyWalkAcresBtn?.addEventListener("click", applyWalkAcresToForms);

  // Header Quick Actions: Global Voice Search Button
  voiceSearchBtn?.addEventListener("click", () => startVoiceRecognition("global"));

  // Header Quick Actions: Interactive Satellite Field Plotter Modal
  openSatelliteMapBtn?.addEventListener("click", openSatelliteMapModal);
  closeSatelliteMapBtn?.addEventListener("click", closeSatelliteMapModal);
  satelliteMapModal?.addEventListener("click", (e) => {
    if (e.target === satelliteMapModal) closeSatelliteMapModal();
  });
  satLocateBtn?.addEventListener("click", locateUserOnSatelliteMap);
  satClearPolygonBtn?.addEventListener("click", clearSatellitePolygon);
  applySatAcresBtn?.addEventListener("click", applySatelliteAcres);
  fenceTypeSelect?.addEventListener("change", updateSatelliteFencingCalc);
  fencePoleSpacing?.addEventListener("change", updateSatelliteFencingCalc);
  fencePoleType?.addEventListener("change", updateSatelliteFencingCalc);

  // Dynamic Crop Calendar Modal
  closeCropCalendarBtn?.addEventListener("click", closeCropCalendarModal);
  cropCalendarModal?.addEventListener("click", (e) => {
    if (e.target === cropCalendarModal) closeCropCalendarModal();
  });
  downloadIcsBtn?.addEventListener("click", downloadCropCalendarIcs);

  // Sub-feature Action Listeners
  leafPhotoInput?.addEventListener("change", handleLeafPhotoUpload);
  calcMandiArbitrageBtn?.addEventListener("click", executeMandiArbitrage);
  calcMicronutrientsBtn?.addEventListener("click", executeMicronutrientDoctor);
  calcFarmPondBtn?.addEventListener("click", executeFarmPondSizing);
  calcMachineryBtn?.addEventListener("click", executeMachineryEconomics);
  calcLivestockRationBtn?.addEventListener("click", executeLivestockRation);
  calcGestationBtn?.addEventListener("click", executeGestationSchedule);

  // Kisan Voice Search Buttons
  voiceCropBtn?.addEventListener("click", () => startVoiceRecognition("cropSearchInput"));
  voiceDoctorBtn?.addEventListener("click", () => startVoiceRecognition("doctorSearchInput"));
  voiceMandiBtn?.addEventListener("click", () => startVoiceRecognition("mandiSearchInput"));
  closeVoiceBtn?.addEventListener("click", stopVoiceRecognition);

  // Seed & Population Calculator controls
  seedCropSelect?.addEventListener("change", executeSeedCalculation);
  seedLandAcres?.addEventListener("input", executeSeedCalculation);
  seedGerminationPct?.addEventListener("input", executeSeedCalculation);
  seedSowingMethod?.addEventListener("change", executeSeedCalculation);
  seedCustomSpacingCheck?.addEventListener("change", (e) => {
    seedCustomSpacingBox?.classList.toggle("hidden", !e.target.checked);
    executeSeedCalculation();
  });
  seedRowSpacingCm?.addEventListener("input", executeSeedCalculation);
  seedPlantSpacingCm?.addEventListener("input", executeSeedCalculation);
  calcSeedBtn?.addEventListener("click", executeSeedCalculation);
  seedForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    executeSeedCalculation();
  });

  // Knapsack Sprayer & Dilution Calculator controls
  sprayDosageMode?.addEventListener("change", (e) => {
    if (sprayDoseHint) {
      sprayDoseHint.textContent = e.target.value === "per_acre"
        ? "Standard recommended dose per 1 Acre of crop"
        : "Dilution rate per 1 Liter of clean spray water";
    }
    executeSprayerCalculation();
  });
  sprayChemForm?.addEventListener("change", executeSprayerCalculation);
  sprayTankCap?.addEventListener("change", executeSprayerCalculation);
  sprayLandAcres?.addEventListener("input", executeSprayerCalculation);
  sprayDoseAmount?.addEventListener("input", executeSprayerCalculation);
  sprayWaterRate?.addEventListener("input", executeSprayerCalculation);
  calcSprayerBtn?.addEventListener("click", executeSprayerCalculation);
  sprayerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    executeSprayerCalculation();
  });

  // Solar Pump & PM-KUSUM controls
  solarWaterSource?.addEventListener("change", executeSolarCalculation);
  solarDepthFeet?.addEventListener("input", executeSolarCalculation);
  solarLandAcres?.addEventListener("input", executeSolarCalculation);
  solarIrrigType?.addEventListener("change", executeSolarCalculation);
  solarFarmerCategory?.addEventListener("change", executeSolarCalculation);
  calcSolarBtn?.addEventListener("click", executeSolarCalculation);
  solarForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    executeSolarCalculation();
  });

  // Intercropping Catalog controls
  intercropFilterSelect?.addEventListener("change", (e) => {
    renderIntercroppingCatalog(e.target.value);
  });

  // Grain Storage Doctor controls
  storageCropSelect?.addEventListener("change", executeStorageRiskCheck);
  storageMoistureInput?.addEventListener("input", executeStorageRiskCheck);
  storageMethodSelect?.addEventListener("change", executeStorageRiskCheck);
  storageDurationInput?.addEventListener("input", executeStorageRiskCheck);
  checkStorageRiskBtn?.addEventListener("click", executeStorageRiskCheck);
  storageRiskForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    executeStorageRiskCheck();
  });

  // Weather detection
  detectWeatherBtn?.addEventListener("click", detectLocationAndWeather);
  const closeWeatherAlertBtn = document.getElementById("closeWeatherAlertBtn");
  if (closeWeatherAlertBtn) {
    closeWeatherAlertBtn.addEventListener("click", () => {
      weatherAlertBanner.classList.add("hidden");
    });
  }

  // Language modal controls
  langToggleBtn?.addEventListener("click", () => {
    langModal?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
  closeLangModalBtn?.addEventListener("click", () => {
    langModal?.classList.add("hidden");
    document.body.style.overflow = "";
  });
  langModal?.addEventListener("click", (e) => {
    if (e.target === langModal) {
      langModal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  });
  document.querySelectorAll(".lang-choice-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
      langModal?.classList.add("hidden");
      document.body.style.overflow = "";
    });
  });

  // District Calibrator controls
  stateSelect?.addEventListener("change", handleStateChange);
  districtSelect?.addEventListener("change", handleDistrictChange);

  // Plant Doctor controls
  doctorCropSelect?.addEventListener("change", executePlantDoctor);
  doctorPartSelect?.addEventListener("change", executePlantDoctor);
  doctorSearchInput?.addEventListener("input", (e) => {
    const match = checkContingencyCode(e.target.value);
    if (match) {
      activateContingencyProtocol(match, doctorSearchInput);
      return;
    }
    executePlantDoctor();
  });
  document.querySelectorAll(".quick-symptom-tag").forEach(tagBtn => {
    tagBtn.addEventListener("click", () => {
      const sym = tagBtn.getAttribute("data-symptom");
      if (doctorSearchInput) {
        doctorSearchInput.value = sym;
        executePlantDoctor();
      }
    });
  });
  doctorResetBtn?.addEventListener("click", resetPlantDoctor);

  // Mandi Prices controls
  mandiCommoditySelect?.addEventListener("change", executeMandiPrices);
  mandiStateFilter?.addEventListener("change", executeMandiPrices);
  mandiSearchInput?.addEventListener("input", (e) => {
    const match = checkContingencyCode(e.target.value);
    if (match) {
      activateContingencyProtocol(match, mandiSearchInput);
      return;
    }
    executeMandiPrices();
  });

  // Irrigation Scheduler controls
  calcIrrigationBtn?.addEventListener("click", executeIrrigationScheduler);

  // Organic Doctor controls
  calcOrganicBtn?.addEventListener("click", executeOrganicDoctor);

  // Yojana Hub controls
  calcYojanaBtn?.addEventListener("click", executeKisanYojana);
  kccLoanAmount?.addEventListener("input", calculateKccLoanEstimator);
  kccLoanTenure?.addEventListener("change", calculateKccLoanEstimator);
  kccPromptRepayCheck?.addEventListener("change", calculateKccLoanEstimator);
  schemeSearchInput?.addEventListener("input", (e) => {
    const match = checkContingencyCode(e.target.value);
    if (match) {
      activateContingencyProtocol(match, schemeSearchInput);
      return;
    }
    renderSchemesDirectory(e.target.value, activeSchemeCategory);
  });

  const schemeFilterBtns = document.querySelectorAll(".scheme-filter-btn");
  schemeFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      schemeFilterBtns.forEach(b => {
        b.classList.remove("active", "bg-amber-800", "text-white");
        b.classList.add("bg-slate-100", "text-slate-700");
      });
      btn.classList.add("active", "bg-amber-800", "text-white");
      btn.classList.remove("bg-slate-100", "text-slate-700");
      activeSchemeCategory = btn.getAttribute("data-category") || "All";
      renderSchemesDirectory(schemeSearchInput ? schemeSearchInput.value : "", activeSchemeCategory);
    });
  });


  // Kisan Khata controls
  khataType?.addEventListener("change", updateKhataCategoryOptions);
  khataForm?.addEventListener("submit", addKhataTransaction);
  clearKhataBtn?.addEventListener("click", clearKhataLedger);
  khataFilterCategory?.addEventListener("change", renderKhataLedger);
  exportKhataCsvBtn?.addEventListener("click", exportKhataToCSV);
  backupKhataJsonBtn?.addEventListener("click", backupKhataToJSON);
  restoreKhataBtn?.addEventListener("click", () => restoreKhataInput?.click());
  restoreKhataInput?.addEventListener("change", handleRestoreKhataFile);


  // Print report
  printReportBtn?.addEventListener("click", () => {
    const printDateEl = document.getElementById("printDateStamp");
    if (printDateEl) {
      printDateEl.textContent = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + " • Soil: " + soilTypeSelect.value + " • " + seasonSelect.value;
    }
    window.print();
  });

  // Input change updates
  modeSimpleBtn?.addEventListener("click", () => setMode("simple"));
  modeAdvancedBtn?.addEventListener("click", () => setMode("advanced"));
  soilTypeSelect?.addEventListener("change", updateSoilPresets);
  seasonSelect?.addEventListener("change", updateSeasonHint);
  waterSelect?.addEventListener("change", updateWaterHint);

  // Form submit
  recommendForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    executeRecommendation();
  });

  // Rotation trigger
  generateRotationBtn?.addEventListener("click", executeRotationPlan);

  // Fertilizer Doctor trigger
  calcFertilizerBtn?.addEventListener("click", executeFertilizerDoctor);

  // Search input with Contingency Protocol trigger
  cropSearchInput?.addEventListener("input", (e) => {
    const match = checkContingencyCode(e.target.value);
    if (match) {
      activateContingencyProtocol(match, cropSearchInput);
      return;
    }
    appState.searchQuery = e.target.value.trim().toLowerCase();
    filterAndRenderCrops();
  });

  // Category filter chips with clean border toggle
  categoryChips?.querySelectorAll(".cat-chip").forEach(chip => {
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
  clearCompareBtn?.addEventListener("click", clearComparison);
  openCompareModalBtn?.addEventListener("click", openComparisonModal);
  closeCompareModalBtn?.addEventListener("click", closeComparisonModal);
  compareModal?.addEventListener("click", (e) => {
    if (e.target === compareModal) closeComparisonModal();
  });

  // Escape key closes modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const contingencyModal = document.getElementById("contingencyModal");
      if (contingencyModal && !contingencyModal.classList.contains("hidden")) {
        closeContingencyProtocol();
      }
      if (compareModal && !compareModal.classList.contains("hidden")) {
        closeComparisonModal();
      }
      if (langModal && !langModal.classList.contains("hidden")) {
        langModal.classList.add("hidden");
        document.body.style.overflow = "";
      }
      if (landConverterModal && !landConverterModal.classList.contains("hidden")) {
        closeLandConverterModal();
      }
      if (fieldMeterModal && !fieldMeterModal.classList.contains("hidden")) {
        closeFieldMeterModal();
      }
      if (satelliteMapModal && !satelliteMapModal.classList.contains("hidden")) {
        closeSatelliteMapModal();
      }
      if (cropCalendarModal && !cropCalendarModal.classList.contains("hidden")) {
        closeCropCalendarModal();
      }
    }
  });
}

function switchTab(tab) {
  appState.activeTab = tab;
  const allTabs = [
    { id: "advisor", btn: tabAdvisorBtn, content: advisorTabContent },
    { id: "doctor", btn: tabDoctorBtn, content: doctorTabContent },
    { id: "mandi", btn: tabMandiBtn, content: mandiTabContent },
    { id: "irrigation", btn: tabIrrigationBtn, content: irrigationTabContent },
    { id: "organic", btn: tabOrganicBtn, content: organicTabContent },
    { id: "rotation", btn: tabRotationBtn, content: rotationTabContent },
    { id: "fertilizer", btn: tabFertilizerBtn, content: fertilizerTabContent },
    { id: "yojana", btn: tabYojanaBtn, content: yojanaTabContent },
    { id: "khata", btn: tabKhataBtn, content: khataTabContent },
    { id: "seed", btn: tabSeedBtn, content: seedTabContent },
    { id: "sprayer", btn: tabSprayerBtn, content: sprayerTabContent },
    { id: "solar", btn: tabSolarBtn, content: solarTabContent },
    { id: "intercrop", btn: tabIntercropBtn, content: intercropTabContent },
    { id: "storage", btn: tabStorageBtn, content: storageTabContent },
    { id: "livestock", btn: tabLivestockBtn, content: livestockTabContent }
  ];

  allTabs.forEach(t => {
    if (t.btn) {
      t.btn.classList.remove("active", "bg-brand-800", "text-white", "border-brand-800", "shadow-sm");
      t.btn.classList.add("text-slate-600", "hover:bg-slate-100", "border-transparent");
    }
    if (t.content) {
      t.content.classList.add("hidden");
    }
  });

  const selected = allTabs.find(t => t.id === tab);
  if (selected) {
    if (selected.btn) {
      selected.btn.classList.add("active", "bg-brand-800", "text-white", "border-brand-800", "shadow-sm");
      selected.btn.classList.remove("text-slate-600", "hover:bg-slate-100", "border-transparent");
      selected.btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    if (selected.content) {
      selected.content.classList.remove("hidden");
    }
  }

  // Auto-run initial computation if needed
  if (tab === "doctor" && doctorResultsGrid && !doctorResultsGrid.children.length) {
    executePlantDoctor();
  } else if (tab === "mandi" && mandiCardsContainer && !mandiCardsContainer.children.length) {
    executeMandiPrices();
  } else if (tab === "irrigation" && irrigationResultContainer && !irrigationResultContainer.children.length) {
    executeIrrigationScheduler();
  } else if (tab === "organic" && organicResultContainer && !organicResultContainer.children.length) {
    executeOrganicDoctor();
  } else if (tab === "rotation" && rotationPlansContainer && rotationPlansContainer.children.length === 0) {
    executeRotationPlan();
  } else if (tab === "fertilizer" && fertPrescriptionResult && fertPrescriptionResult.classList.contains("hidden")) {
    executeFertilizerDoctor();
  } else if (tab === "yojana" && yojanaResultContainer && !yojanaResultContainer.children.length) {
    executeKisanYojana();
  } else if (tab === "khata") {
    renderKhataLedger();
  } else if (tab === "seed" && seedResultContainer && !seedResultContainer.children.length) {
    executeSeedCalculation();
  } else if (tab === "sprayer" && sprayerResultContainer && !sprayerResultContainer.children.length) {
    executeSprayerCalculation();
  } else if (tab === "solar" && solarResultContainer && !solarResultContainer.children.length) {
    executeSolarCalculation();
  } else if (tab === "intercrop" && intercropGrid && !intercropGrid.children.length) {
    renderIntercroppingCatalog();
  } else if (tab === "storage" && storageRiskResultContainer && !storageRiskResultContainer.children.length) {
    executeStorageRiskCheck();
  } else if (tab === "livestock") {
    initLivestockTab();
  }
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  appState.currentLang = lang;
  localStorage.setItem("agriassist_lang", lang);

  const dict = TRANSLATIONS[lang];
  const langLabels = {
    en: "🇬🇧 EN",
    hi: "🇮🇳 हिन्दी",
    pa: "🇮🇳 ਪੰਜਾਬੀ",
    mr: "🇮🇳 मराठी",
    gu: "🇮🇳 ગુજરાતી"
  };
  if (langToggleText) {
    langToggleText.textContent = langLabels[lang] || dict.langSwitch || "Language";
  }

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Re-render top pick and crops with updated language
  if (appState.topPick) {
    renderTopPick(appState.topPick);
  }
  filterAndRenderCrops();

  // If Plant doctor, mandi, khata, or new tools are open, refresh them
  if (appState.activeTab === "doctor") executePlantDoctor();
  if (appState.activeTab === "mandi") executeMandiPrices();
  if (appState.activeTab === "khata") renderKhataLedger();
  if (appState.activeTab === "seed") executeSeedCalculation();
  if (appState.activeTab === "sprayer") executeSprayerCalculation();
  if (appState.activeTab === "solar") executeSolarCalculation();
  if (appState.activeTab === "intercrop") renderIntercroppingCatalog();
  if (appState.activeTab === "storage") {
    renderGrainStorageCatalog();
    executeStorageRiskCheck();
  }
  if (appState.activeTab === "livestock") {
    initLivestockTab();
  }
}

function toggleLanguage() {
  if (langModal) {
    langModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } else {
    const nextLang = appState.currentLang === "en" ? "hi" : "en";
    setLanguage(nextLang);
  }
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_gusts_10m&daily=precipitation_sum,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather service unreachable");
    const data = await res.json();

    const currentTemp = Math.round(data.current?.temperature_2m || 28);
    const humidity = Math.round(data.current?.relative_humidity_2m || 65);
    const weatherCode = data.current?.weather_code ?? 1;
    const windSpeed = Math.round(data.current?.wind_speed_10m ?? 12);
    const windGusts = Math.round(data.current?.wind_gusts_10m ?? (windSpeed * 1.3));
    const maxTemp = Math.round(data.daily?.temperature_2m_max?.[0] ?? currentTemp);
    const minTemp = Math.round(data.daily?.temperature_2m_min?.[0] ?? currentTemp);
    const rainForecast7Day = Math.round(
      (data.daily?.precipitation_sum || []).slice(0, 7).reduce((a, b) => a + b, 0)
    );
    const rainProb = Math.round(data.daily?.precipitation_probability_max?.[0] ?? (rainForecast7Day > 10 ? 60 : 10));

    appState.weatherData = {
      lat: lat,
      lon: lon,
      location: locationLabel,
      temp: currentTemp,
      humidity: humidity,
      rain7d: rainForecast7Day,
      rainForecast7Day: rainForecast7Day,
      windSpeed: windSpeed,
      windGusts: windGusts,
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

    const windEl = document.getElementById("weatherWindSpeed");
    if (windEl) windEl.textContent = `${windSpeed} km/h`;

    const readinessEl = document.getElementById("weatherSowingReadiness");
    if (readinessEl) {
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
    }

    // Spraying Feasibility Radar
    const sprayingBadge = document.getElementById("sprayingRadarBadge");
    const sprayingText = document.getElementById("sprayingRadarText");
    if (sprayingBadge && sprayingText) {
      if (windSpeed > 18 || rainProb > 40) {
        sprayingBadge.className = "bg-rose-900/90 text-rose-200 px-3 py-1 rounded-lg font-bold border border-rose-600 flex items-center gap-1.5";
        sprayingText.textContent = `⚠️ Spraying Unsafe: High Wind (${windSpeed} km/h) or Rain Risk (${rainProb}%)`;
      } else if (windSpeed >= 13) {
        sprayingBadge.className = "bg-amber-900/90 text-amber-200 px-3 py-1 rounded-lg font-bold border border-amber-600 flex items-center gap-1.5";
        sprayingText.textContent = `⚠️ Moderate Drift: Spray in early morning or late evening`;
      } else {
        sprayingBadge.className = "bg-emerald-900/90 text-emerald-200 px-3 py-1 rounded-lg font-bold border border-emerald-600 flex items-center gap-1.5";
        sprayingText.textContent = `🎯 Spraying Ideal: Calm wind (${windSpeed} km/h), rain risk low (${rainProb}%)`;
      }
    }

    // Extreme Weather Radar Alerts (Frost, Heatwave, Wind Gusts)
    const extremeAlerts = document.getElementById("extremeRadarAlerts");
    if (extremeAlerts) {
      const alerts = [];
      if (minTemp <= 4) {
        alerts.push(`<span class="bg-cyan-950/80 text-cyan-200 px-2.5 py-1 rounded-lg border border-cyan-500 text-[11px] font-bold">❄️ Frost Alert: ${minTemp}°C night temp expected. Irrigate or smoke fields.</span>`);
      }
      if (maxTemp >= 40) {
        alerts.push(`<span class="bg-orange-950/80 text-orange-200 px-2.5 py-1 rounded-lg border border-orange-500 text-[11px] font-bold">🔥 Heatwave (Loo): ${maxTemp}°C forecast. Apply light frequent irrigation.</span>`);
      }
      if (windGusts >= 38) {
        alerts.push(`<span class="bg-amber-950/80 text-amber-200 px-2.5 py-1 rounded-lg border border-amber-500 text-[11px] font-bold">🌪️ High Wind Gusts: ${windGusts} km/h. Lodging risk in tall crops.</span>`);
      }

      if (alerts.length > 0) {
        extremeAlerts.innerHTML = alerts.join(" ");
      } else {
        extremeAlerts.innerHTML = `<span class="text-emerald-300 text-[11px] font-medium">✓ No extreme frost/heatwave threats detected in 48h</span>`;
      }
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
    showToast("Audio readout is not supported on this browser.", "info");
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

  const currentLang = appState.currentLang || "en";
  const isIndianLang = ["hi", "mr", "pa", "gu"].includes(currentLang);
  let script = "";

  if (isIndianLang) {
    const cropTitle = crop.hindi_name ? crop.hindi_name : crop.name;
    const netProfit = crop.financials ? Math.round(crop.financials.profit_per_acre_inr).toLocaleString("en-IN") : "";
    const urea = crop.fertilizer_prescription ? crop.fertilizer_prescription.urea_bags_50kg : "";
    const dap = crop.fertilizer_prescription ? crop.fertilizer_prescription.dap_bags_50kg : "";

    script = `${cropTitle} की फसल। अनुकूलता स्कोर ${crop.suitability_score} प्रतिशत है। अनुमानित शुद्ध लाभ ${netProfit} रुपये प्रति एकड़। खाद की आवश्यकता: यूरिया ${urea} बोरी, डीएपी ${dap} बोरी। मुख्य बुवाई सलाह: ${crop.sowing_tips}।`;
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
  const langVoiceCodeMap = {
    hi: "hi-IN",
    pa: "pa-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    en: "en-IN"
  };
  utterance.lang = langVoiceCodeMap[currentLang] || "en-US";
  const voice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(currentLang)) ||
                voices.find(v => v.lang && v.lang.toLowerCase().startsWith("hi")) ||
                voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en"));
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
  const crop = appState.recommendations.find(c => c.crop_id === cropId) || (appState.topPick && appState.topPick.crop_id === cropId ? appState.topPick : null);
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
  const apiStatusDot = document.getElementById("apiStatusDot");
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    if (res.ok) {
      appState.apiOnline = true;
      apiStatusBadge.className = "flex items-center space-x-1.5 text-xs bg-emerald-900/90 px-3 py-1.5 rounded-full border border-emerald-600";
      if (apiStatusDot) apiStatusDot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
      apiStatusText.textContent = "Backend Online • FastAPI";
    } else {
      throw new Error("API not healthy");
    }
  } catch (err) {
    appState.apiOnline = false;
    apiStatusBadge.className = "flex items-center space-x-1.5 text-xs bg-amber-900/90 px-3 py-1.5 rounded-full border border-amber-600";
    if (apiStatusDot) apiStatusDot.className = "w-2 h-2 rounded-full bg-amber-400";
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
        <!-- Dynamic Crop Calendar Button -->
        <button type="button" class="open-calendar-btn bg-white hover:bg-emerald-100 text-emerald-800 p-2.5 rounded-xl border border-emerald-300 shadow-sm transition" data-crop-id="${top.crop_id}" title="View Dynamic Growth Calendar & Phone Reminders" aria-label="View Growth Calendar">
          📅
        </button>
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
        ${(TRANSLATIONS[appState.currentLang] || TRANSLATIONS.en).viewCompleteAdvice || "View Complete Agronomic Advice ▼"}
      </button>
    </div>
  `;

  // Attach voice, whatsapp, compare, and details listener to top pick
  topPickCard.querySelector(".open-calendar-btn")?.addEventListener("click", () => openCropCalendarModal(top.crop_id));
  topPickCard.querySelector(".voice-btn")?.addEventListener("click", () => speakCropAdvice(top.crop_id));
  topPickCard.querySelector(".whatsapp-btn")?.addEventListener("click", () => shareOnWhatsApp(top.crop_id));
  topPickCard.querySelector(".compare-checkbox")?.addEventListener("change", (e) => {
    toggleCropComparison(top.crop_id, e.target.checked);
  });
  topPickCard.querySelector(".top-pick-toggle-btn")?.addEventListener("click", (e) => {
    const details = topPickCard.querySelector(".top-pick-expanded-details");
    const isHidden = details.classList.contains("hidden");
    details.classList.toggle("hidden");
    const t = TRANSLATIONS[appState.currentLang] || TRANSLATIONS.en;
    e.target.textContent = isHidden ? (t.hideCompleteAdvice || "Hide Complete Advice ▲") : (t.viewCompleteAdvice || "View Complete Agronomic Advice ▼");
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
      const t = TRANSLATIONS[appState.currentLang] || TRANSLATIONS.en;
      btn.textContent = isHidden ? (t.hideAdvice || "Hide Agronomic Advice ▲") : (t.viewAdvice || "View Agronomic Advice ▼");
    });
  });

  cropsGrid.querySelectorAll(".open-calendar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cropId = btn.getAttribute("data-crop-id");
      openCropCalendarModal(cropId);
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
        <span>📅</span> 4-Stage Growth Timeline:
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
        ${growthStages.map(st => `
          <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
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
            <button type="button" class="open-calendar-btn bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 p-1.5 rounded-lg border border-slate-200 transition text-xs" data-crop-id="${crop.crop_id}" title="View Dynamic Growth Calendar" aria-label="View Growth Calendar">
              📅
            </button>
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
          ${(TRANSLATIONS[appState.currentLang] || TRANSLATIONS.en).viewAdvice || "View Agronomic Advice ▼"}
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

  // Determine crop display name from LOCAL_CROPS_DB or payload
  let cropDisplayName = "Selected Crop";
  const cropsDb = (typeof LOCAL_CROPS_DB !== "undefined" && LOCAL_CROPS_DB) || (typeof window !== "undefined" && window.LOCAL_CROPS_DB) || null;
  if (cropsDb && payload.crop_id) {
    const found = cropsDb.find(c => c.id === payload.crop_id);
    if (found) cropDisplayName = found.name;
  }
  if (cropDisplayName === "Selected Crop" && payload.crop_id) {
    cropDisplayName = payload.crop_id.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  }

  fertPrescriptionResult.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h4 class="font-bold text-slate-900 text-base flex items-center gap-2">
          <span>🩺</span> Agronomic Prescription for ${cropDisplayName} (${payload.land_size_acres} Acres)
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
      showToast("You can compare up to 3 crops at once.", "warning");
      document.querySelectorAll(`.compare-checkbox[data-crop-id="${cropId}"]`).forEach(cb => cb.checked = false);
      return;
    }
    if (!appState.selectedForComparison.some(c => c.crop_id === cropId)) {
      appState.selectedForComparison.push(crop);
    }
  } else {
    appState.selectedForComparison = appState.selectedForComparison.filter(c => c.crop_id !== cropId);
  }

  updateComparisonBar();
}

function updateComparisonBar() {
  const count = appState.selectedForComparison.length;
  compareCount.textContent = count;
  const resultsSection = document.getElementById("resultsSection");

  if (count > 0) {
    compareBar.classList.remove("hidden");
    if (resultsSection) {
      resultsSection.classList.add("pb-24");
    }
    compareBadges.innerHTML = appState.selectedForComparison.map(c => `
      <span class="bg-brand-100 text-brand-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-brand-300 flex items-center gap-1.5 shadow-sm">
        <span>${c.name}</span>
        <button type="button" class="remove-compare-badge text-brand-700 hover:text-rose-700 font-black text-sm leading-none ml-0.5 transition" data-crop-id="${c.crop_id}" title="Remove crop">&times;</button>
      </span>
    `).join("");

    compareBadges.querySelectorAll(".remove-compare-badge").forEach(btn => {
      btn.addEventListener("click", () => {
        const cropId = btn.dataset.cropId;
        appState.selectedForComparison = appState.selectedForComparison.filter(c => c.crop_id !== cropId);
        document.querySelectorAll(`.compare-checkbox[data-crop-id="${cropId}"]`).forEach(cb => cb.checked = false);
        updateComparisonBar();
      });
    });
  } else {
    compareBar.classList.add("hidden");
    if (resultsSection) {
      resultsSection.classList.remove("pb-24");
    }
  }
}

function clearComparison() {
  appState.selectedForComparison = [];
  document.querySelectorAll(".compare-checkbox").forEach(cb => cb.checked = false);
  updateComparisonBar();
}

function openComparisonModal() {
  if (appState.selectedForComparison.length < 2) {
    showToast("Please select at least 2 crops to compare side-by-side.", "warning");
    return;
  }

  document.body.style.overflow = "hidden";

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
          ${row("Cautions & Risks", c => `<span class="text-rose-700 font-medium">${(Array.isArray(c.warnings) ? c.warnings.join("; ") : c.warnings) || c.cautions || "Standard vigilance for localized pests."}</span>`)}
          ${row("Fertilizer Advice", c => c.fertilizer_advice)}
          ${row("Soil Considerations", c => c.soil_notes)}
        </tbody>
      </table>
    </div>
  `;

  compareModal.classList.remove("hidden");
}

function closeComparisonModal() {
  document.body.style.overflow = "";
  compareModal.classList.add("hidden");
}

// ----------------- AUDIO SPEECH SYNTHESIS -----------------

function speakDiagnosis(text, lang) {
  if (!("speechSynthesis" in window)) {
    showToast("Voice speech synthesis is not supported on your browser/device.", "info");
    return;
  }
  const current = lang || appState.currentLang || "hi";
  window.speechSynthesis.cancel(); // Stop any active utterance
  const utterance = new SpeechSynthesisUtterance(text);
  const langMap = {
    hi: "hi-IN",
    pa: "pa-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    en: "en-IN"
  };
  utterance.lang = langMap[current] || "hi-IN";
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(current)) ||
                voices.find(v => v.lang && v.lang.toLowerCase().startsWith("hi")) ||
                voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en"));
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}
window.speakDiagnosis = speakDiagnosis;

// ----------------- REGIONAL AGRO-CLIMATIC CALIBRATOR -----------------

function initDistrictSelector() {
  if (!stateSelect) return;
  const states = Object.keys(LOCAL_DISTRICTS_REGISTRY);
  stateSelect.innerHTML = `<option value="">-- Choose State / राज्य चुनें --</option>` +
    states.map(s => `<option value="${s}">${s}</option>`).join("");
}

function handleStateChange() {
  const state = stateSelect.value;
  if (!state || !LOCAL_DISTRICTS_REGISTRY[state]) {
    districtSelect.innerHTML = `<option value="">-- First choose state --</option>`;
    districtSelect.disabled = true;
    if (districtPresetStatus) districtPresetStatus.textContent = "Select state & district to auto-configure soil and climate";
    return;
  }

  const districts = LOCAL_DISTRICTS_REGISTRY[state];
  districtSelect.innerHTML = `<option value="">-- Choose District / जिला चुनें --</option>` +
    districts.map(d => `<option value="${d.district}">${d.district}</option>`).join("");
  districtSelect.disabled = false;
  if (districtPresetStatus) districtPresetStatus.textContent = `${districts.length} districts available in ${state}`;
}

function handleDistrictChange() {
  const state = stateSelect.value;
  const distName = districtSelect.value;
  if (!state || !distName || !LOCAL_DISTRICTS_REGISTRY[state]) return;

  const district = LOCAL_DISTRICTS_REGISTRY[state].find(d => d.district === distName);
  if (!district) return;

  // Auto-populate form
  if (soilTypeSelect) {
    soilTypeSelect.value = district.soil_type;
    updateSoilPresets();
  }
  if (advRain) advRain.value = district.annual_rainfall_mm;
  if (advTemp) advTemp.value = district.avg_temp_c;

  if (districtPresetStatus) {
    const crops = (district.priority_crops || []).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ");
    districtPresetStatus.innerHTML = `✅ Calibrated for <strong>${district.district}</strong>: ${district.soil_type} • ${district.annual_rainfall_mm}mm rain • Key: ${crops}`;
  }
}

// ----------------- KISAN PLANT DOCTOR & PEST DIAGNOSTIC -----------------

async function executePlantDoctor() {
  const crop = doctorCropSelect ? doctorCropSelect.value : "all";
  const part = doctorPartSelect ? doctorPartSelect.value : "all";
  const query = doctorSearchInput ? doctorSearchInput.value.trim().toLowerCase() : "";

  // Try API first
  if (appState.apiOnline) {
    try {
      const res = await fetch(`${API_BASE}/plant-doctor/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop_id: crop === "all" ? null : crop,
          plant_part: part === "all" ? null : part,
          affected_part: part === "all" ? null : part,
          search_term: query || null,
          symptom_query: query || null
        })
      });
      if (res.ok) {
        const data = await res.json();
        renderPlantDoctor(data.issues || []);
        return;
      }
    } catch (err) {
      console.warn("Plant Doctor API offline, switching to client DB:", err);
    }
  }

  // Offline filtering
  let issues = [...LOCAL_PESTS_DB];
  if (crop && crop !== "all") {
    issues = issues.filter(i => i.crop_id === crop);
  }
  if (part && part !== "all") {
    issues = issues.filter(i => (i.affected_parts || []).includes(part) || (i.affected_parts || []).includes("Whole Plant"));
  }
  if (query) {
    issues = issues.filter(i => {
      const nameMatch = (i.name || "").toLowerCase().includes(query) || (i.hindi_name || "").toLowerCase().includes(query);
      const symptomMatch = (i.symptoms || []).some(s => s.toLowerCase().includes(query));
      const controlMatch = (i.chemical_control || []).concat(i.biological_control || []).some(c => c.toLowerCase().includes(query));
      return nameMatch || symptomMatch || controlMatch;
    });
  }

  renderPlantDoctor(issues);
}

function resetPlantDoctor() {
  if (doctorCropSelect) doctorCropSelect.value = "all";
  if (doctorPartSelect) doctorPartSelect.value = "all";
  if (doctorSearchInput) doctorSearchInput.value = "";
  executePlantDoctor();
}

function renderPlantDoctor(issues) {
  if (!doctorResultsGrid) return;
  if (!issues || issues.length === 0) {
    doctorResultsGrid.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <div class="text-4xl mb-3">🔍</div>
        <h4 class="font-bold text-slate-800 text-base">No Matching Pest or Disease Found</h4>
        <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">Try clearing search terms or setting plant part to "All Parts" to see full diagnostics for this crop.</p>
      </div>
    `;
    return;
  }

  doctorResultsGrid.innerHTML = issues.map(item => {
    const sevColor = item.severity === "Critical" ? "bg-rose-100 text-rose-800 border-rose-300" :
                    (item.severity === "High" ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-100 text-emerald-800 border-emerald-300");
    const speechScript = `${item.name}. ${item.hindi_name || ""}. लक्षण: ${(item.symptoms || []).join(", ")}. जैविक उपचार: ${(item.biological_control || []).join(", ")}. रासायनिक दवा: ${item.chemical_dosage || ""}. फसल कटाई अंतराल: ${item.pre_harvest_interval_days} दिन.`;
    const escapedScript = encodeURIComponent(speechScript);

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between space-y-4">
        <div>
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold border ${sevColor}">
                  ● ${item.severity}
                </span>
                <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">${item.crop_name}</span>
                <span class="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">${item.type}</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 mt-1.5">${item.name}</h4>
              <p class="text-xs font-semibold text-rose-700">${item.hindi_name || ""}</p>
            </div>

            <!-- Audio Speak Button -->
            <button type="button" class="shrink-0 p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition" title="Listen to Audio Advisory (ऑडियो सलाह सुनें)" onclick="speakDiagnosis(decodeURIComponent('${escapedScript}'), '${appState.currentLang}')">
              🔊
            </button>
          </div>

          <!-- Symptoms -->
          <div class="mt-3">
            <span class="text-xs font-bold text-slate-700 block mb-1">🔍 Diagnostic Symptoms (लक्षण):</span>
            <ul class="text-xs text-slate-600 space-y-1 pl-4 list-disc">
              ${(item.symptoms || []).map(s => `<li>${s}</li>`).join("")}
            </ul>
          </div>

          <!-- Biological Control (IPM) -->
          <div class="mt-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
            <span class="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
              <span>🌿</span> Biological & Natural Control (जैविक उपचार):
            </span>
            <ul class="text-xs text-emerald-800 space-y-1 pl-4 list-disc">
              ${(item.biological_control || []).map(b => `<li>${b}</li>`).join("")}
            </ul>
          </div>

          <!-- Chemical Control & PHI -->
          <div class="mt-3.5 bg-rose-50/70 border border-rose-200 rounded-xl p-3">
            <span class="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-1">
              <span>🧪</span> Chemical Intervention (रासायनिक नियंत्रण):
            </span>
            <div class="text-xs text-rose-950 font-mono bg-white/80 p-2 rounded-lg border border-rose-200 mb-2">
              <strong>Dosage:</strong> ${item.chemical_dosage || (item.chemical_control || []).join(" OR ")}
            </div>
            <div class="flex items-center justify-between text-xs pt-1 border-t border-rose-200/60 text-rose-800">
              <span class="flex items-center gap-1 font-semibold">
                <span>⏱️ Pre-Harvest Interval (PHI):</span>
              </span>
              <span class="font-bold bg-rose-200 px-2 py-0.5 rounded-full text-rose-900">
                Wait ${item.pre_harvest_interval_days} Days before picking
              </span>
            </div>
          </div>
        </div>

        <!-- Prevention Footer -->
        <div class="pt-2 border-t border-slate-100 text-xs text-slate-500 italic">
          💡 Preventive advice: ${(item.prevention_tips || []).join(" • ")}
        </div>
      </div>
    `;
  }).join("");
}

// ----------------- MANDI MARKET PRICES & TRENDS -----------------

async function executeMandiPrices() {
  const crop = mandiCommoditySelect ? mandiCommoditySelect.value : "all";
  const state = mandiStateFilter ? mandiStateFilter.value : "all";
  const query = mandiSearchInput ? mandiSearchInput.value.trim().toLowerCase() : "";

  // Try API first
  if (appState.apiOnline) {
    try {
      const url = new URL(`${API_BASE}/mandi-prices`);
      if (crop !== "all") url.searchParams.append("crop_id", crop);
      if (state !== "all") url.searchParams.append("state", state);
      if (query) url.searchParams.append("query", query);

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        renderMandiPrices(data.prices || data.markets || []);
        return;
      }
    } catch (err) {
      console.warn("Mandi API offline, falling back to local DB:", err);
    }
  }

  // Offline filtering
  let prices = [...LOCAL_MANDI_DB];
  if (crop && crop !== "all") {
    prices = prices.filter(p => p.crop_id === crop);
  }
  if (state && state !== "all") {
    prices = prices.filter(p => p.state.toLowerCase() === state.toLowerCase());
  }
  if (query) {
    prices = prices.filter(p => {
      return (p.commodity || "").toLowerCase().includes(query) ||
             (p.market_apmc || "").toLowerCase().includes(query) ||
             (p.district || "").toLowerCase().includes(query) ||
             (p.crop_name || "").toLowerCase().includes(query);
    });
  }

  renderMandiPrices(prices);
}

function renderMandiPrices(prices) {
  if (!mandiCardsContainer) return;
  if (!prices || prices.length === 0) {
    mandiCardsContainer.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <div class="text-4xl mb-3">📉</div>
        <h4 class="font-bold text-slate-800 text-base">No Mandi Prices Matching Filter</h4>
        <p class="text-xs text-slate-500 mt-1">Try selecting "All Commodities" or "All States" to view current benchmarks.</p>
      </div>
    `;
    return;
  }

  mandiCardsContainer.innerHTML = prices.map(m => {
    const diffMsp = m.modal_price_per_quintal - m.msp_price;
    const mspBadge = diffMsp >= 0 ?
      `<span class="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-xs">+₹${Math.round(diffMsp)} above MSP</span>` :
      `<span class="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-bold text-xs">-₹${Math.abs(Math.round(diffMsp))} below MSP</span>`;

    // Generate mini SVG sparkline
    const hist = m.historical_30d || [];
    let sparklineSVG = "";
    if (hist.length >= 2) {
      const vals = hist.map(h => h.modal_price);
      const minV = Math.min(...vals);
      const maxV = Math.max(...vals);
      const range = (maxV - minV) || 1;
      const w = 240;
      const h = 40;
      const points = vals.map((v, idx) => {
        const x = (idx / (vals.length - 1)) * w;
        const y = h - ((v - minV) / range) * (h - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");

      sparklineSVG = `
        <div class="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div class="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-semibold">
            <span>30-Day APMC Price Trajectory</span>
            <span class="${m.trend.includes('Rising') ? 'text-emerald-600' : 'text-slate-600'}">● ${m.trend}</span>
          </div>
          <svg viewBox="0 0 ${w} ${h}" class="w-full h-10 overflow-visible">
            <polyline fill="none" stroke="${m.trend.includes('Rising') ? '#059669' : '#0284c7'}" stroke-width="2.5" points="${points}" />
            ${vals.map((v, idx) => {
              const x = (idx / (vals.length - 1)) * w;
              const y = h - ((v - minV) / range) * (h - 8) - 4;
              return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#ffffff" stroke="${m.trend.includes('Rising') ? '#059669' : '#0284c7'}" stroke-width="2" />`;
            }).join("")}
          </svg>
          <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>30d ago: ₹${vals[0]}</span>
            <span class="font-bold text-slate-700">Today: ₹${vals[vals.length - 1]}</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between space-y-4">
        <div>
          <!-- Header -->
          <div class="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">${m.state} • ${m.district}</span>
              <h4 class="font-black text-slate-900 text-base mt-1">${m.commodity}</h4>
              <p class="text-xs text-brand-700 font-semibold">${m.market_apmc}</p>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-500 block font-medium">Modal Price</span>
              <span class="text-xl font-black text-emerald-700">₹${Math.round(m.modal_price_per_quintal).toLocaleString("en-IN")}</span>
              <span class="text-[10px] text-slate-400 block font-mono">per Quintal (100 kg)</span>
            </div>
          </div>

          <!-- MSP Comparison -->
          <div class="flex items-center justify-between mt-3 text-xs">
            <span class="text-slate-600 font-medium">Govt MSP: <strong class="font-mono text-slate-900">₹${Math.round(m.msp_price).toLocaleString("en-IN")}</strong></span>
            ${mspBadge}
          </div>

          <!-- Price Range Bar -->
          <div class="mt-3 bg-slate-100 p-2.5 rounded-xl text-xs flex items-center justify-between font-mono">
            <span class="text-slate-600">Min: ₹${Math.round(m.min_price)}</span>
            <span class="text-slate-400">↔</span>
            <span class="text-slate-900 font-bold">Max: ₹${Math.round(m.max_price)}</span>
          </div>

          <!-- 30-day Trend Graph -->
          ${sparklineSVG}
        </div>

        <!-- Selling Advice Box -->
        <div class="pt-3 border-t border-slate-100">
          <div class="bg-brand-50/80 border border-brand-200 rounded-xl p-2.5 text-xs text-brand-900">
            <strong class="text-brand-800 flex items-center gap-1 mb-0.5">
              <span>💡</span> Mandi Selling Advisory:
            </strong>
            ${m.selling_advice}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ----------------- SMART IRRIGATION & WATER BUDGETING SCHEDULER -----------------

async function executeIrrigationScheduler() {
  const crop = irrigCropSelect ? irrigCropSelect.value : "wheat";
  const stage = irrigStageSelect ? irrigStageSelect.value : "CRI / Early Vegetative";
  const soil = irrigSoilSelect ? irrigSoilSelect.value : "Alluvial Soil";
  const landAcres = irrigLandInput ? parseFloat(irrigLandInput.value) || 2.0 : 2.0;
  const pumpHp = irrigPumpInput ? parseFloat(irrigPumpInput.value) || 5.0 : 5.0;

  // Try API first
  if (appState.apiOnline) {
    try {
      const res = await fetch(`${API_BASE}/irrigation-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop_id: crop,
          growth_stage: stage,
          soil_type: soil,
          land_size_acres: landAcres,
          pump_hp: pumpHp,
          pump_capacity_hp: pumpHp,
          forecast_rain_mm: (appState.weatherData && (appState.weatherData.rainForecast7Day || appState.weatherData.rain7d)) ? (appState.weatherData.rainForecast7Day || appState.weatherData.rain7d) : 0.0
        })
      });
      if (res.ok) {
        const data = await res.json();
        renderIrrigationResult(data);
        return;
      }
    } catch (err) {
      console.warn("Irrigation API offline, using client logic:", err);
    }
  }

  // Offline calculation
  const stageDepths = {
    "CRI / Early Vegetative": 45,
    "Branching / Tillering": 55,
    "Flowering / Tasseling": 65,
    "Grain / Pod / Tuber Filling": 60,
    "Maturity": 30
  };
  const soilFactors = {
    "Sandy Loam Soil": 0.85,
    "Alluvial Soil": 1.0,
    "Clay Loam Soil": 1.15,
    "Black Soil (Regur)": 1.25,
    "Red Soil": 0.95,
    "Laterite Soil": 0.90
  };

  const baseDepth = stageDepths[stage] || 50;
  const soilFactor = soilFactors[soil] || 1.0;
  const waterMm = Math.round(baseDepth * soilFactor);
  const volumeLiters = Math.round(waterMm * 4046.86 * landAcres);
  const pumpFlowPerHour = pumpHp * 6500; // ~6500 L/hr per HP delivery
  const pumpHours = Math.round((volumeLiters / pumpFlowPerHour) * 10) / 10;

  const rainUpcoming = appState.weatherData?.rainForecast7Day ?? appState.weatherData?.rain7d ?? 0;
  const postponeAlert = rainUpcoming >= 15 ?
    `⚠️ Heavy Rain Alert (${rainUpcoming} mm forecast in 7 days): Postpone surface irrigation by 4-6 days to avoid crop root rot and nitrogen leaching!` : null;

  const offlineData = {
    crop_name: crop.charAt(0).toUpperCase() + crop.slice(1),
    growth_stage: stage,
    water_depth_mm: waterMm,
    total_water_volume_liters: volumeLiters,
    pump_run_hours: pumpHours,
    interval_days: soil.includes("Black") ? "12-15 days" : (soil.includes("Sandy") ? "6-8 days" : "9-11 days"),
    weather_rain_forecast_mm: rainUpcoming,
    postpone_irrigation_alert: postponeAlert,
    water_saving_tips: [
      "Use Alternate Furrow Irrigation (AFI) to reduce water usage by 30-35% without yield loss.",
      "Apply irrigation in evening or early morning hours to minimize evaporative loss by up to 20%.",
      "Adopt straw or biological mulch to lock in soil moisture and suppress weed emergence."
    ]
  };

  renderIrrigationResult(offlineData);
}

function renderIrrigationResult(data) {
  if (!irrigationResultContainer) return;
  irrigationResultContainer.classList.remove("hidden");

  const rainUpcoming = data.weather_rain_forecast_mm ?? data.forecast_rain_mm ?? 0;
  const totalVolume = data.total_water_volume_liters ?? data.water_volume_liters ?? 0;
  const pumpRuntime = data.pump_run_hours ?? data.pump_runtime_hours ?? 0;
  const interval = data.interval_days ?? data.irrigation_interval_days ?? "7-10 days";

  const rainAlertHTML = data.postpone_irrigation_alert ? `
    <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
      <span class="text-2xl">🌧️</span>
      <div>
        <h4 class="font-bold text-amber-900 text-sm">Weather Postponement Recommendation</h4>
        <p class="text-xs text-amber-800 mt-0.5 leading-relaxed font-semibold">${data.postpone_irrigation_alert}</p>
      </div>
    </div>
  ` : `
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-center justify-between">
      <span>🌤️ 7-Day Rainfall Forecast: <strong>${rainUpcoming} mm</strong></span>
      <span class="font-semibold text-blue-700">No heavy rainfall expected. Proceed with scheduled irrigation.</span>
    </div>
  `;

  irrigationResultContainer.innerHTML = `
    ${rainAlertHTML}

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <span class="text-xs text-slate-500 font-semibold block">Water Depth Needed</span>
        <span class="text-2xl font-black text-blue-900 mt-1 block">${data.water_depth_mm} mm</span>
        <span class="text-[10px] text-slate-400">Per irrigation turn</span>
      </div>

      <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <span class="text-xs text-slate-500 font-semibold block">Total Water Volume</span>
        <span class="text-2xl font-black text-blue-700 mt-1 block">${(totalVolume).toLocaleString("en-IN")} L</span>
        <span class="text-[10px] text-slate-400">Total liters across holding</span>
      </div>

      <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <span class="text-xs text-slate-500 font-semibold block">Motor Pump Run Time</span>
        <span class="text-2xl font-black text-indigo-700 mt-1 block">${pumpRuntime} Hours</span>
        <span class="text-[10px] text-slate-400 font-mono">Electric/Diesel runtime</span>
      </div>

      <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <span class="text-xs text-slate-500 font-semibold block">Recommended Frequency</span>
        <span class="text-xl font-black text-emerald-800 mt-1 block">${interval}</span>
        <span class="text-[10px] text-slate-400">Interval between irrigations</span>
      </div>
    </div>

    <!-- Conservation Guidance -->
    <div class="bg-white border border-slate-200 rounded-xl p-4">
      <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <span>💧</span> Water Conservation & Soil Moisture Best Practices:
      </h4>
      <ul class="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
        ${(data.water_saving_tips || []).map(tip => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
  `;
}

// ----------------- ORGANIC & NATURAL FARMING DOCTOR -----------------

async function executeOrganicDoctor() {
  const crop = organicCropSelect ? organicCropSelect.value : "wheat";
  const land = organicLandInput ? parseFloat(organicLandInput.value) || 2.0 : 2.0;

  // Try API first
  if (appState.apiOnline) {
    try {
      const res = await fetch(`${API_BASE}/organic-prescription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop_id: crop,
          land_size_acres: land
        })
      });
      if (res.ok) {
        const data = await res.json();
        renderOrganicResult(data);
        return;
      }
    } catch (err) {
      console.warn("Organic API offline, calculating locally:", err);
    }
  }

  // Offline calculation
  const offlineData = {
    crop_name: crop.charAt(0).toUpperCase() + crop.slice(1),
    land_size_acres: land,
    jeevamrutha_liters: Math.round(200 * land),
    beejamrit_liters: Math.round(20 * land),
    ghanjeevamrit_kg: Math.round(200 * land),
    neemastra_liters: Math.round(100 * land),
    recipes: LOCAL_ORGANIC_RECIPES
  };

  renderOrganicResult(offlineData);
}

function renderOrganicResult(data) {
  if (!organicResultContainer) return;
  organicResultContainer.classList.remove("hidden");

  const jeeva = data.jeevamrutha_liters ?? data.total_jeevamrutha_liters ?? 0;
  const beeja = data.beejamrit_liters ?? data.beejamrit_kg ?? 0;
  const ghan = data.ghanjeevamrit_kg ?? data.ghanjeevamrit_liters ?? 0;
  const neem = data.neemastra_liters ?? 0;

  organicResultContainer.innerHTML = `
    <!-- Acreage Volume Badges -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
      <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
        <span class="text-emerald-700 block text-xs">Jeevamrutha (जीवामृत)</span>
        <span class="text-2xl font-black text-emerald-900 mt-1 block">${jeeva} Liters</span>
        <span class="text-[10px] text-emerald-600 font-normal">200 L/acre per 21 days</span>
      </div>

      <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl">
        <span class="text-amber-700 block text-xs">Beejamrit (बीजामृत)</span>
        <span class="text-2xl font-black text-amber-900 mt-1 block">${beeja} Liters</span>
        <span class="text-[10px] text-amber-600 font-normal">For seed coating & inoculation</span>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
        <span class="text-yellow-800 block text-xs">Ghanjeevamrit (घनजीवामृत)</span>
        <span class="text-2xl font-black text-yellow-900 mt-1 block">${ghan} kg</span>
        <span class="text-[10px] text-yellow-600 font-normal">Solid basal soil inoculant</span>
      </div>

      <div class="bg-teal-50 border border-teal-200 p-4 rounded-xl">
        <span class="text-teal-700 block text-xs">Neemastra (नीमास्त्र)</span>
        <span class="text-2xl font-black text-teal-900 mt-1 block">${neem} Liters</span>
        <span class="text-[10px] text-teal-600 font-normal">Biological pest repellent spray</span>
      </div>
    </div>

    <!-- Preparation Recipes Accordion -->
    <div class="space-y-4 pt-2">
      <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
        <span>📖</span> Step-by-Step Preparation Guides & Application Schedules:
      </h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${(data.recipes || []).map(r => `
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div class="border-b border-slate-100 pb-2">
              <h5 class="font-bold text-slate-900 text-base">${r.name}</h5>
              <p class="text-xs text-emerald-700 font-semibold">${r.hindi_name || ""}</p>
            </div>

            <div>
              <span class="text-xs font-bold text-slate-700 block mb-1">🧪 Standard Ingredients:</span>
              <ul class="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                ${(r.ingredients || []).map(ing => `<li>${ing}</li>`).join("")}
              </ul>
            </div>

            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span class="text-xs font-bold text-slate-700 block mb-1">⚙️ Preparation Method:</span>
              <ol class="text-xs text-slate-600 space-y-1 pl-4 list-decimal">
                ${(r.preparation_steps || []).map(step => `<li>${step}</li>`).join("")}
              </ol>
            </div>

            <div class="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
              <strong>🗓️ Application:</strong> ${r.application_method} (${r.dosage_per_acre})
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// ----------------- KISAN YOJANA HUB (GOVERNMENT SCHEMES) -----------------

async function executeKisanYojana() {
  const crop = yojanaCropSelect ? yojanaCropSelect.value : "wheat";
  const land = yojanaLandInput ? parseFloat(yojanaLandInput.value) || 2.0 : 2.0;
  const category = yojanaCategorySelect ? yojanaCategorySelect.value : "Small / Marginal (< 2 Ha)";

  // Try API first
  if (appState.apiOnline) {
    try {
      const res = await fetch(`${API_BASE}/government-schemes/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop_id: crop,
          land_size_acres: land,
          farmer_category: category
        })
      });
      if (res.ok) {
        const data = await res.json();
        renderYojanaResult(data);
        return;
      }
    } catch (err) {
      console.warn("Yojana API offline, calculating locally:", err);
    }
  }

  // Offline calculations
  const isKharif = ["rice", "cotton", "soybean", "maize"].includes(crop);
  const isComm = ["potato", "sugarcane", "cotton"].includes(crop);
  const premRate = isComm ? 0.05 : (isKharif ? 0.02 : 0.015);
  const sumInsuredPerAcre = isComm ? 65000 : (crop === "rice" ? 42000 : 38000);
  const totalSumInsured = Math.round(sumInsuredPerAcre * land);
  const farmerPrem = Math.round(totalSumInsured * premRate);
  const govtSub = Math.round(totalSumInsured * 0.10);

  const kccScale = isComm ? 55000 : (crop === "rice" ? 38000 : 34000);
  const cropComponent = Math.round(kccScale * land);
  const kccTotal = Math.round(cropComponent * 1.30); // 10% post-harvest + 20% maintenance

  const isSmall = category.includes("Small");
  const dripCost = Math.round(45000 * land);
  const dripSubsidyPct = isSmall ? 55 : 45;
  const dripSubsidyAmt = Math.round(dripCost * (dripSubsidyPct / 100));

  const offlineData = {
    crop_name: crop.charAt(0).toUpperCase() + crop.slice(1),
    land_size_acres: land,
    pmfby: {
      season_category: isComm ? "Commercial / Horticultural" : (isKharif ? "Kharif" : "Rabi"),
      sum_insured_inr: totalSumInsured,
      farmer_premium_rate_percent: premRate * 100,
      farmer_share_premium_inr: farmerPrem,
      govt_subsidy_share_inr: govtSub,
      official_portal: "https://pmfby.gov.in"
    },
    kcc: {
      scale_of_finance_per_acre_inr: kccScale,
      recommended_credit_limit_inr: kccTotal,
      interest_rate_percent: 7.0,
      prompt_repayment_incentive_percent: 3.0,
      effective_interest_rate_percent: 4.0,
      official_portal: "https://myscheme.gov.in"
    },
    pmksy_drip: {
      farmer_category: category,
      subsidy_percentage: dripSubsidyPct,
      approx_equipment_cost_inr: dripCost,
      eligible_subsidy_inr: dripSubsidyAmt,
      farmer_payable_inr: dripCost - dripSubsidyAmt
    },
    pm_kisan_annual_cash_inr: 6000
  };

  renderYojanaResult(offlineData);
}

function renderYojanaResult(data) {
  if (!yojanaResultContainer || !data) return;
  yojanaResultContainer.classList.remove("hidden");

  const pmfby = data.pmfby || {
    season_category: data.pmfby_season_category || "Seasonal",
    farmer_premium_rate_percent: data.pmfby_farmer_premium_rate_percent || 2.0,
    sum_insured_inr: data.pmfby_sum_insured_inr || data.sum_insured_inr || 0,
    farmer_share_premium_inr: data.pmfby_farmer_share_premium_inr || data.farmer_share_premium_inr || 0,
    govt_subsidy_share_inr: data.pmfby_govt_subsidy_share_inr || data.govt_subsidy_share_inr || 0
  };

  const kcc = data.kcc || {
    effective_interest_rate_percent: data.kcc_effective_interest_rate_percent || 4.0,
    scale_of_finance_per_acre_inr: data.kcc_scale_of_finance_per_acre_inr || data.scale_of_finance_per_acre_inr || 0,
    recommended_credit_limit_inr: data.kcc_recommended_credit_limit_inr || data.recommended_credit_limit_inr || 0
  };

  const pmksy = data.pmksy_drip || {
    subsidy_percentage: data.pmksy_subsidy_percentage || data.subsidy_percentage || 45,
    approx_equipment_cost_inr: data.pmksy_approx_equipment_cost_inr || data.approx_equipment_cost_inr || 0,
    eligible_subsidy_inr: data.pmksy_eligible_subsidy_inr || data.eligible_subsidy_inr || 0,
    farmer_payable_inr: data.pmksy_farmer_payable_inr || data.farmer_payable_inr || 0
  };

  const pmKisan = data.pm_kisan_annual_cash_inr || 6000;

  yojanaResultContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- 1. PMFBY Crop Insurance -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Crop Risk Protection</span>
            <h4 class="text-lg font-bold text-slate-900 mt-1">🌾 PM Fasal Bima Yojana (PMFBY)</h4>
            <p class="text-xs text-slate-500">${pmfby.season_category} Season Insurance</p>
          </div>
          <span class="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-1 rounded-lg">
            ${pmfby.farmer_premium_rate_percent}% Premium
          </span>
        </div>

        <div class="space-y-2 text-xs border-y border-slate-100 py-3">
          <div class="flex justify-between"><span class="text-slate-600">Total Sum Insured Coverage:</span> <strong class="font-mono text-slate-900">₹${(pmfby.sum_insured_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Farmer Payable Share:</span> <strong class="font-mono text-emerald-700 text-sm">₹${(pmfby.farmer_share_premium_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Govt Premium Subsidy:</span> <strong class="font-mono text-slate-700">₹${(pmfby.govt_subsidy_share_inr || 0).toLocaleString("en-IN")}</strong></div>
        </div>

        <a href="https://pmfby.gov.in" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline">
          <span>Apply on PMFBY Portal</span> <span>↗</span>
        </a>
      </div>

      <!-- 2. Kisan Credit Card (KCC) -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-700">Working Capital Credit</span>
            <h4 class="text-lg font-bold text-slate-900 mt-1">💳 Kisan Credit Card (KCC)</h4>
            <p class="text-xs text-slate-500">Subsidized Institutional Crop Loan</p>
          </div>
          <span class="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg">
            ${kcc.effective_interest_rate_percent}% Effective Interest
          </span>
        </div>

        <div class="space-y-2 text-xs border-y border-slate-100 py-3">
          <div class="flex justify-between"><span class="text-slate-600">Scale of Finance / Acre:</span> <strong class="font-mono text-slate-900">₹${(kcc.scale_of_finance_per_acre_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Max Sanction Limit (with 30% add-on):</span> <strong class="font-mono text-indigo-700 text-sm">₹${(kcc.recommended_credit_limit_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Interest Subvention:</span> <span class="text-slate-700">7% base - 3% prompt incentive = <strong>4% net</strong></span></div>
        </div>

        <span class="text-xs text-slate-500 block">Available at nearest Commercial, Regional Rural (RRB), or Cooperative Bank.</span>
      </div>

      <!-- 3. PMKSY Micro-Irrigation Drip Subsidy -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-700">Micro-Irrigation Subsidy</span>
            <h4 class="text-lg font-bold text-slate-900 mt-1">🚿 PM Krishi Sinchayee Yojana (PMKSY)</h4>
            <p class="text-xs text-slate-500">Per Drop More Crop Drip / Sprinkler Support</p>
          </div>
          <span class="bg-blue-100 text-blue-800 text-xs font-black px-2.5 py-1 rounded-lg">
            ${pmksy.subsidy_percentage}% Subsidy
          </span>
        </div>

        <div class="space-y-2 text-xs border-y border-slate-100 py-3">
          <div class="flex justify-between"><span class="text-slate-600">Est. Drip Installation Cost:</span> <strong class="font-mono text-slate-900">₹${(pmksy.approx_equipment_cost_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Eligible Govt Subsidy:</span> <strong class="font-mono text-emerald-700 text-sm">₹${(pmksy.eligible_subsidy_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Farmer Net Contribution:</span> <strong class="font-mono text-slate-700">₹${(pmksy.farmer_payable_inr || 0).toLocaleString("en-IN")}</strong></div>
        </div>

        <span class="text-xs text-slate-500 block">Apply via state horticulture department or e-Horticulture portal.</span>
      </div>

      <!-- 4. PM-KISAN Cash Support -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700">Direct Income Support</span>
            <h4 class="text-lg font-bold text-slate-900 mt-1">🏦 PM-KISAN Samman Nidhi</h4>
            <p class="text-xs text-slate-500">Direct Bank Transfer (DBT) to Landholding Farmers</p>
          </div>
          <span class="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg">
            ₹6,000 / Year
          </span>
        </div>

        <div class="space-y-2 text-xs border-y border-slate-100 py-3">
          <div class="flex justify-between"><span class="text-slate-600">Total Annual Assistance:</span> <strong class="font-mono text-emerald-700 text-base">₹${(pmKisan).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Installments:</span> <span class="text-slate-800 font-medium">3 equal tranches of <strong>₹2,000</strong> every 4 months</span></div>
          <div class="flex justify-between"><span class="text-slate-600">eKYC Requirement:</span> <span class="text-slate-800 font-semibold">Aadhaar seeded bank account mandatory</span></div>
        </div>

        <a href="https://pmkisan.gov.in" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline">
          <span>Check Beneficiary Status on PM-KISAN</span> <span>↗</span>
        </a>
      </div>

    </div>
  `;
}

// ----------------- KCC LOAN CALCULATOR & SCHEMES DIRECTORY -----------------

function calculateKccLoanEstimator() {
  if (!kccLoanAmount) return;
  const principal = parseFloat(kccLoanAmount.value) || 100000;
  const tenureMonths = parseInt(kccLoanTenure ? kccLoanTenure.value : "12") || 12;
  const isPrompt = kccPromptRepayCheck ? kccPromptRepayCheck.checked : true;

  if (kccLoanAmountDisplay) {
    kccLoanAmountDisplay.textContent = `₹${principal.toLocaleString("en-IN")}`;
  }

  const yearFraction = tenureMonths / 12.0;
  // Baseline 7% per annum
  const grossInterest = Math.round(principal * 0.07 * yearFraction);
  // Prompt Repayment Incentive (3% per annum subvention)
  const subventionSavings = isPrompt ? Math.round(principal * 0.03 * yearFraction) : 0;
  // Net Interest
  const netInterest = Math.max(0, grossInterest - subventionSavings);
  const totalPayable = principal + netInterest;

  if (kccGrossInterest) kccGrossInterest.textContent = `₹${grossInterest.toLocaleString("en-IN")}`;
  if (kccSubventionSavings) {
    kccSubventionSavings.textContent = isPrompt ? `-₹${subventionSavings.toLocaleString("en-IN")}` : "₹0 (Lost)";
    kccSubventionSavings.className = `text-base font-bold font-mono ${isPrompt ? 'text-emerald-700' : 'text-slate-400'}`;
  }
  if (kccNetInterest) {
    kccNetInterest.textContent = `₹${netInterest.toLocaleString("en-IN")}`;
    kccNetInterest.className = `text-base font-black font-mono ${isPrompt ? 'text-indigo-800' : 'text-rose-800'}`;
  }
  if (kccTotalPayable) kccTotalPayable.textContent = `₹${totalPayable.toLocaleString("en-IN")}`;
}

const SCHEMES_DIRECTORY = [
  {
    id: "pm_kisan",
    name: "PM-KISAN Samman Nidhi",
    category: "Direct Benefit",
    tag: "Central DBT",
    eligibility: "All landholding farmer families across India with cultivable landholdings.",
    benefits: "₹6,000 per year paid in 3 four-monthly installments of ₹2,000 directly via DBT into Aadhaar-linked accounts.",
    action_link: "https://pmkisan.gov.in"
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "Crop Insurance",
    tag: "Risk Coverage",
    eligibility: "All farmers growing notified food crops, oilseeds, and annual commercial/horticultural crops.",
    benefits: "Comprehensive crop insurance against drought, floods, pest epidemics, unseasonal rains. Farmer premium capped at 1.5% to 2.0%.",
    action_link: "https://pmfby.gov.in"
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC) Scheme",
    category: "Subsidized Credit",
    tag: "4% Net Interest",
    eligibility: "Owner cultivators, tenant farmers, oral lessees, and self-help groups (SHGs).",
    benefits: "Subsidized institutional crop loans at 7% p.a., reduced to effective 4% p.a. upon prompt repayment within 1 year.",
    action_link: "https://myscheme.gov.in"
  },
  {
    id: "pmksy_drip",
    name: "PMKSY - Per Drop More Crop (Micro-Irrigation)",
    category: "Irrigation Infrastructure",
    tag: "Water Saving",
    eligibility: "Farmers with assured irrigation source adopting drip or sprinkler irrigation.",
    benefits: "55% financial subsidy for small & marginal farmers and 45% for other farmers on micro-irrigation system cost.",
    action_link: "https://pmksy.gov.in"
  },
  {
    id: "pm_kusum",
    name: "PM-KUSUM Solar Agriculture Pumps",
    category: "Irrigation Infrastructure",
    tag: "Solar Energy",
    eligibility: "Individual farmers, water user associations, and farmer producer organizations (FPOs).",
    benefits: "Up to 60% capital subsidy for installing standalone solar agriculture pumps (3HP to 7.5HP) replacing diesel engines.",
    action_link: "https://pmkusum.mnre.gov.in"
  },
  {
    id: "smam",
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    category: "Farm Machinery",
    tag: "Mechanization",
    eligibility: "Individual farmers, SHGs, and cooperative Custom Hiring Centers (CHCs).",
    benefits: "40% to 50% capital subsidy on farm machinery: laser land levelers, happy seeders, rotavators, power tillers, and drone sprayers.",
    action_link: "https://agrimachinery.nic.in"
  },
  {
    id: "soil_health",
    name: "Soil Health Card (SHC) Scheme",
    category: "Direct Benefit",
    tag: "Soil Health",
    eligibility: "Every registered farmer across all states.",
    benefits: "Free periodic soil testing for 12 essential nutrients with crop-wise customized fertilizer dosage recommendations.",
    action_link: "https://soilhealth.dac.gov.in"
  },
  {
    id: "pkvy",
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    category: "Direct Benefit",
    tag: "Jaivik Kheti",
    eligibility: "Farmers practicing or transitioning to organic farming in clusters.",
    benefits: "₹50,000 per hectare financial assistance for organic inputs, PGS-India certification, packaging, and marketing.",
    action_link: "https://pgsindia-ncof.gov.in"
  }
];

function renderSchemesDirectory(searchTerm = "", categoryFilter = "All") {
  if (!schemesDirectoryGrid) return;

  const term = (searchTerm || "").toLowerCase().trim();
  const filtered = SCHEMES_DIRECTORY.filter(s => {
    const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;
    const matchesSearch = !term ||
      s.name.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.tag.toLowerCase().includes(term) ||
      s.eligibility.toLowerCase().includes(term) ||
      s.benefits.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    schemesDirectoryGrid.innerHTML = `
      <div class="col-span-1 md:col-span-2 p-8 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-200">
        No agricultural schemes matched your query. Try searching for "drip", "kcc", "solar", or "insurance".
      </div>
    `;
    return;
  }

  schemesDirectoryGrid.innerHTML = filtered.map(s => `
    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 hover:border-amber-400 transition">
      <div class="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800">${s.category}</span>
          <h4 class="font-bold text-slate-900 text-sm mt-0.5">${s.name}</h4>
        </div>
        <span class="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
          ${s.tag}
        </span>
      </div>

      <div class="space-y-2 text-xs">
        <div>
          <strong class="text-slate-700 block">👤 Who is Eligible:</strong>
          <p class="text-slate-600 leading-relaxed">${s.eligibility}</p>
        </div>
        <div>
          <strong class="text-slate-700 block">🎁 Entitlement & Benefits:</strong>
          <p class="text-slate-600 leading-relaxed">${s.benefits}</p>
        </div>
      </div>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span class="text-[10px] text-slate-400">Govt of India / MoA&FW</span>
        <a href="${s.action_link}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline">
          <span>Official Portal</span> <span>↗</span>
        </a>
      </div>
    </div>
  `).join("");
}

// ----------------- KISAN BAHI-KHATA (FARM LEDGER & EXPENSE TRACKER) -----------------


const KHATA_STORAGE_KEY = "agriassist_bahi_khata";

function initKisanKhata() {
  const existing = localStorage.getItem(KHATA_STORAGE_KEY);
  if (!existing) {
    const initial = [
      { id: "tx_1", date: new Date(Date.now() - 86400000 * 3).toISOString(), type: "Expense", category: "Seeds", amount: 1800, notes: "Wheat HD-2967 certified seed" },
      { id: "tx_2", date: new Date(Date.now() - 86400000 * 2).toISOString(), type: "Expense", category: "Fertilizer", amount: 2700, notes: "2 bags DAP + 1 bag Urea" }
    ];
    localStorage.setItem(KHATA_STORAGE_KEY, JSON.stringify(initial));
  }
}

const KHATA_EXPENSE_CATEGORIES = [
  { value: "Seeds", label: "Certified Seeds (बीज)" },
  { value: "Fertilizer", label: "Fertilizers / DAP / Urea (खाद)" },
  { value: "Pesticides", label: "Pesticides / Fungicides (कीटनाशक)" },
  { value: "Labor", label: "Farm Labor / Weeding (मजदूरी)" },
  { value: "Tillage", label: "Tractor / Plowing (जुताई / बुवाई)" },
  { value: "Irrigation", label: "Diesel / Electricity / Tube-well (सिंचाई)" },
  { value: "Machinery", label: "Machinery / Equipment (उपकरण)" },
  { value: "Other Expense", label: "Other Farm Expense (अन्य खर्च)" }
];

const KHATA_INCOME_CATEGORIES = [
  { value: "Crop Sale", label: "Crop Mandi Sale (फसल बिक्री)" },
  { value: "Subsidy", label: "Govt Subsidy / PM-KISAN (सब्सिडी)" },
  { value: "Dairy / Livestock", label: "Dairy / Livestock (पशुपालन / दुग्ध)" },
  { value: "Lease / Rent", label: "Land Lease / Custom Hiring (किराया)" },
  { value: "Other Income", label: "Other Farm Income (अन्य आय)" }
];

function updateKhataCategoryOptions() {
  if (!khataType || !khataCategory) return;
  const isIncome = khataType.value === "Income";
  const list = isIncome ? KHATA_INCOME_CATEGORIES : KHATA_EXPENSE_CATEGORIES;
  khataCategory.innerHTML = list.map(c => `<option value="${c.value}">${c.label}</option>`).join("");
}
window.updateKhataCategoryOptions = updateKhataCategoryOptions;

function getKhataEntries() {
  try {
    const raw = localStorage.getItem(KHATA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveKhataEntries(entries) {
  localStorage.setItem(KHATA_STORAGE_KEY, JSON.stringify(entries));
}

function addKhataTransaction(e) {
  e.preventDefault();
  const type = khataType ? khataType.value : "Expense";
  const cat = khataCategory ? khataCategory.value : "Seeds";
  const amt = khataAmount ? parseFloat(khataAmount.value) : 0;
  const notes = khataNotes ? khataNotes.value.trim() : "";

  if (isNaN(amt) || amt <= 0) {
    showToast("Please enter a valid amount greater than zero.", "warning");
    return;
  }

  const entries = getKhataEntries();
  const newTx = {
    id: "tx_" + Date.now(),
    date: new Date().toISOString(),
    type: type,
    category: cat,
    amount: amt,
    notes: notes || "-"
  };

  entries.unshift(newTx);
  saveKhataEntries(entries);

  // Reset inputs
  if (khataAmount) khataAmount.value = "";
  if (khataNotes) khataNotes.value = "";

  renderKhataLedger();
  showToast("✓ Record added to farm ledger", "success");
}

function deleteKhataTransaction(id) {
  if (!confirm("Are you sure you want to delete this farm record?")) return;
  const entries = getKhataEntries().filter(t => t.id !== id);
  saveKhataEntries(entries);
  renderKhataLedger();
  showToast("Record deleted from farm ledger", "info");
}
window.deleteKhataTransaction = deleteKhataTransaction;

function clearKhataLedger() {
  if (confirm("Are you sure you want to delete all entries from your farm ledger? This cannot be undone.")) {
    localStorage.removeItem(KHATA_STORAGE_KEY);
    renderKhataLedger();
    showToast("Farm ledger cleared", "info");
  }
}

function exportKhataToCSV() {
  const entries = getKhataEntries();
  if (entries.length === 0) {
    showToast("No ledger entries to export.", "warning");
    return;
  }
  const headers = ["ID", "Date", "Type", "Category", "Amount_INR", "Notes"];
  const rows = entries.map(t => [
    t.id,
    new Date(t.date).toISOString().split("T")[0],
    t.type,
    `"${(t.category || "").replace(/"/g, '""')}"`,
    t.amount,
    `"${(t.notes || "").replace(/"/g, '""')}"`
  ]);
  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `AgriAssist_Kisan_Bahi_Khata_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("✓ Farm ledger exported to CSV", "success");
}

function backupKhataToJSON() {
  const entries = getKhataEntries();
  if (entries.length === 0) {
    showToast("No ledger entries to backup.", "warning");
    return;
  }
  const backupData = {
    appName: "AgriAssist",
    module: "Kisan Bahi-Khata",
    exportDate: new Date().toISOString(),
    version: "1.0",
    recordCount: entries.length,
    entries: entries
  };
  const jsonContent = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `AgriAssist_BahiKhata_Backup_${today}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("✓ Farm ledger backup saved", "success");
}

function handleRestoreKhataFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      let newEntries = [];
      if (Array.isArray(parsed)) {
        newEntries = parsed;
      } else if (parsed && Array.isArray(parsed.entries)) {
        newEntries = parsed.entries;
      } else {
        throw new Error("Invalid ledger backup file structure.");
      }

      if (newEntries.length === 0) {
        showToast("Backup file contained 0 entries.", "warning");
        return;
      }

      const merge = confirm(`Found ${newEntries.length} records in backup.\n\nClick 'OK' to MERGE with existing records, or 'Cancel' to REPLACE all current records.`);
      const current = getKhataEntries();
      let finalEntries;
      if (merge) {
        const existingIds = new Set(current.map(c => c.id));
        const nonDuplicates = newEntries.filter(n => !existingIds.has(n.id));
        finalEntries = [...nonDuplicates, ...current];
      } else {
        finalEntries = newEntries;
      }

      saveKhataEntries(finalEntries);
      renderKhataLedger();
      showToast(`✓ Successfully restored ${finalEntries.length} farm records!`, "success");
    } catch (err) {
      showToast("Error restoring backup: " + err.message, "error");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function renderKhataLedger() {
  const entries = getKhataEntries();
  let totalExpense = 0;
  let totalRevenue = 0;

  entries.forEach(t => {
    if (t.type === "Expense") {
      totalExpense += t.amount;
    } else {
      totalRevenue += t.amount;
    }
  });

  const net = totalRevenue - totalExpense;

  if (khataTotalExpense) khataTotalExpense.textContent = `₹${totalExpense.toLocaleString("en-IN")}`;
  if (khataTotalRevenue) khataTotalRevenue.textContent = `₹${totalRevenue.toLocaleString("en-IN")}`;
  if (khataNetBalance) {
    khataNetBalance.textContent = `₹${net.toLocaleString("en-IN")}`;
    khataNetBalance.className = `text-2xl font-black mt-1 ${net >= 0 ? 'text-emerald-800' : 'text-rose-800'}`;
  }
  if (khataEntryCount) {
    khataEntryCount.textContent = `${entries.length} record${entries.length === 1 ? '' : 's'}`;
  }

  // Render Category Spending Breakdown Chips
  if (khataCategoryBreakdown) {
    const catExpenses = {};
    entries.forEach(t => {
      if (t.type === "Expense") {
        catExpenses[t.category] = (catExpenses[t.category] || 0) + t.amount;
      }
    });

    const catKeys = Object.keys(catExpenses);
    if (catKeys.length === 0) {
      khataCategoryBreakdown.innerHTML = `<span class="text-slate-400 italic">No farm expenses recorded yet.</span>`;
    } else {
      khataCategoryBreakdown.innerHTML = catKeys.map(cat => {
        const val = catExpenses[cat];
        const pct = totalExpense > 0 ? Math.round((val / totalExpense) * 100) : 0;
        return `
          <div class="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
            <span class="font-bold text-slate-700">${cat}:</span>
            <span class="font-black text-rose-700 font-mono">₹${val.toLocaleString("en-IN")}</span>
            <span class="text-[10px] text-slate-400">(${pct}%)</span>
          </div>
        `;
      }).join("");
    }
  }

  if (!khataTableBody) return;
  if (entries.length === 0) {
    khataTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-slate-400 italic">
          No records yet. Add an expense or income entry above to start your farm ledger.
        </td>
      </tr>
    `;
    return;
  }

  // Filter entries if category filter selected
  const selectedFilter = khataFilterCategory ? khataFilterCategory.value : "All";
  const displayedEntries = selectedFilter === "All"
    ? entries
    : entries.filter(t => t.category === selectedFilter);

  if (displayedEntries.length === 0) {
    khataTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-slate-400 italic">
          No records found under category "${selectedFilter}".
        </td>
      </tr>
    `;
    return;
  }

  khataTableBody.innerHTML = displayedEntries.map(t => {
    const formattedDate = new Date(t.date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
    const typeBadge = t.type === "Expense" ?
      `<span class="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold text-[10px]">🔴 Expense</span>` :
      `<span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">🟢 Income</span>`;
    const amtColor = t.type === "Expense" ? "text-rose-700" : "text-emerald-700";

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="p-3 text-slate-600 whitespace-nowrap font-mono">${formattedDate}</td>
        <td class="p-3">${typeBadge}</td>
        <td class="p-3 font-semibold text-slate-800">${t.category}</td>
        <td class="p-3 text-slate-600 max-w-xs truncate">${t.notes}</td>
        <td class="p-3 text-right font-black font-mono ${amtColor}">₹${t.amount.toLocaleString("en-IN")}</td>
        <td class="p-3 text-center">
          <button type="button" class="text-rose-500 hover:text-rose-700 font-bold text-xs p-1" onclick="deleteKhataTransaction('${t.id}')" title="Delete entry">
            ✕
          </button>
        </td>
      </tr>
    `;
  }).join("");
}


// ============================================================================
// 1. REGIONAL LAND UNIT CONVERTER (क्षेत्रीय भूमि मापक)
// ============================================================================

const STATE_BIGHA_ACRE_FACTORS = {
  // Region slugs matching converterStateSelect option values
  "up_bihar": 0.625,        // Pucca Bigha (27,225 sq ft)
  "up_kaccha": 0.2083,      // Western UP Kaccha Bigha (9,075 sq ft / 3 Kaccha = 1 Pucca)
  "maharashtra": 0.625,
  "punjab_haryana": 0.2066,  // 5 Bighas = 1 Killa / Acre approx
  "rajasthan": 0.625,        // Pucca Bigha
  "gujarat": 0.574,          // Vigha (25,000 sq ft approx)
  "bengal": 0.3306,         // 14,400 sq ft (3 Bighas = ~1 Acre)
  "south_india": 0.625,
  // State name fallbacks matching stateSelect option values
  "Uttar Pradesh": 0.625,
  "Bihar": 0.625,
  "Punjab": 0.2066,
  "Haryana": 0.2066,
  "Rajasthan": 0.625,
  "Gujarat": 0.574,
  "West Bengal": 0.3306,
  "Madhya Pradesh": 0.5,
  "Maharashtra": 0.625,
  "Tamil Nadu": 0.625,
  "Karnataka": 0.625,
  "Andhra Pradesh": 0.625,
  "Telangana": 0.625,
  "Odisha": 0.625,
  "Assam": 0.3306
};

const STATE_TO_REGION_SLUG = {
  "Uttar Pradesh": "up_bihar",
  "Bihar": "up_bihar",
  "Punjab": "punjab_haryana",
  "Haryana": "punjab_haryana",
  "Rajasthan": "rajasthan",
  "Gujarat": "gujarat",
  "West Bengal": "bengal",
  "Assam": "bengal",
  "Maharashtra": "maharashtra",
  "Madhya Pradesh": "up_bihar",
  "Tamil Nadu": "south_india",
  "Kerala": "south_india",
  "Karnataka": "south_india",
  "Andhra Pradesh": "south_india",
  "Telangana": "south_india"
};

const REGION_DISPLAY_NAMES = {
  "up_bihar": "Uttar Pradesh & Bihar",
  "up_kaccha": "Western UP (Kaccha)",
  "maharashtra": "Maharashtra",
  "punjab_haryana": "Punjab & Haryana",
  "rajasthan": "Rajasthan",
  "gujarat": "Gujarat",
  "bengal": "West Bengal",
  "south_india": "South India"
};

let currentCalculatedAcres = 1.0;

function initLandConverter() {
  if (converterStateSelect && stateSelect) {
    const selectedState = stateSelect.value || "Uttar Pradesh";
    converterStateSelect.value = STATE_TO_REGION_SLUG[selectedState] || "up_bihar";
  }
}

function recalculateLandConverter() {
  const val = parseFloat(converterInputValue?.value) || 0;
  const unit = converterUnitSelect?.value || "acre";
  const state = converterStateSelect?.value || "up_bihar";
  const bighaFactor = STATE_BIGHA_ACRE_FACTORS[state] || 0.625;

  // Convert input unit to normalized Acres
  let acres = 0;
  switch (unit) {
    case "acre":
      acres = val;
      break;
    case "hectare":
      acres = val * 2.47105;
      break;
    case "guntha":
      acres = val / 40.0;
      break;
    case "bigha":
      acres = val * bighaFactor;
      break;
    case "biswa":
      acres = (val * (bighaFactor / 20.0));
      break;
    case "kattha":
      acres = (val * (bighaFactor / 20.0));
      break;
    case "kanal":
      acres = val * 0.125;
      break;
    case "marla":
      acres = val * 0.00625;
      break;
    case "cent":
      acres = val * 0.01;
      break;
    case "ground":
      acres = val * (2400.0 / 43560.0);
      break;
    case "sq_feet":
      acres = val / 43560.0;
      break;
    case "sq_meter":
    case "sq_meters":
      acres = val / 4046.86;
      break;
    default:
      acres = val;
  }

  currentCalculatedAcres = acres;

  // Update all UI cells
  const convResAcre = document.getElementById("convResAcre");
  const convResHectare = document.getElementById("convResHectare");
  const convResGuntha = document.getElementById("convResGuntha");
  const convResBigha = document.getElementById("convResBigha");
  const convResKanal = document.getElementById("convResKanal");
  const convResMarla = document.getElementById("convResMarla");
  const convResSqFt = document.getElementById("convResSqFt");
  const convResSqM = document.getElementById("convResSqM");
  const formulaHint = document.getElementById("converterFormulaHint");

  if (convResAcre) convResAcre.textContent = acres.toFixed(3);
  if (convResHectare) convResHectare.textContent = (acres / 2.47105).toFixed(3);
  if (convResGuntha) convResGuntha.textContent = (acres * 40.0).toFixed(2);
  if (convResBigha) convResBigha.textContent = (acres / bighaFactor).toFixed(3);
  if (convResKanal) convResKanal.textContent = (acres * 8.0).toFixed(2);
  if (convResMarla) convResMarla.textContent = (acres * 160.0).toFixed(1);
  if (convResSqFt) convResSqFt.textContent = Math.round(acres * 43560.0).toLocaleString("en-IN");
  if (convResSqM) convResSqM.textContent = Math.round(acres * 4046.86).toLocaleString("en-IN");

  if (formulaHint) {
    const regionName = REGION_DISPLAY_NAMES[state] || state;
    formulaHint.textContent = `In ${regionName}: 1 Bigha = ${(bighaFactor).toFixed(3)} Acre (1 Acre = ${(1 / bighaFactor).toFixed(2)} Bigha) • 1 Guntha = 1,089 sq ft`;
  }
}

function openLandConverterModal() {
  document.body.style.overflow = "hidden";
  landConverterModal?.classList.remove("hidden");
  recalculateLandConverter();
}

function closeLandConverterModal() {
  document.body.style.overflow = "";
  landConverterModal?.classList.add("hidden");
}

function applyConvertedAcresToForms() {
  const acresVal = parseFloat(currentCalculatedAcres.toFixed(2));
  if (acresVal <= 0) {
    showToast("Please enter a valid land measurement greater than 0.", "error");
    return;
  }

  // Update AgriAssist form inputs across all modules
  const mainLand = document.getElementById("landSizeInput");
  if (mainLand) {
    mainLand.value = acresVal;
    appState.landSize = acresVal;
  }
  if (seedLandAcres) seedLandAcres.value = acresVal;
  if (sprayLandAcres) sprayLandAcres.value = acresVal;
  if (solarLandAcres) solarLandAcres.value = acresVal;
  const irrigLand = document.getElementById("irrigLandInput");
  if (irrigLand) irrigLand.value = acresVal;
  const fertLand = document.getElementById("fertLandAcres");
  if (fertLand) fertLand.value = acresVal;
  const rotLand = document.getElementById("rotLandInput");
  if (rotLand) rotLand.value = acresVal;
  const organicLand = document.getElementById("organicLandInput");
  if (organicLand) organicLand.value = acresVal;
  const yojanaLand = document.getElementById("yojanaLandInput");
  if (yojanaLand) yojanaLand.value = acresVal;

  closeLandConverterModal();
  showToast(`✓ Applied ${acresVal} Acres across all AgriAssist calculation modules!`, "success");
}


// ============================================================================
// 2. OFFLINE GPS FIELD PERIMETER & WALK-METER (खेत जीपीएस मापक)
// ============================================================================

const fieldWalkState = {
  watching: false,
  watchId: null,
  points: [],
  lastGps: null,
  calculatedAreaSqM: 0,
  calculatedAcres: 0,
  calculatedPerimeterM: 0
};

function openFieldMeterModal() {
  document.body.style.overflow = "hidden";
  fieldMeterModal?.classList.remove("hidden");
  setTimeout(drawFieldPolygon, 100);
}

function closeFieldMeterModal() {
  document.body.style.overflow = "";
  fieldMeterModal?.classList.add("hidden");
}

function startFieldWalking() {
  if (!("geolocation" in navigator)) {
    showToast("GPS Geolocation is not supported by your browser or device.", "error");
    return;
  }

  if (fieldWalkState.watching) return;

  fieldWalkState.watching = true;
  fieldWalkState.points = [];
  gpsStartBtn.disabled = true;
  gpsStartBtn.classList.add("opacity-50");
  gpsAddPointBtn.disabled = false;
  gpsFinishBtn.disabled = false;

  if (gpsStatusDot) {
    gpsStatusDot.className = "w-3 h-3 rounded-full bg-amber-500 animate-ping";
  }
  if (gpsStatusText) {
    gpsStatusText.textContent = "Acquiring GPS Satellite Lock...";
  }

  fieldWalkState.watchId = navigator.geolocation.watchPosition(
    onGpsLocationSuccess,
    onGpsLocationError,
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
  );
}

function onGpsLocationSuccess(pos) {
  const { latitude, longitude, accuracy } = pos.coords;
  fieldWalkState.lastGps = { lat: latitude, lng: longitude, acc: accuracy };

  if (gpsStatusDot) {
    gpsStatusDot.className = "w-3 h-3 rounded-full bg-emerald-500";
  }
  if (gpsStatusText) {
    gpsStatusText.textContent = `GPS Active • Walk along your field edge`;
  }
  if (gpsAccuracyText) {
    gpsAccuracyText.textContent = `Accuracy: ±${Math.round(accuracy)} m`;
  }

  // Auto-record first point or if moved > 5 meters
  if (fieldWalkState.points.length === 0) {
    recordFieldPoint();
  } else {
    const lastPt = fieldWalkState.points[fieldWalkState.points.length - 1];
    const dist = calculateGpsDistanceMeters(lastPt.lat, lastPt.lng, latitude, longitude);
    if (dist >= 4.0) {
      recordFieldPoint();
    }
  }
}

function onGpsLocationError(err) {
  console.warn("GPS Location error:", err);
  if (gpsStatusText) {
    gpsStatusText.textContent = `GPS Error: ${err.message || "Cannot acquire signal"}`;
  }
  if (gpsStatusDot) {
    gpsStatusDot.className = "w-3 h-3 rounded-full bg-rose-500";
  }
}

function calculateGpsDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function recordFieldPoint() {
  if (!fieldWalkState.lastGps) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fieldWalkState.lastGps = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          acc: pos.coords.accuracy
        };
        recordFieldPoint();
      },
      (err) => showToast("Could not fetch GPS fix. Please ensure location is enabled.", "error")
    );
    return;
  }

  fieldWalkState.points.push({
    lat: fieldWalkState.lastGps.lat,
    lng: fieldWalkState.lastGps.lng
  });

  if (canvasPointsCount) {
    canvasPointsCount.textContent = `Points logged: ${fieldWalkState.points.length}`;
  }

  computeFieldGeometry();
  drawFieldPolygon();
}

function finishFieldWalking() {
  if (fieldWalkState.watchId !== null) {
    navigator.geolocation.clearWatch(fieldWalkState.watchId);
    fieldWalkState.watchId = null;
  }
  fieldWalkState.watching = false;

  gpsStartBtn.disabled = false;
  gpsStartBtn.classList.remove("opacity-50");
  gpsAddPointBtn.disabled = true;
  gpsFinishBtn.disabled = true;

  if (gpsStatusDot) {
    gpsStatusDot.className = "w-3 h-3 rounded-full bg-brand-600";
  }
  if (gpsStatusText) {
    gpsStatusText.textContent = `Survey Finished • ${fieldWalkState.points.length} boundary stakes surveyed`;
  }

  computeFieldGeometry();
  drawFieldPolygon();
}

function resetFieldMeter() {
  if (fieldWalkState.watchId !== null) {
    navigator.geolocation.clearWatch(fieldWalkState.watchId);
    fieldWalkState.watchId = null;
  }
  fieldWalkState.watching = false;
  fieldWalkState.points = [];
  fieldWalkState.lastGps = null;
  fieldWalkState.calculatedAreaSqM = 0;
  fieldWalkState.calculatedAcres = 0;
  fieldWalkState.calculatedPerimeterM = 0;

  gpsStartBtn.disabled = false;
  gpsStartBtn.classList.remove("opacity-50");
  gpsAddPointBtn.disabled = true;
  gpsFinishBtn.disabled = true;

  if (gpsStatusDot) gpsStatusDot.className = "w-3 h-3 rounded-full bg-emerald-500 animate-pulse";
  if (gpsStatusText) gpsStatusText.textContent = "GPS Idle • Ready to Walk Boundary";
  if (gpsAccuracyText) gpsAccuracyText.textContent = "Accuracy: --";
  if (canvasPointsCount) canvasPointsCount.textContent = "Points logged: 0";

  updateFieldMeterStats(0, 0, 0);
  drawFieldPolygon();
}

function computeFieldGeometry() {
  const pts = fieldWalkState.points;
  if (pts.length < 3) {
    let perim = 0;
    if (pts.length === 2) {
      perim = calculateGpsDistanceMeters(pts[0].lat, pts[0].lng, pts[1].lat, pts[1].lng);
    }
    updateFieldMeterStats(0, 0, perim);
    return;
  }

  // Equirectangular local Cartesian projection
  const lat0 = pts[0].lat;
  const lon0 = pts[0].lng;
  const R = 6378137.0; // Earth radius in meters
  const cosLat0 = Math.cos((lat0 * Math.PI) / 180.0);

  const xy = pts.map(p => {
    const x = ((p.lng - lon0) * Math.PI / 180.0) * R * cosLat0;
    const y = ((p.lat - lat0) * Math.PI / 180.0) * R;
    return { x, y };
  });

  // Shoelace formula for polygon area
  let areaSum = 0;
  let perimSum = 0;
  const n = xy.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    areaSum += (xy[i].x * xy[j].y) - (xy[j].x * xy[i].y);
    const dx = xy[j].x - xy[i].x;
    const dy = xy[j].y - xy[i].y;
    perimSum += Math.sqrt(dx * dx + dy * dy);
  }

  const areaSqM = Math.abs(areaSum) * 0.5;
  const acres = areaSqM / 4046.86;

  fieldWalkState.calculatedAreaSqM = areaSqM;
  fieldWalkState.calculatedAcres = acres;
  fieldWalkState.calculatedPerimeterM = perimSum;

  updateFieldMeterStats(acres, areaSqM, perimSum);
}

function updateFieldMeterStats(acres, areaSqM, perimM) {
  if (walkCalculatedAcres) walkCalculatedAcres.textContent = acres.toFixed(2);
  if (walkCalculatedGuntha) walkCalculatedGuntha.textContent = (acres * 40.0).toFixed(1);
  if (walkCalculatedBigha) walkCalculatedBigha.textContent = (acres / 0.625).toFixed(2);
  if (walkCalculatedPerimeter) walkCalculatedPerimeter.textContent = `${Math.round(perimM)} m`;
}

function calculateManualFieldArea() {
  const lenFt = parseFloat(manualFieldLength?.value) || 0;
  const widFt = parseFloat(manualFieldWidth?.value) || 0;

  if (lenFt <= 0 || widFt <= 0) {
    showToast("Please enter both length and width in feet.", "warning");
    return;
  }

  const sqFt = lenFt * widFt;
  const acres = sqFt / 43560.0;
  const perimFt = 2 * (lenFt + widFt);
  const perimM = perimFt * 0.3048;

  fieldWalkState.calculatedAcres = acres;
  fieldWalkState.calculatedPerimeterM = perimM;

  updateFieldMeterStats(acres, sqFt * 0.092903, perimM);

  // Draw simulated rectangular polygon
  if (fieldCanvas) {
    const ctx = fieldCanvas.getContext("2d");
    const cw = fieldCanvas.width;
    const ch = fieldCanvas.height;

    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, cw, ch);

    const aspect = lenFt / widFt;
    let boxW = 280;
    let boxH = boxW / aspect;
    if (boxH > 180) {
      boxH = 180;
      boxW = boxH * aspect;
    }

    const startX = (cw - boxW) / 2;
    const startY = (ch - boxH) / 2;

    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
    ctx.fillRect(startX, startY, boxW, boxH);

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, boxW, boxH);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${lenFt} ft`, cw / 2, startY - 8);
    ctx.textAlign = "left";
    ctx.fillText(`${widFt} ft`, startX + boxW + 8, ch / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`${acres.toFixed(2)} Acres (${(acres * 40).toFixed(1)} Gunthas)`, cw / 2, ch / 2 + 5);
  }
}

function drawFieldPolygon() {
  if (!fieldCanvas) return;
  const ctx = fieldCanvas.getContext("2d");
  const cw = fieldCanvas.width;
  const ch = fieldCanvas.height;

  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, cw, ch);

  const pts = fieldWalkState.points;
  if (!pts || pts.length === 0) {
    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GPS Visualizer: Walk along boundary or enter dimensions", cw / 2, ch / 2);
    return;
  }

  if (pts.length === 1) {
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Point 1 logged • Walk forward...", cw / 2, ch / 2 + 25);
    return;
  }

  // Find bounding box in GPS coords
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  pts.forEach(p => {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  });

  const midLat = (minLat + maxLat) / 2;
  const cosLat = Math.cos((midLat * Math.PI) / 180.0);
  const spanLatM = Math.max((maxLat - minLat) * 111139.0, 5.0);
  const spanLngM = Math.max((maxLng - minLng) * 111139.0 * cosLat, 5.0);

  const pad = 40;
  const drawW = cw - 2 * pad;
  const drawH = ch - 2 * pad;

  // Uniform scale to preserve true ground aspect ratio
  const scale = Math.min(drawW / spanLngM, drawH / spanLatM);
  const polyW = spanLngM * scale;
  const polyH = spanLatM * scale;
  const offsetX = pad + (drawW - polyW) / 2;
  const offsetY = pad + (drawH - polyH) / 2;

  const toCanvasX = (lng) => offsetX + ((lng - minLng) * 111139.0 * cosLat) * scale;
  const toCanvasY = (lat) => offsetY + ((maxLat - lat) * 111139.0) * scale;

  // Draw polygon path
  ctx.beginPath();
  pts.forEach((p, idx) => {
    const x = toCanvasX(p.lng);
    const y = toCanvasY(p.lat);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  if (pts.length >= 3) {
    ctx.closePath();
    ctx.fillStyle = "rgba(16, 185, 129, 0.22)";
    ctx.fill();
  }

  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw point markers
  pts.forEach((p, idx) => {
    const x = toCanvasX(p.lng);
    const y = toCanvasY(p.lat);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = idx === 0 ? "#22c55e" : (idx === pts.length - 1 ? "#38bdf8" : "#f59e0b");
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

function applyWalkAcresToForms() {
  const acres = parseFloat(fieldWalkState.calculatedAcres.toFixed(2));
  if (acres <= 0) {
    showToast("Please walk and record at least 3 perimeter points or calculate manual dimensions.", "warning");
    return;
  }

  const mainLand = document.getElementById("landSizeInput");
  if (mainLand) {
    mainLand.value = acres;
    appState.landSize = acres;
  }
  if (seedLandAcres) seedLandAcres.value = acres;
  if (sprayLandAcres) sprayLandAcres.value = acres;
  if (solarLandAcres) solarLandAcres.value = acres;
  const irrigLand = document.getElementById("irrigLandInput");
  if (irrigLand) irrigLand.value = acres;
  const fertLand = document.getElementById("fertLandAcres");
  if (fertLand) fertLand.value = acres;
  const rotLand = document.getElementById("rotLandInput");
  if (rotLand) rotLand.value = acres;
  const organicLand = document.getElementById("organicLandInput");
  if (organicLand) organicLand.value = acres;
  const yojanaLand = document.getElementById("yojanaLandInput");
  if (yojanaLand) yojanaLand.value = acres;

  closeFieldMeterModal();
  showToast(`✓ Measured field size (${acres} Acres) applied to all AgriAssist calculators!`, "success");
}


// ============================================================================
// 3. KISAN VOICE SEARCH (WEB SPEECH RECOGNITION - 100% FREE / BROWSER NATIVE)
// ============================================================================

let activeVoiceRecognition = null;
let activeTargetInputElement = null;

function startVoiceRecognition(targetInputId) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    showToast("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge on your mobile or desktop.", "info");
    return;
  }

  stopVoiceRecognition();

  if (targetInputId === "global") {
    activeTargetInputElement = null;
  } else {
    activeTargetInputElement = document.getElementById(targetInputId);
  }

  const langCodeMap = {
    hi: "hi-IN",
    pa: "pa-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    en: "en-IN"
  };
  const chosenLang = langCodeMap[appState.currentLang] || "hi-IN";

  activeVoiceRecognition = new SpeechRec();
  activeVoiceRecognition.continuous = false;
  activeVoiceRecognition.interimResults = true;
  activeVoiceRecognition.lang = chosenLang;

  voiceStatusPill?.classList.remove("hidden");
  if (voiceStatusTitle) {
    voiceStatusTitle.textContent = appState.currentLang === "hi" ? "सुन रहे हैं... बोलिए" : "Listening... Speak now";
  }
  if (voiceTranscriptPreview) {
    voiceTranscriptPreview.textContent = "...";
  }

  let capturedTranscript = "";

  activeVoiceRecognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        capturedTranscript = transcript;
      }
    }
    if (!capturedTranscript) capturedTranscript = transcript;
    if (voiceTranscriptPreview) voiceTranscriptPreview.textContent = transcript;

    if (activeTargetInputElement) {
      activeTargetInputElement.value = transcript;
      activeTargetInputElement.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  activeVoiceRecognition.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    stopVoiceRecognition();
  };

  activeVoiceRecognition.onend = () => {
    const textToRoute = capturedTranscript || voiceTranscriptPreview?.textContent;
    if (!activeTargetInputElement && textToRoute && textToRoute !== "..." && textToRoute !== "Listening...") {
      handleVoiceRecognitionResult(textToRoute);
    }
    stopVoiceRecognition();
  };

  try {
    activeVoiceRecognition.start();
  } catch (err) {
    console.error("Failed to start speech recognition:", err);
    stopVoiceRecognition();
  }
}

function stopVoiceRecognition() {
  if (activeVoiceRecognition) {
    try {
      activeVoiceRecognition.stop();
    } catch (_) {}
    activeVoiceRecognition = null;
  }
  voiceStatusPill?.classList.add("hidden");
}


// ============================================================================
// 4. SEED RATE & PLANT POPULATION / GEOMETRY CALCULATOR
// ============================================================================

const LOCAL_SEED_CATALOG = [
  {
    id: "wheat",
    name: "Wheat (गेहूं)",
    baseSeedRateKg: 40.0,
    testWeightG: 40.0,
    defRowCm: 22.5,
    defPlantCm: 5.0,
    stdGerm: 85,
    notes: "Normal sowing: 40 kg/acre; Late sowing: 50 kg/acre. Seed treatment with Trichoderma (5g/kg) + Azotobacter / PSB biofertilizer."
  },
  {
    id: "rice_trans",
    name: "Paddy / Rice - Transplanted (धान - रोपाई)",
    baseSeedRateKg: 18.0,
    testWeightG: 25.0,
    defRowCm: 20.0,
    defPlantCm: 15.0,
    stdGerm: 80,
    notes: "Nursery area: 1/10th acre per 1 acre transplant. Treat seed with Carbendazim 2g/kg or Trichoderma viride."
  },
  {
    id: "rice_dsr",
    name: "Paddy / Rice - DSR Direct Seeded (धान - सीधी बिजाई)",
    baseSeedRateKg: 9.0,
    testWeightG: 25.0,
    defRowCm: 20.0,
    defPlantCm: 10.0,
    stdGerm: 80,
    notes: "Requires tar-watter field moisture at sowing. Spray Pendimethalin 30% EC within 24 hours to control weeds."
  },
  {
    id: "maize",
    name: "Maize / Corn (मक्का)",
    baseSeedRateKg: 8.0,
    testWeightG: 280.0,
    defRowCm: 60.0,
    defPlantCm: 20.0,
    stdGerm: 90,
    notes: "Drop 1 seed per hill at 4-5 cm depth. Treat with Imidacloprid 600FS (4ml/kg) to protect against shoot fly."
  },
  {
    id: "cotton",
    name: "Cotton - Bt Hybrid (कपास)",
    baseSeedRateKg: 1.8,
    testWeightG: 100.0,
    defRowCm: 90.0,
    defPlantCm: 60.0,
    stdGerm: 75,
    notes: "Approx 2 packets (450g + refuge) per acre. Dibble 1 seed per hole in moist soil."
  },
  {
    id: "mustard",
    name: "Mustard / Sarson (सरसों)",
    baseSeedRateKg: 1.8,
    testWeightG: 4.5,
    defRowCm: 30.0,
    defPlantCm: 10.0,
    stdGerm: 85,
    notes: "Mix seeds with fine sand or ash for uniform line sowing. Thin out to 10 cm plant spacing at 18-20 days."
  },
  {
    id: "chickpea",
    name: "Chickpea / Chana (चना)",
    baseSeedRateKg: 28.0,
    testWeightG: 220.0,
    defRowCm: 30.0,
    defPlantCm: 10.0,
    stdGerm: 85,
    notes: "Deep sowing at 8-10 cm in conserved moisture. Treat with Rhizobium ciceri + Trichoderma."
  },
  {
    id: "soybean",
    name: "Soybean (सोयाबीन)",
    baseSeedRateKg: 28.0,
    testWeightG: 130.0,
    defRowCm: 45.0,
    defPlantCm: 5.0,
    stdGerm: 70,
    notes: "Do not sow deeper than 3 cm. Inoculate with Bradyrhizobium japonicum culture before sowing."
  },
  {
    id: "groundnut",
    name: "Groundnut / Peanut (मूंगफली)",
    baseSeedRateKg: 45.0,
    testWeightG: 400.0,
    defRowCm: 30.0,
    defPlantCm: 10.0,
    stdGerm: 80,
    notes: "Use hand-shelled sound mature kernels. Treat with Trichoderma (4g/kg) and Rhizobium."
  },
  {
    id: "sugarcane",
    name: "Sugarcane (गन्ना)",
    baseSeedRateKg: 3000.0,
    testWeightG: 1000.0,
    defRowCm: 120.0,
    defPlantCm: 30.0,
    stdGerm: 90,
    notes: "Approx 35,000 two-bud setts (3.0-3.5 tonnes) per acre. Dip setts in Carbendazim 0.1% for 15 minutes."
  },
  {
    id: "potato",
    name: "Potato (आलू)",
    baseSeedRateKg: 900.0,
    testWeightG: 45.0,
    defRowCm: 60.0,
    defPlantCm: 20.0,
    stdGerm: 95,
    notes: "Use certified seed tubers (35-45mm diameter, 40-50g weight). Treat with Mancozeb (2.5g/L) before planting."
  },
  {
    id: "tomato",
    name: "Tomato - Hybrid (टमाटर)",
    baseSeedRateKg: 0.08,
    testWeightG: 3.2,
    defRowCm: 60.0,
    defPlantCm: 45.0,
    stdGerm: 85,
    notes: "60-80 grams seed per acre nursery. Grow in pro-trays with coco-peat + Trichoderma for vigorous root plugs."
  },
  {
    id: "onion",
    name: "Onion (प्याज)",
    baseSeedRateKg: 4.0,
    testWeightG: 3.8,
    defRowCm: 15.0,
    defPlantCm: 10.0,
    stdGerm: 80,
    notes: "Nursery area: 0.05 acre. Transplant 6-7 week old seedlings on raised beds with light irrigation."
  },
  {
    id: "moong",
    name: "Moong / Green Gram (मूंग)",
    baseSeedRateKg: 8.5,
    testWeightG: 40.0,
    defRowCm: 30.0,
    defPlantCm: 10.0,
    stdGerm: 80,
    notes: "Treat seed with Rhizobium and PSB culture. Suitable for summer catch-crop or Kharif pulse."
  }
];

function populateSeedCropOptions() {
  if (!seedCropSelect) return;
  seedCropSelect.innerHTML = LOCAL_SEED_CATALOG.map(c => `
    <option value="${c.id}">${c.name}</option>
  `).join("");
}

async function executeSeedCalculation() {
  const cropId = seedCropSelect?.value || "wheat";
  const crop = LOCAL_SEED_CATALOG.find(c => c.id === cropId) || LOCAL_SEED_CATALOG[0];

  const acres = parseFloat(seedLandAcres?.value) || 1.0;
  const germPct = Math.max(40, Math.min(100, parseFloat(seedGerminationPct?.value) || crop.stdGerm));
  const sowingMethod = seedSowingMethod?.value || "line_sowing";

  // Geometry
  const isCustom = seedCustomSpacingCheck?.checked;
  const rowCm = isCustom ? (parseFloat(seedRowSpacingCm?.value) || crop.defRowCm) : crop.defRowCm;
  const plantCm = isCustom ? (parseFloat(seedPlantSpacingCm?.value) || crop.defPlantCm) : crop.defPlantCm;

  if (appState.apiOnline) {
    try {
      const res = await fetch(`${API_BASE}/seed-calculator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop_id: cropId,
          land_size_acres: acres,
          row_spacing_cm: rowCm,
          plant_spacing_cm: plantCm,
          germination_rate_pct: germPct,
          sowing_method: sowingMethod
        })
      });
      if (res.ok) {
        const data = await res.json();
        renderSeedResult({
          crop: { ...crop, name: data.crop_name || crop.name, notes: data.agronomic_advisory || crop.notes },
          acres: data.land_size_acres || acres,
          germPct: germPct,
          sowingMethod: data.sowing_method || sowingMethod,
          rowCm: data.effective_row_spacing_cm || rowCm,
          plantCm: data.effective_plant_spacing_cm || plantCm,
          plantPopulationPerAcre: data.population_per_acre || Math.round(40468600 / (rowCm * plantCm)),
          totalFieldPopulation: data.estimated_plant_population || Math.round(Math.round(40468600 / (rowCm * plantCm)) * acres),
          seedRatePerAcreKg: data.recommended_seed_rate_kg_per_acre || (crop.baseSeedRateKg * (crop.stdGerm / germPct)),
          totalSeedRequiredKg: data.total_seed_required_kg || (crop.baseSeedRateKg * (crop.stdGerm / germPct) * acres),
          seedTreatmentProtocol: data.seed_treatment_protocol
        });
        return;
      }
    } catch (_) {}
  }

  // Method factor
  const sowingMethodLower = (sowingMethod || "").toLowerCase();
  let methodMultiplier = 1.0;
  if (sowingMethodLower.includes("broadcasting")) methodMultiplier = 1.25;
  else if (sowingMethodLower.includes("dibbling")) methodMultiplier = 0.85;
  else if (sowingMethodLower.includes("transplanting")) methodMultiplier = 1.0;

  // 1 Acre = 4046.86 m² = 40,468,600 cm²
  const plantPopulationPerAcre = Math.round(40468600 / (rowCm * plantCm));
  const totalFieldPopulation = Math.round(plantPopulationPerAcre * acres);

  // Adjusted seed rate
  const germCorrection = crop.stdGerm / germPct;
  const seedRatePerAcreKg = crop.baseSeedRateKg * methodMultiplier * germCorrection;
  const totalSeedRequiredKg = seedRatePerAcreKg * acres;

  renderSeedResult({
    crop,
    acres,
    germPct,
    sowingMethod,
    rowCm,
    plantCm,
    plantPopulationPerAcre,
    totalFieldPopulation,
    seedRatePerAcreKg,
    totalSeedRequiredKg
  });
}

function renderSeedResult(res) {
  if (!seedResultContainer) return;
  seedResultContainer.classList.remove("hidden");

  const totalSeedDisplay = res.totalSeedRequiredKg >= 1000
    ? `${(res.totalSeedRequiredKg / 1000).toFixed(2)} Tonnes`
    : (res.totalSeedRequiredKg < 1
      ? `${Math.round(res.totalSeedRequiredKg * 1000)} grams`
      : `${res.totalSeedRequiredKg.toFixed(1)} kg`);

  const perAcreSeedDisplay = res.seedRatePerAcreKg < 1
    ? `${Math.round(res.seedRatePerAcreKg * 1000)} g/acre`
    : `${res.seedRatePerAcreKg.toFixed(1)} kg/acre`;

  const treatmentText = res.seedTreatmentProtocol
    ? `<div class="font-bold text-amber-900 mt-2">🧪 Seed Bio-Treatment Protocol:</div><p class="text-slate-700 leading-relaxed">${res.seedTreatmentProtocol}</p>`
    : "";

  seedResultContainer.innerHTML = `
    <div class="bg-white rounded-2xl p-6 border border-brand-200 shadow-sm space-y-6 animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span class="text-xs font-bold text-brand-700 uppercase tracking-wider">Seed & Population Prescription</span>
          <h3 class="text-xl font-black text-slate-900">${res.crop.name}</h3>
        </div>
        <div class="text-right">
          <span class="bg-brand-50 text-brand-800 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-200">
            🌾 Area: ${res.acres} Acre(s)
          </span>
        </div>
      </div>

      <!-- Key Metrics 4-Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl text-center shadow-sm">
          <span class="text-[11px] font-bold text-emerald-800 uppercase block">Total Seed Needed</span>
          <span class="text-2xl font-black text-emerald-950">${totalSeedDisplay}</span>
          <span class="text-[10px] text-emerald-700 block mt-0.5">${perAcreSeedDisplay}</span>
        </div>

        <div class="bg-indigo-50/80 border border-indigo-200 p-4 rounded-xl text-center shadow-sm">
          <span class="text-[11px] font-bold text-indigo-800 uppercase block">Target Population</span>
          <span class="text-2xl font-black text-indigo-950">${res.totalFieldPopulation.toLocaleString("en-IN")}</span>
          <span class="text-[10px] text-indigo-700 block mt-0.5">${res.plantPopulationPerAcre.toLocaleString("en-IN")} plants/ac</span>
        </div>

        <div class="bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-center shadow-sm">
          <span class="text-[11px] font-bold text-amber-800 uppercase block">Spacing Geometry</span>
          <span class="text-xl font-black text-amber-950">${res.rowCm} × ${res.plantCm} cm</span>
          <span class="text-[10px] text-amber-700 block mt-0.5">Row × Plant distance</span>
        </div>

        <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center shadow-sm">
          <span class="text-[11px] font-bold text-slate-600 uppercase block">Plant Density</span>
          <span class="text-2xl font-black text-slate-900">${(res.plantPopulationPerAcre / 4046.86).toFixed(1)}</span>
          <span class="text-[10px] text-slate-500 block mt-0.5">plants / m²</span>
        </div>
      </div>

      <!-- Advisory Box -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
        <div class="font-bold text-slate-800 flex items-center gap-1.5">
          <span>🛡️</span> <span>Agronomic Seed Treatment & Sowing Protocol:</span>
        </div>
        <p class="text-slate-600 leading-relaxed">${res.crop.notes}</p>
        ${treatmentText}
        <div class="text-[11px] text-brand-800 font-medium pt-1">
          ✓ Calculated for <strong>${res.germPct}% Germination</strong> standard under <strong>${res.sowingMethod.replace("_", " ")}</strong> method.
        </div>
      </div>
    </div>
  `;
}


// ============================================================================
// 5. KNAPSACK SPRAYER & CHEMICAL DILUTION CALCULATOR
// ============================================================================

async function executeSprayerCalculation() {
  const tankCap = parseFloat(sprayTankCap?.value) || 16.0;
  const acres = parseFloat(sprayLandAcres?.value) || 1.0;
  const dosageMode = sprayDosageMode?.value || "per_acre";
  const chemForm = sprayChemForm?.value || "liquid_ml";
  const doseAmt = parseFloat(sprayDoseAmount?.value) || 250.0;
  const waterRate = parseFloat(sprayWaterRate?.value) || 150.0;

  try {
    const res = await fetch(`${API_BASE}/sprayer-calculator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tank_capacity_liters: tankCap,
        land_size_acres: acres,
        field_acres: acres,
        dosage_mode: dosageMode,
        chemical_form: chemForm === "liquid_ml" ? "Liquid (ml)" : "Powder (g)",
        chemical_formulation: chemForm,
        dosage_amount: doseAmt,
        spray_volume_liters_per_acre: waterRate,
        water_volume_liters_per_acre: waterRate
      })
    });
    if (res.ok) {
      const data = await res.json();
      renderSprayerResult(data);
      return;
    }
  } catch (_) {
    // Offline client fallback
  }

  // Pure Offline calculation
  const totalWater = acres * waterRate;
  const totalTanks = Math.ceil(totalWater / tankCap);
  let totalChem = 0;
  let chemPerTank = 0;

  if (dosageMode === "per_acre") {
    totalChem = acres * doseAmt;
    chemPerTank = totalChem / totalTanks;
  } else {
    chemPerTank = tankCap * doseAmt;
    totalChem = totalWater * doseAmt;
  }

  const unit = chemForm === "liquid_ml" ? "ml" : "grams";
  const bulkUnit = chemForm === "liquid_ml" ? (totalChem >= 1000 ? "Liters" : "ml") : (totalChem >= 1000 ? "kg" : "g");
  const bulkVal = totalChem >= 1000 ? (totalChem / 1000).toFixed(2) : totalChem.toFixed(0);

  renderSprayerResult({
    total_spray_tanks: totalTanks,
    chemical_per_tank: parseFloat(chemPerTank.toFixed(1)),
    chemical_unit: unit,
    total_chemical_required: parseFloat(bulkVal),
    total_chemical_unit: bulkUnit,
    total_water_liters: Math.round(totalWater),
    recommendations: [
      `Add exactly ${chemPerTank.toFixed(1)} ${unit} per ${tankCap}L knapsack tank.`,
      `Always pre-mix chemical in 1-2 Liters bucket before pouring into tank.`,
      `Use Hollow Cone nozzle for foliar fungicides/insecticides and Flat Fan nozzle for weedicides.`,
      `Spray during calm morning or evening hours with the wind at your back.`
    ]
  });
}

function renderSprayerResult(res) {
  if (!sprayerResultContainer) return;
  sprayerResultContainer.classList.remove("hidden");

  const totalTanks = res.total_spray_tanks ?? res.tanks_needed_total ?? 0;
  const chemPerTank = res.chemical_per_tank ?? 0;
  const chemUnit = res.chemical_unit || "ml";
  const totalChem = res.total_chemical_required ?? res.total_chemical_needed ?? 0;
  const totalChemUnit = res.total_chemical_unit || (chemUnit === "ml" ? "Liters" : "kg");
  const waterNeeded = res.total_water_liters ?? 0;
  const tips = res.recommendations || (res.application_tips ? [res.nozzle_recommendation, ...(res.application_tips || []), ...(res.safety_checklist || [])] : []);

  sprayerResultContainer.innerHTML = `
    <div class="bg-white rounded-2xl p-6 border border-brand-200 shadow-sm space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span class="text-xs font-bold text-brand-700 uppercase tracking-wider">Sprayer Calibration Results</span>
          <h3 class="text-xl font-black text-slate-900">Knapsack Dilution Schedule</h3>
        </div>
        <span class="bg-indigo-50 text-indigo-800 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-200">
          🧪 Precise Dose
        </span>
      </div>

      <!-- 4 Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center shadow-sm">
          <span class="text-[11px] font-bold text-amber-800 uppercase block">Total Tanks</span>
          <span class="text-3xl font-black text-amber-950">${totalTanks}</span>
          <span class="text-[10px] text-amber-700 block mt-0.5">tanks for whole field</span>
        </div>

        <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center shadow-sm">
          <span class="text-[11px] font-bold text-emerald-800 uppercase block">Dose Per Tank</span>
          <span class="text-3xl font-black text-emerald-950">${chemPerTank}</span>
          <span class="text-[10px] text-emerald-700 block mt-0.5 font-bold">${chemUnit} / tank</span>
        </div>

        <div class="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-center shadow-sm">
          <span class="text-[11px] font-bold text-indigo-800 uppercase block">Total Chemical</span>
          <span class="text-2xl font-black text-indigo-950">${totalChem}</span>
          <span class="text-[10px] text-indigo-700 block mt-0.5 font-bold">${totalChemUnit}</span>
        </div>

        <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center shadow-sm">
          <span class="text-[11px] font-bold text-slate-600 uppercase block">Water Needed</span>
          <span class="text-2xl font-black text-slate-900">${waterNeeded} L</span>
          <span class="text-[10px] text-slate-500 block mt-0.5">clean spray water</span>
        </div>
      </div>

      <!-- Measuring Guide & Precautions -->
      <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
        <div class="font-bold text-slate-800 flex items-center gap-2">
          <span>📋</span> <span>Mixing & Field Application Protocol:</span>
        </div>
        <ul class="space-y-1.5 text-slate-600 list-disc list-inside">
          ${tips.map(r => `<li>${r}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}


// ============================================================================
// 6. SOLAR AG-PUMP SIZING & PM-KUSUM SUBSIDY ESTIMATOR
// ============================================================================

async function executeSolarCalculation() {
  const source = solarWaterSource?.value || "borewell";
  const depthFt = parseFloat(solarDepthFeet?.value) || 120.0;
  const acres = parseFloat(solarLandAcres?.value) || 3.0;
  const irrigType = solarIrrigType?.value || "drip";
  const category = solarFarmerCategory?.value || "General";

  try {
    const res = await fetch(`${API_BASE}/solar-pump-calculator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        water_source: source,
        water_depth_feet: depthFt,
        land_size_acres: acres,
        command_area_acres: acres,
        irrigation_type: irrigType,
        irrigation_method: irrigType,
        farmer_category: category,
        state: "All-India"
      })
    });
    if (res.ok) {
      const data = await res.json();
      renderSolarResult(data);
      return;
    }
  } catch (_) {
    // Offline fallback
  }

  // Client Offline Sizing
  const tdhMeters = Math.round(depthFt * 0.3048 * 1.25);
  let hp = 3.0;
  if (tdhMeters > 75 || acres > 5.0) hp = 7.5;
  else if (tdhMeters > 50 || acres > 3.5) hp = 5.0;
  else if (tdhMeters < 25 && acres <= 2.0) hp = 2.0;

  const arrayKw = hp;
  const pumpType = source === "borewell" ? "Submersible (AC)" : "Surface Monoblock";
  const baseCost = hp * 65000;

  const centralPct = (category === "Hilly_NE" || category === "SC_ST") ? 0.50 : 0.30;
  const statePct = 0.30;
  const centralSubsidy = baseCost * centralPct;
  const stateSubsidy = baseCost * statePct;
  const farmerShare = baseCost - (centralSubsidy + stateSubsidy);

  const annualDieselLiters = Math.round(hp * 220);
  const annualDieselSavingRs = annualDieselLiters * 92;
  const co2Tons = parseFloat((annualDieselLiters * 0.00268).toFixed(1));

  renderSolarResult({
    recommended_pump_hp: hp,
    pump_type: pumpType,
    solar_array_kwp: arrayKw,
    total_dynamic_head_meters: tdhMeters,
    estimated_total_cost: baseCost,
    central_subsidy: centralSubsidy,
    state_subsidy: stateSubsidy,
    farmer_share: farmerShare,
    bank_loan_available: baseCost * 0.30,
    annual_diesel_saved_liters: annualDieselLiters,
    annual_diesel_cost_savings_rs: annualDieselSavingRs,
    co2_reduction_tons_per_year: co2Tons
  });
}

function renderSolarResult(res) {
  if (!solarResultContainer) return;
  solarResultContainer.classList.remove("hidden");

  const hp = res.recommended_pump_hp ?? 3.0;
  const kwp = res.solar_array_kwp ?? res.recommended_solar_array_kw ?? hp;
  const pumpType = res.pump_type || "Submersible (AC)";
  const tdh = res.total_dynamic_head_meters ?? Math.round((parseFloat(solarDepthFeet?.value) || 120) * 0.3048 * 1.25);
  const farmerShare = res.farmer_share ?? res.farmer_share_inr ?? 0;
  const totalCost = res.estimated_total_cost ?? res.total_estimated_cost_inr ?? 0;
  const dieselSavings = res.annual_diesel_cost_savings_rs ?? res.annual_diesel_savings_inr ?? 0;
  const dieselLiters = res.annual_diesel_saved_liters ?? Math.round(hp * 220);
  const co2Tons = res.co2_reduction_tons_per_year ?? parseFloat((dieselLiters * 0.00268).toFixed(1));
  const centralSubsidy = res.central_subsidy ?? res.central_subsidy_inr ?? 0;
  const stateSubsidy = res.state_subsidy ?? res.state_subsidy_inr ?? 0;

  solarResultContainer.innerHTML = `
    <div class="bg-white rounded-2xl p-6 border border-brand-200 shadow-sm space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span class="text-xs font-bold text-amber-700 uppercase tracking-wider">PM-KUSUM Solar Feasibility</span>
          <h3 class="text-xl font-black text-slate-900">${hp} HP Solar Ag-Pump Recommendation</h3>
        </div>
        <span class="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full">
          ☀️ 60% Govt Subsidy
        </span>
      </div>

      <!-- 3 Key Highlights -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
          <span class="text-xs font-bold text-emerald-800 uppercase block">Pump & Array Capacity</span>
          <span class="text-2xl font-black text-emerald-950">${hp} HP / ${kwp} kWp</span>
          <span class="text-[11px] text-emerald-700 block mt-0.5">${pumpType} • TDH: ${tdh}m</span>
        </div>

        <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
          <span class="text-xs font-bold text-amber-800 uppercase block">Farmer Payable Share</span>
          <span class="text-2xl font-black text-amber-950">₹${Math.round(farmerShare).toLocaleString("en-IN")}</span>
          <span class="text-[11px] text-amber-700 block mt-0.5">Remaining ~60% paid by Central + State</span>
        </div>

        <div class="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-center">
          <span class="text-xs font-bold text-indigo-800 uppercase block">Annual Diesel Saved</span>
          <span class="text-2xl font-black text-indigo-950">₹${Math.round(dieselSavings).toLocaleString("en-IN")}/yr</span>
          <span class="text-[11px] text-indigo-700 block mt-0.5">${dieselLiters} Liters • ${co2Tons} t CO₂ offset</span>
        </div>
      </div>

      <!-- Financial Breakdown Table -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
        <div class="font-bold text-slate-800 mb-2">PM-KUSUM Component-B Financial Breakdown:</div>
        <div class="divide-y divide-slate-200 font-mono">
          <div class="flex justify-between py-1.5 text-slate-700">
            <span>Standard Benchmark Capital Cost:</span>
            <span class="font-bold">₹${Math.round(totalCost).toLocaleString("en-IN")}</span>
          </div>
          <div class="flex justify-between py-1.5 text-emerald-700">
            <span>Central Govt Subsidy (CFA):</span>
            <span class="font-bold">- ₹${Math.round(centralSubsidy).toLocaleString("en-IN")}</span>
          </div>
          <div class="flex justify-between py-1.5 text-emerald-700">
            <span>State Govt Subsidy:</span>
            <span class="font-bold">- ₹${Math.round(stateSubsidy).toLocaleString("en-IN")}</span>
          </div>
          <div class="flex justify-between py-1.5 text-slate-900 font-bold bg-white px-2 rounded-lg">
            <span>Net Farmer Upfront Contribution:</span>
            <span class="text-brand-800">₹${Math.round(farmerShare).toLocaleString("en-IN")}</span>
          </div>
        </div>
        <div class="text-[11px] text-slate-500 pt-1">
          * Optional NABARD/Bank loan can finance up to 30% of total cost, leaving only 10% cash margin for the farmer.
        </div>
      </div>
    </div>
  `;
}


// ============================================================================
// 7. INTERCROPPING & COMPANION CROP MATRIX
// ============================================================================

const LOCAL_INTERCROPPING_CATALOG = [
  {
    main_crop: "Sugarcane",
    companion_crop: "Potato",
    spatial_ratio: "1 Row Sugarcane : 2 Rows Potato",
    ler: 1.42,
    biological_benefit: "High financial return; potato matures in 85 days before sugarcane canopy closes. Improves soil tilth.",
    recommended_season: "Autumn / Rabi",
    water_compatibility: "Excellent - Furrows utilized simultaneously."
  },
  {
    main_crop: "Sugarcane",
    companion_crop: "Moong / Green Gram",
    spatial_ratio: "1 Row Sugarcane : 2 Rows Moong",
    ler: 1.35,
    biological_benefit: "Atmospheric Nitrogen fixation (30-40 kg N/ha), suppresses early weeds, provides quick early harvest.",
    recommended_season: "Spring / Summer",
    water_compatibility: "High compatibility."
  },
  {
    main_crop: "Maize",
    companion_crop: "Pigeonpea / Arhar",
    spatial_ratio: "2 Rows Maize : 1 Row Arhar",
    ler: 1.38,
    biological_benefit: "Deep taproot of arhar and shallow fibrous root of maize access different soil zones without moisture competition.",
    recommended_season: "Kharif",
    water_compatibility: "Rainfed / Conserved moisture."
  },
  {
    main_crop: "Maize",
    companion_crop: "Soybean",
    spatial_ratio: "2 Rows Maize : 2 Rows Soybean",
    ler: 1.28,
    biological_benefit: "Balances protein and starch production; soybean canopy smothers weed growth between maize rows.",
    recommended_season: "Kharif",
    water_compatibility: "Moderate."
  },
  {
    main_crop: "Cotton",
    companion_crop: "Moong / Green Gram",
    spatial_ratio: "1 Row Cotton : 2 Rows Moong",
    ler: 1.30,
    biological_benefit: "Moong is harvested in 60-65 days providing early cash flow and leguminous nitrogen residue for cotton boll formation.",
    recommended_season: "Kharif",
    water_compatibility: "High."
  },
  {
    main_crop: "Cotton",
    companion_crop: "Marigold (Trap Crop)",
    spatial_ratio: "1 Row Marigold every 10-15 Rows Cotton",
    ler: 1.15,
    biological_benefit: "Ecological pest trap: Marigold yellow flowers attract Helicoverpa bollworms away from cotton squares.",
    recommended_season: "Kharif",
    water_compatibility: "High."
  },
  {
    main_crop: "Wheat",
    companion_crop: "Mustard",
    spatial_ratio: "9 Rows Wheat : 1 Row Mustard",
    ler: 1.22,
    biological_benefit: "Traditional risk insurance; mustard flowers attract beneficial honeybees for cross-pollination and yields valuable cooking oil.",
    recommended_season: "Rabi",
    water_compatibility: "High."
  },
  {
    main_crop: "Chickpea",
    companion_crop: "Mustard",
    spatial_ratio: "4 Rows Chickpea : 1 Row Mustard",
    ler: 1.25,
    biological_benefit: "Mustard pungent root exudates repel soil pests, and provides mixed pulse-oilseed harvest.",
    recommended_season: "Rabi",
    water_compatibility: "Conserved residual moisture."
  },
  {
    main_crop: "Sorghum (Jowar)",
    companion_crop: "Cowpea (Lobia)",
    spatial_ratio: "2 Rows Jowar : 2 Rows Cowpea",
    ler: 1.32,
    biological_benefit: "Superior dairy fodder mix: high energy sorghum balanced with high protein cowpea vines.",
    recommended_season: "Kharif",
    water_compatibility: "Drought hardy."
  },
  {
    main_crop: "Tomato",
    companion_crop: "African Marigold",
    spatial_ratio: "Border Crop + 1 Row every 8 Rows Tomato",
    ler: 1.20,
    biological_benefit: "Root exudate alpha-terthienyl suppresses harmful root-knot nematodes; traps tomato fruit borer.",
    recommended_season: "All seasons",
    water_compatibility: "Drip compatible."
  }
];

async function renderIntercroppingCatalog(filterCrop = "all") {
  let catalog = LOCAL_INTERCROPPING_CATALOG;
  try {
    const url = filterCrop === "all" ? `${API_BASE}/intercropping` : `${API_BASE}/intercropping?main_crop=${encodeURIComponent(filterCrop)}&crop_id=${encodeURIComponent(filterCrop)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.pairs && data.pairs.length) {
        catalog = data.pairs;
      }
    }
  } catch (_) {}

  const filtered = filterCrop === "all"
    ? catalog
    : catalog.filter(c => {
        const name = (c.main_crop || c.main_crop_name || "").toLowerCase();
        return name.includes(filterCrop.toLowerCase());
      });

  if (intercropCount) {
    intercropCount.textContent = `Showing ${filtered.length} proven intercropping pairing(s)`;
  }

  if (!intercropGrid) return;
  if (!filtered.length) {
    intercropGrid.innerHTML = `
      <div class="col-span-full p-8 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-200">
        No companion crop recommendations registered yet for ${filterCrop}.
      </div>
    `;
    return;
  }

  intercropGrid.innerHTML = filtered.map(pair => {
    const mainName = pair.main_crop || pair.main_crop_name || "";
    const compName = pair.companion_crop || pair.companion_crop_name || "";
    const ratio = pair.spatial_ratio || pair.row_ratio || "Intercrop";
    const lerVal = pair.ler ?? pair.land_equivalent_ratio ?? 1.25;
    const bonusPct = Math.round((lerVal - 1.0) * 100);
    const season = pair.recommended_season || "Kharif / Rabi";
    const benefit = pair.biological_benefit || pair.economic_advisory || pair.pest_repellent_benefit || "";
    const water = pair.water_compatibility || "High compatibility";

    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition space-y-3.5 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-1 rounded-full">
              LER: ${lerVal.toFixed(2)} (+${bonusPct}% Yield Advantage)
            </span>
            <span class="text-[11px] text-slate-500 font-semibold">${season}</span>
          </div>

          <div class="pt-1">
            <h4 class="font-black text-slate-900 text-base">
              ${mainName} + <span class="text-brand-700">${compName}</span>
            </h4>
            <span class="inline-block bg-slate-100 text-slate-700 text-[11px] font-mono font-bold px-2 py-0.5 rounded mt-1">
              📐 ${ratio}
            </span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed pt-1">
            ${benefit}
          </p>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>💧 ${water}</span>
          <span class="font-bold text-brand-800">Zero Chemical Extra</span>
        </div>
      </div>
    `;
  }).join("");
}


// ============================================================================
// 8. POST-HARVEST GRAIN STORAGE DOCTOR & RISK CHECKER
// ============================================================================

const LOCAL_GRAIN_STORAGE_CATALOG = [
  {
    crop: "Wheat (गेहूं)",
    safe_moisture_pct: 12.0,
    max_safe_duration_months: 18,
    major_pests: "Khapra beetle (Trogoderma granarium), Lesser grain borer",
    safe_practices: "Sun dry grain to <= 12% moisture. Mix with dry neem leaves (1 kg per 100 kg grain) or store in airtight hermetic bags."
  },
  {
    crop: "Paddy / Rice (धान)",
    safe_moisture_pct: 13.0,
    max_safe_duration_months: 12,
    major_pests: "Rice weevil (Sitophilus oryzae), Angoumois grain moth",
    safe_practices: "Dry to 13% for raw paddy, 14% for parboiled. Keep bags 1 foot off ground on wooden pallets away from damp walls."
  },
  {
    crop: "Maize (मक्का)",
    safe_moisture_pct: 13.5,
    max_safe_duration_months: 9,
    major_pests: "Maize weevil, Aflatoxin fungus (Aspergillus flavus)",
    safe_practices: "Critically vulnerable to Aflatoxin fungus if moisture > 14%. Dry thoroughly before bagging in HDPE / metal bins."
  },
  {
    crop: "Chickpea / Chana (चना)",
    safe_moisture_pct: 10.0,
    max_safe_duration_months: 12,
    major_pests: "Pulse beetle / Dhora (Callosobruchus maculatus)",
    safe_practices: "Pulse beetles multiply exponentially in humidity. Coat grain with edible mustard oil (500ml/100kg) or use Pusa Bin."
  },
  {
    crop: "Mustard / Rapeseed (सरसों)",
    safe_moisture_pct: 8.0,
    max_safe_duration_months: 12,
    major_pests: "High oil rancidity, fungal heating",
    safe_practices: "Oilseeds require low moisture <= 8%. Store in galvanized iron bins in a cool, ventilated godown."
  },
  {
    crop: "Soybean (सोयाबीन)",
    safe_moisture_pct: 11.0,
    max_safe_duration_months: 9,
    major_pests: "Rapid loss of seed germination vigour, fungal mold",
    safe_practices: "Store at <= 11% moisture. Do not drop bags from height to prevent seed coat mechanical cracking."
  },
  {
    crop: "Moong / Pulses (मूंग / दालें)",
    safe_moisture_pct: 9.5,
    max_safe_duration_months: 12,
    major_pests: "Bruchid weevil, grain borer",
    safe_practices: "Add dry red chillies or clean wood ash in grain layers. Use hermetic SuperGrain bags."
  }
];

async function renderGrainStorageCatalog() {
  let catalog = LOCAL_GRAIN_STORAGE_CATALOG;
  try {
    const res = await fetch(`${API_BASE}/grain-storage/advisory`);
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.crops || []);
      if (list.length) {
        catalog = list;
      }
    }
  } catch (_) {}

  if (!storageCatalogTableBody) return;

  storageCatalogTableBody.innerHTML = catalog.map(c => {
    const cropName = c.crop || c.crop_name || "";
    const safeMoist = c.safe_moisture_pct ?? c.safe_moisture_limit_pct ?? 12.0;
    const maxDur = c.max_safe_duration_months ?? c.max_shelf_life_months ?? 12;
    const pests = c.major_pests || (Array.isArray(c.common_storage_pests) ? c.common_storage_pests.join(", ") : "");
    const practices = c.safe_practices || (Array.isArray(c.natural_protectants) ? c.natural_protectants.join(". ") : (c.stacking_and_storage_guidelines || ""));
    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="p-3.5 font-bold text-slate-800">${cropName}</td>
        <td class="p-3.5 text-center font-mono font-bold text-emerald-700 bg-emerald-50/50">
          ≤ ${safeMoist}%
        </td>
        <td class="p-3.5 text-center text-slate-600 font-mono">${maxDur} mos</td>
        <td class="p-3.5 text-rose-700 text-xs">${pests}</td>
        <td class="p-3.5 text-slate-600 text-xs">${practices}</td>
      </tr>
    `;
  }).join("");
}

async function executeStorageRiskCheck() {
  const crop = storageCropSelect?.value || "Wheat";
  const moisture = parseFloat(storageMoistureInput?.value) || 12.0;
  const method = storageMethodSelect?.value || "Jute Bags";
  const duration = parseFloat(storageDurationInput?.value) || 6.0;

  try {
    const res = await fetch(`${API_BASE}/grain-storage/check-risk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop_id: crop.toLowerCase().split(" ")[0],
        crop_name: crop,
        measured_moisture_pct: moisture,
        current_moisture_pct: moisture,
        storage_method: method,
        intended_duration_months: Math.round(duration),
        planned_duration_months: Math.round(duration)
      })
    });
    if (res.ok) {
      const data = await res.json();
      renderStorageRiskResult(data);
      return;
    }
  } catch (_) {}

  // Pure Offline fallback
  const found = LOCAL_GRAIN_STORAGE_CATALOG.find(c => c.crop.toLowerCase().includes(crop.toLowerCase()))
    || LOCAL_GRAIN_STORAGE_CATALOG[0];

  const diff = moisture - found.safe_moisture_pct;
  let risk = "Safe";
  const warnings = [];
  const actionPlan = [];

  if (diff <= 0) {
    risk = "Safe";
    warnings.push("Grain moisture is at or below safe physiological limits.");
    actionPlan.push("Clean storage container thoroughly before grain loading.");
    actionPlan.push("Keep bags elevated on wooden pallets away from ground dampness.");
  } else if (diff <= 2.0) {
    risk = "Caution";
    warnings.push(`Moisture is ${diff.toFixed(1)}% above ideal threshold. High risk of insect breeding (weevils) within 60-90 days.`);
    actionPlan.push(`Spread grain in bright sunlight for 2 consecutive days (6-8 hours/day) before storage.`);
    actionPlan.push(`Mix with dried neem leaves (1-2 kg per 100 kg grain) or coat with vegetable oil.`);
  } else {
    risk = "High Risk";
    warnings.push(`CRITICAL: Moisture is ${diff.toFixed(1)}% above safe storage threshold!`);
    warnings.push(`Imminent danger of fungal mold (Aspergillus / Aflatoxin) and severe heating/spoilage.`);
    actionPlan.push(`DO NOT STORE GRAIN IMMEDIATELY IN SEALED BAGS.`);
    actionPlan.push(`Immediately spread on clean tarpaulin for intensive sun drying until moisture drops below ${found.safe_moisture_pct}%.`);
    actionPlan.push(`Use Hermetic Super Grain Bags or Metal Silo with moisture absorbers.`);
  }

  if (method === "Jute Bags" && (risk === "Caution" || risk === "High Risk")) {
    warnings.push("Jute bags absorb atmospheric humidity during monsoon rains.");
  }

  renderStorageRiskResult({
    crop_name: crop,
    current_moisture_pct: moisture,
    safe_moisture_pct: found.safe_moisture_pct,
    risk_level: risk,
    spoilage_warnings: warnings,
    drying_action_plan: actionPlan
  });
}

function renderStorageRiskResult(res) {
  if (!storageRiskResultContainer) return;
  storageRiskResultContainer.classList.remove("hidden");

  const isSafe = (res.risk_level || "").toLowerCase().includes("safe");
  const isCaution = (res.risk_level || "").toLowerCase().includes("moderate") || (res.risk_level || "").toLowerCase().includes("caution") || (res.risk_level || "").toLowerCase().includes("yellow");

  const riskLabel = isSafe ? "Safe" : (isCaution ? "Caution" : "High Risk");
  const riskColor = isSafe
    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
    : (isCaution
      ? "bg-amber-100 text-amber-950 border-amber-300"
      : "bg-rose-100 text-rose-950 border-rose-300");

  const badgeColor = isSafe
    ? "bg-emerald-600 text-white"
    : (isCaution
      ? "bg-amber-600 text-white"
      : "bg-rose-600 text-white");

  const cropName = res.crop_name || res.crop_id || "Grain";
  const measuredMoist = res.current_moisture_pct ?? res.measured_moisture_pct ?? 12.0;
  const safeMoist = res.safe_moisture_pct ?? res.safe_moisture_limit_pct ?? 12.0;

  const warnings = res.spoilage_warnings || (res.risk_explanation ? [res.risk_explanation] : []);
  const actionPlan = res.drying_action_plan || [
    ...(res.sun_drying_hours_needed ? [`Sun drying needed: approximately ${res.sun_drying_hours_needed} hours.`] : []),
    ...(res.traditional_preservation_tips || []),
    ...(res.enwr_warehouse_pledge_benefit ? [res.enwr_warehouse_pledge_benefit] : [])
  ];

  storageRiskResultContainer.innerHTML = `
    <div class="rounded-2xl p-5 border ${riskColor} space-y-4 animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider">Moisture Risk Diagnostic:</span>
          <h4 class="text-lg font-black">${cropName}</h4>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono font-bold">Tested: ${measuredMoist}% (Safe: ≤ ${safeMoist}%)</span>
          <span class="${badgeColor} px-3 py-1 rounded-full text-xs font-black uppercase">
            ${riskLabel}
          </span>
        </div>
      </div>

      <div class="space-y-2 text-xs">
        <div class="font-bold">⚠️ Spoilage & Infestation Warnings:</div>
        <ul class="list-disc list-inside space-y-1 opacity-90">
          ${warnings.map(w => `<li>${w}</li>`).join("")}
        </ul>
      </div>

      <div class="bg-white/80 rounded-xl p-4 text-xs space-y-2 text-slate-800 border border-black/5">
        <div class="font-bold text-slate-900 flex items-center gap-1.5">
          <span>☀️</span> <span>Recommended Drying & Preservation Protocol:</span>
        </div>
        <ol class="list-decimal list-inside space-y-1 text-slate-700">
          ${actionPlan.map(p => `<li>${p}</li>`).join("")}
        </ol>
      </div>
    </div>
  `;
}





// ============================================================================
// 10 NEW AG-TECH FEATURES IMPLEMENTATION (100% Zero Cost / Browser Native)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. INTERACTIVE SATELLITE FIELD PLOTTER & FENCING CALCULATOR (Leaflet + Esri)
// ----------------------------------------------------------------------------

let satMap = null;
let satPolygonPoints = [];
let satPolygonLayer = null;
let satMarkersGroup = null;
let currentSatAcres = 0;
let currentSatPerimM = 0;

function openSatelliteMapModal() {
  if (!satelliteMapModal) return;
  satelliteMapModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(initSatelliteMap, 150);
}

function closeSatelliteMapModal() {
  if (!satelliteMapModal) return;
  satelliteMapModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function initSatelliteMap() {
  if (satMap) {
    satMap.invalidateSize();
    return;
  }
  if (typeof L === "undefined") {
    showToast("Leaflet mapping library is loading. Please check internet connection.", "warning");
    return;
  }

  const lat = (appState.weatherData && appState.weatherData.lat) || 21.1458;
  const lon = (appState.weatherData && appState.weatherData.lon) || 79.0882;

  satMap = L.map("leafletSatelliteMap", {
    center: [lat, lon],
    zoom: 16,
    maxZoom: 19
  });

  // Free Esri World Imagery (Zero cost, high-resolution satellite tiles)
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics"
  }).addTo(satMap);

  satMarkersGroup = L.layerGroup().addTo(satMap);

  satMap.on("click", (e) => {
    addSatellitePoint(e.latlng);
  });

  locateUserOnSatelliteMap();
}

function locateUserOnSatelliteMap() {
  if (!satMap) return;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        satMap.setView([lat, lon], 17);
        L.circleMarker([lat, lon], {
          radius: 7,
          color: "#38bdf8",
          fillColor: "#0284c7",
          fillOpacity: 0.9
        }).addTo(satMap).bindPopup("📍 Your Current Field Location").openPopup();
      },
      (err) => {
        console.warn("Satellite GPS locate failed:", err);
      },
      { timeout: 6000 }
    );
  }
}

function addSatellitePoint(latlng) {
  satPolygonPoints.push(latlng);

  const marker = L.circleMarker(latlng, {
    radius: 6,
    color: "#ffffff",
    weight: 2,
    fillColor: "#10b981",
    fillOpacity: 1
  });
  satMarkersGroup.addLayer(marker);

  updateSatellitePolygon();
}

function clearSatellitePolygon() {
  satPolygonPoints = [];
  if (satMarkersGroup) satMarkersGroup.clearLayers();
  if (satPolygonLayer && satMap) {
    satMap.removeLayer(satPolygonLayer);
    satPolygonLayer = null;
  }
  updateSatelliteCalculations(0, 0);
}

function updateSatellitePolygon() {
  if (!satMap) return;
  if (satPolygonLayer) {
    satMap.removeLayer(satPolygonLayer);
    satPolygonLayer = null;
  }

  const badge = document.getElementById("satPointsBadge");
  if (badge) badge.textContent = `Corners: ${satPolygonPoints.length} points`;

  if (satPolygonPoints.length < 2) {
    updateSatelliteCalculations(0, 0);
    return;
  }

  if (satPolygonPoints.length === 2) {
    satPolygonLayer = L.polyline(satPolygonPoints, { color: "#10b981", weight: 3, dashArray: "5, 5" }).addTo(satMap);
    const p1 = satPolygonPoints[0];
    const p2 = satPolygonPoints[1];
    const distM = p1.distanceTo(p2);
    updateSatelliteCalculations(0, distM);
    return;
  }

  satPolygonLayer = L.polygon(satPolygonPoints, {
    color: "#10b981",
    weight: 3,
    fillColor: "#10b981",
    fillOpacity: 0.25
  }).addTo(satMap);

  const areaSqM = computePolygonAreaSqM(satPolygonPoints);
  const perimM = computePolygonPerimeterM(satPolygonPoints);
  updateSatelliteCalculations(areaSqM, perimM);
}

function computePolygonPerimeterM(points) {
  let perim = 0;
  for (let i = 0; i < points.length; i++) {
    const nextIdx = (i + 1) % points.length;
    perim += points[i].distanceTo(points[nextIdx]);
  }
  return perim;
}

function computePolygonAreaSqM(points) {
  if (points.length < 3) return 0;
  let area = 0;
  const rad = Math.PI / 180;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    area += (p2.lng * rad - p1.lng * rad) * (2 + Math.sin(p1.lat * rad) + Math.sin(p2.lat * rad));
  }
  area = Math.abs(area * 6378137 * 6378137 / 2.0);
  return area;
}

function updateSatelliteCalculations(areaSqM, perimM) {
  currentSatPerimM = perimM;
  currentSatAcres = areaSqM / 4046.86;
  const guntha = currentSatAcres * 40.0;
  const bigha = currentSatAcres * 1.613;

  const elAcres = document.getElementById("satAreaAcres");
  const elGuntha = document.getElementById("satAreaGuntha");
  const elBigha = document.getElementById("satAreaBigha");
  const elPerim = document.getElementById("satPerimeterM");

  if (elAcres) elAcres.textContent = currentSatAcres.toFixed(2);
  if (elGuntha) elGuntha.textContent = guntha.toFixed(1);
  if (elBigha) elBigha.textContent = bigha.toFixed(2);
  if (elPerim) elPerim.textContent = `${Math.round(perimM)} m`;

  updateSatelliteFencingCalc();
}

function updateSatelliteFencingCalc() {
  const fenceType = document.getElementById("fenceTypeSelect")?.value || "barbed_4";
  const spacingM = parseFloat(document.getElementById("fencePoleSpacing")?.value) || 3.0;
  const poleType = document.getElementById("fencePoleType")?.value || "cement";

  const perimM = currentSatPerimM || 0;
  let strands = 4;
  let isChainLink = false;
  let isSolar = false;

  if (fenceType === "barbed_3") strands = 3;
  else if (fenceType === "barbed_4") strands = 4;
  else if (fenceType === "solar_electric") { strands = 3; isSolar = true; }
  else if (fenceType === "chain_link") { isChainLink = true; }

  const totalWireM = isChainLink ? Math.round(perimM) : Math.round(perimM * strands);
  const wireKg = isChainLink ? Math.round(perimM * 2.8) : Math.round(totalWireM / 10.0);
  const polesCount = perimM > 0 ? Math.ceil(perimM / spacingM) + 4 : 0;

  let poleRate = 280;
  if (poleType === "iron") poleRate = 350;
  else if (poleType === "wood") poleRate = 120;

  const wireCost = isChainLink ? (perimM * 220) : (wireKg * 85.0);
  const poleCost = polesCount * poleRate;
  const laborAndAccessories = perimM * 25.0 + (isSolar ? 15000.0 : 0);
  const totalCost = Math.round(wireCost + poleCost + laborAndAccessories);

  const elWireM = document.getElementById("fenceWireMeters");
  const elWireKg = document.getElementById("fenceWireKg");
  const elPoles = document.getElementById("fencePolesCount");
  const elCost = document.getElementById("fenceTotalCost");

  if (elWireM) elWireM.textContent = `${totalWireM} m`;
  if (elWireKg) elWireKg.textContent = `${wireKg} kg`;
  if (elPoles) elPoles.textContent = `${polesCount} poles`;
  if (elCost) elCost.textContent = `₹${totalCost.toLocaleString("en-IN")}`;
}

function applySatelliteAcres() {
  if (currentSatAcres <= 0.01) {
    showToast("Please plot at least 3 points on the satellite map first.", "warning");
    return;
  }
  const acresVal = parseFloat(currentSatAcres.toFixed(2));
  if (landSizeInput) {
    landSizeInput.value = acresVal;
    landSizeInput.dispatchEvent(new Event("change"));
  }
  const inputs = ["fertLandAcres", "irrigLandInput", "organicLandInput", "sprayLandAcres", "seedLandAcres", "solarLandAcres", "machineryFarmAcres", "microAcresInput"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = acresVal;
  });

  closeSatelliteMapModal();
  showToast(`Applied ${acresVal} measured acres from satellite imagery!`, "success");
}

// ----------------------------------------------------------------------------
// 2. DYNAMIC CROP GROWTH CALENDAR & RFC 5545 .ICS EXPORT
// ----------------------------------------------------------------------------

let currentCalendarCropId = "wheat";
let currentIcsData = "";

async function openCropCalendarModal(cropId) {
  if (!cropCalendarModal) return;
  currentCalendarCropId = cropId || "wheat";
  cropCalendarModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  const timelineContainer = document.getElementById("cropCalendarTimelineContainer");
  if (timelineContainer) {
    timelineContainer.innerHTML = `<div class="p-8 text-center text-slate-500 font-bold animate-pulse">Loading agronomic growth calendar...</div>`;
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const acres = parseFloat(landSizeInput?.value) || 1.0;

  try {
    const res = await fetch(`${API_BASE}/crop-calendar/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop_id: currentCalendarCropId,
        sowing_date: todayStr,
        land_size_acres: acres
      })
    });

    if (res.ok) {
      const data = await res.json();
      renderCropCalendarData(data);
    } else {
      throw new Error("API offline");
    }
  } catch (err) {
    console.warn("Using offline calendar generator:", err);
    const fallback = generateOfflineCropCalendar(currentCalendarCropId, todayStr, acres);
    renderCropCalendarData(fallback);
  }
}

function closeCropCalendarModal() {
  if (!cropCalendarModal) return;
  cropCalendarModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderCropCalendarData(data) {
  const modalTitle = document.getElementById("calendarCropModalTitle");
  const summaryEl = document.getElementById("calSowingSummary");
  const durationEl = document.getElementById("calDurationDays");
  const timelineContainer = document.getElementById("cropCalendarTimelineContainer");

  currentIcsData = data.ics_calendar_text || "";

  if (modalTitle) modalTitle.textContent = `📅 ${data.crop_name} Dynamic Growth Calendar & Phone Reminders`;
  if (summaryEl) summaryEl.textContent = `Sowing: ${data.sowing_date}  ➔  Expected Harvest: ${data.harvest_date}`;
  if (durationEl) durationEl.textContent = `Total Lifecycle: ${data.total_duration_days} Days`;

  if (!timelineContainer) return;

  timelineContainer.innerHTML = (data.events || []).map((ev, i) => {
    const icons = {
      "Sowing": "🌱",
      "Irrigation": "💧",
      "Weeding": "🌿",
      "Nutrient": "🧪",
      "Pest Management": "🐛",
      "Harvesting": "🌾"
    };
    const icon = icons[ev.activity_type] || "📌";

    return `
      <div class="relative pl-6 pb-4 border-l-2 border-emerald-300 last:border-l-0">
        <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow">
          ${i + 1}
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                ${ev.activity_type} • Day ${ev.day_offset}
              </span>
              <h4 class="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
                <span>${icon}</span> <span>${ev.phase_name}</span>
              </h4>
            </div>
            <span class="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              📅 ${ev.target_date}
            </span>
          </div>

          <p class="text-slate-700 leading-relaxed text-xs">
            ${ev.action_required}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div class="bg-amber-50 p-2 rounded-lg text-amber-900 border border-amber-200">
              <strong class="block">⚠️ Critical Alert:</strong>
              ${ev.critical_alert}
            </div>
            <div class="bg-sky-50 p-2 rounded-lg text-sky-900 border border-sky-200">
              <strong class="block">⛅ Weather Sensitivity:</strong>
              ${ev.weather_sensitivity}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function downloadCropCalendarIcs() {
  if (!currentIcsData) {
    showToast("No calendar data to export.", "warning");
    return;
  }
  const blob = new Blob([currentIcsData], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `crop_calendar_${currentCalendarCropId}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Calendar downloaded! Open the .ics file to sync with Google / Apple / Android calendar.", "success");
}

function generateOfflineCropCalendar(cropId, sowingDateStr, acres) {
  const sDate = new Date(sowingDateStr || new Date());
  const found = LOCAL_CROPS_DB.find(c => c.id === cropId);
  const cropName = found ? found.name : cropId.toUpperCase();
  let totalDays = 120;
  if (found && found.duration_days) {
    const num = parseInt(found.duration_days);
    if (!isNaN(num)) totalDays = num;
  }

  const addDays = (d, n) => {
    const res = new Date(d);
    res.setDate(res.getDate() + n);
    return res.toISOString().split("T")[0];
  };

  const events = [
    {
      day_offset: 0,
      target_date: addDays(sDate, 0),
      phase_name: "Sowing & Basal Nutrients",
      activity_type: "Sowing",
      action_required: "Treat seed with Trichoderma (5g/kg). Broadcast basal fertilizer (DAP + MOP + 1/3rd Urea). Sow at optimum seed depth.",
      critical_alert: "Ensure adequate soil moisture before drilling seed.",
      weather_sensitivity: "Avoid sowing right before torrential rain to prevent soil crusting."
    },
    {
      day_offset: Math.min(21, Math.round(totalDays * 0.18)),
      target_date: addDays(sDate, Math.min(21, Math.round(totalDays * 0.18))),
      phase_name: "Crown Root & Early Vegetative Vigor",
      activity_type: "Irrigation",
      action_required: "Provide 1st critical irrigation. Apply 1st top dressing of Urea (1/3rd dose) along with light intercultural weeding.",
      critical_alert: "Moisture stress at this stage permanently reduces tillering and yield.",
      weather_sensitivity: "Postpone irrigation if rainfall > 15 mm is forecast."
    },
    {
      day_offset: Math.min(35, Math.round(totalDays * 0.30)),
      target_date: addDays(sDate, Math.min(35, Math.round(totalDays * 0.30))),
      phase_name: "Active Tillering & Weed Management",
      activity_type: "Weeding",
      action_required: "Perform secondary manual weeding or apply selective post-emergence herbicide. Check leaf undersides for sucking pests.",
      critical_alert: "Weed competition in first 40 days causes 30-40% yield drop.",
      weather_sensitivity: "Spray herbicide only during calm wind (< 12 km/h)."
    },
    {
      day_offset: Math.round(totalDays * 0.50),
      target_date: addDays(sDate, Math.round(totalDays * 0.50)),
      phase_name: "Stem Elongation & Panicle / Bud Initiation",
      activity_type: "Nutrient",
      action_required: "Broadcast remaining 1/3rd Urea. Apply foliar micronutrient booster (Zinc + Boron 0.1%) to enhance flowering.",
      critical_alert: "Do not delay nitrogen application beyond this point to avoid vegetative lodging.",
      weather_sensitivity: "Avoid over-irrigation during strong wind gusts to prevent lodging."
    },
    {
      day_offset: Math.round(totalDays * 0.70),
      target_date: addDays(sDate, Math.round(totalDays * 0.70)),
      phase_name: "Flowering & Grain / Fruit Filling",
      activity_type: "Pest Management",
      action_required: "Maintain soil moisture at field capacity. Scout for caterpillars/borers. Install pheromone traps.",
      critical_alert: "Never spray synthetic chemical insecticides during morning pollination.",
      weather_sensitivity: "Extreme heat (> 38°C) desiccates pollen; light evening sprinkler helps."
    },
    {
      day_offset: totalDays,
      target_date: addDays(sDate, totalDays),
      phase_name: "Physiological Maturity & Harvest",
      activity_type: "Harvesting",
      action_required: "Harvest when 80-85% grains or pods turn golden brown. Sun dry on clean tarpaulin to safe moisture limit.",
      critical_alert: "Do not delay harvest to prevent grain shattering and unseasonal rain spoilage.",
      weather_sensitivity: "Strict dry weather required for harvesting and threshing."
    }
  ];

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AgriAssist//Dynamic Crop Sowing Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];
  events.forEach(ev => {
    const dClean = ev.target_date.replace(/-/g, "");
    icsLines.push("BEGIN:VEVENT");
    icsLines.push(`SUMMARY:AgriAssist: ${cropName} - ${ev.phase_name}`);
    icsLines.push(`DESCRIPTION:${ev.action_required} | Alert: ${ev.critical_alert}`);
    icsLines.push(`DTSTART;VALUE=DATE:${dClean}`);
    icsLines.push(`DTEND;VALUE=DATE:${dClean}`);
    icsLines.push("STATUS:CONFIRMED");
    icsLines.push("END:VEVENT");
  });
  icsLines.push("END:VCALENDAR");

  return {
    crop_id: cropId,
    crop_name: cropName,
    sowing_date: sowingDateStr,
    harvest_date: addDays(sDate, totalDays),
    total_duration_days: totalDays,
    events: events,
    ics_calendar_text: icsLines.join("\r\n")
  };
}

// ----------------------------------------------------------------------------
// 3. LEAF DISEASE SCANNER & OPTICAL SPECTRUM ANALYZER (HTML5 Canvas)
// ----------------------------------------------------------------------------

function handleLeafPhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const fileNameEl = document.getElementById("leafFileName");
  if (fileNameEl) fileNameEl.textContent = `📷 ${file.name} (${Math.round(file.size / 1024)} KB)`;

  const canvas = document.getElementById("leafCanvas");
  const placeholder = document.getElementById("leafCanvasPlaceholder");

  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = 320;
      canvas.height = 220;
      ctx.drawImage(img, 0, 0, 320, 220);
      if (placeholder) placeholder.classList.add("hidden");
      canvas.classList.remove("hidden");

      analyzeLeafPixels(ctx, 320, 220);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function analyzeLeafPixels(ctx, w, h) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let totalSampled = 0;
  let greenCount = 0;
  let yellowCount = 0;
  let brownCount = 0;
  let whiteCount = 0;

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;
    const brightness = (r + g + b) / 3;
    if (brightness < 20 || brightness > 245) continue;

    totalSampled++;

    if (g > r * 1.15 && g > b * 1.15) {
      greenCount++;
    } else if (r > 130 && g > 130 && b < 100 && Math.abs(r - g) < 55) {
      yellowCount++;
    } else if (r > 60 && r < 160 && g < 110 && b < 85 && r > g) {
      brownCount++;
    } else if (r > 175 && g > 175 && b > 165 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25) {
      whiteCount++;
    } else if (g >= r && g >= b) {
      greenCount++;
    } else {
      brownCount++;
    }
  }

  if (totalSampled === 0) totalSampled = 1;

  const greenPct = Math.round((greenCount / totalSampled) * 100);
  const yellowPct = Math.round((yellowCount / totalSampled) * 100);
  const brownPct = Math.round((brownCount / totalSampled) * 100);
  const whitePct = Math.round((whiteCount / totalSampled) * 100);

  const spectrumBars = document.getElementById("leafSpectrumBars");
  if (spectrumBars) spectrumBars.classList.remove("hidden");

  const specG = document.getElementById("specGreenPct");
  const barG = document.getElementById("barGreen");
  const specY = document.getElementById("specYellowPct");
  const barY = document.getElementById("barYellow");
  const specB = document.getElementById("specBrownPct");
  const barB = document.getElementById("barBrown");
  const specW = document.getElementById("specWhitePct");
  const barW = document.getElementById("barWhite");

  if (specG) specG.textContent = `${greenPct}%`;
  if (barG) barG.style.width = `${greenPct}%`;
  if (specY) specY.textContent = `${yellowPct}%`;
  if (barY) barY.style.width = `${yellowPct}%`;
  if (specB) specB.textContent = `${brownPct}%`;
  if (barB) barB.style.width = `${brownPct}%`;
  if (specW) specW.textContent = `${whitePct}%`;
  if (barW) barW.style.width = `${whitePct}%`;

  const verdictEl = document.getElementById("leafScannerVerdict");
  if (!verdictEl) return;
  verdictEl.classList.remove("hidden");

  let verdictTitle = "Healthy Plant Canopy";
  let diagnosis = "";
  let searchKeyword = "";

  if (brownPct > 20) {
    verdictTitle = "⚠️ Necrosis / Fungal Blight Lesions Detected";
    diagnosis = `High necrotic brown surface (${brownPct}%). Characteristic of Early/Late Blight, Cercospora Leaf Spot, or Anthracnose fungal damage.`;
    searchKeyword = "Blight";
  } else if (whitePct > 18) {
    verdictTitle = "⚠️ Powdery / Downy Mildew Infection Detected";
    diagnosis = `White superficial mycelium patches detected (${whitePct}%). High likelihood of Powdery Mildew or Sucking Pest Honeydew mold.`;
    searchKeyword = "Mildew";
  } else if (yellowPct > 25) {
    verdictTitle = "⚠️ Chlorosis / Severe Nutrient Deficiency Detected";
    diagnosis = `Interveinal or marginal yellowing detected (${yellowPct}%). Points to Nitrogen/Iron deficiency or Yellow Mosaic Virus.`;
    searchKeyword = "Mosaic";
  } else if (greenPct >= 70) {
    verdictTitle = "✅ Dominantly Healthy Foliage";
    diagnosis = `Over ${greenPct}% active green photosynthetic tissue. Minimal necrotic or chlorotic spots observed.`;
    searchKeyword = "";
  } else {
    verdictTitle = "⚠️ Mixed Leaf Stress Symptoms";
    diagnosis = `Moderate discoloration (Yellow ${yellowPct}%, Brown ${brownPct}%). Suggests early pest infestation or moisture stress.`;
    searchKeyword = "Rot";
  }

  verdictEl.innerHTML = `
    <div class="space-y-1 text-left">
      <div class="font-extrabold text-xs text-rose-950">${verdictTitle}</div>
      <p class="text-[11px] font-normal leading-tight text-slate-700">${diagnosis}</p>
      ${searchKeyword ? `
        <div class="pt-1.5 flex justify-end">
          <button type="button" onclick="autoFilterDoctorWithKeyword('${searchKeyword}')" class="bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-sm transition">
            🩺 Filter "${searchKeyword}" in Plant Doctor
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

function autoFilterDoctorWithKeyword(kw) {
  switchTab("doctor");
  if (doctorSearchInput) {
    doctorSearchInput.value = kw;
    doctorSearchInput.dispatchEvent(new Event("input"));
  }
}
window.autoFilterDoctorWithKeyword = autoFilterDoctorWithKeyword;

// ----------------------------------------------------------------------------
// 4. MANDI DISTANCE & NET PROFIT ARBITRAGE CALCULATOR
// ----------------------------------------------------------------------------

async function executeMandiArbitrage() {
  const cropId = document.getElementById("arbCropSelect")?.value || "wheat";
  const qty = parseFloat(document.getElementById("arbQuantityInput")?.value) || 35.0;
  const vehicleType = document.getElementById("arbVehicleSelect")?.value || "Tractor Trolley";
  const dieselPrice = parseFloat(document.getElementById("arbDieselPriceInput")?.value) || 90.0;

  const localPrice = parseFloat(document.getElementById("arbLocalPriceInput")?.value) || 2250.0;
  const localDist = parseFloat(document.getElementById("arbLocalDistInput")?.value) || 12.0;

  const distPrice = parseFloat(document.getElementById("arbDistantPriceInput")?.value) || 2420.0;
  const distDist = parseFloat(document.getElementById("arbDistantDistInput")?.value) || 48.0;

  const container = document.getElementById("mandiArbitrageResultContainer");
  if (!container) return;
  container.classList.remove("hidden");
  container.innerHTML = `<div class="p-6 text-center text-slate-500 font-bold animate-pulse">Calculating net arbitrage profit...</div>`;

  try {
    const res = await fetch(`${API_BASE}/mandi-prices/arbitrage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop_id: cropId,
        quantity_quintals: qty,
        local_mandi_name: "Local Mandi",
        local_mandi_price: localPrice,
        local_mandi_distance_km: localDist,
        distant_mandi_name: "Distant Terminal APMC",
        distant_mandi_price: distPrice,
        distant_mandi_distance_km: distDist,
        vehicle_type: vehicleType,
        diesel_price_per_liter: dieselPrice
      })
    });
    if (!res.ok) throw new Error("API offline");
    const data = await res.json();
    renderMandiArbitrageResult(data);
  } catch (err) {
    console.warn("Using offline Mandi Arbitrage calculation:", err);
    const vLower = vehicleType.toLowerCase();
    const mileage = vLower.includes("tractor") ? 4.0 : (vLower.includes("pickup") ? 9.0 : 3.5);
    const localFuel = ((localDist * 2) / mileage) * dieselPrice;
    const distFuel = ((distDist * 2) / mileage) * dieselPrice;
    const toll = distDist > 35 ? 100 : 0;
    const localTransport = Math.round(localFuel + 200 + (qty * localPrice * 0.01));
    const distTransport = Math.round(distFuel + 400 + (qty * distPrice * 0.01) + toll);
    const localGross = Math.round(qty * localPrice);
    const distGross = Math.round(qty * distPrice);
    const localNet = localGross - localTransport;
    const distNet = distGross - distTransport;
    const netDiff = distNet - localNet;
    const isWorth = netDiff > 0;

    renderMandiArbitrageResult({
      quantity_quintals: qty,
      local_gross_revenue: localGross,
      local_transport_cost: localTransport,
      local_net_revenue: localNet,
      distant_gross_revenue: distGross,
      distant_transport_cost: distTransport,
      distant_net_revenue: distNet,
      net_profit_difference: netDiff,
      is_distant_mandi_worth_it: isWorth,
      break_even_price_per_quintal: Math.round((localNet + distTransport) / qty),
      recommendation: isWorth
        ? `✅ GO TO DISTANT MANDI: You will earn an extra net in-hand profit of ₹${netDiff.toLocaleString("en-IN")} after accounting for ₹${distTransport.toLocaleString("en-IN")} in round-trip diesel and transport.`
        : `🛑 SELL LOCALLY: Distant rate appears higher, but extra fuel and transport costs will cause a NET LOSS of ₹${Math.abs(netDiff).toLocaleString("en-IN")}!`,
      round_trip_km_distant: distDist * 2,
      fuel_liters_consumed_distant: Math.round((distDist * 2) / mileage)
    });
  }
}

function renderMandiArbitrageResult(res) {
  const container = document.getElementById("mandiArbitrageResultContainer");
  if (!container) return;

  const isWorth = res.is_distant_mandi_worth_it;
  const cardColor = isWorth ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950";
  const badgeColor = isWorth ? "bg-emerald-700 text-white" : "bg-rose-700 text-white";

  container.innerHTML = `
    <div class="rounded-2xl p-5 border ${cardColor} space-y-4 animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider">Mandi Arbitrage Verdict:</span>
          <h4 class="text-base font-black">${isWorth ? "Profitable to Transport" : "Better to Sell Locally"}</h4>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono font-bold">Volume: ${res.quantity_quintals} Quintals</span>
          <span class="${badgeColor} px-3 py-1 rounded-full text-xs font-bold">
            ${isWorth ? `+ ₹${res.net_profit_difference.toLocaleString("en-IN")} Net Extra` : `- ₹${Math.abs(res.net_profit_difference).toLocaleString("en-IN")} Net Loss`}
          </span>
        </div>
      </div>

      <div class="p-3 bg-white/80 rounded-xl border border-black/5 text-xs font-semibold leading-relaxed">
        ${res.recommendation}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div class="font-bold text-slate-900 border-b border-slate-100 pb-1 flex justify-between">
            <span>🏠 Local Mandi</span>
            <span class="text-slate-500">Local</span>
          </div>
          <div class="flex justify-between"><span>Gross Revenue:</span> <strong>₹${res.local_gross_revenue.toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between text-rose-700"><span>Transport & Mandi Fee:</span> <strong>- ₹${res.local_transport_cost.toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between text-slate-900 font-extrabold pt-1 border-t border-slate-100 text-sm">
            <span>In-Hand Net:</span> <span class="text-emerald-700">₹${res.local_net_revenue.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div class="font-bold text-slate-900 border-b border-slate-100 pb-1 flex justify-between">
            <span>🚛 Distant Terminal APMC</span>
            <span class="text-slate-500 font-mono">${res.round_trip_km_distant} km RT</span>
          </div>
          <div class="flex justify-between"><span>Gross Revenue:</span> <strong>₹${res.distant_gross_revenue.toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between text-rose-700"><span>Transport, Fuel & Toll:</span> <strong>- ₹${res.distant_transport_cost.toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between text-slate-900 font-extrabold pt-1 border-t border-slate-100 text-sm">
            <span>In-Hand Net:</span> <span class="${isWorth ? "text-emerald-700 font-black" : "text-rose-700"}">₹${res.distant_net_revenue.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div class="text-[11px] text-slate-600 flex flex-wrap justify-between items-center pt-1 border-t border-black/5">
        <span>Fuel Consumed: ~${res.fuel_liters_consumed_distant} Liters Diesel</span>
        <span>Break-Even Distant Rate: <strong>₹${res.break_even_price_per_quintal} / quintal</strong></span>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// 5. SOIL HEALTH CARD MICRONUTRIENT DOCTOR
// ----------------------------------------------------------------------------

function populateMicronutrientCropOptions() {
  const sel = document.getElementById("microCropSelect");
  if (!sel) return;
  sel.innerHTML = LOCAL_CROPS_DB.map(c => `
    <option value="${c.id}">${c.name}${c.hindi_name ? ` (${c.hindi_name})` : ""}</option>
  `).join("");
}

async function executeMicronutrientDoctor() {
  const cropId = document.getElementById("microCropSelect")?.value || "wheat";
  const acres = parseFloat(document.getElementById("microAcresInput")?.value) || 1.0;
  const zn = parseFloat(document.getElementById("microZincInput")?.value) || 0.45;
  const s = parseFloat(document.getElementById("microSulfurInput")?.value) || 8.0;
  const b = parseFloat(document.getElementById("microBoronInput")?.value) || 0.35;
  const fe = parseFloat(document.getElementById("microIronInput")?.value) || 3.8;
  const oc = parseFloat(document.getElementById("microOCInput")?.value) || 0.45;

  const container = document.getElementById("micronutrientResultContainer");
  if (!container) return;
  container.classList.remove("hidden");
  container.innerHTML = `<div class="p-6 text-center text-slate-500 font-bold animate-pulse">Analyzing Soil Health Card micronutrients...</div>`;

  try {
    const res = await fetch(`${API_BASE}/fertilizer/micronutrients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop_id: cropId,
        land_size_acres: acres,
        zinc_ppm: zn,
        sulfur_ppm: s,
        boron_ppm: b,
        iron_ppm: fe,
        organic_carbon_pct: oc
      })
    });
    if (!res.ok) throw new Error("API offline");
    const data = await res.json();
    renderMicronutrientResult(data);
  } catch (err) {
    console.warn("Using offline Micronutrient calculation:", err);
    const pres = [];
    let totCost = 0;
    if (zn < 0.6) {
      const kg = Math.round(10 * acres);
      totCost += kg * 45;
      pres.push({
        nutrient: "Zinc (Zn)",
        soil_status: zn < 0.4 ? "Critical Deficient" : "Low / Deficient",
        measured_value: zn,
        critical_threshold: "0.60 ppm",
        recommended_fertilizer: "Zinc Sulphate Heptahydrate (ZnSO4 21%)",
        dosage_kg_per_acre: 10.0,
        total_dosage_kg: kg,
        application_method: "Broadcast as basal dose before final plowing. DO NOT mix directly with DAP.",
        visual_deficiency_symptom: "Khaira disease in paddy (rusty brown patches on middle leaves); white bud in maize; bleached interveinal bands in wheat."
      });
    }
    if (s < 10.0) {
      const kg = Math.round(10 * acres);
      totCost += kg * 38;
      pres.push({
        nutrient: "Sulfur (S)",
        soil_status: s < 6.0 ? "Critical Deficient" : "Low / Deficient",
        measured_value: s,
        critical_threshold: "10.0 ppm",
        recommended_fertilizer: "Bentonite Sulphur (90% S) or Agricultural Gypsum",
        dosage_kg_per_acre: 10.0,
        total_dosage_kg: kg,
        application_method: "Broadcast at sowing. In alkaline soil, Gypsum (50 kg/acre) supplies both Calcium and Sulfur.",
        visual_deficiency_symptom: "Uniform pale yellowing starting on younger top leaves; low seed oil percentage."
      });
    }
    if (b < 0.5) {
      const kg = Math.round(1.5 * acres);
      totCost += kg * 120;
      pres.push({
        nutrient: "Boron (B)",
        soil_status: "Low / Deficient",
        measured_value: b,
        critical_threshold: "0.50 ppm",
        recommended_fertilizer: "Agricultural Borax (10.5% B) or Solubor",
        dosage_kg_per_acre: 1.5,
        total_dosage_kg: kg,
        application_method: "Apply with sand/FYM at sowing or 2 foliar sprays of Solubor (1g/L) before flowering.",
        visual_deficiency_symptom: "Hollow heart in cauliflower; tomato fruit cracking; poor pollen viability and seed set."
      });
    }
    if (fe < 4.5) {
      const kg = Math.round(8.0 * acres);
      totCost += kg * 30;
      pres.push({
        nutrient: "Iron (Fe)",
        soil_status: "Low / Deficient",
        measured_value: fe,
        critical_threshold: "4.50 ppm",
        recommended_fertilizer: "Ferrous Sulphate (FeSO4 19% Fe)",
        dosage_kg_per_acre: 8.0,
        total_dosage_kg: kg,
        application_method: "Foliar spray: 0.5% FeSO4 (5g/L) + 0.1% Citric Acid (1g/L) at 30-40 days.",
        visual_deficiency_symptom: "Interveinal chlorosis on young emerging leaves; leaf veins stay dark green while blade turns pale ivory."
      });
    }

    renderMicronutrientResult({
      land_size_acres: acres,
      prescriptions: pres,
      organic_manure_advice: oc < 0.5
        ? `CRITICAL: Soil Organic Carbon is low (${oc}% < 0.50%). Apply ${(2.5 * acres).toFixed(1)} Tons FYM or 1 Ton Vermicompost before sowing.`
        : `Soil Organic Carbon is ${oc}%. Maintain humus by regular compost addition.`,
      foliar_spray_options: [
        "Zinc Emergency Spray: Dissolve 500g ZnSO4 (21%) + 250g unslaked Lime in 100 Liters of water per acre at 30 & 45 days after sowing.",
        "Boron Foliar Spray: Dissolve 100g to 150g Solubor (20% B) in 100 Liters of water per acre during vegetative and pre-flowering stage.",
        "Iron Emergency Spray: Dissolve 500g FeSO4 + 100g Citric Acid in 100 Liters of water per acre for rapid recovery from chlorosis."
      ],
      approx_total_cost_inr: totCost
    });
  }
}

function renderMicronutrientResult(res) {
  const container = document.getElementById("micronutrientResultContainer");
  if (!container) return;

  const presList = (res.prescriptions || []).map(p => {
    const isDef = p.soil_status.toLowerCase().includes("defic");
    const badgeColor = isDef ? "bg-rose-100 text-rose-800 border-rose-300" : "bg-emerald-100 text-emerald-800 border-emerald-300";

    return `
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full ${isDef ? "bg-rose-500" : "bg-emerald-500"}"></span>
            <strong class="text-sm text-slate-900">${p.nutrient}</strong>
            <span class="text-[11px] font-mono text-slate-500">(Tested: ${p.measured_value} ppm vs Limit: ${p.critical_threshold})</span>
          </div>
          <span class="${badgeColor} px-2.5 py-0.5 rounded-full text-xs font-bold border">
            ${p.soil_status}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span class="text-slate-500 block text-[11px]">Recommended Commercial Fertilizer:</span>
            <strong class="text-teal-900">${p.recommended_fertilizer}</strong>
          </div>
          <div>
            <span class="text-slate-500 block text-[11px]">Required Quantity (${res.land_size_acres} Acres):</span>
            <strong class="text-slate-900">${p.total_dosage_kg} kg (${p.dosage_kg_per_acre} kg/acre)</strong>
          </div>
        </div>

        <div class="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 text-slate-700">
          <div><strong class="text-slate-900">Application Method:</strong> ${p.application_method}</div>
          <div class="text-[11px] text-amber-900"><strong class="text-slate-900">Deficiency Symptom:</strong> ${p.visual_deficiency_symptom}</div>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-5 animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-teal-200/80 pb-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-teal-950">Soil Health Card Prescription:</span>
          <h4 class="text-base font-black text-slate-900">Micronutrient & Soil Organic Carbon Doctor</h4>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-600 block">Est. Micronutrient Investment:</span>
          <strong class="text-lg font-black text-teal-950">₹${Math.round(res.approx_total_cost_inr || 0).toLocaleString("en-IN")}</strong>
        </div>
      </div>

      <div class="space-y-3">
        ${presList}
      </div>

      <div class="bg-white p-4 rounded-xl border border-teal-300 space-y-2 text-xs">
        <div class="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
          <span>🌿</span> <span>Soil Organic Carbon (Humus) Diagnostic:</span>
        </div>
        <p class="text-slate-700 leading-relaxed">${res.organic_manure_advice}</p>
      </div>

      <div class="bg-white/80 p-4 rounded-xl border border-teal-200 text-xs space-y-2">
        <div class="font-bold text-slate-900 flex items-center gap-1.5">
          <span>💧</span> <span>Zero-Waste Emergency Foliar Spray Recipes:</span>
        </div>
        <ul class="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
          ${(res.foliar_spray_options || []).map(f => `<li>${f}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// 6. FARM POND (KHET TALAB) & RAINWATER SIZER
// ----------------------------------------------------------------------------

async function executeFarmPondSizing() {
  const catchment = parseFloat(document.getElementById("pondCatchmentAcres")?.value) || 5.0;
  const rain = parseFloat(document.getElementById("pondRainfallInput")?.value) || 800.0;
  const soil = document.getElementById("pondSoilSelect")?.value || "Loam";
  const irrigAcres = parseFloat(document.getElementById("pondIrrigAcres")?.value) || 2.0;
  const dryDays = parseInt(document.getElementById("pondDrySpellDays")?.value) || 30;

  const container = document.getElementById("farmPondResultContainer");
  if (!container) return;
  container.classList.remove("hidden");
  container.innerHTML = `<div class="p-6 text-center text-slate-500 font-bold animate-pulse">Designing farm pond geometry & calculating subsidy...</div>`;

  try {
    const res = await fetch(`${API_BASE}/water-conservation/farm-pond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        catchment_acres: catchment,
        annual_rainfall_mm: rain,
        catchment_soil_type: soil,
        supplementary_irrigation_acres: irrigAcres,
        dry_spell_days_target: dryDays
      })
    });
    if (!res.ok) throw new Error("API offline");
    const data = await res.json();
    renderFarmPondResult(data);
  } catch (err) {
    console.warn("Using offline Farm Pond calculation:", err);
    const cRunoff = soil.toLowerCase().includes("clay") ? 0.32 : (soil.toLowerCase().includes("sandy") ? 0.15 : 0.22);
    const runoffVol = Math.round(catchment * 4046.86 * (rain / 1000) * cRunoff);
    const targetCuM = Math.round(Math.min(runoffVol * 0.6, Math.max(300, irrigAcres * 4046.86 * 0.05 * 2)));
    const depth = 3.0;
    const topW = Math.round(Math.sqrt((targetCuM / 2.25) / 1.3) * 10) / 10;
    const topL = Math.round(topW * 1.3 * 10) / 10;
    const botW = Math.max(4, Math.round((topW - 9) * 10) / 10);
    const botL = Math.max(5, Math.round((topL - 9) * 10) / 10);
    const actualVol = Math.round((depth / 6) * ((topL * topW) + (botL * botW) + (4 * ((topL + botL) / 2) * ((topW + botW) / 2))));
    const liters = actualVol * 1000;
    const lakhLiters = (liters / 100000).toFixed(2);
    const earthCost = actualVol * 65;
    const hdpeCost = Math.round(actualVol * 1.4 * 85);
    const totCost = earthCost + hdpeCost;
    const subsidy = Math.round(Math.min(totCost * 0.5, 105000));

    renderFarmPondResult({
      catchment_acres: catchment,
      annual_rainfall_mm: rain,
      runoff_volume_cu_meters: runoffVol,
      storage_capacity_liters: liters,
      storage_capacity_lakh_liters: lakhLiters,
      recommended_top_length_m: topL,
      recommended_top_width_m: topW,
      recommended_bottom_length_m: botL,
      recommended_bottom_width_m: botW,
      recommended_depth_m: depth,
      side_slope_ratio: "1:1.5 (V:H)",
      geomembrane_lining_area_sqm: Math.round(actualVol * 1.4),
      estimated_earthwork_cost_inr: earthCost,
      estimated_hdpe_lining_cost_inr: hdpeCost,
      estimated_total_cost_inr: totCost,
      pmksy_khet_talab_subsidy_inr: subsidy,
      net_farmer_cost_inr: totCost - subsidy,
      water_security_advisory: `A ${topL}m x ${topW}m pond (${depth}m deep) will impound ${lakhLiters} Lakh Liters of rainwater. This guarantees ${dryDays} days of drought buffer, sufficient for 2 lifesaver irrigations on ${irrigAcres} acres.`
    });
  }
}

function renderFarmPondResult(res) {
  const container = document.getElementById("farmPondResultContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-5 animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-blue-200 pb-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-950">Rainwater Harvesting Design:</span>
          <h4 class="text-base font-black text-slate-900">Farm Pond (Khet Talab) Engineering Specification</h4>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-500 block">Total Harvest Capacity:</span>
          <strong class="text-xl font-black text-blue-900">${res.storage_capacity_lakh_liters} Lakh Liters</strong>
        </div>
      </div>

      <div class="p-3 bg-white/80 rounded-xl border border-blue-100 text-xs text-slate-700 leading-relaxed font-semibold">
        💡 ${res.water_security_advisory}
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <span class="text-slate-500 block text-[11px]">Top Dimensions:</span>
          <strong class="text-slate-900 text-sm">${res.recommended_top_length_m}m × ${res.recommended_top_width_m}m</strong>
        </div>
        <div class="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <span class="text-slate-500 block text-[11px]">Bottom Bed:</span>
          <strong class="text-slate-900 text-sm">${res.recommended_bottom_length_m}m × ${res.recommended_bottom_width_m}m</strong>
        </div>
        <div class="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <span class="text-slate-500 block text-[11px]">Pond Depth:</span>
          <strong class="text-slate-900 text-sm">${res.recommended_depth_m} meters (~10 ft)</strong>
        </div>
        <div class="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <span class="text-slate-500 block text-[11px]">Side Slope:</span>
          <strong class="text-slate-900 text-sm">${res.side_slope_ratio}</strong>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
        <h5 class="font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2">
          <span>💰 Estimated Budget & PMKSY Government Subsidy</span>
          <span class="text-emerald-700 font-extrabold">50% Subsidy Eligible</span>
        </h5>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span class="text-slate-500 block text-[11px]">Earthwork Excavation (JCB):</span>
            <strong class="text-slate-800">₹${Math.round(res.estimated_earthwork_cost_inr).toLocaleString("en-IN")}</strong>
          </div>
          <div>
            <span class="text-slate-500 block text-[11px]">500-Micron HDPE Geomembrane:</span>
            <strong class="text-slate-800">₹${Math.round(res.estimated_hdpe_lining_cost_inr).toLocaleString("en-IN")}</strong>
            <span class="text-[10px] text-slate-400 block">${res.geomembrane_lining_area_sqm} sq.m lining</span>
          </div>
          <div>
            <span class="text-slate-500 block text-[11px]">Estimated Gross Cost:</span>
            <strong class="text-slate-900 font-extrabold">₹${Math.round(res.estimated_total_cost_inr).toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 bg-emerald-50 p-3 rounded-lg text-emerald-950">
          <div>
            <span class="block text-[11px] font-bold">PMKSY / State Khet Talab Subsidy:</span>
            <strong class="text-base text-emerald-800 font-black">- ₹${Math.round(res.pmksy_khet_talab_subsidy_inr).toLocaleString("en-IN")}</strong>
          </div>
          <div class="text-right">
            <span class="block text-[11px] font-bold">Net Farmer Share:</span>
            <strong class="text-lg text-slate-900 font-black">₹${Math.round(res.net_farmer_cost_inr).toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// 7. TRACTOR & MACHINERY RENT VS. BUY ECONOMICS
// ----------------------------------------------------------------------------

async function executeMachineryEconomics() {
  const machineType = document.getElementById("machineryTypeSelect")?.value || "Tractor 45-50 HP";
  const farmAcres = parseFloat(document.getElementById("machineryFarmAcres")?.value) || 8.0;
  const customAcres = parseFloat(document.getElementById("machineryCustomAcres")?.value) || 0.0;
  const customRate = parseFloat(document.getElementById("machineryCustomRate")?.value) || 0;

  const container = document.getElementById("machineryResultContainer");
  if (!container) return;
  container.classList.remove("hidden");
  container.innerHTML = `<div class="p-6 text-center text-slate-500 font-bold animate-pulse">Evaluating machinery depreciation, diesel costs, and break-even point...</div>`;

  try {
    const res = await fetch(`${API_BASE}/machinery/rent-vs-buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        machine_type: machineType,
        farm_size_acres: farmAcres,
        purchase_price_inr: null,
        custom_hire_rate_per_acre_or_hr: customRate > 0 ? customRate : null,
        commercial_rental_acres_to_others: customAcres
      })
    });
    if (!res.ok) throw new Error("API offline");
    const data = await res.json();
    renderMachineryResult(data);
  } catch (err) {
    console.warn("Using offline Machinery calculation:", err);
    const isTractor = machineType.toLowerCase().includes("tractor");
    const hoursPerAcre = isTractor ? 4.0 : 1.0;
    const price = isTractor ? 720000 : 120000;
    const rate = (customRate > 0 ? customRate : (isTractor ? 950 : 900)) * hoursPerAcre;
    const totalAcres = farmAcres + customAcres;
    const annualHiring = Math.round(farmAcres * rate);
    const annualFixed = Math.round(price * 0.14);
    const fuelLiters = Math.round(totalAcres * 3.8 * hoursPerAcre);
    const annualFuel = Math.round(fuelLiters * 90);
    const annualVar = Math.round(annualFuel + (price * 0.025) + (totalAcres * 150 * hoursPerAcre));
    const annualOwnership = annualFixed + annualVar;
    const commIncome = Math.round(customAcres * rate);
    const netSaving = Math.round(annualHiring - (annualOwnership - commIncome));
    const breakEven = Math.round((annualFixed / Math.max(100, rate - (3.8 * hoursPerAcre * 90 + 150 * hoursPerAcre))) * 10) / 10;
    const isBuy = netSaving > 0 || totalAcres >= breakEven;

    renderMachineryResult({
      machine_type: machineType,
      farm_size_acres: farmAcres,
      commercial_rental_acres_to_others: customAcres,
      total_operated_acres: totalAcres,
      annual_hiring_cost_inr: annualHiring,
      annual_ownership_cost_inr: annualOwnership,
      annual_diesel_burn_liters: fuelLiters,
      annual_fuel_cost_inr: annualFuel,
      break_even_acres: breakEven,
      commercial_rental_income_inr: commIncome,
      net_annual_saving_or_loss_inr: netSaving,
      recommendation: isBuy
        ? `✅ BUY RECOMMENDED: Operating ${totalAcres} total acres (including ${customAcres} custom hire acres for neighbors) makes ownership profitable, saving ₹${netSaving.toLocaleString("en-IN")}/year over renting.`
        : `🛑 RENT (CUSTOM HIRE) RECOMMENDED: For ${farmAcres} acres, renting costs ₹${annualHiring.toLocaleString("en-IN")}/year, whereas buying costs ₹${annualOwnership.toLocaleString("en-IN")}/year in fixed depreciation, fuel, and loan interest. Break-even threshold is ${breakEven} acres.`,
      payback_period_years: Math.round((price / Math.max(1000, annualHiring + commIncome - annualVar)) * 10) / 10,
      key_decision_factors: [
        `Annual Fixed Depreciation & Interest: ₹${annualFixed.toLocaleString("en-IN")}`,
        `Operational Diesel Burn: ${fuelLiters} Liters (₹${annualFuel.toLocaleString("en-IN")})`,
        `Break-Even Operational Area: ${breakEven} acres/year`,
        `Estimated Payback Period: ${Math.round((price / Math.max(1000, annualHiring + commIncome - annualVar)) * 10) / 10} years`
      ]
    });
  }
}

function renderMachineryResult(res) {
  const container = document.getElementById("machineryResultContainer");
  if (!container) return;

  const isBuy = res.net_annual_saving_or_loss_inr > 0 || res.total_operated_acres >= res.break_even_acres;
  const cardColor = isBuy ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-amber-50 border-amber-300 text-amber-950";
  const badgeColor = isBuy ? "bg-emerald-700 text-white" : "bg-amber-700 text-white";

  container.innerHTML = `
    <div class="rounded-2xl p-5 border ${cardColor} space-y-4 animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider">Financial Feasibility Verdict:</span>
          <h4 class="text-base font-black">${isBuy ? "Purchase / Ownership Feasible" : "Custom Hiring / Rental Recommended"}</h4>
        </div>
        <span class="${badgeColor} px-3 py-1 rounded-full text-xs font-black">
          ${isBuy ? "✅ BUY" : "🛑 RENT (CUSTOM HIRE)"}
        </span>
      </div>

      <div class="p-3 bg-white/85 rounded-xl border border-black/5 text-xs font-semibold leading-relaxed">
        ${res.recommendation}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="bg-white p-3 rounded-xl border border-slate-200">
          <span class="text-slate-500 block text-[11px]">Annual Custom Renting Cost:</span>
          <strong class="text-slate-900 text-sm">₹${Math.round(res.annual_hiring_cost_inr).toLocaleString("en-IN")} / yr</strong>
        </div>
        <div class="bg-white p-3 rounded-xl border border-slate-200">
          <span class="text-slate-500 block text-[11px]">Annual Ownership Total Cost:</span>
          <strong class="text-slate-900 text-sm">₹${Math.round(res.annual_ownership_cost_inr).toLocaleString("en-IN")} / yr</strong>
        </div>
        <div class="bg-white p-3 rounded-xl border border-slate-200">
          <span class="text-slate-500 block text-[11px]">Break-Even Usage Threshold:</span>
          <strong class="text-emerald-700 text-sm font-black">${res.break_even_acres} Acres / yr</strong>
        </div>
      </div>

      <div class="bg-white/80 p-3.5 rounded-xl border border-black/5 text-xs space-y-1.5">
        <div class="font-bold text-slate-900 mb-1">📊 Key Economic Decision Metrics:</div>
        <ul class="list-disc list-inside space-y-1 text-slate-700">
          ${(res.key_decision_factors || []).map(f => `<li>${f}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// 8. DAIRY & LIVESTOCK HUSBANDRY MODULE (Feed Ration, Gestation & EVM)
// ----------------------------------------------------------------------------

function initLivestockTab() {
  loadLivestockRemedies();
  executeLivestockRation();
  const dateInput = document.getElementById("inseminationDateInput");
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }
}

async function executeLivestockRation() {
  const animType = document.getElementById("animTypeSelect")?.value || "Cow (Crossbred HF/Jersey)";
  const weight = parseFloat(document.getElementById("animWeightInput")?.value) || 420.0;
  const milk = parseFloat(document.getElementById("animMilkInput")?.value) || 10.0;
  const fat = parseFloat(document.getElementById("animFatInput")?.value) || 4.0;
  const preg = document.getElementById("animPregSelect")?.value || "None";

  const container = document.getElementById("livestockRationResultContainer");
  if (!container) return;
  container.classList.remove("hidden");
  container.innerHTML = `<div class="p-6 text-center text-slate-500 font-bold animate-pulse">Balancing ICAR daily dairy feed ration...</div>`;

  try {
    const res = await fetch(`${API_BASE}/livestock/ration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        animal_type: animType,
        body_weight_kg: weight,
        daily_milk_yield_liters: milk,
        milk_fat_percentage: fat,
        pregnancy_stage: preg
      })
    });
    if (!res.ok) throw new Error("API offline");
    const data = await res.json();
    renderLivestockRationResult(data);
  } catch (err) {
    console.warn("Using offline Livestock Ration calculation:", err);
    const dmPct = animType.toLowerCase().includes("desi") ? 0.026 : (animType.toLowerCase().includes("goat") ? 0.038 : 0.030);
    const totalDm = Math.round(weight * dmPct * 10) / 10;
    const conc = Math.round((1.2 + (milk * 0.38) + (preg.toLowerCase().includes("last") ? 1.25 : 0)) * 10) / 10;
    const remDm = Math.max(1, totalDm - (conc * 0.9));
    const greenKg = Math.round(((remDm * 0.65) / 0.20) * 10) / 10;
    const dryKg = Math.round(((remDm * 0.35) / 0.90) * 10) / 10;
    const cost = Math.round((greenKg * 2.0) + (dryKg * 6.0) + (conc * 28.0) + 5.0);

    renderLivestockRationResult({
      animal_type: animType,
      body_weight_kg: weight,
      daily_milk_liters: milk,
      dry_matter_requirement_kg: totalDm,
      green_fodder_kg: greenKg,
      dry_straw_bhusa_kg: dryKg,
      concentrate_feed_kg: conc,
      mineral_mixture_grams: 50.0,
      salt_grams: 30.0,
      water_requirement_liters: Math.round(45 + (milk * 3.2)),
      estimated_daily_feed_cost_inr: cost,
      feeding_tips: [
        "Chaff (Kutti) all green and dry fodder to 1-2 inch pieces to reduce feed wastage by 20-30%.",
        "Offer clean, fresh drinking water ad-libitum at least 3-4 times a day (clean water boosts milk yield by 10%).",
        "Mix 50g area-specific mineral mixture and 30g iodized salt in concentrate daily to ensure regular heat cycles.",
        "Provide leguminous green fodder (Berseem/Lucerne) alongside cereal fodder (Napier/Maize) for optimal crude protein."
      ]
    });
  }
}

function renderLivestockRationResult(res) {
  const container = document.getElementById("livestockRationResultContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-5 animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-950">Balanced Dairy Ration:</span>
          <h4 class="text-base font-black text-slate-900">${res.animal_type} (${res.daily_milk_liters} L/day Yield)</h4>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-500 block">Est. Daily Feed Cost:</span>
          <strong class="text-xl font-black text-amber-950">₹${Math.round(res.estimated_daily_feed_cost_inr)} / day</strong>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div class="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <span class="text-slate-500 block text-[11px]">Green Fodder (हरा चारा):</span>
          <strong class="text-emerald-700 text-base font-black">${res.green_fodder_kg} kg</strong>
          <span class="text-[10px] text-slate-400 block">Napier / Berseem</span>
        </div>
        <div class="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <span class="text-slate-500 block text-[11px]">Dry Straw (सूखा भूसा):</span>
          <strong class="text-amber-800 text-base font-black">${res.dry_straw_bhusa_kg} kg</strong>
          <span class="text-[10px] text-slate-400 block">Wheat / Paddy straw</span>
        </div>
        <div class="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <span class="text-slate-500 block text-[11px]">Concentrate (दाना/खली):</span>
          <strong class="text-slate-900 text-base font-black">${res.concentrate_feed_kg} kg</strong>
          <span class="text-[10px] text-slate-400 block">Pellets / Mustard cake</span>
        </div>
        <div class="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <span class="text-slate-500 block text-[11px]">Mineral Mix & Salt:</span>
          <strong class="text-slate-900 text-base font-black">${res.mineral_mixture_grams}g + ${res.salt_grams}g</strong>
          <span class="text-[10px] text-slate-400 block">Daily in feed</span>
        </div>
        <div class="bg-white p-3 rounded-xl border border-slate-200 text-center">
          <span class="text-slate-500 block text-[11px]">Clean Water:</span>
          <strong class="text-blue-700 text-base font-black">${res.water_requirement_liters} Liters</strong>
          <span class="text-[10px] text-slate-400 block">3-4 times daily</span>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
        <div class="font-bold text-slate-900 flex items-center gap-1.5">
          <span>💡</span> <span>ICAR Agronomic Nutrition & Feeding Directives:</span>
        </div>
        <ul class="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
          ${(res.feeding_tips || []).map(t => `<li>${t}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

async function executeGestationSchedule() {
  const animType = document.getElementById("gestationAnimalTypeSelect")?.value || "Cow";
  const insDate = document.getElementById("inseminationDateInput")?.value || new Date().toISOString().split("T")[0];

  const container = document.getElementById("gestationResultContainer");
  if (!container) return;
  container.classList.remove("hidden");
  container.innerHTML = `<div class="p-6 text-center text-slate-500 font-bold animate-pulse">Calculating veterinary pregnancy timeline...</div>`;

  try {
    const res = await fetch(`${API_BASE}/livestock/gestation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        animal_type: animType,
        insemination_date: insDate
      })
    });
    if (!res.ok) throw new Error("API offline");
    const data = await res.json();
    renderGestationResult(data);
  } catch (err) {
    console.warn("Using offline Gestation calculation:", err);
    const sDate = new Date(insDate);
    const isBuffalo = animType.toLowerCase().includes("buffalo");
    const isGoat = animType.toLowerCase().includes("goat");
    const gestDays = isBuffalo ? 310 : (isGoat ? 150 : 280);

    const addD = (n) => {
      const d = new Date(sDate);
      d.setDate(d.getDate() + n);
      return d.toISOString().split("T")[0];
    };

    renderGestationResult({
      animal_type: animType,
      insemination_date: insDate,
      gestation_period_days: gestDays,
      expected_calving_date: addD(gestDays),
      advisory_notes: `Standard gestation period for ${animType} is ${gestDays} days. Expected delivery date: ${addD(gestDays)}.`,
      milestones: [
        { days_after_insemination: 21, milestone_date: addD(21), title: "First Heat Check (21-Day Estrus)", action_notes: "Observe for heat symptoms (mucus discharge, bellowing). If observed in heat, re-inseminate." },
        { days_after_insemination: isGoat ? 45 : 60, milestone_date: addD(isGoat ? 45 : 60), title: "Veterinary Pregnancy Diagnosis (PD)", action_notes: "Veterinarian performs rectal examination or sonography to confirm conception." },
        { days_after_insemination: isBuffalo ? 210 : (isGoat ? 100 : 180), milestone_date: addD(isBuffalo ? 210 : (isGoat ? 100 : 180)), title: "Drying-Off Milestone", action_notes: "Gradually stop milking to allow udder regeneration and build maternal colostrum." },
        { days_after_insemination: gestDays - 30, milestone_date: addD(gestDays - 30), title: "Steaming-Up & Transition Nutrition", action_notes: "Increase concentrate feed by +1.5 kg/day. Provide Vitamin AD3E to prevent milk fever." },
        { days_after_insemination: gestDays, milestone_date: addD(gestDays), title: `Expected Calving / Delivery Date`, action_notes: "Prepare a clean straw stall. Feed warm colostrum to newborn calf within 1 hour." }
      ]
    });
  }
}

function renderGestationResult(res) {
  const container = document.getElementById("gestationResultContainer");
  if (!container) return;

  const milestonesHTML = (res.milestones || []).map((m, idx) => `
    <div class="relative pl-6 pb-4 border-l-2 border-stone-300 last:border-l-0">
      <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-stone-700 text-white flex items-center justify-center text-xs font-bold shadow">
        ${idx + 1}
      </div>
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <strong class="text-slate-900 text-sm">${m.title}</strong>
          <span class="font-mono text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
            📅 ${m.milestone_date} (+${m.days_after_insemination} days)
          </span>
        </div>
        <p class="text-slate-600 text-xs leading-relaxed">${m.action_notes}</p>
      </div>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-5 animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-stone-900">Reproduction Schedule:</span>
          <h4 class="text-base font-black text-slate-900">${res.animal_type} Pregnancy Milestones</h4>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-500 block">Expected Calving Date:</span>
          <strong class="text-lg font-black text-emerald-800">📅 ${res.expected_calving_date}</strong>
        </div>
      </div>

      <div class="space-y-3">
        ${milestonesHTML}
      </div>
    </div>
  `;
}

async function loadLivestockRemedies() {
  const grid = document.getElementById("livestockRemediesGrid");
  if (!grid || grid.children.length > 0) return;

  try {
    const res = await fetch(`${API_BASE}/livestock/remedies`);
    if (!res.ok) throw new Error("API offline");
    const remedies = await res.json();
    renderLivestockRemedies(remedies);
  } catch (err) {
    console.warn("Using offline EVM remedies:", err);
    renderLivestockRemedies(OFFLINE_EVM_REMEDIES);
  }
}

const OFFLINE_EVM_REMEDIES = [
  {
    condition: "Sub-clinical & Clinical Mastitis (थनैला रोग / Udder Swelling)",
    symptoms: ["Swollen, hot, painful udder", "Yellowish, curd-like or watery milk clots", "Cow resists milking"],
    evm_formulation_name: "NDDB Haldi-Ghritkumari Lep (Turmeric-Aloe Udder Paste)",
    ingredients: ["Fresh Aloe Vera leaf: 250 g", "Turmeric rhizome/powder: 50 g", "Slaked Lime (Chuna): 15 g"],
    preparation_method: "Grind Aloe Vera, Turmeric, and Chuna into a smooth reddish-yellow paste. Dilute slightly with clean water to spreadable consistency.",
    dosage_and_application: "Milk out the affected quarter completely. Wash udder with clean water, dry, and apply paste generously over the entire udder 3-4 times daily for 5 consecutive days.",
    prevention_guidelines: "Dip teats in 0.5% povidone-iodine after every milking. Never allow cattle to lie down on wet mud for 30 minutes after milking."
  },
  {
    condition: "Bloat & Ruminal Tympany (अफारा / Pet Phulna)",
    symptoms: ["Tense, drum-like swollen left flank", "Difficulty breathing, open mouth panting", "Restlessness and kicking at belly"],
    evm_formulation_name: "Sarson Tel-Hing Kadha (Mustard-Asafoetida Drench)",
    ingredients: ["Pure Mustard Oil: 100-150 ml", "Asafoetida (Hing): 10 g", "Garlic (Lahsun): 50 g", "Ginger (Adrak): 50 g", "Black salt: 25 g"],
    preparation_method: "Crush garlic and ginger into paste. Dissolve hing and black salt in lukewarm water (250 ml), then mix thoroughly with mustard oil.",
    dosage_and_application: "Drench orally slowly using a clean bottle. Keep animal's head elevated. Massage the left flank upward. Repeat in 4 hours if gas is not released.",
    prevention_guidelines: "Never feed excessively wet, dew-covered young legume fodder (Berseem/Lucerne) on an empty stomach. Always feed dry bhusa first."
  },
  {
    condition: "Foot & Mouth Disease (FMD) Lesions (खुरपका-मुंहपका छाले)",
    symptoms: ["Painful blisters/sores on tongue and gums", "Excessive frothy salivation", "Lameness and wounds between hooves"],
    evm_formulation_name: "Neem-Haldi Ghee Balm (Ethno-Veterinary Antiseptic)",
    ingredients: ["Turmeric powder: 50 g", "Neem oil or boiled neem leaf paste: 100 ml", "Pure desi ghee or coconut oil: 50 g", "Camphor (Kapur): 5 g"],
    preparation_method: "Warm ghee/neem oil lightly and blend in turmeric powder and crushed camphor to create an antibacterial antiseptic balm.",
    dosage_and_application: "Wash mouth ulcers with mild baking soda or alum water. Apply the soothing balm gently onto tongue and hoof fissures twice daily.",
    prevention_guidelines: "Get cattle vaccinated bi-annually under the National Animal Disease Control Programme (NADCP). Quarantine infected animals."
  },
  {
    condition: "Internal Parasites & Worms (पेट के कीड़े / Helminthiasis)",
    symptoms: ["Pot belly in calves", "Dull coat, emaciation despite feeding", "Diarrhea or bottle jaw swelling under chin"],
    evm_formulation_name: "Kaduwa Neem-Nirgundi Dewormer (Botanical Anthelmintic)",
    ingredients: ["Neem leaves (Azadirachta indica): 100 g", "Nirgundi leaves: 50 g", "Karela / Bitter gourd pulp: 50 g", "Jaggery: 50 g"],
    preparation_method: "Pound leaves into a thick paste with jaggery to form a sweet-bitter bolus.",
    dosage_and_application: "Feed orally in morning on an empty stomach once a month.",
    prevention_guidelines: "Rotate pastures and avoid grazing on marshy waterlogged riverbanks where snail hosts thrive."
  }
];

function renderLivestockRemedies(remedies) {
  const grid = document.getElementById("livestockRemediesGrid");
  if (!grid) return;

  grid.innerHTML = (remedies || []).map(r => `
    <div class="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm space-y-3 flex flex-col justify-between">
      <div class="space-y-2">
        <div class="flex items-start justify-between gap-2 border-b border-emerald-100 pb-2">
          <div>
            <span class="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">EVM Remedy</span>
            <h4 class="font-extrabold text-slate-900 text-sm mt-1">${r.condition}</h4>
          </div>
          <span class="text-xl">🌿</span>
        </div>

        <div class="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 space-y-1">
          <strong class="text-emerald-950 font-bold block">${r.evm_formulation_name}</strong>
          <div class="text-slate-600 text-[11px]"><strong>Ingredients:</strong> ${r.ingredients.join(" • ")}</div>
        </div>

        <div class="text-xs text-slate-700 space-y-1">
          <div><strong>Preparation:</strong> ${r.preparation_method}</div>
          <div class="text-emerald-900 font-semibold"><strong>Dosage & Use:</strong> ${r.dosage_and_application}</div>
        </div>
      </div>

      <div class="pt-2 border-t border-slate-100 text-[10px] text-slate-500 italic">
        🛡️ Prevention: ${r.prevention_guidelines}
      </div>
    </div>
  `).join("");
}

// ----------------------------------------------------------------------------
// 9. KISAN VOICE ASSISTANT KEYWORD ROUTER
// ----------------------------------------------------------------------------

function handleVoiceRecognitionResult(transcript) {
  const clean = transcript.toLowerCase().trim();

  if (clean.includes("मंडी") || clean.includes("भाव") || clean.includes("mandi") || clean.includes("price") || clean.includes("rate")) {
    switchTab("mandi");
    showToast(`Voice navigation: Opened Mandi Prices ("${transcript}")`, "info");
  } else if (clean.includes("खाद") || clean.includes("यूरिया") || clean.includes("fertilizer") || clean.includes("dap") || clean.includes("मृदा")) {
    switchTab("fertilizer");
    showToast(`Voice navigation: Opened Fertilizer Doctor ("${transcript}")`, "info");
  } else if (clean.includes("रोग") || clean.includes("कीट") || clean.includes("doctor") || clean.includes("pest") || clean.includes("पत्ती")) {
    switchTab("doctor");
    showToast(`Voice navigation: Opened Plant Doctor ("${transcript}")`, "info");
  } else if (clean.includes("पशु") || clean.includes("गाय") || clean.includes("भैंस") || clean.includes("दूध") || clean.includes("livestock") || clean.includes("dairy")) {
    switchTab("livestock");
    showToast(`Voice navigation: Opened Livestock Doctor ("${transcript}")`, "info");
  } else if (clean.includes("सिंचाई") || clean.includes("पानी") || clean.includes("irrigation") || clean.includes("talab") || clean.includes("तालाब")) {
    switchTab("irrigation");
    showToast(`Voice navigation: Opened Smart Irrigation ("${transcript}")`, "info");
  } else if (clean.includes("सोलर") || clean.includes("solar") || clean.includes("पंप")) {
    switchTab("solar");
    showToast(`Voice navigation: Opened Solar Pump Calculator ("${transcript}")`, "info");
  } else if (clean.includes("नक्शा") || clean.includes("खेत") || clean.includes("satellite") || clean.includes("map") || clean.includes("तारबंदी")) {
    openSatelliteMapModal();
    showToast(`Voice navigation: Opened Satellite Field Plotter ("${transcript}")`, "info");
  } else if (clean.includes("बही") || clean.includes("खाता") || clean.includes("खर्च") || clean.includes("khata") || clean.includes("diary")) {
    switchTab("khata");
    showToast(`Voice navigation: Opened Kisan Bahi-Khata ("${transcript}")`, "info");
  } else {
    switchTab("advisor");
    if (cropSearchInput) {
      cropSearchInput.value = transcript;
      cropSearchInput.dispatchEvent(new Event("input", { bubbles: true }));
      showToast(`Searching crops for: "${transcript}"`, "info");
    }
  }
}

// ----------------------------------------------------------------------------
// 10. POST-HARVEST GRAIN AERATION & MOISTURE LOSS CALCULATOR
// ----------------------------------------------------------------------------
function calculatePostHarvestAerationOffline(data) {
  const qty = Math.max(0.1, parseFloat(data.quantity_quintals || 100));
  const mInit = Math.max(5, Math.min(40, parseFloat(data.initial_moisture_pct || 19.5)));
  const tempC = parseFloat(data.ambient_temp_c != null ? data.ambient_temp_c : 28);
  const rhPct = Math.max(10, Math.min(99, parseFloat(data.ambient_rh_pct != null ? data.ambient_rh_pct : 65)));
  
  const mTarget = parseFloat(data.target_moisture_pct || 12.0);
  const initKg = qty * 100;
  const dmKg = initKg * (1 - mInit / 100);
  const finalKg = dmKg / (1 - mTarget / 100);
  const waterKg = Math.max(0, Math.round((initKg - finalKg) * 10) / 10);
  const finalQ = Math.round((finalKg / 100) * 100) / 100;

  const emc = Math.max(7, Math.min(22, Math.round(1.1 * Math.sqrt(Math.log(1 / (1 - Math.min(0.95, rhPct / 100)))) * (300 / (tempC + 273.15)) * 9.5 * 10) / 10));
  const cfmRate = mInit > mTarget + 1 ? 2.5 : 0.8;
  const totalCfm = Math.round(qty * cfmRate * 10) / 10;
  const fanHp = Math.max(0.25, Math.round(((totalCfm * 1.8) / (6356 * 0.55)) * 100) / 100);
  const sunHours = waterKg > 0 ? Math.round((waterKg / (qty * 1.8)) * 4 * 10) / 10 : 0;
  const forcedAirHours = waterKg > 0 ? Math.round((waterKg / Math.max(10, totalCfm * 0.025)) * 10) / 10 : 0;

  let safeDays = 180;
  let riskLevel = "Safe";
  let aflatoxinWarning = "OPTIMAL: Moisture content is within safe storage limits.";
  if (mInit > 18) {
    safeDays = Math.max(2, Math.round(15 - (mInit - 18) * 3 - Math.max(0, tempC - 25) * 0.3));
    riskLevel = "Critical Hazard";
    aflatoxinWarning = "CRITICAL: Moisture exceeds 18%. High risk of Aspergillus mold & aflatoxin heating within 48-72 hrs.";
  } else if (mInit > mTarget + 1.5) {
    safeDays = Math.max(10, Math.round(45 - (mInit - mTarget) * 8 - Math.max(0, tempC - 25)));
    riskLevel = "Moderate Warning";
    aflatoxinWarning = "WARNING: Grain is above safe storage limit. Weevil multiplication and mold possible in 2-4 weeks.";
  }

  return {
    grain_type: data.grain_type || "Paddy (Rice)",
    quantity_quintals: qty,
    initial_moisture_pct: mInit,
    target_moisture_pct: mTarget,
    moisture_to_remove_kg: waterKg,
    final_quantity_quintals: finalQ,
    equilibrium_moisture_content_pct: emc,
    aeration_fan_airflow_cfm: totalCfm,
    fan_power_hp_estimate: fanHp,
    estimated_drying_hours_sun: sunHours,
    estimated_drying_hours_forced_air: forcedAirHours,
    safe_storage_duration_days: safeDays,
    storage_risk_level: riskLevel,
    aflatoxin_mold_warning: aflatoxinWarning,
    recommended_protocols: [
      `Spread in thin layers (3-5 cm) on tarpaulin, raking every 2 hours.`,
      `Run forced-air blowers when ambient RH is below ${Math.round(emc * 5.2)}% to prevent moisture re-absorption.`,
      `Target storage moisture is ${mTarget}% (air EMC is ${emc}%).`
    ]
  };
}

window.calculatePostHarvestAerationOffline = calculatePostHarvestAerationOffline;

// ----------------------------------------------------------------------------
// 11. POLYHOUSE & GREENHOUSE CLIMATE CONTROL SIZER
// ----------------------------------------------------------------------------
function calculatePolyhouseClimateOffline(data) {
  const area = Math.max(50, parseFloat(data.covered_area_sqm || 1008));
  const height = Math.max(3, Math.min(8, parseFloat(data.roof_height_meters || 4.5)));
  const tempAmb = parseFloat(data.ambient_max_temp_c != null ? data.ambient_max_temp_c : 40);
  const rhAmb = Math.max(10, Math.min(95, parseFloat(data.ambient_min_rh_pct != null ? data.ambient_min_rh_pct : 30)));
  const stype = data.structure_type || "Naturally Ventilated Polyhouse (NVPH)";
  const crop = data.crop_type || "Bell Pepper (Colored Capsicum)";

  const volume = Math.round(area * height * 0.85 * 10) / 10;
  const ridgeVent = Math.round(area * 0.18 * 10) / 10;
  const sideVent = Math.round(area * 0.28 * 10) / 10;

  const airflowM3Min = volume * 1.15;
  const airflowCfm = Math.round(airflowM3Min * 35.315);

  let numFans = 0;
  let padArea = 0;
  let coolingWaterLph = 0;
  if (stype.toLowerCase().includes("fan") || stype.toLowerCase().includes("pad") || stype.toLowerCase().includes("greenhouse")) {
    numFans = Math.max(1, Math.ceil(airflowCfm / 22000));
    padArea = Math.round(((airflowM3Min / 60) / 1.25) * 10) / 10;
    coolingWaterLph = Math.round(padArea * 360);
  }

  // Tw approximation via Stull formula
  const tw = tempAmb * Math.atan(0.151977 * Math.sqrt(rhAmb + 8.313659))
    + Math.atan(tempAmb + rhAmb)
    - Math.atan(rhAmb - 1.676331)
    + 0.00391838 * Math.pow(rhAmb, 1.5) * Math.atan(0.023101 * rhAmb)
    - 4.686035;

  let tempInside = Math.round((tempAmb - 4.5) * 10) / 10;
  let insideRh = Math.min(80, Math.round((rhAmb + 15) * 10) / 10);
  if (stype.toLowerCase().includes("fan") || stype.toLowerCase().includes("pad")) {
    tempInside = Math.round((tempAmb - ((tempAmb - tw) * 0.75)) * 10) / 10;
    insideRh = Math.min(85, Math.round((rhAmb + (100 - rhAmb) * 0.65) * 10) / 10);
  } else if (stype.toLowerCase().includes("shade")) {
    tempInside = Math.round((tempAmb - 3.5) * 10) / 10;
    insideRh = Math.min(90, Math.round((rhAmb + 10) * 10) / 10);
  }

  const shadePct = tempAmb >= 42 ? 75 : (tempAmb >= 37 ? 50 : 35);
  const svp = 0.61078 * Math.exp((17.27 * tempInside) / (tempInside + 237.3));
  const avp = svp * (insideRh / 100);
  const vpd = Math.round((svp - avp) * 100) / 100;

  let vpdStatus = "Optimal";
  if (vpd < 0.4) vpdStatus = "Low Transpiration (Humid)";
  else if (vpd > 1.25) vpdStatus = "High Transpiration Stress";

  let ratePerSqm = 844;
  if (stype.toLowerCase().includes("fan") || stype.toLowerCase().includes("pad")) ratePerSqm = 1465;
  else if (stype.toLowerCase().includes("shade")) ratePerSqm = 710;

  const totalCost = Math.round(area * ratePerSqm);
  const subsidyInr = Math.round(totalCost * 0.50);
  const farmerShare = totalCost - subsidyInr;

  return {
    structure_type: stype,
    covered_area_sqm: area,
    crop_type: crop,
    polyhouse_volume_m3: volume,
    ridge_vent_area_sqm: ridgeVent,
    side_vent_area_sqm: sideVent,
    exhaust_fan_airflow_cfm: airflowCfm,
    number_of_exhaust_fans_50inch: numFans,
    cooling_pad_area_sqm: padArea,
    cooling_water_flow_rate_lph: coolingWaterLph,
    shade_net_recommended_pct: shadePct,
    expected_inside_temp_c: tempInside,
    vapor_pressure_deficit_kpa: vpd,
    vpd_status: vpdStatus,
    estimated_midh_subsidy_inr: subsidyInr,
    total_project_cost_inr: totalCost,
    farmer_net_share_inr: farmerShare,
    operational_recommendations: [
      `Fit 40-mesh insect-proof netting on all open vents to prevent virus vectors.`,
      `Estimated inside VPD is ${vpd} kPa (${vpdStatus}).`,
      `MIDH 50% capital subsidy estimate is ₹${subsidyInr.toLocaleString("en-IN")}.`
    ]
  };
}

window.calculatePolyhouseClimateOffline = calculatePolyhouseClimateOffline;

// ----------------------------------------------------------------------------
// 12. STUBBLE RESIDUE (PARALI) TO BIOCHAR & COMPOST BALANCER
// ----------------------------------------------------------------------------
function calculateBiocharStubbleOffline(data) {
  const acres = Math.max(0.1, parseFloat(data.land_size_acres || 5.0));
  const cropStr = (data.residue_crop || "Paddy Straw (Parali)").toLowerCase();

  let biomassPerAcre = 25.0;
  if (cropStr.includes("paddy") || cropStr.includes("rice") || cropStr.includes("parali")) biomassPerAcre = 28.0;
  else if (cropStr.includes("wheat") || cropStr.includes("turi")) biomassPerAcre = 22.0;
  else if (cropStr.includes("cotton")) biomassPerAcre = 18.0;
  else if (cropStr.includes("mustard")) biomassPerAcre = 14.0;
  else if (cropStr.includes("sugarcane")) biomassPerAcre = 35.0;
  else if (cropStr.includes("maize")) biomassPerAcre = 24.0;

  const totalBiomassQ = Math.round(acres * biomassPerAcre * 10) / 10;
  const totalBiomassKg = totalBiomassQ * 100;
  const biocharQ = Math.round(totalBiomassQ * 0.30 * 10) / 10;
  const biocharKg = biocharQ * 100;
  const economicVal = Math.round(biocharKg * 15.0);
  const waterLiters = Math.round(biocharKg * 3.8);
  const co2SeqKg = Math.round(biocharKg * 2.6 * 10) / 10;
  const co2AvertedKg = Math.round(totalBiomassKg * 1.48 * 10) / 10;
  const pm25AvertedKg = Math.round((totalBiomassKg / 1000.0) * 7.5 * 10) / 10;

  let ngtFine = 5000.0;
  if (acres < 2.0) ngtFine = 2500.0;
  else if (acres > 5.0) ngtFine = 15000.0;

  const cowDungKg = Math.round(totalBiomassKg * 0.20);
  const decomposerCaps = Math.max(4, Math.round(acres * 4));
  const jaggeryKg = Math.round(acres * 2.0 * 10) / 10;

  return {
    residue_crop: data.residue_crop || "Paddy Straw (Parali)",
    land_size_acres: acres,
    estimated_residue_biomass_quintals: totalBiomassQ,
    biochar_yield_quintals: biocharQ,
    economic_value_biochar_inr: economicVal,
    soil_water_retention_gain_liters: waterLiters,
    carbon_sequestration_co2e_kg: co2SeqKg,
    co2_emissions_averted_kg: co2AvertedKg,
    pm25_pollution_averted_kg: pm25AvertedKg,
    composting_recipe: {
      raw_straw_c_n_ratio: "80:1 (Very High, decay takes 120+ days)",
      balanced_compost_c_n_ratio: "28:1 (Optimal Humus within 35-45 days)",
      cow_dung_slurry_required_kg: cowDungKg,
      pusa_decomposer_capsules: decomposerCaps,
      fermentation_jaggery_kg: jaggeryKg,
      water_moisture_target_pct: "55 - 60%",
      pile_turning_schedule: "Turn on Day 7, Day 14, and Day 21"
    },
    ngt_fine_penalty_averted_inr: ngtFine,
    actionable_farmer_guidelines: [
      `Generate ${biocharQ} quintals of high-grade biochar via Kon-Tiki flame kiln (worth ₹${economicVal.toLocaleString("en-IN")}).`,
      `Avert ${pm25AvertedKg} kg of toxic PM2.5 smog and avoid ₹${ngtFine.toLocaleString("en-IN")} NGT burning fine.`,
      `Soil water holding capacity boosted by ${waterLiters.toLocaleString("en-IN")} liters.`
    ]
  };
}

window.calculateBiocharStubbleOffline = calculateBiocharStubbleOffline;

// =========================================================================
// CONTINGENCY PROTOCOL: CODE NAME "PLASTIC MAN"
// Proprietary Master Ownership Verification & Anti-Theft Protection System
// Real Owner: MegaTron alias Mohammed Razin H
// Real Project Name: AgriAssist
// =========================================================================

const PLASTIC_MAN_SECRET_CODES = [
  "29082003",
  "05051970",
  "22102022",
  "05082023",
  "05042025",
  "12112021",
  "20012026",
  "13092026",
  "7200170345",
  "9962830634",
  "9840503469",
  "8939887236",
  "9840019278",
  "7695966500",
  "6380376354",
  "9791060348",
  "9176101274",
  "9884602849",
  "9840714441",
  "8072761448",
  "9884783437"
];

const PLASTIC_MAN_ALIASES = [
  "plastic man",
  "plasticman",
  "plastic-man",
  "contingency protocol",
  "megatron"
];

const PLASTIC_MAN_CREDENTIALS = {
  protocol: "Contingency Protocol (Code Name: Plastic Man)",
  realOwnerName: "MegaTron alias Mohammed Razin H",
  realProjectName: "AgriAssist",
  author: "Mohammed Razin H",
  contact: "mohammedrazin22202@gmail.com",
  linkedIn: "https://www.linkedin.com/in/razin88307",
  gitHub: "https://github.com/mohammedrazin22202-cyber",
  status: "ORIGINAL SOLE AUTHOR & PROPRIETARY OWNER VERIFIED"
};

let lastActiveContingencyCode = null;

function checkContingencyCode(rawInput) {
  if (!rawInput || typeof rawInput !== "string") return null;
  const cleaned = rawInput.trim();
  const lower = cleaned.toLowerCase();

  // Check code name aliases
  if (PLASTIC_MAN_ALIASES.includes(lower)) {
    return {
      type: "alias",
      matched: cleaned,
      index: "Master Code Name",
      description: "Code Name Override: Plastic Man"
    };
  }

  // Check 21 secret author codes (also strip whitespace or dashes)
  const digitsOnly = cleaned.replace(/[\s\-_]/g, "");
  const idx = PLASTIC_MAN_SECRET_CODES.indexOf(digitsOnly);
  if (idx !== -1) {
    return {
      type: "code",
      matched: digitsOnly,
      index: idx + 1,
      description: `Author Secret Key #${idx + 1} of 21`
    };
  }

  return null;
}

function playContingencyChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    // High-tech futuristic double chirp
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

    osc2.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, audioCtx.currentTime + 0.35); // D6

    gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start(audioCtx.currentTime + 0.1);
    osc1.stop(audioCtx.currentTime + 0.25);
    osc2.stop(audioCtx.currentTime + 0.45);
  } catch (err) {
    // Audio is optional enhancement
  }
}

function activateContingencyProtocol(matchData, triggeringElement) {
  lastActiveContingencyCode = matchData.matched;

  // Clear search bar to prevent displaying "no matching crops found"
  if (triggeringElement && typeof triggeringElement.value !== "undefined") {
    triggeringElement.value = "";
    if (triggeringElement.id === "cropSearchInput") {
      appState.searchQuery = "";
      filterAndRenderCrops();
    } else if (triggeringElement.id === "doctorSearchInput") {
      executePlantDoctor();
    } else if (triggeringElement.id === "mandiSearchInput") {
      executeMandiPrices();
    } else if (triggeringElement.id === "schemeSearchInput") {
      renderSchemesDirectory("", activeSchemeCategory);
    }
    triggeringElement.blur();
  }

  // Play audio chime
  playContingencyChime();

  // Update dynamic elements in modal
  const keyInfo = document.getElementById("contingencyKeyInfo");
  if (keyInfo) {
    keyInfo.textContent = `Matched Code: ${matchData.matched} (${matchData.description})`;
  }

  // Render the 21 codes vault
  populateSecretCodesGrid(matchData.matched);

  // Open modal
  const modal = document.getElementById("contingencyModal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  // Toast confirmation
  if (typeof showToast === "function") {
    showToast(`🚨 Contingency Protocol Activated: Verified MegaTron (Mohammed Razin H)`, "success");
  }

  // Console output
  console.warn(
    "%c🚨 CONTINGENCY PROTOCOL ACTIVATED: CODE NAME PLASTIC MAN 🚨\n" +
    "%cReal Owner: MegaTron alias Mohammed Razin H\n" +
    "Real Project: AgriAssist\n" +
    "Author: Mohammed Razin H\n" +
    "Contact: mohammedrazin22202@gmail.com\n" +
    "LinkedIn: https://www.linkedin.com/in/razin88307\n" +
    "GitHub: https://github.com/mohammedrazin22202-cyber\n" +
    `Verified Author Key: ${matchData.matched} (${matchData.description})`,
    "background: #052e16; color: #4ade80; font-size: 16px; font-weight: bold; padding: 8px 14px; border: 2px solid #22c55e; border-radius: 8px;",
    "color: #10b981; font-size: 13px; font-weight: 500;"
  );
}

function closeContingencyProtocol() {
  const modal = document.getElementById("contingencyModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function populateSecretCodesGrid(currentMatchedCode) {
  const grid = document.getElementById("secretCodesListGrid");
  if (!grid) return;

  grid.innerHTML = PLASTIC_MAN_SECRET_CODES.map((code, idx) => {
    const isMatched = code === currentMatchedCode;
    const num = String(idx + 1).padStart(2, "0");
    return `
      <div class="px-2.5 py-1.5 rounded-lg border flex items-center justify-between text-[11px] ${
        isMatched
          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50"
          : "bg-slate-900 border-slate-800 text-slate-400"
      }">
        <span class="text-slate-500 text-[10px]">#${num}</span>
        <span class="font-mono">${code}</span>
        <span>${isMatched ? "✓" : "🔒"}</span>
      </div>
    `;
  }).join("");
}

function copyAuthorEmail() {
  const email = "mohammedrazin22202@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    if (typeof showToast === "function") {
      showToast("📋 Author email copied: mohammedrazin22202@gmail.com", "success");
    }
  }).catch(() => {
    const el = document.getElementById("authorEmailText");
    if (el) {
      const range = document.createRange();
      range.selectNode(el);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      if (typeof showToast === "function") {
        showToast("📋 Author email copied to clipboard", "success");
      }
    }
  });
}

function copyVerificationCertificate() {
  const cert = {
    protocol: "Contingency Protocol (Code Name: Plastic Man)",
    status: "AUTHENTICATED_ORIGINAL_PROPRIETOR",
    real_project_name: "AgriAssist",
    real_owner_name: "MegaTron alias Mohammed Razin H",
    author_credentials: {
      author: "Mohammed Razin H",
      contact: "mohammedrazin22202@gmail.com",
      linkedin: "https://www.linkedin.com/in/razin88307",
      github: "https://github.com/mohammedrazin22202-cyber"
    },
    verification_code_used: lastActiveContingencyCode || "29082003",
    secret_codes_registry_count: 21,
    timestamp: new Date().toISOString(),
    tamper_proof_status: "VERIFIED_GENUINE_CREATOR"
  };

  const str = JSON.stringify(cert, null, 2);
  navigator.clipboard.writeText(str).then(() => {
    if (typeof showToast === "function") {
      showToast("📜 Ownership certificate copied to clipboard!", "success");
    }
  }).catch(() => {
    if (typeof showToast === "function") {
      showToast("Certificate generated in console log.", "info");
    }
    console.log(str);
  });
}

function initContingencyProtocol() {
  // Close buttons
  document.getElementById("closeContingencyBtn")?.addEventListener("click", closeContingencyProtocol);
  document.getElementById("dismissContingencyBtn")?.addEventListener("click", closeContingencyProtocol);

  const modal = document.getElementById("contingencyModal");
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeContingencyProtocol();
  });

  // Copy email
  document.getElementById("copyAuthorEmailBtn")?.addEventListener("click", copyAuthorEmail);

  // Copy certificate
  document.getElementById("copyProofCertBtn")?.addEventListener("click", copyVerificationCertificate);

  // Toggle secret codes vault accordion
  const toggleBtn = document.getElementById("toggleSecretCodesBtn");
  const vault = document.getElementById("secretCodesContainer");
  const toggleIcon = document.getElementById("secretCodesToggleIcon");
  toggleBtn?.addEventListener("click", () => {
    if (vault) {
      const isHidden = vault.classList.toggle("hidden");
      if (toggleIcon) {
        toggleIcon.textContent = isHidden ? "▼ Show Codes" : "▲ Hide Codes";
      }
    }
  });

  // Global Capturing Event Listener for all input elements (search bars, text inputs)
  // This guarantees ANY search bar triggers immediately when typed or pasted!
  document.addEventListener("input", (e) => {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
      const match = checkContingencyCode(e.target.value);
      if (match) {
        e.stopImmediatePropagation();
        activateContingencyProtocol(match, e.target);
      }
    }
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target && e.target.tagName === "INPUT") {
      const match = checkContingencyCode(e.target.value);
      if (match) {
        e.preventDefault();
        e.stopImmediatePropagation();
        activateContingencyProtocol(match, e.target);
      }
    }
  }, true);

  // Populate initial codes vault
  populateSecretCodesGrid(null);
}

// Global console developer override command
window.plasticMan = function(customCode = "29082003") {
  const match = checkContingencyCode(customCode) || {
    type: "manual",
    matched: String(customCode),
    index: "DevTools Console Override",
    description: "Console Master Trigger"
  };
  activateContingencyProtocol(match, null);
  return "Contingency Protocol Activated: Real Owner MegaTron alias Mohammed Razin H (AgriAssist)";
};

window.MegaTron = {
  verify: window.plasticMan,
  credentials: PLASTIC_MAN_CREDENTIALS,
  codes: PLASTIC_MAN_SECRET_CODES
};



