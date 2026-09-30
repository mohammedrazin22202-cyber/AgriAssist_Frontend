# AgriAssist Frontend

A clean, high-performance, farmer-oriented Progressive Web App (PWA) designed to empower farmers with science-backed crop sowing decisions, 1-year multi-crop rotations, stoichiometric fertilizer prescriptions, and $0 recurring zero-cost precision ag-tech tools.

---

## 🌟 Key Application Modules

### 1. 🌾 Crop Sowing Advisor
- **Live Weather & Geolocation**: Auto-detect temperature, humidity, and rainfall forecast via Open-Meteo with sowing readiness alerts.
- **Financial & MSP Calculator**: Project net profit (₹/acre), cultivation costs, expected yield, and ROI % based on Indian MSP rates.
- **Fertilizer Prescriber**: Exact 50 kg bags of Urea, DAP, and MOP required.
- **Voice Readout (TTS)**: Listen to agronomic recommendations aloud in English or Hindi.
- **Multi-Language UI**: Seamless toggle between English, Hindi (हिंदी), Marathi (मराठी), Punjabi (ਪੰਜਾਬੀ), and Gujarati (ગુજરાતી).
- **Dynamic Krishi Salahkar Ticker**: Rotating seasonal advisories (Kharif/Rabi/Zaid) with daily actionable crop tips.

### 2. 📸 Camera-Based Green Canopy Meter
- **In-Browser Computer Vision**: HTML5 Canvas analysis using the Excess Green Index ($ExG = 2G - R - B$).
- **Weed Influx Warnings**: Calculates green canopy cover % vs bare soil % and flags critical weed competition windows (CPWC) without sending images to any cloud server.

### 3. ⚖️ Mandi Fair Settlement Auditor
- **FCI / APMC Standard Compliance**: Verifies moisture and foreign matter dockage cuts against official statutory tolerances.
- **One-Click Settlement Slip**: Formats and copies a clean verification slip for WhatsApp sharing or presentation to the Mandi Secretary.

### 4. 🌿 Subhash Palekar Natural Farming (SPNF/ZBNF) Drum Scaler
- **Dynamic Volume Scaling**: Scales raw ingredients for Jeevamrut, Beejamrut, Agniastra, and Neemastra to any custom drum size (e.g., 200L, 500L).

### 5. ❄️ Pusa Zero Energy Cool Chamber (ZECC) Planner
- **Evaporative Cooling Blueprint**: Generates an exact bill of materials (country bricks, coarse sand, thatch) and calculates produce shelf-life extension.

### 6. 🐄 Dairy 365-Day Green Fodder & Silage Pit Planner
- **NDRI Zero-Starvation Model**: Annual green fodder and dry roughage budgeting with underground trench pit and 200L blue drum silage sizing.

### 7. 🛰️ NASA POWER Agroclimatology & GDD Tracker
- **Thermal Unit Accumulation**: Calculates Growing Degree Days ($GDD$) and predicts physiological maturity and harvest dates using open satellite reanalysis data.

### 8. 🌾 Weed Doctor & Herbicide Dilution Calculator
- **ICAR-DWR Guidelines**: Recommends chemical dosages per 15L knapsack tank, flat fan nozzle selection, and non-chemical cultural weed management.

### 9. 🎙️ Voice Field Notes & Kisan Bahi-Khata Ledger
- **Offline Audio Memos**: Record voice notes directly in the field with HTML5 MediaRecorder.
- **Excel-Compatible CSV Export**: One-click download with UTF-8 BOM encoding for regional script preservation.

---

## 📱 Offline PWA Architecture
- **Service Worker (`sw.js` v5)**: Pre-caches shell assets for instant sub-50ms offline loading.
- **Dual-Mode Engine**: Every calculation runs against the FastAPI backend when online, automatically falling back to an identical client-side mathematical engine when offline.
- Detailed technical documentation is available in [`docs/OFFLINE_ARCHITECTURE.md`](docs/OFFLINE_ARCHITECTURE.md).

---

## 🛡️ Contingency Protocol (Code Name: Plastic Man)
AgriAssist includes an integrated anti-theft security system:
- **Original Author**: Mohammed Razin H (MegaTron)
- **Verified Credentials**: `mohammedrazin22202@gmail.com` • [LinkedIn](https://www.linkedin.com/in/razin88307) • [GitHub](https://github.com/mohammedrazin22202-cyber)
- **Secret Codes Interceptor**: Intercepts 21 secret author codes entered into search bars or via `window.plasticMan()` in the browser developer console.

---

## ⚡ How to Run

### Option 1: Direct in Browser
Open `src/index.html` directly in any web browser.

### Option 2: Using Python Built-In Server
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
docker compose up --build
```
- Frontend: [http://localhost:3434](http://localhost:3434)
- Backend: [http://localhost:4343](http://localhost:4343)
