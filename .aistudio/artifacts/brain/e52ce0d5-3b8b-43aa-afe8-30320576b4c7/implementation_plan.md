# Android APK White Screen Resolution: Dual Mode App Container

Solve the mobile Android white screen issue by transforming the APK into a resilient Dual-Mode hybrid container: using Android's modern `WebViewAssetLoader` with a secure virtual origin (`https://appassets.androidplatform.net/`) to support ES modules locally without CORS blocking, backed by a live web fallback and hardware-accelerated rendering.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed via user clarification:
> - **Loading Strategy**: **Dual Mode with Bundled and Live Web Fallback** (loads high-speed local assets offline via virtual HTTPS origin; falls back to live web host if offline assets encounter errors).
> - **Target Platform**: **Modern Android (Android 10 to Android 15 / API 29-35)** utilizing `androidx.webkit.WebViewAssetLoader` and `WebViewClientCompat`.

- **Confirmed Decision 1**: Use `WebViewAssetLoader` on a virtual HTTPS origin (`https://appassets.androidplatform.net/assets/`) so Chromium WebView never triggers CORS errors on Vite's `<script type="module">` tags.
- **Confirmed Decision 2**: Implement native Android network detection and fallback: if local loading fails, seamlessly redirect to the live hosted application URL.
- **Confirmed Decision 3**: Preserve full native phone calling (`tel:9080040503`) and WhatsApp dispatch integration via Android Intent filters.

---

### 1. Overview & Core Concept

- **What It Does**: Resolves the blank white screen on mobile devices by properly packaging the Vite production bundle inside Android's native `assets/` directory and serving it through Android's official `WebViewAssetLoader`.
- **Target Audience**: Pollachi commuters, auto drivers, and Johskhan 24/7 dispatch operators running Android 10+.
- **Key Value**: Instant, zero-latency startup on mobile with 100% offline functionality, full Web Audio synthesized sound effects, vector map rendering, and 1-tap emergency calling.

---

### 2. User Experience & Visual Design

- **Loading Experience**:
  - Immediate visual splash transition with the official **Pollachi Auto & Pulse** logo emblem instead of an unstyled white flash.
  - Smooth slide-in of the dual-console interface once assets are loaded.
- **Native Touch Interactions**:
  - Full-screen immersive viewport (`viewport-fit=cover`).
  - Native back-button navigation: pressing Android's system back button navigates in-app history instead of exiting immediately.
  - One-tap intent triggers: tapping **"Call Now"** opens the device's native phone dialer with `90800 40503` pre-filled; tapping **WhatsApp** opens the native WhatsApp chat.

---

### 3. Key Technical Decisions & Trade-Offs

- **Decision 1: Virtual HTTPS Origin (`appassets.androidplatform.net`) vs. Direct `file:///`**
  - *Chosen Approach*: `WebViewAssetLoader` serving assets from `https://appassets.androidplatform.net/assets/index.html`.
  - *Why*: Modern Android WebViews block ES module imports (`<script type="module">`) over `file:///` schemes due to strict cross-origin policies (origin `null`). A virtual HTTPS origin satisfies all browser security rules, allows ES modules, enables DOM storage, and prevents white screens.
  - *Alternative Considered*: Running an embedded local HTTP server inside the APK (adds unnecessary battery overhead and memory usage).

- **Decision 2: Dual Mode Fallback Architecture**
  - *Chosen Approach*: The WebView attempts local loading first. If a critical local asset error occurs, it gracefully switches to the live hosted URL with a retry prompt.
  - *Why*: Guarantees that users are never stuck on a blank screen, even during network glitches or edge-case device incompatibilities.

- **Decision 3: Vite Relative Base Configuration**
  - *Chosen Approach*: `base: './'` in `vite.config.ts`.
  - *Why*: Ensures asset paths in `index.html` resolve relative to their directory structure in both Android assets and web environments.

---

### 4. Technical Architecture & System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Android Mobile Device                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │             MainActivity (AppCompatActivity)        │   │
│   │                                                     │   │
│   │   ┌─────────────────────────────────────────────┐   │   │
│   │   │         Android WebView Container           │   │   │
│   │   │   (Hardware Accelerated, JS + DOM Storage)  │   │   │
│   │   └──────────────────────┬──────────────────────┘   │   │
│   └──────────────────────────┼──────────────────────────┘   │
│                              │                              │
│            ┌─────────────────┴─────────────────┐            │
│            ▼                                   ▼            │
│  [Primary Mode: Offline]             [Secondary Mode]       │
│  WebViewAssetLoader                  Live Web Fallback      │
│  https://appassets.../assets/        https://ais-dev-...    │
│  ├── index.html                      (Cloud Run Host)       │
│  ├── assets/index-[hash].js                                 │
│  ├── assets/index-[hash].css                                │
│  └── assets/pollachi_logo.jpg                               │
│                                                             │
│  [External Intents] ──► ACTION_VIEW                         │
│  ├── tel:9080040503 (Native Phone Dialer)                   │
│  └── https://wa.me/919080040503 (WhatsApp App)              │
└─────────────────────────────────────────────────────────────┘
```

#### Workflow Build Steps:
1. `npm install --legacy-peer-deps`
2. `npm run build` ➔ produces clean `dist/` bundle with relative paths.
3. Bundle `dist/*` directly into `workspace/app/src/main/assets/`.
4. Configure `MainActivity.kt` with `WebViewAssetLoader` and `WebViewClientCompat`.
5. Compile debug APK with Gradle 8.5 and upload artifact to GitHub Actions.
