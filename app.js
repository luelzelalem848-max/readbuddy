// ====== ReadBuddy — AI Reading Companion for Kids ======
// Uses Web Speech API for text-to-speech and speech recognition

// ---- State ----
let kidName = '';
let currentLevel = 'letters';
let currentItemIndex = 0;
let stars = 0;
let correctCount = 0;
let streak = 0;
let totalCompleted = 0;
let isListening = false;
let recognition = null;

// ---- Reading Content ----
const readingContent = {
  letters: [
    { text: 'A', emoji: '🍎', speak: 'A is for Apple' },
    { text: 'B', emoji: '🐻', speak: 'B is for Bear' },
    { text: 'C', emoji: '🐱', speak: 'C is for Cat' },
    { text: 'D', emoji: '🐶', speak: 'D is for Dog' },
    { text: 'E', emoji: '🐘', speak: 'E is for Elephant' },
    { text: 'F', emoji: '🐟', speak: 'F is for Fish' },
    { text: 'G', emoji: '🍇', speak: 'G is for Grapes' },
    { text: 'H', emoji: '🏠', speak: 'H is for House' },
    { text: 'I', emoji: '🍦', speak: 'I is for Ice Cream' },
    { text: 'J', emoji: '🧃', speak: 'J is for Juice' },
    { text: 'K', emoji: '🪁', speak: 'K is for Kite' },
    { text: 'L', emoji: '🦁', speak: 'L is for Lion' },
    { text: 'M', emoji: '🌙', speak: 'M is for Moon' },
    { text: 'N', emoji: '🪺', speak: 'N is for Nest' },
    { text: 'O', emoji: '🧅', speak: 'O is for Onion' },
    { text: 'P', emoji: '🐧', speak: 'P is for Penguin' },
    { text: 'Q', emoji: '👑', speak: 'Q is for Queen' },
    { text: 'R', emoji: '🌈', speak: 'R is for Rainbow' },
    { text: 'S', emoji: '☀️', speak: 'S is for Sun' },
    { text: 'T', emoji: '🌳', speak: 'T is for Tree' },
    { text: 'U', emoji: '☂️', speak: 'U is for Umbrella' },
    { text: 'V', emoji: '🎻', speak: 'V is for Violin' },
    { text: 'W', emoji: '⌚', speak: 'W is for Watch' },
    { text: 'X', emoji: '📦', speak: 'X is for Box' },
    { text: 'Y', emoji: '🪀', speak: 'Y is for Yoyo' },
    { text: 'Z', emoji: '🦓', speak: 'Z is for Zebra' }
  ],
  words: [
    { text: 'cat', emoji: '🐱' }, { text: 'dog', emoji: '🐶' },
    { text: 'sun', emoji: '☀️' }, { text: 'moon', emoji: '🌙' },
    { text: 'tree', emoji: '🌳' }, { text: 'fish', emoji: '🐟' },
    { text: 'bird', emoji: '🐦' }, { text: 'star', emoji: '⭐' },
    { text: 'book', emoji: '📖' }, { text: 'ball', emoji: '⚽' },
    { text: 'cake', emoji: '🎂' }, { text: 'milk', emoji: '🥛' },
    { text: 'apple', emoji: '🍎' }, { text: 'house', emoji: '🏠' },
    { text: 'water', emoji: '💧' }, { text: 'happy', emoji: '😊' },
    { text: 'chair', emoji: '🪑' }, { text: 'bread', emoji: '🍞' },
    { text: 'cloud', emoji: '☁️' }, { text: 'flower', emoji: '🌸' },
    { text: 'river', emoji: '🏞️' }, { text: 'pencil', emoji: '✏️' },
    { text: 'window', emoji: '🪟' }, { text: 'school', emoji: '🏫' },
    { text: 'friend', emoji: '🤝' }, { text: 'planet', emoji: '🪐' }
  ],
  sentences: [
    { text: 'I like cats', words: ['I', 'like', 'cats'] },
    { text: 'The sun is hot', words: ['The', 'sun', 'is', 'hot'] },
    { text: 'I see a dog', words: ['I', 'see', 'a', 'dog'] },
    { text: 'She has a book', words: ['She', 'has', 'a', 'book'] },
    { text: 'The fish swims', words: ['The', 'fish', 'swims'] },
    { text: 'I love my mom', words: ['I', 'love', 'my', 'mom'] },
    { text: 'He plays ball', words: ['He', 'plays', 'ball'] },
    { text: 'We eat cake', words: ['We', 'eat', 'cake'] },
    { text: 'The bird flies', words: ['The', 'bird', 'flies'] },
    { text: 'I can run fast', words: ['I', 'can', 'run', 'fast'] },
    { text: 'The moon is bright', words: ['The', 'moon', 'is', 'bright'] },
    { text: 'My dog is big', words: ['My', 'dog', 'is', 'big'] },
    { text: 'She drinks milk', words: ['She', 'drinks', 'milk'] },
    { text: 'We go to school', words: ['We', 'go', 'to', 'school'] },
    { text: 'The tree is tall', words: ['The', 'tree', 'is', 'tall'] }
  ],
  stories: [
    {
      title: 'The Little Cat',
      text: 'The little cat sat on a mat. The cat ate a fish. The cat was happy.',
      words: ['The', 'little', 'cat', 'sat', 'on', 'a', 'mat.', 'The', 'cat', 'ate', 'a', 'fish.', 'The', 'cat', 'was', 'happy.']
    },
    {
      title: 'My Friend',
      text: 'I have a friend. My friend likes to play. We run and jump. We have fun.',
      words: ['I', 'have', 'a', 'friend.', 'My', 'friend', 'likes', 'to', 'play.', 'We', 'run', 'and', 'jump.', 'We', 'have', 'fun.']
    },
    {
      title: 'The Sunny Day',
      text: 'The sun is up. The sky is blue. I see a bird. The bird sings. I am happy.',
      words: ['The', 'sun', 'is', 'up.', 'The', 'sky', 'is', 'blue.', 'I', 'see', 'a', 'bird.', 'The', 'bird', 'sings.', 'I', 'am', 'happy.']
    },
    {
      title: 'The Big Dog',
      text: 'I see a big dog. The dog runs fast. The dog has a ball. I like the dog.',
      words: ['I', 'see', 'a', 'big', 'dog.', 'The', 'dog', 'runs', 'fast.', 'The', 'dog', 'has', 'a', 'ball.', 'I', 'like', 'the', 'dog.']
    }
  ]
};

// ---- Encouragement Messages ----
const praiseMessages = [
  'Amazing! 🎉', 'You did it! 🌟', 'Great job! 👏', 'Fantastic! ✨',
  'You\'re a star! ⭐', 'Super reading! 🚀', 'Wonderful! 💖', 'You\'re so smart! 🧠'
];

const tryAgainMessages = [
  'Almost! Try again 💪', 'Good try! Listen and try again 🎧',
  'You\'re getting there! Try once more 🌈', 'Don\'t give up! Try again ⭐'
];

// ---- Init Speech Recognition ----
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Your browser doesn\'t support speech recognition. Try Chrome or Edge!');
    return false;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 3;

  recognition.onresult = function(event) {
    let transcript = '';
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    transcript = transcript.toLowerCase().trim();

    if (event.results[event.results.length - 1].isFinal) {
      checkReading(transcript);
    }
  };

  recognition.onerror = function(event) {
    stopListening();
    if (event.error === 'no-speech') {
      showFeedback('I didn\'t hear anything. Try again! 🎤', 'hint');
    } else if (event.error === 'not-allowed') {
      showFeedback('Please allow microphone access to use this feature! 🎤', 'error');
    } else {
      showFeedback('Something went wrong. Try again! 🤗', 'error');
    }
  };

  recognition.onend = function() {
    stopListening();
  };

  return true;
}

// ---- Start Listening ----
function startListening() {
  if (!recognition) {
    if (!initSpeechRecognition()) return;
  }

  try {
    recognition.start();
    isListening = true;
    document.getElementById('listeningIndicator').style.display = 'flex';
    document.getElementById('listenBtn').textContent = '⏹️ Stop';
    document.getElementById('listenBtn').classList.add('listening');
  } catch (e) {
    // Already listening, stop
    stopListening();
  }
}

// ---- Stop Listening ----
function stopListening() {
  if (recognition) {
    try { recognition.stop(); } catch(e) {}
  }
  isListening = false;
  document.getElementById('listeningIndicator').style.display = 'none';
  document.getElementById('listenBtn').textContent = '🎤 I\'ll Read It!';
  document.getElementById('listenBtn').classList.remove('listening');
}

// ---- Check if the kid read correctly ----
function checkReading(transcript) {
  const transcriptClean = transcript.toLowerCase().replace(/[.,!?]/g, '').trim();
  let targetWord = '';

  if (currentLevel === 'letters') {
    const item = readingContent.letters[currentItemIndex];
    targetWord = item.text.toLowerCase();
  } else if (currentLevel === 'words') {
    const item = readingContent.words[currentItemIndex];
    targetWord = item.text.toLowerCase();
  } else if (currentLevel === 'sentences') {
    const item = readingContent.sentences[currentItemIndex];
    targetWord = item.text.toLowerCase();
  } else if (currentLevel === 'stories') {
    const item = readingContent.stories[currentItemIndex];
    targetWord = item.text.toLowerCase();
  }

  // Check if transcript contains the target
  // For letters, check if the letter sound is in the transcript
  let isCorrect = false;

  if (currentLevel === 'letters') {
    // For letters, accept if the transcript starts with the letter or contains it
    isCorrect = transcriptClean.includes(targetWord) ||
                transcriptClean.startsWith(targetWord) ||
                transcriptClean === targetWord;
  } else if (currentLevel === 'words') {
    // For words, check exact match or if the word is in the transcript
    isCorrect = transcriptClean === targetWord || transcriptClean.includes(targetWord);
  } else {
    // For sentences and stories, check if most words match
    const targetWords = targetWord.split(' ');
    let matchedWords = 0;
    for (const tw of targetWords) {
      const twClean = tw.replace(/[.,!?]/g, '');
      if (transcriptClean.includes(twClean)) matchedWords++;
    }
    // Need at least 70% of words correct
    isCorrect = matchedWords / targetWords.length >= 0.7;
  }

  if (isCorrect) {
    handleCorrect();
  } else {
    handleIncorrect(targetWord);
  }
}

// ---- Handle Correct Reading ----
function handleCorrect() {
  stopListening();
  stars++;
  correctCount++;
  streak++;
  totalCompleted++;

  updateScoreboard();
  showFeedback(getRandomPraise(), 'success');
  triggerConfetti();
  updateProgress();

  // Auto-advance after a short delay
  setTimeout(() => {
    nextItem();
  }, 2000);
}

// ---- Handle Incorrect Reading ----
function handleIncorrect(targetWord) {
  streak = 0;
  updateScoreboard();
  showFeedback(getRandomTryAgain() + ' The word was: "' + targetWord + '". Listen and try! 🎧', 'error');

  // Speak the correct word
  setTimeout(() => {
    speakText(targetWord);
  }, 1500);
}

// ---- Show Feedback ----
function showFeedback(message, type) {
  const fb = document.getElementById('feedback');
  fb.className = 'feedback ' + type;
  fb.textContent = message;
}

// ---- Random Praise / Try Again ----
function getRandomPraise() {
  return praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
}

function getRandomTryAgain() {
  return tryAgainMessages[Math.floor(Math.random() * tryAgainMessages.length)];
}

// ---- Text-to-Speech ----
function speakText(text, rate) {
  if (!('speechSynthesis' in window)) {
    alert('Your browser doesn\'t support text-to-speech.');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate || 0.8; // slower for kids
  utterance.pitch = 1.2; // higher pitch, friendly
  utterance.volume = 1;

  // Try to find a female English voice (kid-friendly)
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v =>
    v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
  );
  if (preferredVoice) utterance.voice = preferredVoice;

  // Highlight the word while speaking
  const display = document.getElementById('wordDisplay');
  const words = display.querySelectorAll('.big-word, .sentence-word');
  words.forEach(w => {
    w.classList.add('speaking');
  });

  utterance.onend = function() {
    words.forEach(w => w.classList.remove('speaking'));
  };

  window.speechSynthesis.speak(utterance);
}

// ---- Speak Sentence Word-by-Word ----
function speakSentence(words, wordIndex) {
  if (wordIndex >= words.length) return;

  const wordEl = document.querySelectorAll('.sentence-word')[wordIndex];
  if (wordEl) wordEl.classList.add('highlighted');

  const utterance = new SpeechSynthesisUtterance(words[wordIndex]);
  utterance.rate = 0.7;
  utterance.pitch = 1.2;

  utterance.onend = function() {
    if (wordEl) wordEl.classList.remove('highlighted');
    speakSentence(words, wordIndex + 1);
  };

  window.speechSynthesis.speak(utterance);
}

// ---- Render Current Item ----
function renderItem() {
  const display = document.getElementById('wordDisplay');
  const imageEl = document.getElementById('wordImage');
  const instruction = document.getElementById('instruction');
  const fb = document.getElementById('feedback');
  fb.textContent = '';
  fb.className = 'feedback';

  display.innerHTML = '';
  imageEl.innerHTML = '';
  window.speechSynthesis.cancel();

  if (currentLevel === 'letters') {
    const item = readingContent.letters[currentItemIndex];
    instruction.textContent = '👆 Click the letter to hear it, then say it out loud!';
    display.innerHTML = `<span class="big-word" onclick="speakText('${item.speak}')">${item.text}</span>`;
    imageEl.innerHTML = item.emoji;

  } else if (currentLevel === 'words') {
    const item = readingContent.words[currentItemIndex];
    instruction.textContent = '👆 Click the word to hear it, then read it out loud!';
    display.innerHTML = `<span class="big-word" onclick="speakText('${item.text}')">${item.text}</span>`;
    imageEl.innerHTML = item.emoji;

  } else if (currentLevel === 'sentences') {
    const item = readingContent.sentences[currentItemIndex];
    instruction.textContent = '👆 Click "Read to Me" to hear the sentence, then read it!';
    display.innerHTML = item.words.map((w, i) =>
      `<span class="sentence-word" onclick="speakText('${w.replace(/[.,!?]/g, '')}')">${w}</span>`
    ).join('');

  } else if (currentLevel === 'stories') {
    const item = readingContent.stories[currentItemIndex];
    instruction.textContent = `📖 ${item.title} — Click "Read to Me" to hear the story, then read along!`;
    display.innerHTML = item.words.map((w, i) =>
      `<span class="sentence-word" onclick="speakText('${w.replace(/[.,!?]/g, '')}')">${w}</span>`
    ).join('');
  }

  updateProgress();
}

// ---- Next Item ----
function nextItem() {
  const items = readingContent[currentLevel];
  currentItemIndex = (currentItemIndex + 1) % items.length;
  renderItem();
  showFeedback('Great! Here\'s the next one! 👇', 'hint');
}

// ---- Change Level ----
function changeLevel(level) {
  currentLevel = level;
  currentItemIndex = 0;

  const levelNames = {
    letters: 'Level 1: Letters',
    words: 'Level 2: Words',
    sentences: 'Level 3: Sentences',
    stories: 'Level 4: Stories'
  };
  document.getElementById('levelBadge').textContent = levelNames[level];

  document.querySelectorAll('.btn-level').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === level);
  });

  renderItem();
}

// ---- Update Scoreboard ----
function updateScoreboard() {
  document.getElementById('starsCount').textContent = stars;
  document.getElementById('correctCount').textContent = correctCount;
  document.getElementById('streakCount').textContent = streak;
}

// ---- Update Progress ----
function updateProgress() {
  const items = readingContent[currentLevel];
  const pct = ((currentItemIndex + 1) / items.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent =
    `${currentItemIndex + 1} of ${items.length} completed (${totalCompleted} total)`;
}

// ---- Confetti ----
function triggerConfetti() {
  const colors = ['#6c5ce7', '#fd79a8', '#00b894', '#fdcb6e', '#e17055', '#0984e3'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.width = (5 + Math.random() * 10) + 'px';
      confetti.style.height = (5 + Math.random() * 10) + 'px';
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }, i * 50);
  }
}

// ---- Show Encouragement ----
function showEncouragement(message) {
  const el = document.getElementById('encouragement');
  el.innerHTML = `<p>${message}</p>`;
  setTimeout(() => { el.innerHTML = ''; }, 3000);
}

// ---- Start App ----
function startApp() {
  const nameInput = document.getElementById('kidName');
  kidName = nameInput.value.trim() || 'Friend';

  document.getElementById('setupSection').style.display = 'none';
  document.getElementById('readingApp').style.display = 'block';

  initSpeechRecognition();
  renderItem();
  updateScoreboard();

  showEncouragement(`Welcome, ${kidName}! Let's start reading! 🎉`);

  // Pre-load voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function() {
      window.speechSynthesis.getVoices();
    };
  }
}

// ---- Event Listeners ----
document.getElementById('startBtn').addEventListener('click', startApp);

document.getElementById('kidName').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') startApp();
});

document.getElementById('speakBtn').addEventListener('click', function() {
  if (currentLevel === 'letters') {
    const item = readingContent.letters[currentItemIndex];
    speakText(item.speak);
  } else if (currentLevel === 'words') {
    const item = readingContent.words[currentItemIndex];
    speakText(item.text);
  } else if (currentLevel === 'sentences') {
    const item = readingContent.sentences[currentItemIndex];
    speakText(item.text);
  } else if (currentLevel === 'stories') {
    const item = readingContent.stories[currentItemIndex];
    speakText(item.text);
  }
});

document.getElementById('listenBtn').addEventListener('click', function() {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
});

document.getElementById('nextBtn').addEventListener('click', nextItem);

document.querySelectorAll('.btn-level').forEach(btn => {
  btn.addEventListener('click', function() {
    changeLevel(this.dataset.level);
  });
});

// ---- Initialize voices on load ----
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
}
