// GRAMSYNC | Harvest Routing & Orchestration Engine

let currentLang = 'en';
let harvestMap = null;
let mapMarkers = {};
let activeRoutePolyline = null;
let compostRoutePolyline = null;
let currentPathways = [];
let selectedPathwayId = 'gram_fpo';

// Geographic Coordinates for Maharashtra Nashik Agricultural Cluster
const LOCATIONS = {
  farm: {
    id: 'farm',
    name: 'Dindori Farm Cluster (Origin)',
    nameHi: 'दिंडोरी फार्म क्लस्टर (उद्गम)',
    coords: [20.1420, 73.8350],
    type: 'Origin',
    iconClass: 'marker-farm',
    iconChar: '🌱'
  },
  fpo: {
    id: 'fpo',
    name: 'Sahyadri Agro-Processing Facility (Mohadi)',
    nameHi: 'सह्याद्री ऍग्रो प्रोसेसिंग प्लांट (मोहाडी)',
    coords: [20.1050, 73.9350],
    distanceKm: 16,
    durationMins: 30,
    type: 'FPO / Food Processor',
    iconClass: 'marker-fpo',
    iconChar: '🏭'
  },
  mandi: {
    id: 'mandi',
    name: 'Nashik APMC Mandi (Panchavati)',
    nameHi: 'नाशिक एपीएमसी मंडी (पंचवटी)',
    coords: [20.0120, 73.8010],
    distanceKm: 22,
    durationMins: 45,
    type: 'APMC Mandi',
    iconClass: 'marker-mandi',
    iconChar: '🏛️'
  },
  storage: {
    id: 'storage',
    name: 'Lasalgaon Cold Chain & Multi-Commodity Store',
    nameHi: 'लासलगाव कोल्ड स्टोरेज व गोडाउन',
    coords: [20.1480, 74.2250],
    distanceKm: 42,
    durationMins: 65,
    type: 'Cold / Dry Storage',
    iconClass: 'marker-storage',
    iconChar: '❄️'
  },
  compost: {
    id: 'compost',
    name: 'Gramsync Green Bio-Compost & Vermicompost Center',
    nameHi: 'ग्रामसिंक बायो-कंपोस्ट व सेंद्रिय खत केंद्र',
    coords: [20.1250, 73.8650],
    distanceKm: 5,
    durationMins: 12,
    type: 'Composting & Bio-Fertilizer',
    iconClass: 'marker-compost',
    iconChar: '♻️'
  }
};

// ==========================================
// TRANSLATION DICTIONARY (English & Hindi)
// ==========================================
const I18N = {
  en: {
    bannerTag: "Live Operational System",
    bannerText: '"Where, when and how should this harvest move?"',
    bannerSub: "AI Route & Location Optimization",
    geoHubBadge: "Nashik Agri Belt • Active Node",
    bannerCta: "Route Your Harvest Now →",
    logoBadge: "Routing Engine",
    logoSub: "Rural Production Orchestration",
    navSimulator: "Live Harvest Dispatcher",
    navMap: "Optimized Route Map",
    navCompost: "Composting & Waste Recovery",
    navSignUp: "Sign Up / Join",
    ctaSignUp: "Register Farm / FPO",
    heroBadge: "Solving Farmgate Realization & Spoilage in Real Time",
    heroTitlePart1: "Smart Harvest Dispatch: Find The ",
    heroTitlePart2: "Optimized Selling Location",
    heroSubtitle: "Don't lose money on high headline quotes eroded by freight, delays, and transit damage. Enter your harvest details below to calculate net payout, view live geospatial routes, and divert rotten crops for bio-composting recovery.",
    stat1Label: "Market Matching",
    stat1Val: "Mandi vs Processor",
    stat2Label: "Logistics Consolidation",
    stat2Val: "Shared FPO Freight",
    stat3Label: "Holding Option",
    stat3Val: "Cold/Dry Storage",
    stat4Label: "Zero Waste Loop",
    stat4Val: "Bio-Compost Recovery",
    simTag: "Step 1: Input Harvest Details",
    simTitle: "Harvest Dispatch & Net Realization Optimizer",
    simDesc: "Configure your harvest volume, urgency, and rotten crop portion to generate real-time dispatch routes.",
    voiceBtn: "Hear Voice Guidance (हिन्दी)",
    labelCrop: "1. Crop Type",
    cropHelp: "Affects perishability decay & processing feasibility.",
    labelVolume: "2. Harvest Quantity",
    labelUrgency: "3. Payment Urgency",
    urgencyImmediate: "Immediate Cash (Within 24 Hours)",
    urgencyFlexible: "Flexible (Can wait 2-5 days for best net)",
    urgencyStorage: "Storage Arbitrage (Wait for off-peak price)",
    urgencyHelp: "Allows holding or batch aggregation.",
    labelRotten: "Rotten / Damaged Crop",
    rottenMin: "0% (All Fresh)",
    rottenMax: "100% (All Rotten)",
    rottenNotice: "♻️ Automatically diverted to rural composting plant at ₹2.50/kg!",
    pathwaysHeader: "Evaluated Selling & Disposal Destinations",
    clickCardNotice: "👉 Click any destination card below to highlight its exact route on the map!",
    mapTag: "Step 2: Real-Time Geospatial Follow-Up",
    mapTitle: "Live Route & Optimized Selling Location Map",
    mapDesc: "Geographic view of farm origin, mandi, processing unit, cold storage, and bio-composting facility. Routes update dynamically as you select destinations.",
    legendFarm: "Farm Cluster (Origin)",
    legendFpo: "FPO Processing",
    legendMandi: "APMC Mandi",
    legendCompost: "Composting Plant (Rotten)",
    mapTip: "Interactive map: Zoom, pan, or click markers to inspect facility details and capacity.",
    mapCoords: "Region: Dindori - Nashik - Pimpalgaon Agri Cluster",
    panelRouteTitle: "Active Selected Route",
    specDistance: "Distance",
    specTransitTime: "Est. Travel Time",
    specFreight: "Consolidated Freight",
    specNetPayout: "Net Farmer Payout",
    rottenSplitTitle: "Compost Diversion Active",
    coordStatus: "Coordinated Fleet Match",
    truckType: "Vehicle: Shared Bolero Maxi (FPO Batch #402)",
    btnConfirmDispatch: "Confirm & Lock This Dispatch Route",
    dispatchNotice: "Transmits pick-up details to FPO coordinator and destination receiver.",
    compostBadge: "Circular Agriculture & Zero Waste",
    compostTitle: "Transforming Rotten Harvests Into Cash & Organic Bio-Fertilizer",
    compostDesc: "When crops spoil due to weather, delay, or transit stress, traditional channels force farmers to dump them on highways for zero return. GRAMSYNC automatically detects spoiled or damaged portions and routes them directly to local vermicompost units, bio-CNG plants, and organic fertilizer producers.",
    compostPerKg: "Payout per kg for organic compost biomass",
    compostDiversion: "Diversion from landfills & road dumping",
    compostRadius: "Hyper-local village composting radius",
    compostProcessTitle: "The 3-Step Waste Recovery Loop",
    step1Title: "Damage Assessment:",
    step1Desc: "Farmer or FPO grades spoiled volume on the simulator.",
    step2Title: "Automated Dispatch:",
    step2Desc: "Routed to the closest verified composting or biogas digester.",
    step3Title: "Farmer Recovery Credit:",
    step3Desc: "Direct payment credited to the farmer's account for biomass input.",
    signUpTag: "Join The Network",
    signUpTitle: "Sign Up For GRAMSYNC Rural Orchestration",
    signUpDesc: "Whether you are a grower, an FPO manager, a transport driver, a cold store operator, or a composting plant owner, register to connect your nodes.",
    formName: "Full Name / Contact Person",
    formPhone: "Mobile / WhatsApp Number",
    formRole: "I Represent",
    roleFarmer: "Individual Farmer / Grower Cluster",
    roleFpo: "Farmer Producer Organization (FPO) / Cooperative",
    roleCompost: "Composting / Bio-CNG / Waste Recovery Facility",
    roleProcessor: "Food Processor / Agro Enterprise",
    roleLogistics: "Transporter / Fleet Operator",
    roleStorage: "Cold Storage / Warehouse Facility",
    formDistrict: "Village / District / State",
    formDetails: "Commodities, Volume, or Infrastructure Details",
    formSubmitBtn: "Submit Registration",
    formSuccessText: "🎉 Registration received! A local Gramsync coordinator will connect with you via WhatsApp/Call within 24 hours.",
    footerSub: "Harvest Routing & Rural Production Network",
    footerCopyright: "© 2026 GRAMSYNC Network. Operational platform for harvest dispatch, logistics consolidation & composting recovery.",
    dispatchModalTitle: "Dispatch Route Confirmed!"
  },
  hi: {
    bannerTag: "सक्रिय संचालन प्रणाली",
    bannerText: '"यह फसल कहां, कब और कैसे जानी चाहिए?"',
    bannerSub: "एआई द्वारा रूट और स्थान अनुकूलन",
    geoHubBadge: "नाशिक कृषि क्षेत्र • सक्रिय नोड",
    bannerCta: "अपनी फसल का सही रूट चुनें →",
    logoBadge: "रूटिंग इंजन",
    logoSub: "ग्रामीण उत्पादन समन्वय नेटवर्क",
    navSimulator: "लाइव फसल डिस्पैचर",
    navMap: "अनुकूलित रूट मैप",
    navCompost: "कंपोस्टिंग और कचरा पुनर्चक्रण",
    navSignUp: "रजिस्टर करें",
    ctaSignUp: "फार्म / FPO जोड़ें",
    heroBadge: "खेत से बिक्री और खराबी की समस्या का वास्तविक समाधान",
    heroTitlePart1: "स्मार्ट फसल डिस्पैच: खोजें ",
    heroTitlePart2: "सर्वोत्तम बिक्री स्थान और रूट",
    heroSubtitle: "मंडी के ऊंचे झूठे भाव के चक्कर में भाड़ा, देरी और खराबी से नुकसान न उठाएं। नीचे अपनी फसल की जानकारी दर्ज करें, वास्तविक शुद्ध आय देखें, नक्शे पर लाइव रूट ट्रैक करें, और सड़ी फसल को कंपोस्टिंग में बेचकर अतिरिक्त पैसे कमाएं।",
    stat1Label: "बाजार मिलान",
    stat1Val: "मंडी बनाम फूड प्रोसेसर",
    stat2Label: "परिवहन बचत",
    stat2Val: "साझा FPO ट्रक भाड़ा",
    stat3Label: "भंडारण विकल्प",
    stat3Val: "कोल्ड स्टोरेज सुविधा",
    stat4Label: "जीरो वेस्ट चक्र",
    stat4Val: "सड़ी फसल से कंपोस्ट आय",
    simTag: "चरण 1: फसल विवरण भरें",
    simTitle: "फसल डिस्पैच और शुद्ध मुनाफा कैलकुलेटर",
    simDesc: "अपनी उपज, नकदी की जरूरत, और सड़ी फसल का प्रतिशत दर्ज करें और सबसे बेहतर रूट प्राप्त करें।",
    voiceBtn: "आवाज में सुझाव सुनें (Voice)",
    labelCrop: "1. फसल का प्रकार",
    cropHelp: "खराबी की दर और प्रोसेसिंग क्षमता तय करता है।",
    labelVolume: "2. फसल की मात्रा",
    labelUrgency: "3. भुगतान की तात्कालिकता",
    urgencyImmediate: "तुरंत नकद (24 घंटे में भुगतान)",
    urgencyFlexible: "लचीला (2-5 दिन में अधिकतम मुनाफा)",
    urgencyStorage: "स्टोरेज आर्बिट्राज (ऑफ-सीजन में बिक्री)",
    urgencyHelp: "माल को रोककर ऊंचे भाव में बेचने की सुविधा।",
    labelRotten: "सड़ी / खराब फसल की मात्रा",
    rottenMin: "0% (पूरी तरह ताजी)",
    rottenMax: "100% (पूरी सड़ी हुई)",
    rottenNotice: "♻️ सड़ी फसल सीधे ₹2.50/किग्रा पर जैविक कंपोस्ट खाद केंद्र भेजी जाएगी!",
    pathwaysHeader: "उपलब्ध बिक्री और निस्तारण विकल्प",
    clickCardNotice: "👉 नक्शे पर लाइव रूट देखने के लिए नीचे दिए गए किसी भी कार्ड पर क्लिक करें!",
    mapTag: "चरण 2: लाइव नक्शा और स्थान",
    mapTitle: "लाइव रूट और अनुकूलित बिक्री स्थान का नक्शा",
    mapDesc: "खेत, मंडी, प्रोसेसिंग यूनिट, कोल्ड स्टोर और कंपोस्टिंग केंद्र का भौगोलिक नक्शा। कार्ड चुनने पर रूट तुरंत बदलता है।",
    legendFarm: "खेत (उद्गम केंद्र)",
    legendFpo: "FPO प्रोसेसिंग",
    legendMandi: "APMC मंडी",
    legendCompost: "कंपोस्ट केंद्र (सड़ी फसल)",
    mapTip: "इंटरैक्टिव मैप: ज़ूम करें, ड्रैग करें, या मार्कर पर क्लिक करके क्षमता और विवरण देखें।",
    mapCoords: "क्षेत्र: दिंडोरी - नाशिक - पिंपलगांव कृषि क्लस्टर",
    panelRouteTitle: "वर्तमान में चुना गया रूट",
    specDistance: "दूरी",
    specTransitTime: "अनुमानित समय",
    specFreight: "साझा ट्रक भाड़ा",
    specNetPayout: "किसान की शुद्ध आय",
    rottenSplitTitle: "सड़ी फसल का कंपोस्ट रूट सक्रिय",
    coordStatus: "उपलब्ध वाहन समन्वय",
    truckType: "वाहन: साझा बोलेरो मैक्सी (FPO बैच #402)",
    btnConfirmDispatch: "यह डिस्पैच रूट पक्का करें",
    dispatchNotice: "FPO कोऑर्डिनेटर और खरीदार को तुरंत संदेश भेजता है।",
    compostBadge: "चक्रीय कृषि और शून्य बर्बादी",
    compostTitle: "सड़ी हुई फसल से कमाएं नकद और बनाएं जैविक खाद",
    compostDesc: "जब फसल मौसम या देरी से सड़ जाती है, तो परंपरागत व्यवस्था में किसानों को सड़क किनारे फेंकना पड़ता है। ग्रामसिंक सड़ी फसल को पहचानकर तुरंत नजदीकी वर्मीकंपोस्ट और बायो-सीएनजी प्लांट भेजता है, जिससे किसान को ₹2.50/किग्रा का अतिरिक्त नकद लाभ मिलता है।",
    compostPerKg: "सड़ी फसल के लिए जैविक खाद केंद्र से भुगतान",
    compostDiversion: "सड़क किनारे कचरा फेंकने से 100% बचाव",
    compostRadius: "स्थानीय 8 किमी के दायरे में कंपोस्टिंग",
    compostProcessTitle: "कचरे से कमाई के 3 चरण",
    step1Title: "खराबी का आकलन:",
    step1Desc: "किसान या FPO खराब हिस्से का प्रतिशत दर्ज करते हैं।",
    step2Title: "स्वचालित डिस्पैच:",
    step2Desc: "नजदीकी अधिकृत कंपोस्ट या बायो-डाइजेस्टर को रूट भेजा जाता है।",
    step3Title: "किसान को भुगतान:",
    step3Desc: "सड़ी फसल का पैसा सीधे किसान के खाते में जमा होता है।",
    signUpTag: "नेटवर्क से जुड़ें",
    signUpTitle: "ग्रामसिंक ग्रामीण नेटवर्क में पंजीकरण करें",
    signUpDesc: "चाहे आप किसान हों, FPO संचालक, ट्रक चालक, कोल्ड स्टोर मालिक या कंपोस्ट प्लांट ऑपरेटर — अपने केंद्र को जोड़ें।",
    formName: "पूरा नाम / संपर्क व्यक्ति",
    formPhone: "मोबाइल / व्हाट्सएप नंबर",
    formRole: "मेरी भूमिका",
    roleFarmer: "किसान / उत्पादक समूह",
    roleFpo: "FPO / किसान सहकारी समिति",
    roleCompost: "कंपोस्टिंग / बायो-सीएनजी प्लांट ऑपरेटर",
    roleProcessor: "फूड प्रोसेसिंग इकाई / उद्योग",
    roleLogistics: "ट्रांसपोर्टर / ट्रक मालिक",
    roleStorage: "कोल्ड स्टोरेज / गोदाम संचालक",
    formDistrict: "गांव / जिला / राज्य",
    formDetails: "फसल, मात्रा या सुविधा का विवरण",
    formSubmitBtn: "पंजीकरण जमा करें",
    formSuccessText: "🎉 पंजीकरण प्राप्त हुआ! हमारे स्थानीय कोऑर्डिनेटर 24 घंटे के भीतर आपसे व्हाट्सएप/कॉल पर संपर्क करेंगे।",
    footerSub: "फसल रूटिंग एवं ग्रामीण उत्पादन नेटवर्क",
    footerCopyright: "© 2026 GRAMSYNC Network. फसल डिस्पैच, लॉजिस्टिक्स बचत एवं कंपोस्टिंग हेतु परिचालन मंच।",
    dispatchModalTitle: "डिस्पैच रूट सुरक्षित हो गया!"
  }
};

// ==========================================
// CROP CONFIGURATION DATA
// ==========================================
const CROP_DATA = {
  tomato: {
    nameEn: "Tomato",
    nameHi: "टमाटर",
    mandiPrice: 24,
    processorPrice: 20.5,
    storagePrice: 28,
    middlemanPrice: 14,
    compostPrice: 2.5,
    perishabilityFactor: 0.12,
    storable: false
  },
  onion: {
    nameEn: "Red Onion",
    nameHi: "लाल प्याज",
    mandiPrice: 22,
    processorPrice: 19.5,
    storagePrice: 32,
    middlemanPrice: 15,
    compostPrice: 2.0,
    perishabilityFactor: 0.04,
    storable: true
  },
  chilli: {
    nameEn: "Green Chilli",
    nameHi: "हरी मिर्च",
    mandiPrice: 44,
    processorPrice: 39,
    storagePrice: 52,
    middlemanPrice: 26,
    compostPrice: 3.0,
    perishabilityFactor: 0.09,
    storable: false
  },
  potato: {
    nameEn: "Table Potato",
    nameHi: "आलू",
    mandiPrice: 17,
    processorPrice: 15,
    storagePrice: 25,
    middlemanPrice: 11,
    compostPrice: 2.0,
    perishabilityFactor: 0.02,
    storable: true
  },
  mango: {
    nameEn: "Mango",
    nameHi: "आम",
    mandiPrice: 75,
    processorPrice: 68,
    storagePrice: 95,
    middlemanPrice: 42,
    compostPrice: 3.5,
    perishabilityFactor: 0.07,
    storable: false
  }
};

// ==========================================
// APP INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  initMap();
  updateQtyDisplay();
  updateRottenDisplay();
  runSimulation();
});

// Switch language between English and Hindi
function switchLanguage(lang) {
  currentLang = lang;

  // Toggle active button style
  const btnEn = document.getElementById('langBtnEn');
  const btnHi = document.getElementById('langBtnHi');

  if (lang === 'hi') {
    btnHi.className = "px-2.5 py-1 text-xs font-bold rounded-lg transition-all bg-brand-700 text-white shadow-sm";
    btnEn.className = "px-2.5 py-1 text-xs font-bold rounded-lg transition-all text-slate-600 hover:text-slate-900";
  } else {
    btnEn.className = "px-2.5 py-1 text-xs font-bold rounded-lg transition-all bg-white text-brand-800 shadow-sm";
    btnHi.className = "px-2.5 py-1 text-xs font-bold rounded-lg transition-all text-slate-600 hover:text-slate-900";
  }

  // Update all elements with data-i18n
  const dict = I18N[lang] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Re-run simulation to update dynamic labels and pathway cards
  runSimulation();
}

// Display updates
function updateQtyDisplay() {
  const qtyQ = parseFloat(document.getElementById('simQty').value) || 25;
  const kg = qtyQ * 100;
  const text = currentLang === 'hi' 
    ? `${qtyQ} क्विंटल (${kg.toLocaleString()} किग्रा)`
    : `${qtyQ} Q (${kg.toLocaleString()} kg)`;
  document.getElementById('simQtyVal').innerText = text;
}

function updateRottenDisplay() {
  const rottenPct = parseFloat(document.getElementById('simRotten').value) || 0;
  const qtyQ = parseFloat(document.getElementById('simQty').value) || 25;
  const totalKg = qtyQ * 100;
  const rottenKg = Math.round((rottenPct / 100) * totalKg);

  const text = currentLang === 'hi'
    ? `${rottenPct}% (${rottenKg.toLocaleString()} किग्रा खराब)`
    : `${rottenPct}% (${rottenKg.toLocaleString()} kg rotten)`;
  document.getElementById('simRottenVal').innerText = text;
}

// ==========================================
// SIMULATOR CORE LOGIC
// ==========================================
function runSimulation() {
  const cropKey = document.getElementById('simCrop').value;
  const qtyQ = parseFloat(document.getElementById('simQty').value) || 25;
  const urgency = document.getElementById('simUrgency').value;
  const rottenPct = parseFloat(document.getElementById('simRotten').value) || 0;

  const crop = CROP_DATA[cropKey] || CROP_DATA.tomato;
  const totalKg = qtyQ * 100;

  // Split into fresh vs rotten portions
  const rottenKg = Math.round((rottenPct / 100) * totalKg);
  const freshKg = totalKg - rottenKg;

  // Payout from Composting Hub for Rotten crop portion
  const compostIncome = Math.round(rottenKg * crop.compostPrice);

  // === CALCULATE THE 4 DESTINATIONS FOR FRESH CROP ===

  // 1. APMC Mandi Route (Uncoordinated)
  const mandiHeadline = Math.round(freshKg * crop.mandiPrice);
  const mandiFreight = freshKg > 0 ? Math.round(freshKg * 2.6) : 0;
  const mandiSpoilage = freshKg > 0 ? Math.round(mandiHeadline * crop.perishabilityFactor) : 0;
  const mandiCess = Math.round(mandiHeadline * 0.06);
  const mandiNet = Math.max(0, mandiHeadline - mandiFreight - mandiSpoilage - mandiCess) + compostIncome;

  // 2. FPO Aggregated Processor (Sahyadri Agro)
  const fpoGross = Math.round(freshKg * crop.processorPrice);
  const fpoFreight = freshKg > 0 ? Math.round(freshKg * 0.85) : 0;
  const fpoSpoilage = freshKg > 0 ? Math.round(fpoGross * 0.015) : 0;
  const fpoNet = Math.max(0, fpoGross - fpoFreight - fpoSpoilage) + compostIncome;

  // 3. Cold / Dry Storage (Lasalgaon Hub)
  const storageFuturePrice = crop.storable ? crop.storagePrice : crop.mandiPrice * 1.15;
  const storageGross = Math.round(freshKg * storageFuturePrice);
  const storageRent = Math.round((freshKg / 100) * 120); // 3 weeks storage rent
  const storageSpoilage = Math.round(storageGross * (crop.storable ? 0.03 : 0.20));
  const storageFreight = freshKg > 0 ? Math.round(freshKg * 1.2) : 0;
  const storageNet = Math.max(0, storageGross - storageRent - storageSpoilage - storageFreight) + compostIncome;

  // 4. Dedicated 100% Composting Route (for comparison or when rotten is high)
  const pureCompostNet = Math.round(totalKg * crop.compostPrice);

  // Build Pathways
  currentPathways = [
    {
      id: 'gram_fpo',
      locationKey: 'fpo',
      title: currentLang === 'hi' ? 'FPO प्रसंस्करण केंद्र (सह्याद्री)' : 'FPO Processor Link (Sahyadri)',
      destName: LOCATIONS.fpo.name,
      destNameHi: LOCATIONS.fpo.nameHi,
      badge: currentLang === 'hi' ? 'अनुशंसित (सर्वश्रेष्ठ)' : 'Recommended (Optimal)',
      badgeClass: 'bg-emerald-100 text-brand-900 border border-emerald-300',
      totalNet: fpoNet,
      headlineOffer: `₹${crop.processorPrice}/kg`,
      ratePerKg: totalKg > 0 ? (fpoNet / totalKg).toFixed(1) : 0,
      freshShare: fpoNet - compostIncome,
      compostShare: compostIncome,
      rottenKg: rottenKg,
      desc: currentLang === 'hi' 
        ? 'साझा FPO ट्रक, सीधा अनुबंध, शून्य मंडी टैक्स। सड़ा हिस्सा कंपोस्ट भेजा गया।'
        : 'Shared FPO freight, direct food processor contract, zero brokerage. Rotten portion diverted to compost.'
    },
    {
      id: 'mandi',
      locationKey: 'mandi',
      title: currentLang === 'hi' ? 'APMC मंडी (पंचवटी नाशिक)' : 'APMC Mandi (Nashik Panchavati)',
      destName: LOCATIONS.mandi.name,
      destNameHi: LOCATIONS.mandi.nameHi,
      badge: currentLang === 'hi' ? 'असंगठित रूट' : 'Uncoordinated',
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-200',
      totalNet: mandiNet,
      headlineOffer: `₹${crop.mandiPrice}/kg`,
      ratePerKg: totalKg > 0 ? (mandiNet / totalKg).toFixed(1) : 0,
      freshShare: mandiNet - compostIncome,
      compostShare: compostIncome,
      rottenKg: rottenKg,
      desc: currentLang === 'hi'
        ? 'ऊंचा दिखावटी भाव, लेकिन व्यक्तिगत भारी भाड़ा (₹2.6/kg) और 6% आढ़त कटौती।'
        : 'High headline quote eroded by solo transit costs and 6% APMC mandi cess.'
    },
    {
      id: 'storage',
      locationKey: 'storage',
      title: currentLang === 'hi' ? 'कोल्ड स्टोरेज (लासलगाव)' : 'Cold Storage (Lasalgaon)',
      destName: LOCATIONS.storage.name,
      destNameHi: LOCATIONS.storage.nameHi,
      badge: currentLang === 'hi' ? 'स्टोरेज आर्बिट्राज' : 'Staggered Arbitrage',
      badgeClass: 'bg-indigo-100 text-indigo-900 border border-indigo-200',
      totalNet: storageNet,
      headlineOffer: `₹${storageFuturePrice}/kg (भविष्य)`,
      ratePerKg: totalKg > 0 ? (storageNet / totalKg).toFixed(1) : 0,
      freshShare: storageNet - compostIncome,
      compostShare: compostIncome,
      rottenKg: rottenKg,
      desc: currentLang === 'hi'
        ? (crop.storable ? 'फसल सुरक्षित रखकर ऑफ-पीक सीजन में ऊंचे भाव पर बिक्री।' : 'टमाटर जैसे खराब होने वाले फल में स्टोरेज नुकसान अधिक।')
        : (crop.storable ? 'Holds produce to capture off-peak market price spikes.' : 'High spoilage risk for highly perishable commodities.')
    },
    {
      id: 'compost_pure',
      locationKey: 'compost',
      title: currentLang === 'hi' ? 'ग्रामसिंक कंपोस्ट व जैविक केंद्र' : 'Gramsync Bio-Compost Hub',
      destName: LOCATIONS.compost.name,
      destNameHi: LOCATIONS.compost.nameHi,
      badge: currentLang === 'hi' ? 'जीरो वेस्ट रिकवरी' : 'Zero-Waste Recovery',
      badgeClass: 'bg-lime-100 text-lime-900 border border-lime-300',
      totalNet: pureCompostNet,
      headlineOffer: `₹${crop.compostPrice}/kg`,
      ratePerKg: crop.compostPrice.toFixed(1),
      freshShare: 0,
      compostShare: pureCompostNet,
      rottenKg: totalKg,
      desc: currentLang === 'hi'
        ? 'पूरी फसल को वर्मीकंपोस्ट व बायो-सीएनजी में तब्दील कर पर्यावरण और जमीन की रक्षा।'
        : '100% conversion into vermicompost and biogas feedstock. Direct cash recovery for waste biomass.'
    }
  ];

  // Pick optimal based on rotten % and net
  let bestId = 'gram_fpo';
  if (rottenPct >= 80) {
    bestId = 'compost_pure';
  } else if (urgency === 'storage' && crop.storable && storageNet > fpoNet) {
    bestId = 'storage';
  } else {
    bestId = fpoNet >= mandiNet ? 'gram_fpo' : 'mandi';
  }

  // Preserve user selection if valid, otherwise set best
  if (!currentPathways.some(p => p.id === selectedPathwayId)) {
    selectedPathwayId = bestId;
  }

  renderPathways(bestId);
  updateActiveRouteDetails();
}

function renderPathways(bestId) {
  const container = document.getElementById('pathwaysContainer');
  const cropKey = document.getElementById('simCrop').value;
  const crop = CROP_DATA[cropKey] || CROP_DATA.tomato;
  const cropName = currentLang === 'hi' ? crop.nameHi : crop.nameEn;

  container.innerHTML = currentPathways.map(p => {
    const isSelected = p.id === selectedPathwayId;
    const isBest = p.id === bestId;
    const isCompostPure = p.id === 'compost_pure';

    let cardBorder = isSelected 
      ? 'selected-pathway' 
      : (isCompostPure ? 'compost-pathway' : 'bg-slate-50/70 border-slate-200');

    return `
      <div onclick="selectPathway('${p.id}')" class="pathway-card rounded-2xl p-5 border ${cardBorder} flex flex-col justify-between relative">
        <div>
          ${isBest ? `
            <div class="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-brand-700 text-white text-[10px] font-bold shadow">
              ★ ${currentLang === 'hi' ? 'सर्वोत्तम लाभ' : 'OPTIMAL'}
            </div>` : ''}

          <div class="flex items-center justify-between gap-1 mb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${p.badgeClass}">
              ${p.badge}
            </span>
          </div>

          <h4 class="font-bold text-sm text-slate-900 leading-snug">${p.title}</h4>
          
          <div class="mt-3 text-xs text-slate-500">
            ${currentLang === 'hi' ? 'भाव:' : 'Offer:'} <strong class="text-slate-900">${p.headlineOffer}</strong>
          </div>

          <div class="mt-2 text-2xl font-black font-mono ${isSelected ? 'text-brand-700' : 'text-slate-800'}">
            ₹${p.totalNet.toLocaleString()}
          </div>

          <div class="text-[11px] font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-500'}">
            ₹${p.ratePerKg} / kg ${currentLang === 'hi' ? 'शुद्ध हाथ में' : 'net in pocket'}
          </div>

          ${p.compostShare > 0 ? `
            <div class="mt-2 p-1.5 rounded-lg bg-lime-100 text-lime-900 text-[10px] font-medium flex items-center justify-between">
              <span>♻️ ${currentLang === 'hi' ? 'कंपोस्टिंग से आय:' : 'Compost Payout:'}</span>
              <strong class="font-mono">+₹${p.compostShare.toLocaleString()}</strong>
            </div>
          ` : ''}

          <div class="mt-3 text-[11px] text-slate-600 border-t border-slate-200/80 pt-2 leading-tight">
            ${p.desc}
          </div>
        </div>

        <div class="mt-4 pt-2 text-[10px] font-bold uppercase text-brand-600 flex items-center justify-between">
          <span>${isSelected ? (currentLang === 'hi' ? '✓ मैप पर सक्रिय' : '✓ Active On Map') : (currentLang === 'hi' ? 'मैप पर देखें →' : 'View on Map →')}</span>
        </div>
      </div>
    `;
  }).join('');

  // Update Detail Recommendation Banner
  const selectedP = currentPathways.find(p => p.id === selectedPathwayId) || currentPathways[0];
  const detailBox = document.getElementById('simDetailBox');
  detailBox.innerHTML = `
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5">
        <i data-lucide="check-circle" class="w-6 h-6"></i>
      </div>
      <div class="space-y-1">
        <div class="text-xs uppercase font-bold tracking-wider text-brand-900">
          ${currentLang === 'hi' ? 'चुना हुआ रूट एवं बिक्री स्थान' : 'Selected Harvest Movement & Destination'}
        </div>
        <div class="text-lg font-bold text-slate-900 font-display">
          ${selectedP.title} — ${currentLang === 'hi' ? 'किसान की कुल शुद्ध आय:' : 'Total Farmer Net Realization:'} ₹${selectedP.totalNet.toLocaleString()}
        </div>
        <p class="text-xs text-slate-700 leading-relaxed">
          ${currentLang === 'hi' 
            ? `ग्रामसिंक ने <strong>${cropName}</strong> की उपज के लिए दूरी, भाड़ा, खराबी और सड़ी फसल के कंपोस्टिंग को जोड़कर यह रूट तैयार किया है। नीचे दिए गए नक्शे में रूट का पूरा विवरण देखें।` 
            : `GRAMSYNC evaluated freight savings, decay rates, and compost diversion for this <strong>${cropName}</strong> batch. Inspect the live route and facility details on the map below.`}
        </p>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// User clicks a pathway card
function selectPathway(pathwayId) {
  selectedPathwayId = pathwayId;
  const bestId = (currentPathways[0] && currentPathways[0].id) || 'gram_fpo';
  renderPathways(bestId);
  updateActiveRouteDetails();

  // Scroll smoothly to map on small screens
  if (window.innerWidth < 768) {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Update Active Route Panel next to Map
function updateActiveRouteDetails() {
  const pathway = currentPathways.find(p => p.id === selectedPathwayId) || currentPathways[0];
  if (!pathway) return;

  const loc = LOCATIONS[pathway.locationKey] || LOCATIONS.fpo;
  const rottenPct = parseFloat(document.getElementById('simRotten').value) || 0;
  const qtyQ = parseFloat(document.getElementById('simQty').value) || 25;
  const totalKg = qtyQ * 100;
  const rottenKg = Math.round((rottenPct / 100) * totalKg);

  document.getElementById('activeDestName').innerText = currentLang === 'hi' ? loc.nameHi : loc.name;
  document.getElementById('activeDestType').innerText = loc.type;
  document.getElementById('activeDistance').innerText = `${loc.distanceKm} km`;
  document.getElementById('activeDuration').innerText = `${loc.durationMins} mins`;
  
  // Freight calculation
  const freight = pathway.id === 'mandi' ? Math.round(totalKg * 2.6) : (pathway.id === 'compost_pure' ? 250 : Math.round(totalKg * 0.85));
  document.getElementById('activeFreight').innerText = `₹${freight.toLocaleString()}`;
  document.getElementById('activeNetPayout').innerText = `₹${pathway.totalNet.toLocaleString()}`;

  // Rotten card in panel
  const rottenCard = document.getElementById('rottenSplitCard');
  if (rottenKg > 0 && pathway.id !== 'compost_pure') {
    rottenCard.classList.remove('hidden');
    document.getElementById('rottenPayoutVal').innerText = `+₹${pathway.compostShare.toLocaleString()} ${currentLang === 'hi' ? 'आय' : 'Payout'}`;
    document.getElementById('rottenSplitDesc').innerText = currentLang === 'hi'
      ? `${rottenKg} किग्रा सड़ी फसल सीधे ग्रामसिंक कंपोस्ट केंद्र (5 किमी) भेजी जाएगी।`
      : `${rottenKg} kg spoiled crop diverted to Gramsync Green Bio-Compost Hub (5 km) for organic fertilizer.`;
  } else {
    rottenCard.classList.add('hidden');
  }

  // Draw active route on map
  drawRouteOnMap(loc);
}

// ==========================================
// LEAFLET MAP INITIALIZATION & ROUTING
// ==========================================
function initMap() {
  const mapContainer = document.getElementById('harvestMap');
  if (!mapContainer || harvestMap) return;

  // Center on Dindori / Nashik agricultural belt
  harvestMap = L.map('harvestMap', {
    scrollWheelZoom: false
  }).setView([20.10, 73.90], 11);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(harvestMap);

  // Place custom icons for each location
  Object.values(LOCATIONS).forEach(loc => {
    const customIcon = L.divIcon({
      className: `custom-map-icon ${loc.iconClass}`,
      html: `<span>${loc.iconChar}</span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker(loc.coords, { icon: customIcon }).addTo(harvestMap);
    
    // Popup
    marker.bindPopup(`
      <div class="text-xs space-y-1">
        <strong class="text-slate-900 font-bold block text-sm">${currentLang === 'hi' ? loc.nameHi : loc.name}</strong>
        <span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">${loc.type}</span>
        ${loc.distanceKm ? `<div class="text-slate-600 mt-1">📍 ${currentLang === 'hi' ? 'खेत से दूरी:' : 'Distance:'} <strong>${loc.distanceKm} km</strong> (${loc.durationMins} mins)</div>` : '<div class="text-emerald-700 font-semibold mt-1">🌱 Origin Farm Cluster</div>'}
      </div>
    `);

    mapMarkers[loc.id] = marker;
  });
}

function drawRouteOnMap(destination) {
  if (!harvestMap) return;

  const farmCoords = LOCATIONS.farm.coords;
  const destCoords = destination.coords;

  // Clear previous main polyline
  if (activeRoutePolyline) {
    harvestMap.removeLayer(activeRoutePolyline);
  }
  // Clear compost auxiliary line
  if (compostRoutePolyline) {
    harvestMap.removeLayer(compostRoutePolyline);
  }

  // Choose route line color
  let routeColor = '#059669'; // default emerald
  if (destination.id === 'mandi') routeColor = '#e11d48';
  if (destination.id === 'storage') routeColor = '#4f46e5';
  if (destination.id === 'compost') routeColor = '#65a30d';

  // Draw main route polyline
  activeRoutePolyline = L.polyline([farmCoords, destCoords], {
    color: routeColor,
    weight: 5,
    opacity: 0.85,
    dashArray: '8, 8'
  }).addTo(harvestMap);

  // If there's rotten crop and destination is NOT compost itself, draw secondary green line to Compost Hub
  const rottenPct = parseFloat(document.getElementById('simRotten').value) || 0;
  if (rottenPct > 0 && destination.id !== 'compost') {
    compostRoutePolyline = L.polyline([farmCoords, LOCATIONS.compost.coords], {
      color: '#65a30d',
      weight: 4,
      opacity: 0.8,
      dashArray: '4, 6'
    }).addTo(harvestMap);
  }

  // Fit bounds to show both origin and destination comfortably
  const bounds = L.latLngBounds([farmCoords, destCoords]);
  if (rottenPct > 0 && destination.id !== 'compost') {
    bounds.extend(LOCATIONS.compost.coords);
  }
  harvestMap.fitBounds(bounds, { padding: [50, 50] });

  // Open destination popup
  if (mapMarkers[destination.id]) {
    mapMarkers[destination.id].openPopup();
  }
}

// ==========================================
// VOICE ASSISTANT DEMO (Hindi SpeechSynthesis)
// ==========================================
function playVoiceBrief() {
  const cropKey = document.getElementById('simCrop').value;
  const qtyQ = parseFloat(document.getElementById('simQty').value) || 25;
  const rottenPct = parseFloat(document.getElementById('simRotten').value) || 0;
  const crop = CROP_DATA[cropKey] || CROP_DATA.tomato;

  const speechText = `नमस्ते किसान भाई। आपके ${qtyQ} क्विंटल ${crop.nameHi} में से ${rottenPct} प्रतिशत सड़ा हिस्सा सीधे ग्रामसिंक बायो-कंपोस्ट केंद्र जाएगा जिससे आपको अतिरिक्त नकद मिलेगा। ताजी उपज के लिए सह्याद्री FPO का साझा ट्रक सबसे ज्यादा शुद्ध मुनाफा दे रहा है। अंतिम निर्णय आपका है।`;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Audio Guidance: " + speechText);
  }
}

// ==========================================
// DISPATCH CONFIRMATION MODAL
// ==========================================
function confirmRouteDispatch() {
  const pathway = currentPathways.find(p => p.id === selectedPathwayId) || currentPathways[0];
  const modal = document.getElementById('dispatchModal');
  const msgEl = document.getElementById('dispatchModalMsg');

  if (modal && msgEl) {
    const destTitle = currentLang === 'hi' ? pathway.title : pathway.destName;
    msgEl.innerText = currentLang === 'hi'
      ? `आपका डिस्पैच आर्डर दर्ज कर लिया गया है। गंतव्य: "${destTitle}"। FPO साझा वाहन और सड़ी फसल के कंपोस्टिंग केंद्र को पिक-अप अलर्ट भेज दिया गया है।`
      : `Your dispatch route to "${destTitle}" is locked. The shared FPO pickup vehicle and local composting center have been notified.`;

    document.getElementById('modalBatchId').innerText = `GS-2026-NASHIK-${Math.floor(100 + Math.random() * 900)}`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeDispatchModal() {
  const modal = document.getElementById('dispatchModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
}

// Form submission handler
function handleOnboardingSubmit(e) {
  e.preventDefault();
  const successBox = document.getElementById('formSuccessMessage');
  if (successBox) {
    successBox.classList.remove('hidden');
    setTimeout(() => {
      e.target.reset();
    }, 1500);
  }
}
