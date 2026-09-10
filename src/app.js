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
    tabAdvisor: "Crop Sowing Advisor",
    tabDoctor: "Plant Doctor (IPM)",
    tabMandi: "Mandi Prices & Trends",
    tabIrrigation: "Smart Irrigation",
    tabOrganic: "Organic / Jaivik Kheti",
    tabRotation: "1-Year Rotation",
    tabFertilizer: "Fertilizer Doctor",
    tabYojana: "Kisan Yojana Hub",
    tabKhata: "Kisan Bahi-Khata",
    heroTitle: "What Should You Sow This Season?",
    heroDesc: "Make confident, high-yield planting decisions. Tell us about your soil, season, and irrigation, and AgriAssist will rank the most profitable, climate-resilient crops with exact fertilizer bags, cost estimates, and stage-wise agronomic guidance.",
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
    langSwitch: "🌐 Language / भाषा"
  },
  hi: {
    tagline: "कृषि निर्णय प्रणाली",
    subtitle: "किसान फसल सलाहकार • भारतीय कृषि सशक्तिकरण",
    detectLocation: "मौसम जांचें",
    tabAdvisor: "फसल बुवाई सलाहकार",
    tabDoctor: "प्लांट डॉक्टर (कीट-रोग)",
    tabMandi: "मंडी भाव एवं रुझान",
    tabIrrigation: "सटीक सिंचाई योजना",
    tabOrganic: "जैविक / प्राकृतिक खेती",
    tabRotation: "1-वर्षीय फसल चक्र",
    tabFertilizer: "खाद एवं मृदा डॉक्टर",
    tabYojana: "किसान योजना हब",
    tabKhata: "किसान बही-खाता",
    heroTitle: "इस मौसम में कौन सी फसल बोएं?",
    heroDesc: "वैज्ञानिक एवं सटीक फसल निर्णय लें। अपनी मिट्टी, मौसम और सिंचाई की जानकारी दें, और एग्रीअसिस्ट आपको अधिकतम मुनाफे वाली, उपयुक्त फसलों की सिफारिश के साथ सटीक खाद की बोरी, लागत और पैदावार का हिसाब देगा।",
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
    langSwitch: "🌐 भाषा / Language"
  },
  mr: {
    tagline: "कृषी निर्णय प्रणाली",
    subtitle: "शेतकरी पीक सल्लागार • प्रगत शेती मार्गदर्शन",
    detectLocation: "हवामान तपासा",
    tabAdvisor: "पीक पेरणी सल्लागार",
    tabDoctor: "प्लँट डॉक्टर (रोग व कीड)",
    tabMandi: "बाजारभाव व कल",
    tabIrrigation: "पाणी व्यवस्थापन",
    tabOrganic: "सेंद्रिय / नैसर्गिक शेती",
    tabRotation: "१-वर्षीय पीक फेरपालट",
    tabFertilizer: "खत व माती डॉक्टर",
    tabYojana: "शासकीय योजना केंद्र",
    tabKhata: "शेतकरी वही-खाते",
    heroTitle: "ह्या हंगामात कोणते पीक घ्यावे?",
    heroDesc: "शास्त्रीय पद्धतीने पीक निवड करा. माती, हवामान आणि पाण्याचे नियोजन करून योग्य पिकांची शिफारस आणि खतांचे अचूक प्रमाण मिळवा.",
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
    langSwitch: "🌐 भाषा निवडा"
  },
  pa: {
    tagline: "ਖੇਤੀ ਫੈਸਲਾ ਪ੍ਰਣਾਲੀ",
    subtitle: "ਕਿਸਾਨ ਫਸਲ ਸਲਾਹਕਾਰ • ਪੰਜਾਬ ਤੇ ਹਰਿਆਣਾ ਖੇਤੀਬਾੜੀ",
    detectLocation: "ਮੌਸਮ ਵੇਖੋ",
    tabAdvisor: "ਫਸਲ ਬਿਜਾਈ ਸਲਾਹਕਾਰ",
    tabDoctor: "ਪਲਾਂਟ ਡਾਕਟਰ (ਕੀੜੇ ਤੇ ਬਿਮਾਰੀਆਂ)",
    tabMandi: "ਮੰਡੀ ਭਾਅ ਤੇ ਰੁਝਾਨ",
    tabIrrigation: "ਸਿੰਚਾਈ ਪ੍ਰਬੰਧਨ",
    tabOrganic: "ਕੁਦਰਤੀ / ਜੈਵਿਕ ਖੇਤੀ",
    tabRotation: "੧-ਸਾਲਾ ਫਸਲੀ ਚੱਕਰ",
    tabFertilizer: "ਖਾਦ ਤੇ ਮਿੱਟੀ ਡਾਕਟਰ",
    tabYojana: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਕੇਂਦਰ",
    tabKhata: "ਕਿਸਾਨ ਬਹੀ-ਖਾਤਾ",
    heroTitle: "ਇਸ ਸੀਜ਼ਨ ਕਿਹੜੀ ਫਸਲ ਬੀਜੀਏ?",
    heroDesc: "ਵਿਗਿਆਨਕ ਅਤੇ ਸਹੀ ਫਸਲ ਫੈਸਲੇ ਲਓ। ਆਪਣੀ ਜ਼ਮੀਨ ਅਤੇ ਪਾਣੀ ਅਨੁਸਾਰ ਵੱਧ ਮੁਨਾਫਾ ਦੇਣ ਵਾਲੀਆਂ ਫਸਲਾਂ ਅਤੇ ਖਾਦ ਦੀ ਸਹੀ ਮਾਤਰਾ ਜਾਣੋ।",
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
    langSwitch: "🌐 ਭਾਸ਼ਾ ਚੁਣੋ"
  },
  gu: {
    tagline: "કૃષિ નિર્ણય પ્રણાલી",
    subtitle: "ખેડૂત પાક સલાહકાર • ગુજરાત કૃષિ વિકાસ",
    detectLocation: "હવામાન તપાસો",
    tabAdvisor: "પાક વાવણી સલાહકાર",
    tabDoctor: "પ્લાન્ટ ડૉક્ટર (રોગ-જીવાત)",
    tabMandi: "બજારભાવ અને વલણ",
    tabIrrigation: "સ્માર્ટ પિયત વ્યવસ્થાપન",
    tabOrganic: "પ્રાકૃતિક / જૈવિક ખેતી",
    tabRotation: "૧-વાર્ષિક પાક ચક્ર",
    tabFertilizer: "ખાતર અને જમીન ડૉક્ટર",
    tabYojana: "સરકારી યોજના કેન્દ્ર",
    tabKhata: "ખેડૂત વહી-ખાતું",
    heroTitle: "આ સીઝનમાં કયો પાક વાવવો?",
    heroDesc: "વૈજ્ઞાનિક રીતે સાચી પાક પસંદગી કરો. જમીન, ઋતુ અને પાણીની સુવિધા મુજબ સૌથી વધુ નફાકારક પાકની ભલામણ મેળવો.",
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
    langSwitch: "🌐 ભાષા પસંદ કરો"
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

const advisorTabContent = document.getElementById("advisorTabContent");
const doctorTabContent = document.getElementById("doctorTabContent");
const mandiTabContent = document.getElementById("mandiTabContent");
const irrigationTabContent = document.getElementById("irrigationTabContent");
const organicTabContent = document.getElementById("organicTabContent");
const rotationTabContent = document.getElementById("rotationTabContent");
const fertilizerTabContent = document.getElementById("fertilizerTabContent");
const yojanaTabContent = document.getElementById("yojanaTabContent");
const khataTabContent = document.getElementById("khataTabContent");

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



// ----------------- INITIALIZATION -----------------

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  registerServiceWorker();
  populateFertilizerCropOptions();
  initDistrictSelector();
  initKisanKhata();
  checkApiHealth();
  updateSoilPresets();
  executeRecommendation();

  // Load saved language if any
  const savedLang = localStorage.getItem("agriassist_lang");
  if (savedLang && TRANSLATIONS[savedLang]) {
    setLanguage(savedLang);
  }
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
  // Navigation Tabs (All 9 Modules)
  tabAdvisorBtn?.addEventListener("click", () => switchTab("advisor"));
  tabDoctorBtn?.addEventListener("click", () => switchTab("doctor"));
  tabMandiBtn?.addEventListener("click", () => switchTab("mandi"));
  tabIrrigationBtn?.addEventListener("click", () => switchTab("irrigation"));
  tabOrganicBtn?.addEventListener("click", () => switchTab("organic"));
  tabRotationBtn?.addEventListener("click", () => switchTab("rotation"));
  tabFertilizerBtn?.addEventListener("click", () => switchTab("fertilizer"));
  tabYojanaBtn?.addEventListener("click", () => switchTab("yojana"));
  tabKhataBtn?.addEventListener("click", () => switchTab("khata"));

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
  });
  closeLangModalBtn?.addEventListener("click", () => {
    langModal?.classList.add("hidden");
  });
  langModal?.addEventListener("click", (e) => {
    if (e.target === langModal) langModal.classList.add("hidden");
  });
  document.querySelectorAll(".lang-choice-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
      langModal?.classList.add("hidden");
    });
  });

  // District Calibrator controls
  stateSelect?.addEventListener("change", handleStateChange);
  districtSelect?.addEventListener("change", handleDistrictChange);

  // Plant Doctor controls
  doctorCropSelect?.addEventListener("change", executePlantDoctor);
  doctorPartSelect?.addEventListener("change", executePlantDoctor);
  doctorSearchInput?.addEventListener("input", executePlantDoctor);
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
  mandiSearchInput?.addEventListener("input", executeMandiPrices);

  // Irrigation Scheduler controls
  calcIrrigationBtn?.addEventListener("click", executeIrrigationScheduler);

  // Organic Doctor controls
  calcOrganicBtn?.addEventListener("click", executeOrganicDoctor);

  // Yojana Hub controls
  calcYojanaBtn?.addEventListener("click", executeKisanYojana);

  // Kisan Khata controls
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

  // Search input
  cropSearchInput?.addEventListener("input", (e) => {
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
      if (compareModal && !compareModal.classList.contains("hidden")) {
        closeComparisonModal();
      }
      if (langModal && !langModal.classList.contains("hidden")) {
        langModal.classList.add("hidden");
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
    { id: "khata", btn: tabKhataBtn, content: khataTabContent }
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

  // If Plant doctor or mandi is currently open, refresh them
  if (appState.activeTab === "doctor") executePlantDoctor();
  if (appState.activeTab === "mandi") executeMandiPrices();
  if (appState.activeTab === "khata") renderKhataLedger();
}

function toggleLanguage() {
  if (langModal) {
    langModal.classList.remove("hidden");
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

  // Determine crop display name from LOCAL_CROPS_DB or payload
  let cropDisplayName = "Selected Crop";
  if (window.LOCAL_CROPS_DB && payload.crop_id) {
    const found = window.LOCAL_CROPS_DB.find(c => c.id === payload.crop_id);
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
      alert("You can compare up to 3 crops at once.");
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
    alert("Please select at least 2 crops to compare side-by-side.");
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
          ${row("Cautions & Risks", c => `<span class="text-rose-700 font-medium">${c.cautions || "Standard vigilance for localized pests."}</span>`)}
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

function speakDiagnosis(text, lang = "hi") {
  if (!("speechSynthesis" in window)) {
    alert("Voice speech synthesis is not supported on your browser/device.");
    return;
  }
  window.speechSynthesis.cancel(); // Stop any active utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
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
          affected_part: part === "all" ? null : part,
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
            <button type="button" class="shrink-0 p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition" title="Listen to Audio Advisory (ऑडियो सलाह सुनें)" onclick="speakDiagnosis(decodeURIComponent('${escapedScript}'), 'hi')">
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
        renderMandiPrices(data.markets || []);
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
          pump_capacity_hp: pumpHp
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

  const rainUpcoming = (appState.weatherData && appState.weatherData.rainForecast7Day) ? appState.weatherData.rainForecast7Day : 0;
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
      <span>🌤️ 7-Day Rainfall Forecast: <strong>${data.weather_rain_forecast_mm || 0} mm</strong></span>
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
        <span class="text-2xl font-black text-blue-700 mt-1 block">${(data.total_water_volume_liters || 0).toLocaleString("en-IN")} L</span>
        <span class="text-[10px] text-slate-400">Total liters across holding</span>
      </div>

      <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <span class="text-xs text-slate-500 font-semibold block">Motor Pump Run Time</span>
        <span class="text-2xl font-black text-indigo-700 mt-1 block">${data.pump_run_hours} Hours</span>
        <span class="text-[10px] text-slate-400 font-mono">Electric/Diesel runtime</span>
      </div>

      <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <span class="text-xs text-slate-500 font-semibold block">Recommended Frequency</span>
        <span class="text-xl font-black text-emerald-800 mt-1 block">${data.interval_days}</span>
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

  organicResultContainer.innerHTML = `
    <!-- Acreage Volume Badges -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
      <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
        <span class="text-emerald-700 block text-xs">Jeevamrutha (जीवामृत)</span>
        <span class="text-2xl font-black text-emerald-900 mt-1 block">${data.jeevamrutha_liters} Liters</span>
        <span class="text-[10px] text-emerald-600 font-normal">200 L/acre per 21 days</span>
      </div>

      <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl">
        <span class="text-amber-700 block text-xs">Beejamrit (बीजामृत)</span>
        <span class="text-2xl font-black text-amber-900 mt-1 block">${data.beejamrit_liters} Liters</span>
        <span class="text-[10px] text-amber-600 font-normal">For seed coating & inoculation</span>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
        <span class="text-yellow-800 block text-xs">Ghanjeevamrit (घनजीवामृत)</span>
        <span class="text-2xl font-black text-yellow-900 mt-1 block">${data.ghanjeevamrit_kg} kg</span>
        <span class="text-[10px] text-yellow-600 font-normal">Solid basal soil inoculant</span>
      </div>

      <div class="bg-teal-50 border border-teal-200 p-4 rounded-xl">
        <span class="text-teal-700 block text-xs">Neemastra (नीमास्त्र)</span>
        <span class="text-2xl font-black text-teal-900 mt-1 block">${data.neemastra_liters} Liters</span>
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
  if (!yojanaResultContainer) return;
  yojanaResultContainer.classList.remove("hidden");

  yojanaResultContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- 1. PMFBY Crop Insurance -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-700">Crop Risk Protection</span>
            <h4 class="text-lg font-bold text-slate-900 mt-1">🌾 PM Fasal Bima Yojana (PMFBY)</h4>
            <p class="text-xs text-slate-500">${data.pmfby.season_category} Season Insurance</p>
          </div>
          <span class="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-1 rounded-lg">
            ${data.pmfby.farmer_premium_rate_percent}% Premium
          </span>
        </div>

        <div class="space-y-2 text-xs border-y border-slate-100 py-3">
          <div class="flex justify-between"><span class="text-slate-600">Total Sum Insured Coverage:</span> <strong class="font-mono text-slate-900">₹${(data.pmfby.sum_insured_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Farmer Payable Share:</span> <strong class="font-mono text-emerald-700 text-sm">₹${(data.pmfby.farmer_share_premium_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Govt Premium Subsidy:</span> <strong class="font-mono text-slate-700">₹${(data.pmfby.govt_subsidy_share_inr || 0).toLocaleString("en-IN")}</strong></div>
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
            ${data.kcc.effective_interest_rate_percent}% Effective Interest
          </span>
        </div>

        <div class="space-y-2 text-xs border-y border-slate-100 py-3">
          <div class="flex justify-between"><span class="text-slate-600">Scale of Finance / Acre:</span> <strong class="font-mono text-slate-900">₹${(data.kcc.scale_of_finance_per_acre_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Max Sanction Limit (with 30% add-on):</span> <strong class="font-mono text-indigo-700 text-sm">₹${(data.kcc.recommended_credit_limit_inr || 0).toLocaleString("en-IN")}</strong></div>
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
            ${data.pmksy_drip.subsidy_percentage}% Subsidy
          </span>
        </div>

        <div class="space-y-2 text-xs border-y border-slate-100 py-3">
          <div class="flex justify-between"><span class="text-slate-600">Est. Drip Installation Cost:</span> <strong class="font-mono text-slate-900">₹${(data.pmksy_drip.approx_equipment_cost_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Eligible Govt Subsidy:</span> <strong class="font-mono text-emerald-700 text-sm">₹${(data.pmksy_drip.eligible_subsidy_inr || 0).toLocaleString("en-IN")}</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">Farmer Net Contribution:</span> <strong class="font-mono text-slate-700">₹${(data.pmksy_drip.farmer_payable_inr || 0).toLocaleString("en-IN")}</strong></div>
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
          <div class="flex justify-between"><span class="text-slate-600">Total Annual Assistance:</span> <strong class="font-mono text-emerald-700 text-base">₹${(data.pm_kisan_annual_cash_inr || 6000).toLocaleString("en-IN")}</strong></div>
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
    alert("Please enter a valid amount greater than zero.");
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
}

function deleteKhataTransaction(id) {
  const entries = getKhataEntries().filter(t => t.id !== id);
  saveKhataEntries(entries);
  renderKhataLedger();
}
window.deleteKhataTransaction = deleteKhataTransaction;

function clearKhataLedger() {
  if (confirm("Are you sure you want to delete all entries from your farm ledger? This cannot be undone.")) {
    localStorage.removeItem(KHATA_STORAGE_KEY);
    renderKhataLedger();
  }
}

function exportKhataToCSV() {
  const entries = getKhataEntries();
  if (entries.length === 0) {
    alert("No ledger entries to export.");
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
}

function backupKhataToJSON() {
  const entries = getKhataEntries();
  if (entries.length === 0) {
    alert("No ledger entries to backup.");
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
        alert("Backup file contained 0 entries.");
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
      alert(`Successfully restored ${finalEntries.length} farm records!`);
    } catch (err) {
      alert("Error restoring backup: " + err.message);
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
          <div class="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
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


