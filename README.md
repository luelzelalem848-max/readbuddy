# 📚 ReadBuddy — AI Reading Companion for Kids

An interactive, AI-powered reading assistant that helps kids who can't read learn to read. Uses the browser's built-in **Speech Recognition** and **Text-to-Speech** APIs to listen to kids read, give them real-time feedback, and read words/sentences aloud — all with a fun, colorful, kid-friendly interface.

## ✨ Features

### 🔤 Four Reading Levels
- **Letters** — Learn A-Z with pictures and sounds (🍎 A is for Apple)
- **Words** — Simple 3-6 letter words with emoji hints (🐱 cat, ☀️ sun)
- **Sentences** — Short, easy sentences with word-by-word highlighting
- **Stories** — Mini stories with multiple sentences

### 🎤 AI Speech Recognition
- Kid clicks "I'll Read It!" and reads the word/sentence out loud
- The app **listens in real-time** and checks if they read it correctly
- Gives instant feedback — praise for correct, gentle retry for incorrect
- Works with natural speech (doesn't need to be perfect!)

### 🔊 Text-to-Speech
- Click "Read to Me" and the app reads the word/sentence aloud
- Kid-friendly voice (slower rate, higher pitch)
- Word-by-word highlighting for sentences and stories
- Click any individual word to hear just that word

### 🎉 Gamification
- ⭐ Stars for every correct read
- ✅ Correct answer counter
- 🔥 Streak tracker (consecutive correct reads)
- 📊 Progress bar showing how far through the level
- 🎊 Confetti animation on correct answers
- 💬 Random encouraging messages

### 🎨 Kid-Friendly Design
- Big, colorful buttons
- Fun fonts (Fredoka & Comic Neue)
- Emoji pictures for every letter and word
- Smooth animations and visual feedback
- Fully responsive — works on tablets and phones

## How It Works

1. Kid enters their name
2. Pick a level (Letters, Words, Sentences, or Stories)
3. Click **🔊 Read to Me** to hear the word/sentence
4. Click **🎤 I'll Read It!** and read it out loud
5. The app listens and tells them if they got it right!
6. Stars and confetti for correct reads 🎉
7. Click **➡️ Next** to move to the next word

## Tech Stack
- **HTML5, CSS3, Vanilla JavaScript** — no frameworks, no dependencies
- **Web Speech API** — browser-native speech recognition & synthesis
- **No backend needed** — runs entirely in the browser
- **No data collection** — everything stays on the device

## Browser Support
- ✅ **Chrome** (recommended — best speech recognition)
- ✅ **Edge** (full support)
- ⚠️ **Safari** (text-to-speech works, speech recognition limited)
- ❌ **Firefox** (text-to-speech works, no speech recognition)

## How to Run
1. Clone the repo
2. Open `index.html` in Chrome or Edge
3. Allow microphone access when prompted
4. Start reading!

## Deploy to GitHub Pages
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Select **main** branch, `/ (root)` folder
4. Save — your app will be live

## Project Structure
```
ReadBuddy/
├── index.html       # Main HTML structure
├── style.css        # Kid-friendly colorful styling
├── app.js           # Speech recognition, TTS, reading logic, gamification
└── README.md        # You are here
```

## 🔬 About the "AI" Part
ReadBuddy uses the **Web Speech API** — a browser-native technology that:
- **SpeechRecognition**: Converts the kid's spoken words to text in real-time, then checks if they match the target word/sentence
- **SpeechSynthesis**: Reads words and sentences aloud with a kid-friendly voice

No external AI APIs, no API keys, no costs — it all runs in the browser for free.

## 📋 Patent Note
AI-powered reading assistants for children exist in the market (Duolingo ABC, Homer, Reading Eggs, Speechify, etc.). The general concept of using speech recognition to help kids read is **not patentable** as a broad idea. However, a **specific unique implementation, method, or feature** that is novel and non-obvious could potentially be patentable. Consult a patent attorney for specific guidance.

## License
MIT — free to use, modify, and share.

## Author
**Luel Zelalem** — [GitHub](https://github.com/luelzelalem848-max)
