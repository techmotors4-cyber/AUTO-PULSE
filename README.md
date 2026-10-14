# Pollachi AutoPulse (பொள்ளாச்சி ஆட்டோ & மினி கேப்)

> On-demand local auto-rickshaw and mini cab dispatch application for **Pollachi City (பொள்ளாச்சி)** with real-time GPS tracking and dedicated 24/7 operator hotline for **Johskhan (90800 40503, Pollachi)**.

---

## 🛺 Features

- **Pollachi Local Fleet**: Classic 3-wheeler Auto Rickshaw, Eco E-Rickshaw, and Mini Cab AC with TN-41 registrations.
- **Pollachi Landmarks**: New Bus Stand, Gandhi Statue & Bazaar, Mahalingapuram Roundabout, Railway Junction, Coimbatore Rd (Achipatti), Palakkad Rd (NGM College), Udumalpet Rd, and Uzhavar Sandhai.
- **Dedicated Dispatch**: One-tap phone dialing (`tel:9080040503`) and direct WhatsApp dispatch to **Johskhan (90800 40503)**.
- **In-App Messaging**: Real-time two-way quick reply messaging between Rider and Driver with audio chime notification.
- **Trip History**: Dedicated history tab showing previous rides, date, destination, driver details, fare summaries, and 1-tap rebooking.
- **Official Branding**: Official Pollachi Auto & Pulse logo badge in header, rider view, and browser favicon.
- **Dual-Mode Android APK**: Built with AndroidX `WebViewAssetLoader` over a secure virtual HTTPS origin (`https://appassets.androidplatform.net/assets/index.html`) with automatic live web fallback, eliminating mobile white screens.
- **Production APK Signing**: Signed with APK Signature Schemes v1, v2, and v3 using a 2048-bit RSA key and 4-byte zip alignment for seamless installation on Android 7 to 15.

---

## 📱 How to Build and Download the Android APK

1. In your local terminal, push the latest code to GitHub:
   ```bash
   git add .
   git commit -m "fix: enforce v1/v2/v3 APK signing, zipalign, and com.pollachi.autopulse package id"
   git push origin main
   ```

2. On GitHub:
   - Go to your repository on GitHub.
   - Click on the **Actions** tab at the top.
   - Click the latest **AUTO PULSE Android APK** workflow run.
   - Under the **Artifacts** section at the bottom, click **Pollachi-AutoPulse-APK** to download `Pollachi-AutoPulse.apk`.

3. Install on your Android phone — it installs cleanly without "App not installed" errors and opens immediately.

---

## 💻 Local Web Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📞 Pollachi Contact & Operator
- **Operator**: Johskhan (ஜோஸ்கான்)
- **Phone / WhatsApp**: [+91 90800 40503](tel:9080040503)
- **Location**: Pollachi, Tamil Nadu, India (TN-41)
