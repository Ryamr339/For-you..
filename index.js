// =============================================
// CONFIGURASI DAN INISIALISASI
// =============================================

// DOM Elements
const textEl = document.getElementById("text");
const optionsEl = document.getElementById("choices");
const card = document.getElementById("card");
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const starSound = document.getElementById("star-sound");
const startScreen = document.getElementById("start-screen");
const chatScreen = document.getElementById("chat-screen");
const loadingScreen = document.getElementById("loading-screen");
const clockElement = document.getElementById("clock");
const missSlider = document.getElementById("missSlider");
const sliderValue = document.getElementById("sliderValue");

// State Variables
let currentTheme = 'dark';
let currentScenes = [];
let currentCategory = '';
let typingSpeed = 30;
let currentScene = 0;
let isTyping = false;
let isMusicPlaying = false;
let musicVolume = 0.5;
let easyMode = false;

// =============================================
// REAL TIME CLOCK SYSTEM
// =============================================

function initializeClock() {
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// =============================================
// MISS ME SLIDER SYSTEM
// =============================================

function initializeMissSlider() {
    function updateSliderValue() {
        const value = parseInt(missSlider.value);
        let text = "";
        
        if (value <= 20) {
            text = "Not at all 😢";
        } else if (value <= 40) {
            text = "Just a bit 💭";
        } else if (value <= 60) {
            text = "A little 💭";
        } else if (value <= 80) {
            text = "Quite a lot 💕";
        } else {
            text = "Too much 💖";
        }
        
        sliderValue.textContent = text;
        
        // Efek warna berdasarkan nilai
        const hue = (value / 100) * 120; // 0-120 (red to green)
        sliderValue.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue + 20}, 70%, 60%))`;
        sliderValue.style.webkitBackgroundClip = 'text';
        sliderValue.style.webkitTextFillColor = 'transparent';
    }
    
    missSlider.addEventListener('input', updateSliderValue);
    updateSliderValue(); // Set initial value
}

// =============================================
// CLICK HEART ANIMATION SYSTEM
// =============================================

function initializeClickHearts() {
    document.body.addEventListener('click', function(e) {
        createClickHeart(e.clientX, e.clientY);
    });
}

function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.innerHTML = '💖';
    heart.style.left = (x - 12) + 'px';
    heart.style.top = (y - 12) + 'px';
    
    // Random heart color
    const colors = ['#ff6b9d', '#a566ff', '#72ddf7', '#ffd166', '#4CAF50'];
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, 2000);
}

// =============================================
// DATA MESSAGES DAN SCENES (Tetap sama)
// =============================================

const randomMessages = {
  motivation: [
    "Setiap langkah kecil membawamu lebih dekat ke impianmu! 🚶‍♀️✨",
    "Hari ini mungkin berat, tapi ingat betapa kuatnya dirimu! 💪",
    "Progress itu seperti menanam bunga - butuh waktu tapi hasilnya indah 🌸",
    "Kamu lebih berani dari yang kamu kira, lebih kuat dari yang kamu lihat! 🦁",
    "Masalah sementara, tapi pelajaran dan kekuatanmu tetap selamanya 📚"
  ],
  sweet: [
    "Kalau kamu itu bintang, aku mau jadi langitnya biar bisa lihat kamu setiap malam 🌟",
    "Tau gak bedanya kamu sama wifi? Kalau wifi sinyalnya bisa hilang, tapi kamu selalu ada di hati ❤️",
    "Kamu tuh kayak kopi di pagi hari - bikin mata melek dan hati senang ☕️",
    "Aku bukan photographer, tapi aku bisa lihat masa depan yang indah bersamamu 📸",
    "Kalau bahagia itu warna, pasti warnanya seperti senyuman kamu 🌈"
  ],
  surprise: [
    "BOOM! 💥 Kamu baru saja dikirimkan paket semangat dan cinta! 📦💖",
    "Surprise! 🎉 Hari ini adalah hari yang spesial karena kamu ada di dunia!",
    "Psst... rahasia nih... kamu itu lebih awesome dari yang kamu sadari! 🤫✨",
    "Alert! 🚨 Ditemukan manusia paling amazing di dunia - dan itu kamu!",
    "Magic! 🎩✨ Tiba-tiba ada pesan ini muncul untuk mengingatkan betapa berharganya kamu!"
  ]
};

const sceneCategories = {
  motivation: [
    {
      text: "Hai my life partner.. gimana perasaan lu hari ini? Keliatan ada yang berat nih...",
      options: [
        { text: "Iya bang, lagi banyak tekanan nih...", next: 1 },
        { text: "Lumayan, tapi ada tantangan baru", next: 2 }
      ]
    },
    {
      text: "Gw ngerti... Tapi tau gak? Setiap kali lu hadapi tantangan, lu jadi versi yang lebih kuat! 💪",
      options: [
        { text: "Huhu butuh pelukan virtual nih 😭", next: 3 },
        { text: "Bener juga, harus tetap semangat! 💫", next: 4 }
      ]
    },
    {
      text: "Tantangan itu kayak gym buat mental - bikin lu makin kuat dan tahan banting! 🏋️‍♀️",
      options: [
        { text: "Jadi kita lagi latihan mental ya? 😅", next: 3 },
        { text: "Aku akan hadapi ini dengan berani! 🦸‍♀️", next: 4 }
      ]
    },
    {
      text: "Istirahat itu bukan tanda lemah, tapi strategi juara! Even superhero butuh recharge 🦸‍♂️🔋",
      options: [
        { text: "Oke, gw akan istirahat sebentar", next: 5 },
        { text: "Bentar lagi, hampir selesai kok!", next: 5 }
      ]
    },
    {
      text: "Ingat cill.. : Perjalanan ribuan mil dimulai dari satu langkah. lu sudah mulai, itu yang penting! 🚶‍♀️🌟",
      options: [
        { text: "Makasih udah ingetin! 🌈", next: 5 },
        { text: "Iya, harus tetep jalan!", next: 5 }
      ]
    },
    {
      text: "Proud of you banget! No matter what happens today, you're still amazing in my eyes 👀💖",
      options: [
        { text: "Love you! 😘", next: 6 },
        { text: "You're my favorite cheerleader! 🎉", next: 6 }
      ]
    },
    {
      text: "Sekarang tarik napas dalem-dalem... You've survived 100% of your bad days so far! 🌬️✨",
      options: [
        { text: "hehe.. cuman segitu.. mau ulang lagi?🔄", next: 0 },
        { text: "hehe.. cuman segitu.. mau balik ke menu?🏠", next: -1 }
      ]
    }
  ],

  sweet: [
    {
      text: "Hai my bocill.. Tau gak bedanya lu sama bulan? 🌙",
      options: [
        { text: "Enggak tau, apa? 😊", next: 1, normal: true },
        { text: "Tau dong! 😏", next: 1, runaway: true }
      ]
    },
    {
      text: "Bulan cuma keluar malem hari, tapi lu bikin setiap detik gw jadi terang dan berarti! ✨",
      options: [
        { text: "Lanjut yakk 😄", next: 2 },
        { text: "Jelek >:(..", next: 2 , runaway:true}
      ]
    },
    {
      text: "Kalo lu itu library, gw mau jadi kartu membernya - biar bisa dateng setiap hari baca cerita indah lu 📚💖",
      options: [
        { text: "Hahaha kreatif banget! 🤣", next: 3 },
        { text: "Bosenn.. 📝", next: 3, runaway : true }
      ]
    },
    {
      text: "Tau gak kenapa kalender 2025 ada 365 hari? Soalnya butuh waktu setahun buat nemuin orang secantik lu :))! 📅",
      options: [
        { text: "WKWKWK itu mah kebetulan! 😂", next: 4 },
        { text: "Najiss...🫣", next: 4 , runaway : true }
      ]
    },
    {
      text: "lu tuh kayak alphabet... tanpa lu, hidup ku gak ada artinya 🔤❤️",
      options: [
        { text: "Awww that's deep! 🥰", next: 5 },
        { text: "Dih.. jauh jauh 😄", next: 5,runaway:true }
      ]
    },
    {
      text: "Serius deh... every time I hear your voice, my heart does the happy dance! 💃🎶",
      options: [
        { text: "You're too sweet! 💖", next: 6 },
        { text: "Gak jelas..🕺", next: 6,runaway:true }
      ]
    },
    {
      text: "Thanks for being the beautiful person you are, and for making my world brighter! 🌞💌",
      options: [
        { text: "Mulai Lagi 🔄", next: 0 },
        { text: "Back to Start 🏠", next: -1 }
      ]
    }
  ],

  surprise: [
    {
      text: "Hey you! I've got a special delivery for you today... 🎁📬",
      options: [
        { text: "What is it? 😮", next: 1 },
        { text: "A surprise? Yay! 🎉", next: 1 }
      ]
    },
    {
      text: "Did you know? Your existence makes the universe a better place! 🌌✨",
      options: [
        { text: "Really? 🥺", next: 2 },
        { text: "You always know what to say! 💫", next: 2 }
      ]
    },
    {
      text: "I was thinking about your smile today... and it made my day 100x better! 😄🌈",
      options: [
        { text: "That's so sweet! 💕", next: 3 },
        { text: "You make me smile too! 😁", next: 3 }
      ]
    },
    {
      text: "Secret fact: You're doing much better than you realize, and you're loved more than you know! 🤫💖",
      options: [
        { text: "I needed to hear that... 🥲", next: 4 },
        { text: "Thank you for the reminder! 🌟", next: 4 }
      ]
    },
    {
      text: "Want to know another secret? The way you laugh is my favorite sound in the world! 🎵🤫",
      options: [
        { text: "You notice that? 🫣", next: 5 },
        { text: "That's so specific and cute! 😆", next: 5 }
      ]
    },
    {
      text: "Final surprise... *whispers* You're absolutely wonderful, and don't let anyone tell you otherwise! 💌✨",
      options: [
        { text: "Terima Kasih! 💖", next: 6 },
        { text: "Back to Start 🏠", next: -1 }
      ]
    },
    {
      text: "Hope these little surprises made you smile! Remember, you're perfect just the way you are! 🌸🎁",
      options: [
        { text: "Start Over 🔄", next: 0 },
        { text: "Main Menu 🏠", next: -1 }
      ]
    }
  ]
};

// =============================================
// SISTEM BINTANG INTERAKTIF (Tetap sama)
// =============================================

function createInteractiveStars() {
  const starsContainer = document.getElementById('stars-container');
  if (!starsContainer) return;
  
  starsContainer.innerHTML = '';
  const starCount = 100;
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = (Math.random() * 4 + 2) + 'px';
    star.style.height = star.style.width;
    star.style.animationDelay = Math.random() * 4 + 's';
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    
    star.addEventListener('click', function(e) {
      e.stopPropagation();
      playSound(starSound);
      this.classList.add('clicked');
      
      createStarParticles(this.getBoundingClientRect().left, this.getBoundingClientRect().top);
      showStarMessage(this);
      
      setTimeout(() => {
        if (this.parentNode) {
          this.remove();
          setTimeout(() => createInteractiveStars(), 2000);
        }
      }, 600);
    });
    
    starsContainer.appendChild(star);
  }
}

function createStarParticles(x, y) {
  const colors = ['#ffd700', '#ffffff', '#a566ff', '#72ddf7'];
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    
    const animation = particle.animate([
      { 
        transform: 'translate(0, 0) scale(1)',
        opacity: 1
      },
      { 
        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
        opacity: 0
      }
    ], {
      duration: 800 + Math.random() * 400,
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    });
    
    animation.onfinish = () => {
      if (particle.parentNode) {
        particle.remove();
      }
    };
  }
}

function showStarMessage(starElement) {
  const messages = [
    "Wish upon a star! 🌟",
    "You shine brighter than stars! ✨",
    "Make a wish! 💫",
    "Stardust for you! 🌌",
    "Twinkle twinkle! ⭐"
  ];
  
  const message = document.createElement('div');
  message.textContent = messages[Math.floor(Math.random() * messages.length)];
  message.style.position = 'fixed';
  message.style.left = starElement.getBoundingClientRect().left + 'px';
  message.style.top = (starElement.getBoundingClientRect().top - 30) + 'px';
  message.style.background = 'rgba(255, 215, 0, 0.9)';
  message.style.color = '#000';
  message.style.padding = '5px 10px';
  message.style.borderRadius = '15px';
  message.style.fontSize = '12px';
  message.style.fontWeight = 'bold';
  message.style.zIndex = '1001';
  message.style.pointerEvents = 'none';
  message.style.whiteSpace = 'nowrap';
  
  document.body.appendChild(message);
  
  const animation = message.animate([
    { 
      transform: 'translateY(0) scale(1)',
      opacity: 1 
    },
    { 
      transform: 'translateY(-50px) scale(1.2)',
      opacity: 0 
    }
  ], {
    duration: 1500,
    easing: 'ease-out'
  });
  
  animation.onfinish = () => {
    if (message.parentNode) {
      message.remove();
    }
  };
}

// =============================================
// SISTEM MUSIK (Volume dihapus)
// =============================================

function initializeMusic() {
  const musicToggle = document.getElementById('music-toggle');
  
  bgMusic.volume = musicVolume;
  bgMusic.loop = true;
  
  const tryPlayMusic = () => {
    playMusic().catch(() => {
      musicToggle.style.background = 'linear-gradient(135deg, #ff6b9d, #ff4757)';
    });
  };
  
  setTimeout(tryPlayMusic, 1000);
  
  musicToggle.addEventListener('click', function() {
    if (isMusicPlaying) {
      bgMusic.pause();
      musicToggle.textContent = '🔇';
      musicToggle.style.background = '';
    } else {
      playMusic();
      musicToggle.textContent = '🎵';
      musicToggle.style.background = '';
    }
    isMusicPlaying = !isMusicPlaying;
    playSound(clickSound);
  });
}

function playMusic() {
  return bgMusic.play().then(() => {
    isMusicPlaying = true;
    document.getElementById('music-toggle').textContent = '🎵';
  }).catch(e => {
    console.log("Autoplay prevented");
  });
}

// =============================================
// SISTEM KUCING DENGAN SUARA BERBEDA (Tetap sama)
// =============================================

function initializeCats() {
  const cats = document.querySelectorAll('.cat');
  const meowSounds = {
    1: document.getElementById('meow-sound1'),
    2: document.getElementById('meow-sound2'),
    3: document.getElementById('meow-sound3'),
    4: document.getElementById('meow-sound4')
  };
  
  cats.forEach((cat) => {
    const soundId = cat.getAttribute('data-sound');
    
    cat.addEventListener('click', function(e) {
      e.stopPropagation();
      const img = this.querySelector('img');
      img.classList.add('jump');
      
      if (meowSounds[soundId]) {
        playSound(meowSounds[soundId]);
      }
      
      createCatEffect(this, soundId);
      
      setTimeout(() => img.classList.remove('jump'), 600);
    });
  });
}

function createCatEffect(catElement, soundId) {
  const effects = {
    1: { emoji: '🐟', color: '#ff6b9d' },
    2: { emoji: '🎀', color: '#a566ff' },
    3: { emoji: '🦴', color: '#72ddf7' },
    4: { emoji: '🍪', color: '#ffd166' }
  };
  
  const effect = effects[soundId] || { emoji: '✨', color: '#ffffff' };
  
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const emoji = document.createElement('div');
      emoji.textContent = effect.emoji;
      emoji.style.position = 'absolute';
      emoji.style.left = '50%';
      emoji.style.top = '50%';
      emoji.style.fontSize = '20px';
      emoji.style.zIndex = '30';
      emoji.style.pointerEvents = 'none';
      emoji.style.transform = 'translate(-50%, -50%)';
      
      catElement.appendChild(emoji);
      
      const angle = (i / 3) * Math.PI * 2;
      const distance = 40;
      
      const animation = emoji.animate([
        { 
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)'
        },
        { 
          opacity: 0,
          transform: `translate(${Math.cos(angle) * distance - 50}px, ${Math.sin(angle) * distance - 50}px) scale(1.5)`
        }
      ], {
        duration: 800,
        easing: 'ease-out'
      });
      
      animation.onfinish = () => {
        if (emoji.parentNode) {
          emoji.remove();
        }
      };
    }, i * 100);
  }
}

// =============================================
// SISTEM TOMBOL YANG BISA DIKLIK (Tetap sama)
// =============================================

function createButton(opt, index) {
  const btn = document.createElement("button");
  btn.textContent = opt.text;
  btn.className = "choice-btn";
  
  btn.style.pointerEvents = 'auto';
  btn.style.cursor = 'pointer';
  
  let clickAttempts = 0;
  const maxAttempts = 3;
  
  if (opt.runaway && !easyMode) {
    btn.classList.add('runaway');
    
    btn.addEventListener('mouseenter', function(e) {
      if (Math.random() < 0.7) {
        runAwayButton(this);
      }
    });
    
    btn.addEventListener('touchstart', function(e) {
      if (Math.random() < 0.6) {
        runAwayButton(this);
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    if (isTyping) return;
    
    if (opt.runaway && this.classList.contains('running')) {
      clickAttempts++;
      playSound(clickSound);
      
      this.style.background = `linear-gradient(135deg, #ff6b9d, #ff8bb5)`;
      
      if (clickAttempts >= maxAttempts) {
        easyMode = true;
        this.classList.add('easy-mode');
        this.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        createConfetti(this.getBoundingClientRect().left + this.offsetWidth / 2, 
                       this.getBoundingClientRect().top);
        
        showTemporaryMessage("Easy mode activated! 🎯", this);
      }
      return;
    }
    
    handleButtonClick(opt, this);
  });
  
  return btn;
}

function handleButtonClick(opt, button) {
  playSound(clickSound);
  
  button.style.transform = 'scale(0.95)';
  setTimeout(() => {
    button.style.transform = '';
  }, 150);
  
  if (opt.next !== null) {
    if (opt.next === -1) {
      showScreen('start');
    } else {
      setTimeout(() => showScene(opt.next), 300);
    }
  } else {
    endScene();
  }
}

function runAwayButton(button) {
  if (easyMode) return;
  
  button.classList.add('running');
  
  const movements = [
    { x: -30, y: -20 },
    { x: 25, y: -35 },
    { x: -35, y: 15 },
    { x: 30, y: 25 }
  ];
  
  const move = movements[Math.floor(Math.random() * movements.length)];
  button.style.transform = `translate(${move.x}px, ${move.y}px)`;
  
  setTimeout(() => {
    button.classList.remove('running');
    button.style.transform = '';
  }, 800);
}

// =============================================
// SISTEM SCENE DAN TYPING (Tetap sama)
// =============================================

function typeText(text, callback) {
  isTyping = true;
  textEl.innerHTML = "";
  let i = 0;
  
  const interval = setInterval(() => {
    if (text.charAt(i) === '<') {
      const tagEnd = text.indexOf('>', i);
      textEl.innerHTML += text.substring(i, tagEnd + 1);
      i = tagEnd + 1;
    } else {
      textEl.innerHTML += text.charAt(i);
      i++;
    }
    
    if (i >= text.length) {
      clearInterval(interval);
      isTyping = false;
      if (callback) callback();
    }
  }, typingSpeed);
}

function showScene(sceneIndex) {
  if (!currentScenes[sceneIndex]) return;
  
  currentScene = sceneIndex;
  card.classList.remove("active");

  setTimeout(() => {
    textEl.innerHTML = "";
    optionsEl.innerHTML = "";
    
    typeText(currentScenes[sceneIndex].text, () => {
      while (optionsEl.firstChild) {
        optionsEl.removeChild(optionsEl.firstChild);
      }
      
      currentScenes[sceneIndex].options.forEach((opt, index) => {
        const btn = createButton(opt, index);
        optionsEl.appendChild(btn);
      });
      
      updateProgressBar(sceneIndex);
    });
    
    setTimeout(() => card.classList.add("active"), 150);
  }, 400);
}

function updateProgressBar(sceneIndex) {
  let progressContainer = document.querySelector('.progress-container');
  if (!progressContainer) {
    progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressContainer.appendChild(progressBar);
    
    const sceneProgress = document.createElement('div');
    sceneProgress.className = 'scene-progress';
    
    currentScenes.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `progress-dot ${index <= sceneIndex ? 'active' : ''}`;
      sceneProgress.appendChild(dot);
    });
    
    progressContainer.appendChild(sceneProgress);
    const controls = document.querySelector('.controls');
    if (controls) {
      controls.prepend(progressContainer);
    }
  } else {
    const dots = progressContainer.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index <= sceneIndex);
    });
    
    const progressBar = progressContainer.querySelector('.progress-bar');
    const progress = (sceneIndex / (currentScenes.length - 1)) * 100;
    progressBar.style.width = progress + '%';
  }
}

function endScene() {
  textEl.innerHTML = "Terima kasih udah menghabiskan waktu bersamaku!<br><br>Ingat, kamu tuh amazing banget! 🌟<br>Jangan lupa istirahat yang cukup ya!";
  optionsEl.innerHTML = "";
  
  const restartBtn = document.getElementById("restart");
  if (restartBtn) {
    restartBtn.classList.remove("hidden");
  }
  
  createFireworks();
}

function createFireworks() {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      createFloatingHeart();
    }, i * 200);
  }
}

function createFloatingHeart() {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.innerHTML = '💖';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.fontSize = (Math.random() * 25 + 20) + 'px';
  heart.style.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
  document.body.appendChild(heart);
  
  const animation = heart.animate([
    { 
      bottom: '0', 
      opacity: 1,
      transform: 'scale(1) rotate(0deg)'
    },
    { 
      bottom: '100%', 
      opacity: 0,
      transform: `scale(1.5) rotate(${Math.random() * 360}deg)`,
      left: Math.random() * 50 + 25 + '%'
    }
  ], {
    duration: Math.random() * 4000 + 2000,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  });
  
  animation.onfinish = () => {
    if (heart.parentNode) {
      heart.remove();
    }
  };
}

function createConfetti(x, y) {
  const colors = ['#ff6b9d', '#a566ff', '#72ddf7', '#ffd166', '#4CAF50'];
  
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = x + 'px';
      confetti.style.top = y + 'px';
      confetti.style.width = '8px';
      confetti.style.height = '8px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '1000';
      
      document.body.appendChild(confetti);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 80;
      
      const animation = confetti.animate([
        { 
          transform: 'translate(0, 0) rotate(0deg)',
          opacity: 1
        },
        { 
          transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(360deg)`,
          opacity: 0
        }
      ], {
        duration: 800 + Math.random() * 400,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
      });
      
      animation.onfinish = () => {
        if (confetti.parentNode) {
          confetti.remove();
        }
      };
    }, i * 60);
  }
}

// =============================================
// SISTEM THEME TOGGLE (Tetap sama)
// =============================================

function initializeTheme() {
  const themeBtn = document.getElementById('theme-btn');
  if (!themeBtn) return;
  
  document.body.setAttribute('data-theme', currentTheme);
  themeBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  
  themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
    themeBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    playSound(clickSound);
    
    createInteractiveStars();
  });
}

// =============================================
// SISTEM SCREEN MANAGEMENT (Tetap sama)
// =============================================

function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  switch(screenName) {
    case 'loading':
      loadingScreen.classList.add('active');
      break;
    case 'start':
      startScreen.classList.add('active');
      const quoteElement = document.getElementById('random-quote');
      if (quoteElement) {
        quoteElement.textContent = getRandomMessage('motivation');
      }
      break;
    case 'chat':
      chatScreen.classList.add('active');
      break;
  }
}

// =============================================
// START BUTTON HANDLERS (Tetap sama)
// =============================================

function initializeStartButtons() {
  const motivationBtn = document.getElementById('btn-motivation');
  const sweetBtn = document.getElementById('btn-sweet');
  const surpriseBtn = document.getElementById('btn-surprise');
  
  if (motivationBtn) {
    motivationBtn.addEventListener('click', () => {
      currentCategory = 'motivation';
      currentScenes = sceneCategories.motivation;
      showScreen('chat');
      setTimeout(() => showScene(0), 500);
      playSound(clickSound);
    });
  }
  
  if (sweetBtn) {
    sweetBtn.addEventListener('click', () => {
      currentCategory = 'sweet';
      currentScenes = sceneCategories.sweet;
      showScreen('chat');
      setTimeout(() => showScene(0), 500);
      playSound(clickSound);
    });
  }
  
  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', () => {
      currentCategory = 'surprise';
      currentScenes = sceneCategories.surprise;
      showScreen('chat');
      setTimeout(() => showScene(0), 500);
      playSound(clickSound);
    });
  }
}

// =============================================
// NAVIGATION SYSTEM (Tetap sama)
// =============================================

function initializeNavigation() {
  const backBtn = document.getElementById('back-to-start');
  const restartBtn = document.getElementById('restart');
  
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showScreen('start');
      playSound(clickSound);
    });
  }
  
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      restartBtn.classList.add("hidden");
      showScene(0);
      playSound(clickSound);
    });
  }
}

// =============================================
// FUNGSI BANTUAN LAINNYA (Tetap sama)
// =============================================

function playSound(sound) {
  if (!sound) return;
  
  try {
    sound.currentTime = 0;
    sound.volume = 0.4;
    const playPromise = sound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log("Sound play failed:", e);
      });
    }
  } catch (e) {
    console.log("Sound error:", e);
  }
}

function getRandomMessage(category) {
  const messages = randomMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

function showTemporaryMessage(message, element, duration = 1500) {
  const msg = document.createElement('div');
  msg.textContent = message;
  msg.style.position = 'absolute';
  msg.style.background = 'rgba(0,0,0,0.8)';
  msg.style.color = 'white';
  msg.style.padding = '8px 12px';
  msg.style.borderRadius = '15px';
  msg.style.fontSize = '12px';
  msg.style.zIndex = '1001';
  msg.style.whiteSpace = 'nowrap';
  msg.style.top = '-40px';
  msg.style.left = '50%';
  msg.style.transform = 'translateX(-50%)';
  
  element.style.position = 'relative';
  element.appendChild(msg);
  
  setTimeout(() => {
    if (msg.parentNode) {
      msg.remove();
    }
  }, duration);
}

function preloadImages() {
  const images = [
    'ayes.jpg',
    'kucing4.png', 
    'kucing1.jpg',
    'kucing2.jpeg',
    'kucing3.jpg'
  ];
  
  return Promise.all(
    images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });
    })
  );
}

function preloadAudio() {
  return Promise.resolve();
}

// =============================================
// INISIALISASI SEMUA SISTEM (Diperbarui)
// =============================================

function initializeAllSystems() {
  console.log("🚀 Initializing enhanced systems...");
  
  showScreen('loading');
  
  Promise.all([
    preloadImages(),
    preloadAudio()
  ]).then(() => {
    // Initialize new systems
    initializeClock();
    initializeMissSlider();
    initializeClickHearts();
    
    // Initialize existing systems
    createInteractiveStars();
    initializeCats();
    initializeTheme();
    initializeStartButtons();
    initializeNavigation();
    initializeMusic();
    
    setTimeout(() => {
      showScreen('start');
      console.log("🎉 All enhanced systems initialized!");
    }, 1000);
  }).catch(error => {
    console.error("Initialization error:", error);
    showScreen('start');
  });
}

// =============================================
// START APPLICATION
// =============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log("📄 DOM fully loaded");
  setTimeout(initializeAllSystems, 100);
});

setTimeout(() => {
  if (document.querySelectorAll('.screen.active').length === 0) {
    console.log("🔄 Fallback initialization");
    initializeAllSystems();
  }
}, 1000);
