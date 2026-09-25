# AgriAssist Frontend

A clean, responsive, farmer-oriented web application for deciding what crops to sow, planning 1-year multi-crop rotations, calculating fertilizer prescriptions, and diagnosing soil health.

## Key Features
- **🌾 Crop Sowing Advisor**:
  - **Live Weather & Geolocation**: Auto-detect temperature, humidity, and 7-day rainfall forecast via Open-Meteo with sowing readiness alerts.
  - **Financial & MSP Calculator**: Project net profit (₹/acre), cultivation costs, expected yield, and ROI % based on Indian MSP rates.
  - **Fertilizer Prescriber**: Exact 50 kg bags of Urea, DAP, and MOP required.
  - **Voice Readout (TTS)**: Listen to agronomic recommendations aloud in English or Hindi.
  - **Bilingual UI**: One-click toggle between English and Hindi (हिंदी).
  - **4-Stage Growth Timeline**: Milestone-wise activities and IPM pest/disease alerts.
  - **Side-by-Side Comparison**: Compare up to 3 crops simultaneously.
  - **Share & Print**: One-click printable Farmer Advisory Sheet (PDF) and WhatsApp sharing.
- **🔄 1-Year Rotation Planner**:
  - Designs 3-season annual crop cycles (Kharif → Rabi → Zaid).
  - Calculates annual net profit and Soil Health Index (nitrogen-fixing benefits and pest disruption).
- **🧪 Fertilizer & Soil Doctor**:
  - Dedicated stoichiometric calculator for Urea, DAP, MOP, plus Agricultural Lime or Gypsum dosages.
- **🌾 Advanced Agritech Calculators**:
  - Grain moisture removal, silo aeration (CFM) & safe storage mold warnings.
  - Protected cultivation polyhouse climate sizer, cooling pads, VPD & MIDH subsidy.
  - Farm stubble (parali) residue-to-biochar pyrolysis yield & C:N rapid composting optimizer.
- **📱 PWA & 100% Offline Resilient**:
  - Service Worker (`sw.js`) with v4 asset caching and PWA `manifest.json`.
  - Complete 100-crop local database and offline recommendation engine if the backend is not yet started.
- **🛡️ Contingency Protocol (Code Name: Plastic Man)**:
  - Hidden command system and anti-theft proof of original authorship.
  - Intercepts 21 secret author codes entered into any search bar across the application.
  - Displays verification modal proving original owner **MegaTron alias Mohammed Razin H** and authentic project name **AgriAssist**.
  - Supports browser console overrides (`plasticMan()` and `MegaTron.verify()`).
  - Native Web Audio API chime with signed ownership certificate export.

## How to Run

### Option 1: Direct in Browser
Open `src/index.html` directly in any web browser.

### Option 2: Using Python built-in server
```bash
python -m http.server 3434 --directory src
```
Open [http://localhost:3434](http://localhost:3434) in your browser.

### Option 3: Using Node / npx
```bash
npx serve src -l 3434
```

### Option 4: Full Stack with Docker
```bash
# From the project root:
docker compose up --build
```
- Frontend: [http://localhost:3434](http://localhost:3434)
- Backend: [http://localhost:4343](http://localhost:4343)
