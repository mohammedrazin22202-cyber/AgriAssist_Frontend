const API_BASE = "http://localhost:4343/api";

// Application State
let appState = {
  mode: "simple",
  metadata: null,
  recommendations: [],
  selectedForComparison: [],
  activeCategory: "All",
  searchQuery: "",
  apiOnline: false
};

// DOM Elements
const apiStatusBadge = document.getElementById("apiStatusBadge");
const apiStatusText = document.getElementById("apiStatusText");
const modeSimpleBtn = document.getElementById("modeSimpleBtn");
const modeAdvancedBtn = document.getElementById("modeAdvancedBtn");
const advancedParamsPanel = document.getElementById("advancedParamsPanel");
const recommendForm = document.getElementById("recommendForm");
const submitBtn = document.getElementById("submitBtn");
const btnSpinner = document.getElementById("btnSpinner");

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
const soilSummaryBar = document.getElementById("soilSummaryBar");
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

// Default Fallback Soil Benchmarks
const FALLBACK_SOIL_BENCHMARKS = {
  "Black Soil (Regur)": { n: 180, p: 35, k: 320, ph: 7.8, temp: 28, rain: 800, desc: "Clay-rich volcanic soil with high moisture retention." },
  "Alluvial Soil": { n: 220, p: 45, k: 280, ph: 7.0, temp: 26, rain: 850, desc: "Fertile river basin soil rich in potash and lime." },
  "Red Soil": { n: 160, p: 25, k: 190, ph: 6.2, temp: 27, rain: 700, desc: "Porous and aerated soil developed over crystalline rocks." },
  "Sandy Loam Soil": { n: 140, p: 28, k: 160, ph: 6.5, temp: 29, rain: 500, desc: "Well-aerated, fast draining soil ideal for groundnut & millets." },
  "Clay Loam Soil": { n: 240, p: 48, k: 260, ph: 7.3, temp: 25, rain: 1100, desc: "Nutrient-dense soil with high water retention for paddy & sugarcane." },
  "Laterite Soil": { n: 130, p: 18, k: 140, ph: 5.4, temp: 28, rain: 1400, desc: "Naturally acidic tropical leached soil for plantation crops." }
};

// ----------------- INITIALIZATION -----------------

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  checkApiHealth();
  updateSoilPresets();
  // Auto-run default assessment on load for instant interactive experience
  executeRecommendation();
});

function setupEventListeners() {
  // Mode toggles
  modeSimpleBtn.addEventListener("click", () => setMode("simple"));
  modeAdvancedBtn.addEventListener("click", () => setMode("advanced"));

  // Input change updates
  soilTypeSelect.addEventListener("change", updateSoilPresets);
  seasonSelect.addEventListener("change", updateSeasonHint);
  waterSelect.addEventListener("change", updateWaterHint);

  // Form submit
  recommendForm.addEventListener("submit", (e) => {
    e.preventDefault();
    executeRecommendation();
  });

  // Search input
  cropSearchInput.addEventListener("input", (e) => {
    appState.searchQuery = e.target.value.trim().toLowerCase();
    filterAndRenderCrops();
  });

  // Category filter chips
  categoryChips.querySelectorAll(".cat-chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
      categoryChips.querySelectorAll(".cat-chip").forEach(c => {
        c.classList.remove("active", "bg-brand-700", "text-white");
        c.classList.add("bg-white", "text-slate-700");
      });
      chip.classList.add("active", "bg-brand-700", "text-white");
      chip.classList.remove("bg-white", "text-slate-700");

      appState.activeCategory = chip.getAttribute("data-category");
      filterAndRenderCrops();
    });
  });

  // Comparison controls
  clearCompareBtn.addEventListener("click", clearComparison);
  openCompareModalBtn.addEventListener("click", openComparisonModal);
  closeCompareModalBtn.addEventListener("click", closeComparisonModal);
  compareModal.addEventListener("click", (e) => {
    if (e.target === compareModal) closeComparisonModal();
  });
}

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

  // Update advanced fields with baseline numbers
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
      apiStatusBadge.classList.replace("bg-brand-900/80", "bg-emerald-900/90");
      apiStatusText.textContent = "Backend Online • FastAPI";
    } else {
      throw new Error("API not healthy");
    }
  } catch (err) {
    appState.apiOnline = false;
    apiStatusBadge.classList.replace("bg-brand-900/80", "bg-amber-900/90");
