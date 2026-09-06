# AgriAssist Frontend

A clean, responsive, farmer-oriented web application for deciding what crops to sow based on soil type, seasonal calendars, irrigation availability, and agronomic benchmarks.

## Features
- **Dual Mode Input**:
  - **Quick / Simple Mode**: One-click selection of soil types, seasons, and water availability with visual guides.
  - **Advanced Soil Lab Mode**: Input exact Soil Health Card parameters (N, P, K in kg/ha, pH, temperature, and rainfall).
- **Match Scoring**: Visual percentage compatibility scores (0–100%) with categorized badges.
- **Actionable Agronomic Advice**: Expandable cards with seed treatments, sowing depth, fertilizer schedules, risk management, and companion intercrops.
- **Filter & Search**: Search by crop name (English and Hindi) or filter by categories (Cereals, Pulses, Oilseeds, Fiber, Vegetables, Spices).
- **Side-by-Side Comparison**: Select up to 3 crops to compare duration, water need, yield, and profit in an interactive modal.
- **Offline Resilient**: Connects to the FastAPI backend on `http://localhost:4343/api`, with built-in fallback calculation if the backend is not yet started.

## How to Run

### Option 1: Using any browser directly
Double-click `src/index.html` or open it directly in Google Chrome, Microsoft Edge, or Firefox.

### Option 2: Using Node / npx
```bash
npm start
```
Or:
```bash
npx serve src -l 3434
```
Open [http://localhost:3434](http://localhost:3434) in your browser.

### Option 3: Using Python built-in server
```bash
python -m http.server 3434 --directory src
```
Open [http://localhost:3434](http://localhost:3434) in your browser.
