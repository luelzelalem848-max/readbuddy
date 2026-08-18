# 📚 ReadBuddy — AI Reading Tutor for Kids

An interactive, AI-powered reading companion that **talks to kids, listens to them read, and gives real-time feedback** — all automatically. The app starts the moment you open it, asks the kid's name by listening, then teaches letters, words, and sentences one by one.

**Now a PWA — installable on Android phones!**

## ✨ What Makes It Different

### 🤖 Fully Automatic AI Flow
- **Page loads → AI speaks immediately** — no buttons to click
- Asks the kid's name by **listening** with speech recognition
- Saves the name — welcomes returning kids by name
- Teaches each letter: speaks it, shows it, then **immediately starts listening**
- If no speech detected → **repeats the letter and listens again**
- If incorrect → **tells the kid what they said, corrects them, and listens again**
- After 3 wrong tries → moves to next letter automatically
- All 3 levels auto-progress: Letters → Words → Sentences

### 🎤 Long Listening Time
- Listens for up to **20 seconds** per attempt (was 8 before)
- 10 alternative transcripts checked for better accuracy
- Fuzzy matching with Levenshtein distance — catches mispronunciations
- Phonetic matching for letters (e.g., "ay" = A, "bee" = B)

### 🔊 Natural Voice
- Prioritizes the most natural-sounding browser voices (Google UK English Female, Samantha, Microsoft Aria)
- Sentences are split and spoken with natural pauses between them
- Moderate rate (0.9) and friendly pitch (1.15) — not robotic
- Uses the kid's name throughout — "Great job, Luel!" "Your turn, Luel!"

### 💬 More Interaction
- AI remembers the kid's name and uses it constantly
- Every 5 items, AI gives mid-lesson encouragement ("You're doing great!")
- On incorrect answers, AI tells the kid what they said vs what's correct
- Streak tracking with special messages ("That's 3 in a row!")
- Level-up celebrations with personalized messages
- Completion celebration with confetti

### 📲 Installable on Android (PWA)
- Works as a Progressive Web App
- On Android Chrome: tap "Install" to add to home screen
- Works offline after first visit (service worker caches everything)
- Full-screen experience — looks like a real app

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Web Speech API** — speech recognition & synthesis
- **PWA** — manifest.json + service worker for installability
- No backend, no API keys, no data collection

## Browser Support
- ✅ **Chrome** (best — full speech recognition + TTS)
- ✅ **Edge** (full support)
- ⚠️ Safari (limited speech recognition)
- ❌ Firefox (TTS only)

## How to Run
1. Open `index.html` in Chrome
2. Allow microphone access
3. The app starts automatically!

## Install on Android
1. Open the site in Chrome on your Android phone
2. Tap the menu (⋮) → **Install app** or tap the install banner
3. ReadBuddy appears on your home screen like a real app!

## Deploy to GitHub Pages
1. Push to GitHub → Settings → Pages → main branch → Save

## Making a Real APK
To create an actual `.apk` file (not just a PWA), you can use:
- **[PWABuilder](https://www.pwabuilder.com)** — enter your URL, it generates an APK
- **Capacitor** — `npm install @capacitor/core` and wrap the web app
- **Cordova** — similar to Capacitor
- The PWA approach above works on 95% of Android devices without an APK

## License
MIT — free to use, modify, and share.

## Author
**Luel Zelalem** — [GitHub](https://github.com/luelzelalem848-max)
