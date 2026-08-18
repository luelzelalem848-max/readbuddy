// ====== ReadBuddy — AI Reading Tutor (v2: Fully Interactive) ======
// The app TALKS first, LISTENSNS automatically, and drives the lesson flow.

// ---- State ----
let kidName = '';
let currentLevel = 0; // 0=letters, 1=words, 2=sentences
let currentIndex = 0;
let stars = 0;
let correctCount = 0;
let streak = 0;
let isSpeaking = false;
let isListening = false;
let recognition = null;
let listenTimeout = null;
let noSpeechTimeout = null;
let retryCount = 0;
let voice = null;

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

// ---- Praise & encouragement messages ----
const praise = [
  'Amazing job!',
  'You did it! Great work!',
  'Fantastic! You\'re so smart!',
  'Wonderful! Keep going!',
  'You\'re a reading star!',
  'Perfect! That\'s correct!',
  'Super! You\'re amazing!'
];

const tryAgain = [
  'Almost! Let\'s try again. Listen carefully.',
  'Good try! Let me say it again for you.',
  'Not quite! Listen and try once more.',
  'You\'re getting there! Try again!'
];

const noSpeech = [
  'I didn\'t hear you. Let me say it again, and you try!',
  'Oops, I couldn\'t hear you. Speak louder and try!',
  'Say it out loud for me! Let me repeat it.'
];

// ====== ELEMENT HELPERS ======
function el(id) { return document.getElementById(id); }

function setStatus(text) {
  el('avatarStatus').textContent = text;
}

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

function showEmoji(emoji) {
  el('emojiDisplay').textContent = emoji || '';
}

function showFeedback(msg, type) {
  el('feedbackZone').innerHTML = `<div class="feedback-msg ${type}">${msg}</div>`;
}

function clearFeedback() {
  el('feedbackZone').innerHTML = '';
}

function showListening(active) {
  el('listeningZone').classList.toggle('active', active);
}

function showScoreBar(show) {
  el('scoreBar').style.display = show ? 'flex' : 'none';
}

function showControls(show) {
  el('controls').style.display = show ? 'flex' : 'none';
}

function showLevelInfo(show) {
  el('levelInfo').style.display = show ? 'block' : 'none';
  if (show) el('levelLabel').textContent = levels[currentLevel].label;
}

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

// ====== TEXT TO SPEECH ======
function speak(text, callback) {
  if (!('speechSynthesis' in window)) {
    if (callback) callback();
    return;
  }

  window.speechSynthesis.cancel();
  isSpeaking = true;
  setAvatarState('speaking');
  setStatus('Speaking...');

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.85;
  utter.pitch = 1.3;
  utter.volume = 1;

  if (voice) utter.voice = voice;

  utter.onend = function() {
    isSpeaking = false;
    setAvatarState('');
    setStatus('');
    if (callback) callback();
  };

  utter.onerror = function() {
    isSpeaking = false;
    setAvatarState('');
    setStatus('');
    if (callback) callback();
  };

  window.speechSynthesis.speak(utter);
}

// ====== SPEECH RECOGNITION ======
function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    return false;
  }

  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 5;

  recognition.onresult = function(event) {
    clearTimeout(noSpeechTimeout);
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
    setStatus('Listening...');
    recognition.start();

    const timeout = (timeoutSec || 8) * 1000;
    noSpeechTimeout = setTimeout(() => {
      if (isListening) {
        stopListening();
        handleNoSpeech();
      }
    }, timeout);
  } catch (e) {
    stopListening();
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

// ====== SPEECH RESULT DISPATCHER ======
function handleSpeechResult(alternatives) {
  stopListening();
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

// ====== APP FLOW: PHASE 1 — Welcome & Ask Name ======
function startApp() {
  setAvatarState('thinking');
  setStatus('Getting ready...');

  const savedName = localStorage.getItem('readbuddy_name');
  if (savedName) {
    kidName = savedName;
    setSpeech(`Welcome back, ${kidName}! Ready to keep reading? Let's go!`);
    speak(`Welcome back, ${kidName}! Ready to keep reading? Let's go!`, () => {
      startLesson();
    });
  } else {
    setSpeech('Hi there! I\'m ReadBuddy, your reading friend! What\'s your name?');
    speak('Hi there! I\'m ReadBuddy, your reading friend! What\'s your name?', () => {
      askForName();
    });
  }
}

// ====== PHASE 2 — Listen for Name ======
function askForName() {
  setSpeech('Tell me your name! Just say it out loud. 🎤');
  setStatus('Listening for your name...');
  setTimeout(() => {
    startListening(10);
  }, 500);
}

function handleNameResult(alternatives) {
  let name = '';
  for (const alt of alternatives) {
    let cleaned = alt.replace(/^(my name is|i am|i'm|my name's|name is)\s+/i, '').trim();
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

  setSpeech(`Nice to meet you, ${kidName}! That\'s a beautiful name! Let\'s start reading!`);
  speak(`Nice to meet you, ${kidName}! That's a beautiful name! Let's start reading!`, () => {
    startLesson();
  });
}

function handleNameNoSpeech() {
  retryCount++;
  if (retryCount >= 3) {
    setSpeech("Hmm, I can't hear you well. Let's just start reading! You can tell me your name later.");
    speak("Hmm, I can't hear you well. Let's just start reading! You can tell me your name later.", () => {
      kidName = 'Friend';
      localStorage.setItem('readbuddy_name', kidName);
      startLesson();
    });
    return;
  }
  setSpeech("I didn't hear you. Say your name out loud! For example, say: My name is Luel.");
  speak("I didn't hear you. Say your name out loud! For example, say: My name is Luel.", () => {
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

// ====== PHASE 4 — Teach Current Letter/Word ======
function teachCurrentItem() {
  const item = levels[currentLevel].items[currentIndex];
  renderProgressDots();

  showBigDisplay(item.text);
  showEmoji(item.emoji);
  clearFeedback();

  if (currentLevel === 0) {
    setSpeech(`Let's learn the letter ${item.text}. ${item.speak} Now you say it!`);
    speak(`Let's learn the letter ${item.text}. ${item.speak} Now you say it!`, () => {
      listenForReading();
    });
  } else if (currentLevel === 1) {
    setSpeech(`This word is "${item.text}". Can you read it? Say it out loud!`);
    speak(`This word is "${item.text}". Can you read it? Say it out loud!`, () => {
      listenForReading();
    });
  } else {
    setSpeech(`Read this sentence: "${item.text}"`);
    speak(`Read this sentence: ${item.text}`, () => {
      listenForReading();
    });
  }
}

// ====== PHASE 5 — Listen for Kid Reading ======
function listenForReading() {
  setSpeech(`Your turn, ${kidName}! Say it out loud! 🎤`);
  setStatus('Your turn! Speak now...');
  setTimeout(() => {
    startListening(8);
  }, 500);
}

// ====== PHASE 6 — Check Reading Result ======
function checkReading(alternatives) {
  const item = levels[currentLevel].items[currentIndex];
  const target = item.text.toLowerCase().replace(/[.,!?]/g, '').trim();

  let isCorrect = false;
  for (const alt of alternatives) {
    const cleanAlt = alt.replace(/[.,!?]/g, '').trim();

    if (currentLevel === 0) {
      if (cleanAlt === target || cleanAlt.startsWith(target) || cleanAlt.includes(target)) {
        isCorrect = true; break;
      }
    } else if (currentLevel === 1) {
      if (cleanAlt === target || cleanAlt.includes(target)) {
        isCorrect = true; break;
      }
    } else {
      const targetWords = target.split(' ');
      let matched = 0;
      for (const tw of targetWords) {
        if (cleanAlt.includes(tw)) matched++;
      }
      if (matched / targetWords.length >= 0.7) {
        isCorrect = true; break;
      }
    }
  }

  if (isCorrect) {
    handleCorrect();
  } else {
    handleIncorrect();
  }
}

// ====== PHASE 7a — Correct! ======
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
  setSpeech(`${praiseMsg} Great job, ${kidName}!`);
  speak(praiseMsg, () => {
    triggerConfetti();
  });

  setTimeout(() => {
    nextItem();
  }, 2500);
}

// ====== PHASE 7b — Incorrect ======
function handleIncorrect() {
  streak = 0;
  retryCount++;
  updateScore();

  const wordEl = el('bigDisplay').querySelector('.highlight-word');
  if (wordEl) wordEl.classList.add('word-wrong');

  const tryMsg = tryAgain[Math.floor(Math.random() * tryAgain.length)];
  showFeedback(`❌ ${tryMsg}`, 'wrong');

  if (retryCount >= 3) {
    setSpeech(`That's okay, ${kidName}! Let's move to the next one. You can always come back!`);
    speak(`That's okay, ${kidName}! Let's move to the next one. You can always come back!`, () => {
      retryCount = 0;
      setTimeout(() => nextItem(), 500);
    });
  } else {
    const item = levels[currentLevel].items[currentIndex];
    setSpeech(`${tryMsg} Listen: ${item.speak} Now you try!`);
    speak(`${tryMsg} ${item.speak} Now you try!`, () => {
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

  setSpeech(`${msg} Listen: ${item.speak} Now say it!`);
  speak(`${msg} ${item.speak} Now say it!`, () => {
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
    setSpeech(`Amazing, ${kidName}! You finished all the ${prevName}! Now let's try ${levelName}!`);
    speak(`Amazing, ${kidName}! You finished all the ${prevName}! Now let's try ${levelName}!`, () => {
      teachCurrentItem();
    });
    return;
  }

  teachCurrentItem();
}

// ====== PHASE 9 — All Complete ======
function completeAllLevels() {
  setSpeech(`Wow, ${kidName}! You did it! You finished ALL the levels! You are a SUPER READER!`);
  speak(`Wow, ${kidName}! You did it! You finished ALL the levels! You are a SUPER READER!`, () => {
    triggerConfetti(60);
    setTimeout(() => triggerConfetti(60), 500);
    setTimeout(() => triggerConfetti(60), 1000);
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

// ====== INIT VOICES ======
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Female') || v.name.includes('Google US')));
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
