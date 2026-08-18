// ====== ReadBuddy — AI Reading Tutor (v3: Natural & Interactive) ======
// Longer listening, natural voice, more interaction, PWA-ready

// ---- State ----
let kidName = '';
let currentLevel = 0;
let currentIndex = 0;
let stars = 0;
let correctCount = 0;
let streak = 0;
let isSpeaking = false;
let isListening = false;
let recognition = null;
let noSpeechTimeout = null;
let retryCount = 0;
let voice = null;
let voicesLoaded = false;
let totalAttempts = 0;
let currentTarget = '';

// ---- Reading Content ----
const levels = [
  {
    name: 'Letters',
    label: 'Level 1: Letters',
    items: [
      { text: 'A', emoji: '🍎', speak: 'A. A is for Apple.' },
      { text: 'B', emoji: '🐻', speak: 'B. B is for Bear.' },
      { text: 'C', emoji: '🐱', speak: 'C. C is for Cat.' },
      { text: 'D', emoji: '🐶', speak: 'D. D is for Dog.' },
      { text: 'E', emoji: '🐘', speak: 'E. E is for Elephant.' },
      { text: 'F', emoji: '🐟', speak: 'F. F is for Fish.' },
      { text: 'G', emoji: '🍇', speak: 'G. G is for Grapes.' },
      { text: 'H', emoji: '🏠', speak: 'H. H is for House.' },
      { text: 'I', emoji: '🍦', speak: 'I. I is for Ice cream.' },
      { text: 'J', emoji: '🧃', speak: 'J. J is for Juice.' },
      { text: 'K', emoji: '🪁', speak: 'K. K is for Kite.' },
      { text: 'L', emoji: '🦁', speak: 'L. L is for Lion.' },
      { text: 'M', emoji: '🌙', speak: 'M. M is for Moon.' },
      { text: 'N', emoji: '🪺', speak: 'N. N is for Nest.' },
      { text: 'O', emoji: '🍊', speak: 'O. O is for Orange.' },
      { text: 'P', emoji: '🐧', speak: 'P. P is for Penguin.' },
      { text: 'Q', emoji: '👑', speak: 'Q. Q is for Queen.' },
      { text: 'R', emoji: '🌈', speak: 'R. R is for Rainbow.' },
      { text: 'S', emoji: '☀️', speak: 'S. S is for Sun.' },
      { text: 'T', emoji: '🌳', speak: 'T. T is for Tree.' },
      { text: 'U', emoji: '☂️', speak: 'U. U is for Umbrella.' },
      { text: 'V', emoji: '🎻', speak: 'V. V is for Violin.' },
      { text: 'W', emoji: '⌚', speak: 'W. W is for Watch.' },
      { text: 'X', emoji: '📦', speak: 'X. X is for Box.' },
      { text: 'Y', emoji: '🪀', speak: 'Y. Y is for Yo-yo.' },
      { text: 'Z', emoji: '🦓', speak: 'Z. Z is for Zebra.' }
    ]
  },
  {
    name: 'Words',
    label: 'Level 2: Words',
    items: [
      { text: 'cat', emoji: '🐱', speak: 'cat' },
      { text: 'dog', emoji: '🐶', speak: 'dog' },
      { text: 'sun', emoji: '☀️', speak: 'sun' },
      { text: 'moon', emoji: '🌙', speak: 'moon' },
      { text: 'tree', emoji: '🌳', speak: 'tree' },
      { text: 'fish', emoji: '🐟', speak: 'fish' },
      { text: 'bird', emoji: '🐦', speak: 'bird' },
      { text: 'star', emoji: '⭐', speak: 'star' },
      { text: 'book', emoji: '📖', speak: 'book' },
      { text: 'ball', emoji: '⚽', speak: 'ball' },
      { text: 'cake', emoji: '🎂', speak: 'cake' },
      { text: 'milk', emoji: '🥛', speak: 'milk' },
      { text: 'apple', emoji: '🍎', speak: 'apple' },
      { text: 'house', emoji: '🏠', speak: 'house' },
      { text: 'happy', emoji: '😊', speak: 'happy' },
      { text: 'bread', emoji: '🍞', speak: 'bread' },
      { text: 'cloud', emoji: '☁️', speak: 'cloud' },
      { text: 'river', emoji: '🏞️', speak: 'river' },
      { text: 'pencil', emoji: '✏️', speak: 'pencil' },
      { text: 'school', emoji: '🏫', speak: 'school' }
    ]
  },
  {
    name: 'Sentences',
    label: 'Level 3: Sentences',
    items: [
      { text: 'I like cats', emoji: '🐱', speak: 'I like cats' },
      { text: 'The sun is hot', emoji: '☀️', speak: 'The sun is hot' },
      { text: 'I see a dog', emoji: '🐶', speak: 'I see a dog' },
      { text: 'She has a book', emoji: '📖', speak: 'She has a book' },
      { text: 'The fish swims', emoji: '🐟', speak: 'The fish swims' },
      { text: 'I love my mom', emoji: '❤️', speak: 'I love my mom' },
      { text: 'He plays ball', emoji: '⚽', speak: 'He plays ball' },
      { text: 'We eat cake', emoji: '🎂', speak: 'We eat cake' },
      { text: 'The bird flies', emoji: '🐦', speak: 'The bird flies' },
      { text: 'I can run fast', emoji: '🏃', speak: 'I can run fast' }
    ]
  }
];

// ---- Praise & encouragement (more varied & natural) ----
const praise = [
  'Wow, you got it! That was perfect!',
  'Yes! You read that so well!',
  'Amazing! You\'re getting so good at this!',
  'That\'s right! I knew you could do it!',
  'Fantastic! You\'re a reading superstar!',
  'Perfect! Great job!',
  'Yay! You said it correctly! Keep going!',
  'Brilliant! You\'re learning so fast!'
];

const tryAgain = [
  'Oops, not quite! Let me help you. Listen carefully and try again.',
  'Almost! You can do it. Let me say it one more time for you.',
  'Good try! But let\'s try again. Listen to how I say it.',
  'Don\'t worry! Reading is hard sometimes. Let me help you. Listen and try!'
];

const noSpeech = [
  'Hmm, I didn\'t hear you. Can you speak a little louder? Let me say it again.',
  'I think it\'s too quiet! Speak up so I can hear you! Let me repeat.',
  'Oops, I missed that! Say it out loud for me. Here, I\'ll say it again.'
];

const midLessonChat = [
  'You\'re doing great! Keep going!',
  'I love how hard you\'re trying!',
  'You\'re getting better and better!',
  'I\'m so proud of you! Let\'s keep reading!'
];

const letterPhonetics = {
  'a': ['a', 'ay', 'eh', 'ah'],
  'b': ['b', 'bee', 'be'],
  'c': ['c', 'see', 'sea'],
  'd': ['d', 'dee', 'de'],
  'e': ['e', 'ee'],
  'f': ['f', 'eff', 'ef'],
  'g': ['g', 'gee', 'je'],
  'h': ['h', 'aitch', 'ach', 'h'],
  'i': ['i', 'eye', 'ai'],
  'j': ['j', 'jay', 'jay '],
  'k': ['k', 'kay', 'kai'],
  'l': ['l', 'ell', 'el'],
  'm': ['m', 'em'],
  'n': ['n', 'en'],
  'o': ['o', 'oh', 'owe'],
  'p': ['p', 'pee', 'pea'],
  'q': ['q', 'cue', 'queue', 'kyu'],
  'r': ['r', 'ar', 'are'],
  's': ['s', 'ess', 'es'],
  't': ['t', 'tee', 'tea'],
  'u': ['u', 'you', 'yoo'],
  'v': ['v', 'vee', 've'],
  'w': ['w', 'double u', 'double you', 'double-u'],
  'x': ['x', 'ex', 'eks'],
  'y': ['y', 'why', 'wy'],
  'z': ['z', 'zee', 'zed', 'ze']
};

// ====== ELEMENT HELPERS ======
function el(id) { return document.getElementById(id); }
function setStatus(t) { el('avatarStatus').textContent = t; }

function setSpeech(text) {
  el('speechText').textContent = text;
  el('speechBubble').style.animation = 'none';
  void el('speechBubble').offsetHeight;
  el('speechBubble').style.animation = 'bubblePop 0.4s ease';
}

function setAvatarState(state) {
  el('avatar').className = 'avatar' + (state ? ' ' + state : '');
}

function showBigDisplay(text) {
  el('bigDisplay').innerHTML = `<span class="highlight-word">${text}</span>`;
  el('bigDisplay').style.animation = 'none';
  void el('bigDisplay').offsetHeight;
  el('bigDisplay').style.animation = 'bigPop 0.5s ease';
}

function showEmoji(emoji) { el('emojiDisplay').textContent = emoji || ''; }
function showFeedback(msg, type) { el('feedbackZone').innerHTML = `<div class="feedback-msg ${type}">${msg}</div>`; }
function clearFeedback() { el('feedbackZone').innerHTML = ''; }
function showListening(active) { el('listeningZone').classList.toggle('active', active); }
function showScoreBar(show) { el('scoreBar').style.display = show ? 'flex' : 'none'; }
function showControls(show) { el('controls').style.display = show ? 'flex' : 'none'; }
function showLevelInfo(show) { el('levelInfo').style.display = show ? 'block' : 'none'; if (show) el('levelLabel').textContent = levels[currentLevel].label; }

function updateScore() {
  el('starsCount').textContent = stars;
  el('correctCount').textContent = correctCount;
  el('streakCount').textContent = streak;
}

function renderProgressDots() {
  const items = levels[currentLevel].items;
  let html = '';
  for (let i = 0; i < items.length; i++) {
    let cls = 'dot';
    if (i < currentIndex) cls += ' done';
    else if (i === currentIndex) cls += ' active';
    html += `<div class="${cls}"></div>`;
  }
  el('progressDots').innerHTML = html;
}

// ====== TEXT TO SPEECH (Natural Voice) ======
function speak(text, callback) {
  if (!('speechSynthesis' in window)) { if (callback) callback(); return; }

  window.speechSynthesis.cancel();
  isSpeaking = true;
  setAvatarState('speaking');
  setStatus('Speaking...');

  // Split into sentences for more natural pacing
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];

  let chainCallback = callback;
  let idx = 0;

  function speakNext() {
    if (idx >= sentences.length) {
      isSpeaking = false;
      setAvatarState('');
      setStatus('');
      if (callback) callback();
      return;
    }

    const sentence = sentences[idx].trim();
    if (!sentence) { idx++; speakNext(); return; }

    const utter = new SpeechSynthesisUtterance(sentence);
    // Natural settings: moderate rate, slightly higher pitch for friendliness
    utter.rate = 0.9;
    utter.pitch = 1.15;
    utter.volume = 1;

    if (voice) utter.voice = voice;

    utter.onend = function() {
      idx++;
      // Small pause between sentences for natural feel
      setTimeout(speakNext, 150);
    };

    utter.onerror = function() {
      idx++;
      speakNext();
    };

    window.speechSynthesis.speak(utter);
  }

  speakNext();
}

// ====== SPEECH RECOGNITION (Longer & More Robust) ======
function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return false;

  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 10;

  recognition.onresult = function(event) {
    clearTimeout(noSpeechTimeout);

    // Gather many alternatives for better matching
    let alternatives = [];
    for (let i = 0; i < event.results[0].length; i++) {
      alternatives.push(event.results[0][i].transcript.toLowerCase().trim());
    }
    handleSpeechResult(alternatives);
  };

  recognition.onerror = function(event) {
    clearTimeout(noSpeechTimeout);
    stopListening();
    if (event.error === 'no-speech') {
      handleNoSpeech();
    } else if (event.error === 'not-allowed') {
      setSpeech('I need microphone access to listen to you read. Please allow it and refresh the page!');
      setStatus('Microphone blocked');
    } else {
      handleNoSpeech();
    }
  };

  recognition.onend = function() {
    isListening = false;
    showListening(false);
  };

  return true;
}

function startListening(timeoutSec) {
  if (!recognition) {
    if (!initRecognition()) {
      setSpeech('Oh no! Your browser doesn\'t support speech recognition. Please use Google Chrome!');
      return;
    }
  }

  try {
    isListening = true;
    showListening(true);
    setAvatarState('listening');
    setStatus('Listening... speak now!');
    recognition.start();

    // MUCH longer timeout: 20 seconds default, 25 for names
    const timeout = (timeoutSec || 20) * 1000;
    noSpeechTimeout = setTimeout(() => {
      if (isListening) {
        stopListening();
        handleNoSpeech();
      }
    }, timeout);
  } catch (e) {
    // Already running — restart
    try { recognition.stop(); } catch(e2) {}
    setTimeout(() => {
      try { recognition.start(); } catch(e3) {}
    }, 200);
  }
}

function stopListening() {
  isListening = false;
  showListening(false);
  setAvatarState('');
  setStatus('');
  clearTimeout(noSpeechTimeout);
  if (recognition) {
    try { recognition.stop(); } catch(e) {}
  }
}

// ====== FUZZY MATCHING (Better accuracy for kids) ======
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
    }
  }
  return dp[m][n];
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

function checkMatch(transcript, target) {
  const cleanT = transcript.replace(/[.,!?]/g, '').trim();
  const cleanTarget = target.toLowerCase().replace(/[.,!?]/g, '').trim();

  if (currentLevel === 0) {
    // Letters: check phonetic alternatives too
    const phonetics = letterPhonetics[cleanTarget] || [cleanTarget];
    for (const ph of phonetics) {
      if (cleanT === ph || cleanT.startsWith(ph) || cleanT.includes(ph)) return true;
    }
    // Also check similarity for single letters (kids might say "ay" for A)
    if (similarity(cleanT, cleanTarget) >= 0.5) return true;
    // Check if the full speak text matches (e.g. "A is for Apple")
    if (cleanT.includes('apple') && cleanTarget === 'a') return true;
    if (cleanT.includes('bear') && cleanTarget === 'b') return true;
    if (cleanT.includes('cat') && cleanTarget === 'c') return true;
    return false;
  } else if (currentLevel === 1) {
    // Words: exact, contains, or high similarity
    if (cleanT === cleanTarget || cleanT.includes(cleanTarget)) return true;
    if (similarity(cleanT, cleanTarget) >= 0.7) return true;
    return false;
  } else {
    // Sentences: word overlap
    const targetWords = cleanTarget.split(' ');
    let matched = 0;
    for (const tw of targetWords) {
      for (const alt of [cleanT]) {
        if (alt.includes(tw)) { matched++; break; }
        // Fuzzy match per word
        const words = alt.split(' ');
        for (const w of words) {
          if (similarity(w, tw) >= 0.7) { matched++; break; }
        }
      }
    }
    return matched / targetWords.length >= 0.6;
  }
}

// ====== SPEECH RESULT DISPATCHER ======
function handleSpeechResult(alternatives) {
  stopListening();
  totalAttempts++;
  if (!kidName) {
    handleNameResult(alternatives);
  } else {
    checkReading(alternatives);
  }
}

// ====== NO SPEECH DISPATCHER ======
function handleNoSpeech() {
  if (!kidName) {
    handleNameNoSpeech();
  } else {
    handleNoSpeechReading();
  }
}

// ====== PHASE 1 — Welcome & Ask Name ======
function startApp() {
  setAvatarState('thinking');
  setStatus('Getting ready...');

  const savedName = localStorage.getItem('readbuddy_name');
  if (savedName) {
    kidName = savedName;
    setSpeech(`Oh, hi ${kidName}! Welcome back! I missed you! Are you ready to read some more? Let's go!`);
    speak(`Oh, hi ${kidName}! Welcome back! I missed you! Are you ready to read some more? Let's go!`, () => {
      startLesson();
    });
  } else {
    setSpeech('Hello! I\'m ReadBuddy, your reading buddy! I\'m so happy to meet you! What is your name?');
    speak('Hello! I\'m ReadBuddy, your reading buddy! I\'m so happy to meet you! What is your name?', () => {
      askForName();
    });
  }
}

// ====== PHASE 2 — Listen for Name ======
function askForName() {
  setSpeech(`Tell me your name! Just say it out loud. Like this: My name is Sarah.`);
  setStatus('Listening for your name...');
  setTimeout(() => { startListening(25); }, 500);
}

function handleNameResult(alternatives) {
  let name = '';
  for (const alt of alternatives) {
    let cleaned = alt.replace(/^(my name is|i am|i'm|my name's|name is|this is|it's|its)\s+/i, '').trim();
    if (cleaned.length > 0 && cleaned.length <= 20) {
      name = cleaned;
      break;
    }
  }
  if (!name) name = alternatives[0] || '';

  name = name.charAt(0).toUpperCase() + name.slice(1);
  name = name.split(' ')[0];

  kidName = name;
  localStorage.setItem('readbuddy_name', kidName);

  setSpeech(`Oh, ${kidName}! What a lovely name! I love it! Okay ${kidName}, are you ready to learn to read? Let's start with the letters of the alphabet!`);
  speak(`Oh, ${kidName}! What a lovely name! I love it! Okay ${kidName}, are you ready to learn to read? Let's start with the letters of the alphabet!`, () => {
    startLesson();
  });
}

function handleNameNoSpeech() {
  retryCount++;
  if (retryCount >= 3) {
    setSpeech(`Hmm, I can't hear you very well. That's okay! Let's just start reading and have fun!`);
    speak("Hmm, I can't hear you very well. That's okay! Let's just start reading and have fun!", () => {
      kidName = 'Friend';
      localStorage.setItem('readbuddy_name', kidName);
      startLesson();
    });
    return;
  }
  setSpeech(`I didn't quite hear you. Can you speak a little louder? Say your name like this: My name is Luel.`);
  speak("I didn't quite hear you. Can you speak a little louder? Say your name like this: My name is Luel.", () => {
    askForName();
  });
}

// ====== PHASE 3 — Start Lesson ======
function startLesson() {
  currentIndex = 0;
  currentLevel = 0;
  retryCount = 0;

  showScoreBar(true);
  showControls(true);
  showLevelInfo(true);
  renderProgressDots();
  updateScore();

  teachCurrentItem();
}

// ====== PHASE 4 — Teach Current Letter/Word (More Interactive) ======
function teachCurrentItem() {
  const item = levels[currentLevel].items[currentIndex];
  currentTarget = item.text;
  renderProgressDots();

  showBigDisplay(item.text);
  showEmoji(item.emoji);
  clearFeedback();

  // Add occasional chit-chat every 5 items
  let chat = '';
  if (currentIndex > 0 && currentIndex % 5 === 0) {
    chat = midLessonChat[Math.floor(Math.random() * midLessonChat.length)] + ' ';
  }

  if (currentLevel === 0) {
    const speakText = `${chat}Okay ${kidName}, let's look at this letter. This is the letter ${item.text}. ${item.speak} Now it's your turn! Can you say ${item.text}?`;
    setSpeech(`Let's learn the letter ${item.text}. ${item.speak} Now you say it!`);
    speak(speakText, () => {
      listenForReading();
    });
  } else if (currentLevel === 1) {
    const speakText = `${chat}Look at this word, ${kidName}. This word is "${item.text}". Can you read it? Say it out loud!`;
    setSpeech(`This word is "${item.text}". Can you read it? Say it out loud!`);
    speak(speakText, () => {
      listenForReading();
    });
  } else {
    const speakText = `${chat}Now let's read a sentence together, ${kidName}. Read this: ${item.text}. Go ahead!`;
    setSpeech(`Read this sentence: "${item.text}"`);
    speak(speakText, () => {
      listenForReading();
    });
  }
}

// ====== PHASE 5 — Listen for Kid Reading ======
function listenForReading() {
  setSpeech(`Your turn, ${kidName}! Say it out loud! I'm listening! 🎤`);
  setStatus('Your turn! Speak now...');
  setTimeout(() => { startListening(20); }, 500);
}

// ====== PHASE 6 — Check Reading Result ======
function checkReading(alternatives) {
  const item = levels[currentLevel].items[currentIndex];
  let isCorrect = false;

  for (const alt of alternatives) {
    if (checkMatch(alt, item.text)) {
      isCorrect = true;
      break;
    }
  }

  if (isCorrect) {
    handleCorrect();
  } else {
    handleIncorrect(alternatives);
  }
}

// ====== PHASE 7a — Correct! (More natural & celebratory) ======
function handleCorrect() {
  stars++;
  correctCount++;
  streak++;
  retryCount = 0;
  updateScore();

  const wordEl = el('bigDisplay').querySelector('.highlight-word');
  if (wordEl) wordEl.classList.add('word-correct');

  const praiseMsg = praise[Math.floor(Math.random() * praise.length)];
  showFeedback(`✅ ${praiseMsg}`, 'correct');

  // More natural praise — vary the message
  let speakMsg = praiseMsg;
  if (streak >= 3) {
    speakMsg = praiseMsg + ` That's ${streak} in a row! You're on fire, ${kidName}!`;
  } else if (streak >= 5) {
    speakMsg = `Wow, ${kidName}! ${streak} correct in a row! You're amazing!`;
  } else {
    speakMsg = praiseMsg + ` Good job, ${kidName}!`;
  }

  setSpeech(speakMsg);
  speak(speakMsg, () => {
    triggerConfetti();
  });

  setTimeout(() => { nextItem(); }, 2800);
}

// ====== PHASE 7b — Incorrect (More encouraging) ======
function handleIncorrect(alternatives) {
  streak = 0;
  retryCount++;
  updateScore();

  const wordEl = el('bigDisplay').querySelector('.highlight-word');
  if (wordEl) wordEl.classList.add('word-wrong');

  const tryMsg = tryAgain[Math.floor(Math.random() * tryAgain.length)];
  showFeedback(`❌ ${tryMsg}`, 'wrong');

  if (retryCount >= 3) {
    setSpeech(`That's okay, ${kidName}! This one was tricky. Let's try the next one. You're doing great!`);
    speak(`That's okay, ${kidName}! This one was tricky. Let's try the next one. You're doing great!`, () => {
      retryCount = 0;
      setTimeout(() => nextItem(), 500);
    });
  } else {
    const item = levels[currentLevel].items[currentIndex];
    // Be encouraging — tell them what they said vs what's correct
    let heardText = alternatives[0] || '';
    let speakText = `${tryMsg} You said "${heardText}", but the correct answer is "${item.text}". Let me say it for you. ${item.speak} Now you try! Say ${item.text}!`;
    setSpeech(`${tryMsg} Listen: ${item.speak} Now you try!`);
    speak(speakText, () => {
      if (wordEl) wordEl.classList.remove('word-wrong');
      listenForReading();
    });
  }
}

// ====== PHASE 7c — No Speech Detected ======
function handleNoSpeechReading() {
  const item = levels[currentLevel].items[currentIndex];
  const msg = noSpeech[Math.floor(Math.random() * noSpeech.length)];
  showFeedback('🤔 ' + msg, 'encourage');

  let speakText = `${msg} Listen carefully. ${item.speak} Now it's your turn. Say ${item.text}!`;
  setSpeech(`${msg} Listen: ${item.speak} Now say it!`);
  speak(speakText, () => {
    listenForReading();
  });
}

// ====== PHASE 8 — Next Item ======
function nextItem() {
  clearFeedback();
  currentIndex++;

  if (currentIndex >= levels[currentLevel].items.length) {
    currentLevel++;
    currentIndex = 0;

    if (currentLevel >= levels.length) {
      completeAllLevels();
      return;
    }

    showLevelInfo(true);
    const levelName = levels[currentLevel].name;
    const prevName = levels[currentLevel - 1].name;
    setSpeech(`Wow, ${kidName}! You did it! You finished all the ${prevName}! You're so smart! Now let's try ${levelName}. Are you ready? Here we go!`);
    speak(`Wow, ${kidName}! You did it! You finished all the ${prevName}! You're so smart! Now let's try ${levelName}. Are you ready? Here we go!`, () => {
      teachCurrentItem();
    });
    return;
  }

  teachCurrentItem();
}

// ====== PHASE 9 — All Complete ======
function completeAllLevels() {
  setSpeech(`Oh my goodness, ${kidName}! You did it! You finished ALL the levels! You are a SUPER READER! I am so proud of you! You should be proud of yourself too!`);
  speak(`Oh my goodness, ${kidName}! You did it! You finished ALL the levels! You are a SUPER READER! I am so proud of you! You should be proud of yourself too!`, () => {
    triggerConfetti(80);
    setTimeout(() => triggerConfetti(80), 500);
    setTimeout(() => triggerConfetti(80), 1000);
  });
  showFeedback('🎉🏆 SUPER READER! 🏆🎉', 'correct');
  el('bigDisplay').innerHTML = '🎉';
  showEmoji('🏆');
}

// ====== CONFETTI ======
function triggerConfetti(count) {
  count = count || 30;
  const colors = ['#6c5ce7', '#fd79a8', '#00b894', '#fdcb6e', '#e17055', '#0984e3'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      c.style.width = (5 + Math.random() * 10) + 'px';
      c.style.height = (5 + Math.random() * 10) + 'px';
      c.style.animationDuration = (2 + Math.random() * 2) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }, i * 50);
  }
}

// ====== CONTROL BUTTONS ======
el('repeatBtn').addEventListener('click', function() {
  stopListening();
  teachCurrentItem();
});

el('skipBtn').addEventListener('click', function() {
  stopListening();
  retryCount = 0;
  streak = 0;
  updateScore();
  nextItem();
});

el('homeBtn').addEventListener('click', function() {
  stopListening();
  window.speechSynthesis.cancel();
  localStorage.removeItem('readbuddy_name');
  kidName = '';
  currentLevel = 0;
  currentIndex = 0;
  stars = 0;
  correctCount = 0;
  streak = 0;
  retryCount = 0;
  showScoreBar(false);
  showControls(false);
  showLevelInfo(false);
  el('progressDots').innerHTML = '';
  el('progressDots').style.display = 'none';
  el('bigDisplay').innerHTML = '';
  showEmoji('');
  clearFeedback();
  setSpeech('');
  el('progressDots').style.display = 'flex';
  setTimeout(startApp, 300);
});

// ====== INIT VOICES (Pick the most natural voice) ======
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  voicesLoaded = true;

  // Priority list of natural-sounding English voices
  const preferredNames = [
    'Google UK English Female',
    'Google US English',
    'Samantha',
    'Microsoft Aria',
    'Microsoft Jenny',
    'Microsoft Zira',
    'Karen',
    'Moira',
    'Tessa',
    'Fiona'
  ];

  for (const name of preferredNames) {
    voice = voices.find(v => v.name.includes(name));
    if (voice) return;
  }

  // Fallback: any female English voice
  voice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
  if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
}

if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

// ====== START ======
window.addEventListener('load', function() {
  setTimeout(() => {
    el('progressDots').style.display = 'flex';
    startApp();
  }, 800);
});

window.addEventListener('beforeunload', function() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
});
