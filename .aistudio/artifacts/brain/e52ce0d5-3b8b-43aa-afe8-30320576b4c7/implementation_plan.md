# Fix Android 'App Not Installed' Error: Proper V2/V3 Keystore Signing & Alignment

Resolve the "App not installed" error on mobile devices by replacing the generic unsigned/unaligned debug build with an explicitly signed, aligned APK supporting Android APK Signature Schemes v1, v2, and v3, alongside a production-ready package identifier (`com.pollachi.autopulse`).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed that this is a **fresh installation** on Android, and the device displayed **"App not installed"**.
> 
> Root Cause: Modern Android (Android 11–15) strictly mandates **APK Signature Scheme v2/v3** and 4-byte zip alignment. Standard CI headless builds without an explicit keystore omit v2 signatures or use placeholder certificates that device package installers reject. Furthermore, some OEM installers block `com.example.*` package names.

- **Confirmed Decision 1**: Update application ID from `com.example.autopulse` to a proper unique production identifier: **`com.pollachi.autopulse`**.
- **Confirmed Decision 2**: Explicitly generate a dedicated, permanent 2048-bit RSA keystore during the build workflow using JDK `keytool`.
- **Confirmed Decision 3**: Run `zipalign -v 4` and Android SDK `apksigner` with `--v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true` so that all Android versions (Android 7 through 15) accept the package instantly.

---

### 1. Overview & Core Concept

- **What It Does**: Guarantees seamless installation on all Android smartphones by generating a cryptographically verified APK that passes Android Package Manager validation without "App not installed" or parsing errors.
- **Target Audience**: Pollachi commuters and auto-rickshaw drivers installing the app directly from APK downloads.
- **Key Value**: 1-click installation without certificate rejections or signature mismatches.

---

### 2. User Experience & Installation Flow

- **Installation Walkthrough**:
  1. User downloads `AUTO-PULSE-APK.zip` from GitHub Actions Artifacts and extracts `Pollachi-AutoPulse.apk`.
  2. Taps the APK file on their phone.
  3. Android Package Installer opens showing the app name **"Pollachi AutoPulse"** with the official circular logo.
  4. User taps **"Install"** ➔ Status instantly shows **"App installed"**.
  5. User taps **"Open"** ➔ Launches directly into the full Pollachi Auto & Pulse application.

---

### 3. Key Technical Decisions & Fixes

- **Decision 1: Explicit 2048-bit RSA Keystore via `keytool`**
  - *Why*: Default Gradle headless CI environments do not generate a persistent `debug.keystore`, causing Gradle to emit uncertified APKs that modern Android package managers refuse to install.
  - *Solution*: Generate `pollachi-release.keystore` dynamically with standard Android parameters (`CN=Pollachi AutoPulse, O=AutoPulse, C=IN`).

- **Decision 2: Enforce Full `apksigner` Verification (v1 + v2 + v3 Schemes)**
  - *Why*: Android 11+ enforces APK Signature Scheme v2. Without v2 signatures, the system installer immediately returns `INSTALL_PARSE_FAILED_NO_CERTIFICATES` (rendered on screen as "App not installed").
  - *Solution*: Use Android SDK's `build-tools/34.0.0/apksigner` with `--v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true`.

- **Decision 3: 4-Byte Zip Alignment (`zipalign`)**
  - *Why*: Unaligned APKs fail Android memory-mapped file loading.
  - *Solution*: Run `zipalign -p -f -v 4` prior to signing.

- **Decision 4: Renaming Package ID from `com.example.*` to `com.pollachi.autopulse`**
  - *Why*: MIUI, OneUI, and ColorOS package installers block APKs with `com.example` prefixes.
  - *Solution*: Use `com.pollachi.autopulse`.

---

### 4. Technical Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Actions Build Pipeline               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [1. Vite Web Build] ──► Produces dist/ (with relative base)│
│                                                             │
│  [2. Android Scaffold] ──► Copies dist/ into assets/        │
│                        ──► Package: com.pollachi.autopulse  │
│                        ──► Fullscreen Dual-Mode WebView     │
│                                                             │
│  [3. Gradle Build] ──► assembleRelease / assembleDebug      │
│                                                             │
│  [4. Alignment & Signing Pipeline]                          │
│        │                                                    │
│        ▼                                                    │
│   [zipalign -p -f -v 4] ──► 4-byte memory alignment         │
│        │                                                    │
│        ▼                                                    │
│   [keytool] ──► Generates 2048-bit RSA Keystore             │
│        │                                                    │
│        ▼                                                    │
│   [apksigner] ──► Signs with v1 (JAR) + v2 + v3 Schemes     │
│        │                                                    │
│        ▼                                                    │
│   [Verified Pollachi-AutoPulse.apk] ──► Ready to Install!   │
└─────────────────────────────────────────────────────────────┘
```
