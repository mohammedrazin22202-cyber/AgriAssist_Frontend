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
    apiStatusText.textContent = "Engine Offline (Start backend on port 8000)";
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
    apiStatusText.textContent = "Backend Connected";
  } catch (err) {
    console.warn("Backend API unreachable, using local fallback calculation:", err);
    apiStatusText.textContent = "Local Fallback Mode";
    handleOfflineFallback(payload);
  } finally {
    submitBtn.disabled = false;
    btnSpinner.classList.add("hidden");
  }
}

function handleRecommendationResponse(data) {
  appState.recommendations = data.recommendations || [];
  totalCropsCount.textContent = appState.recommendations.length;

  // Update Soil Summary Bar
  const s = data.soil_summary || {};
  summarySoilTitle.textContent = `${s.soil_type || soilTypeSelect.value} Profile`;
  summarySoilDesc.textContent = s.description || "Evaluated against standard regional agronomic criteria.";
  summaryNPKBadge.textContent = s.benchmark_npk || "NPK Benchmark Applied";
  summaryPHBadge.textContent = `pH: ${s.benchmark_ph || "Neutral"}`;
  summaryDrainageBadge.textContent = `Drainage: ${s.drainage || "Moderate"}`;

  // Render Top Pick Card
  if (data.top_pick) {
    renderTopPick(data.top_pick);
  }

  // Filter and render crop cards
  filterAndRenderCrops();
}

function renderTopPick(top) {
  topPickCard.classList.remove("hidden");
  const hindi = top.hindi_name ? `<span class="text-base text-emerald-800 font-normal">(${top.hindi_name})</span>` : "";

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

      <div class="text-right">
        <div class="text-3xl sm:text-4xl font-black text-emerald-700">${top.suitability_score}%</div>
        <div class="text-xs font-semibold text-emerald-800 uppercase tracking-wider">${top.suitability_level}</div>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-200/60 text-xs">
      <div class="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
        <span class="text-emerald-700 block font-semibold">Growth Duration</span>
        <span class="font-bold text-slate-800">${top.duration_days}</span>
      </div>
      <div class="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
        <span class="text-emerald-700 block font-semibold">Water Requirement</span>
        <span class="font-bold text-slate-800">${top.water_requirement}</span>
      </div>
      <div class="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
        <span class="text-emerald-700 block font-semibold">Estimated Yield</span>
        <span class="font-bold text-slate-800">${top.estimated_yield_per_acre}</span>
      </div>
      <div class="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
        <span class="text-emerald-700 block font-semibold">Profit Potential</span>
        <span class="font-bold text-slate-800">${top.profit_potential}</span>
      </div>
    </div>

    <div class="mt-4 text-xs space-y-1.5">
      <div class="font-bold text-emerald-900 flex items-center gap-1.5">
        <span>💡</span> Primary Reason:
        <span class="font-normal text-slate-800">${top.reasons && top.reasons[0] ? top.reasons[0] : "Superb compatibility with selected soil and season."}</span>
      </div>
      <div class="font-bold text-emerald-900 flex items-center gap-1.5">
        <span>🌱</span> Sowing Advice:
        <span class="font-normal text-slate-800">${top.sowing_tips}</span>
      </div>
    </div>
  `;
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

  if (filtered.length === 0) {
    cropsGrid.innerHTML = "";
    noResultsState.classList.remove("hidden");
    return;
  }

  noResultsState.classList.add("hidden");
  cropsGrid.innerHTML = filtered.map(crop => createCropCardHTML(crop)).join("");

  // Attach toggle and checkbox listeners to new cards
  cropsGrid.querySelectorAll(".card-toggle-details").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = btn.closest(".crop-card");
      const details = card.querySelector(".card-expanded-details");
      const isHidden = details.classList.contains("hidden");
      details.classList.toggle("hidden");
      btn.textContent = isHidden ? "Hide Agronomic Advice ▲" : "View Agronomic Advice ▼";
    });
  });

  cropsGrid.querySelectorAll(".compare-checkbox").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const cropId = cb.getAttribute("data-crop-id");
      toggleCropComparison(cropId, cb.checked);
    });
  });
}

function createCropCardHTML(crop) {
  const isCompared = appState.selectedForComparison.some(c => c.crop_id === crop.crop_id);
  const hindi = crop.hindi_name ? `<span class="text-xs text-slate-500 font-normal">(${crop.hindi_name})</span>` : "";

  // Badge score styling
  let scoreBadgeClass = "badge-score-high";
  if (crop.suitability_score < 65) scoreBadgeClass = "badge-score-low";
  else if (crop.suitability_score < 80) scoreBadgeClass = "badge-score-med";

  // Reasons list
  const reasonsList = (crop.reasons || []).map(r => `
    <li class="flex items-start gap-1.5">
      <span class="text-emerald-600 font-bold">✓</span>
      <span>${r}</span>
    </li>
  `).join("");

  // Warnings list
  const warningsList = (crop.warnings || []).length > 0 ? (crop.warnings || []).map(w => `
    <li class="flex items-start gap-1.5 text-amber-800">
      <span class="font-bold">⚠️</span>
      <span>${w}</span>
    </li>
  `).join("") : "";

  return `
    <div class="crop-card bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between" data-crop-id="${crop.crop_id}">
      <div>
        <!-- Top header row: Category & Score -->
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
            <p class="text-xs text-slate-500 italic mb-3">${crop.scientific_name}</p>
          </div>
          <label class="flex items-center space-x-1 text-xs text-slate-500 cursor-pointer select-none bg-slate-50 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
            <input type="checkbox" data-crop-id="${crop.crop_id}" class="compare-checkbox rounded text-brand-600" ${isCompared ? "checked" : ""}>
            <span class="text-[10px] font-semibold">Compare</span>
          </label>
        </div>

        <!-- Metric Grid -->
        <div class="grid grid-cols-2 gap-2 text-xs py-2.5 my-2 border-y border-slate-100">
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
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Profit Potential</span>
            <span class="font-bold text-slate-800">${crop.profit_potential}</span>
          </div>
        </div>

        <!-- Sowing Window -->
        <div class="text-xs text-slate-600 mb-3">
          <span class="font-semibold text-slate-700">🗓️ Sowing Window:</span> ${crop.sowing_window}
        </div>

        <!-- Expandable Details -->
        <div class="card-expanded-details hidden space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
          <div>
            <div class="font-bold text-slate-900 mb-1">Why This Crop:</div>
            <ul class="space-y-1 text-slate-600">${reasonsList}</ul>
          </div>

          ${warningsList ? `
            <div class="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <div class="font-bold text-amber-900 mb-1">Cautions & Risk Management:</div>
              <ul class="space-y-1">${warningsList}</ul>
            </div>
          ` : ""}

          <div>
            <div class="font-bold text-slate-900 mb-1">🌾 Seed & Sowing Tips:</div>
            <p class="text-slate-600 leading-relaxed">${crop.sowing_tips}</p>
          </div>

          <div>
            <div class="font-bold text-slate-900 mb-1">🧪 Fertilizer & Nutrient Advice:</div>
            <p class="text-slate-600 leading-relaxed">${crop.fertilizer_advice}</p>
          </div>

          ${crop.companion_crops && crop.companion_crops.length > 0 ? `
            <div>
              <div class="font-bold text-slate-900 mb-1">🤝 Recommended Intercrops:</div>
              <div class="flex flex-wrap gap-1">
                ${crop.companion_crops.map(c => `<span class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">${c}</span>`).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      </div>

      <!-- Action Button to Expand -->
      <div class="pt-3 mt-2 border-t border-slate-100">
        <button type="button" class="card-toggle-details w-full py-1.5 text-center text-xs font-bold text-brand-700 hover:text-brand-800 hover:bg-emerald-50 rounded-xl transition">
          View Agronomic Advice ▼
        </button>
      </div>
    </div>
  `;
}

// ----------------- SIDE-BY-SIDE COMPARISON -----------------

function toggleCropComparison(cropId, isChecked) {
  const crop = appState.recommendations.find(c => c.crop_id === cropId);
  if (!crop) return;

  if (isChecked) {
    if (appState.selectedForComparison.length >= 3) {
      alert("You can compare up to 3 crops at once.");
      // Uncheck
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
          ${row("Growth Duration", c => c.duration_days)}
          ${row("Water Requirement", c => `<strong>${c.water_requirement}</strong>`)}
          ${row("Est. Yield / Acre", c => c.estimated_yield_per_acre)}
          ${row("Profit Potential", c => c.profit_potential)}
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

// ----------------- OFFLINE FALLBACK ENGINE -----------------

function handleOfflineFallback(payload) {
  // Simple deterministic scoring for when backend is not actively running
  const mockCrops = [
    {
      crop_id: "wheat",
      name: "Wheat",
      hindi_name: "गेहूं",
      scientific_name: "Triticum aestivum",
      category: "Cereal",
      suitability_score: payload.season === "Rabi" ? 92.0 : 40.0,
      suitability_level: payload.season === "Rabi" ? "Highly Recommended" : "Marginal",
      sowing_window: "November 1st - November 25th",
      duration_days: "110 - 130 days",
      water_requirement: "Medium",
      estimated_yield_per_acre: "18 - 24 Quintals",
      investment_level: "Moderate",
      profit_potential: "Moderate",
      reasons: ["Ideal climate fit for post-monsoon cool weather.", "Thrives in well-drained loam."],
      warnings: ["Late sowing results in terminal heat stress."],
      sowing_tips: "Sow at 4-5 cm depth. First irrigation at 21 days is vital.",
      fertilizer_advice: "Half N with full P and K at sowing; remaining N at CRI stage.",
      soil_notes: "Requires well-drained fertile loam."
    },
    {
      crop_id: "mustard",
      name: "Mustard / Rapeseed",
      hindi_name: "सरसों",
      scientific_name: "Brassica juncea",
      category: "Oilseed",
      suitability_score: payload.season === "Rabi" ? 88.0 : 35.0,
      suitability_level: payload.season === "Rabi" ? "Highly Recommended" : "Marginal",
      sowing_window: "Sept 25th - Oct 20th",
      duration_days: "100 - 125 days",
      water_requirement: "Low to Medium",
      estimated_yield_per_acre: "8 - 12 Quintals",
      investment_level: "Low",
      profit_potential: "High",
      reasons: ["Low water requirement saves pumping cost.", "High market price for oil content."],
      warnings: ["Monitor for aphids during foggy periods."],
      sowing_tips: "Fine firm seedbed. Thin seedlings at 15-20 days.",
      fertilizer_advice: "Apply Sulfur (20 kg/ha) for oil content enhancement.",
      soil_notes: "Light to medium alluvial and sandy loam soils."
    },
    {
      crop_id: "cotton",
      name: "Cotton",
      hindi_name: "कपास",
      scientific_name: "Gossypium hirsutum",
      category: "Fiber",
      suitability_score: (payload.season === "Kharif" && payload.soil_type.includes("Black")) ? 94.0 : 55.0,
      suitability_level: (payload.season === "Kharif" && payload.soil_type.includes("Black")) ? "Highly Recommended" : "Moderately Suitable",
      sowing_window: "May - June (Irrigated) or June - July (Rainfed)",
      duration_days: "150 - 180 days",
      water_requirement: "Medium to High",
      estimated_yield_per_acre: "10 - 16 Quintals",
      investment_level: "High",
      profit_potential: "Very High",
      reasons: ["Black soil has the highest water retention for cotton root systems.", "Kharif warmth supports boll formation."],
      warnings: ["Monitor for pink bollworm."],
      sowing_tips: "Maintain 90x60 cm spacing. Trap crops like marigold recommended.",
      fertilizer_advice: "Apply N in 3-4 split doses.",
      soil_notes: "Deep black soil is prime."
    },
    {
      crop_id: "chickpea",
      name: "Chickpea (Gram / Chana)",
      hindi_name: "चना",
      scientific_name: "Cicer arietinum",
      category: "Pulse",
      suitability_score: payload.season === "Rabi" ? 90.0 : 45.0,
      suitability_level: payload.season === "Rabi" ? "Highly Recommended" : "Marginal",
      sowing_window: "Oct 15th - Nov 15th",
      duration_days: "95 - 120 days",
      water_requirement: "Low",
      estimated_yield_per_acre: "8 - 12 Quintals",
      investment_level: "Low to Moderate",
      profit_potential: "High",
      reasons: ["Biological nitrogen fixation enhances soil health.", "Low water demand."],
      warnings: ["Waterlogging causes instant wilt."],
      sowing_tips: "Inoculate seeds with Rhizobium. Sow deep (7-10 cm).",
      fertilizer_advice: "Focus on Phosphorus (DAP/SSP).",
      soil_notes: "Well-aerated deep soil."
    },
    {
      crop_id: "pearl_millet",
      name: "Pearl Millet (Bajra)",
      hindi_name: "बाजरा",
      scientific_name: "Pennisetum glaucum",
      category: "Cereal",
      suitability_score: (payload.water_availability.includes("Low") || payload.season === "Kharif") ? 91.0 : 62.0,
      suitability_level: (payload.water_availability.includes("Low") || payload.season === "Kharif") ? "Highly Recommended" : "Moderately Suitable",
      sowing_window: "June - July",
      duration_days: "75 - 90 days",
      water_requirement: "Low",
      estimated_yield_per_acre: "12 - 18 Quintals",
      investment_level: "Low",
      profit_potential: "Moderate",
      reasons: ["Top performer under water scarcity & high heat.", "Quick harvest."],
      warnings: ["Avoid heavy rains during flowering."],
      sowing_tips: "Shallow 2-3 cm sowing depth.",
      fertilizer_advice: "Modest NPK requirement.",
      soil_notes: "Thrives in sandy and poor fertility soils."
    }
  ];

  mockCrops.sort((a, b) => b.suitability_score - a.suitability_score);

  handleRecommendationResponse({
    total_crops_evaluated: mockCrops.length,
    recommendations: mockCrops,
    top_pick: mockCrops[0],
    soil_summary: {
      soil_type: payload.soil_type,
      description: FALLBACK_SOIL_BENCHMARKS[payload.soil_type]?.desc || "Standard soil profile",
      drainage: "Standard",
      benchmark_npk: "Baseline NPK Applied",
      benchmark_ph: "Baseline pH Applied"
    }
  });
}
