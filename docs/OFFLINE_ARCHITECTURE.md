# AgriAssist Frontend: Offline-First PWA Architecture & Client Engine

## 1. Architectural Philosophy
AgriAssist is designed from the ground up for low-connectivity rural environments (2G/3G dead zones, remote field plots). The application follows an **Offline-First, Zero-Degradation** paradigm: every calculation tool and catalog is fully functional without internet access or server connectivity.

```
                      User Interaction (UI / PWA)
                                  │
                                  ▼
                     Dual-Mode Routing Engine (app.js)
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
         [Online Path]                     [Offline Path]
    Fetch to FastAPI Backend            Local In-Memory Engine
    (http://localhost:4343/api)          (Full Math & Rules Parity)
                 │                                 │
                 │   (On Network Failure / Timeout)│
                 └────────────────►────────────────┘
                                  │
                                  ▼
                       Rendered Farmer Card
```

---

## 2. Core Offline Technologies

### 2.1 Service Worker (`sw.js` v5)
- **Install & Precache**: Precaches static shell (`index.html`, `style.css`, `app.js`, `manifest.json`).
- **Fetch Interceptor**:
  - `Cache-First` for application assets (instant $< 50\text{ms}$ load times).
  - Network passthrough for local API calls, allowing automatic failover to client-side logic.
- **Cache Invalidation**: Previous versioned caches are purged upon worker activation (`v4` $\to$ `v5`).

### 2.2 Client-Side Computer Vision (Excess Green Index)
The **Camera-Based Green Canopy Cover & Weed Density Meter** runs completely inside the browser's HTML5 Canvas context:
1. User captures a vertical top-down photo via `<input type="file" capture="environment">`.
2. Image is resized to a max dimension of $640\text{px}$ to conserve mobile RAM.
3. Canvas context extracts raw RGB pixel byte buffers (`getImageData`).
4. Formula evaluated per pixel:
   $$ExG = 2G - R - B$$
   A pixel is classified as green canopy if $ExG > 18$ and $G > R$ and $G > B$.
5. Emerald green mask overlay (`rgba(34, 197, 94, 255)`) is generated on a secondary buffer for instant toggle.
6. Execution time: $< 15\text{ms}$ on low-end devices without transmitting bytes to any external vision API.

### 2.3 Local Storage Persistence Schema
All user data is stored safely in `window.localStorage`:
- `agriassist_lang`: Currently selected UI language (`en`, `hi`, `mr`, `pa`, `gu`).
- `agriassist_transactions`: Array of financial ledger transactions for Kisan Bahi-Khata.
- `agriassist_voice_notes`: Array of base64 WebM audio blobs and titles recorded via HTML5 MediaRecorder API.

### 2.4 Multi-Language Regional Expansion
A built-in dictionary dictionary (`TRANSLATIONS`) provides real-time client-side translation across 5 Indian languages without cloud translation API calls.

---

## 3. PWA Installation & Field Deployment
- Web App Manifest (`manifest.json`) defines `standalone` display mode and responsive theme color `#15803d` (Brand Forest Green).
- Supported across Android Chrome, iOS Safari ("Add to Home Screen"), and desktop browsers.
