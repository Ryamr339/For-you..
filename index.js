const textEl = document.getElementById("text");
const optionsEl = document.getElementById("choices");
const card = document.getElementById("card");
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const meowSound = document.getElementById("meow-sound");
const particlesCanvas = document.getElementById("particles");
const ctx = particlesCanvas.getContext('2d');

// Set canvas size
particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;

// Particles system
const particles = [];
const particleCount = 80;

class Particle {
  constructor() {
    this.x = Math.random() * particlesCanvas.width;
    this.y = Math.random() * particlesCanvas.height;
    this.size = Math.random() * 6 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 200 + 55)}, ${Math.random() * 0.6 + 0.2})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > particlesCanvas.width) this.x = 0;
    else if (this.x < 0) this.x = particlesCanvas.width;
    if (this.y > particlesCanvas.height) this.y = 0;
    else if (this.y < 0) this.y = particlesCanvas.height;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Scene data - TEXT LEBIH NATURAL & GA BAKU
const scenes = [
  {
    text: "Hai bocill... how's your day? lu keliatan agak lemes, capek ya?",
    options: [
      { text: "Iya bang, capek beneran... banyak tugas, quiz, sama presentasi...", next: 1 },
      { text: "Lumayan lah, ada aja masalah yang bikin pusing tapi masih bisa handle", next: 2 }
    ]
  },
  {
    text: "Waduh.. gw bisa bayangin... tapi tau gak sih? lu tuh kuat banget... meski capek, tetep bisa jalanin hari gw respect banget deh! :)",
    options: [
      { text: "Huhu makasih bang 😭 pengen istirahat dulu sih sebenernya", next: 3 },
      { text: "Hehe iya ya? Kalo dipikir-pikir emang gw tahan banting sih 😎", next: 4 }
    ]
  },
  {
    text: "Wkwkwk yahh lu banget itu mah.. pasti ada aja masalah.. tapi jangan dipendem sendiri ya kalo ada yang berat... kadang kita emang perlu slow down dikit dan cerita-cerita :))",
    options: [
      { text: "Bener juga sih... mungkin gw perlu istirahat dulu", next: 3 },
      { text: "Nanti aja deh, masih ada energi buat lanjut dikit", next: 4 }
    ]
  },
  {
    text: "heemm.. baguss ingett..istirahat itu penting banget.. dunia gak akan kemana-mana kok... yang penting lu happy dan sehat.. itu yang paling penting cil..",
    options: [
      { text: "Iya deh, gw ambil napas dulu ya bang", next: 5 },
      { text: "Oke, nanti gw istirahat setelah ini", next: 5 }
    ]
  },
  {
    text: "kali ini gw iyain dah... tapi inget ya cill.. lu tuh berharga banget... jangan sampe ngerasa kurang only karena lu lagi capek.. you're doing great..",
    options: [
      { text: "Wih, keren keren..", next: 5 },
      { text: "Makasih banget ya.. gw jadi semangat lagi :)", next: 5 }
    ]
  },
  {
    text: "yahh..cill, gw mau minta maaf.. kalo gw banyak salah tutur kata, ngecewain, buat lu marahh.. gw bakal nyoba jadi lebih baik lagi :))",
    options: [
      { text: "Gak usah minta maaf.. lu gak salah kok..", next: 6 },
      { text: "Gak bakal gw maafin >:(", next: 6 }
    ]
  },
  {
    text: "Hwhw anytime.. kapan-kapan kalo butuh temen ngobrol, cuma mau cerita random atau pasangan hidup... gw bakal ada kok.. now go get some rest! 🛌✨",
    options: [
      { text: "siap bang... good night and thank you 🌙", next: 7 },
      { text: "oke bang.. sampai ketemu lagi besok 😴", next: 7 }
    ]
  },
  {
    text: "have a sweet dreams yaa ayes... inget besok hari baru dengan kesempatan baru... lu pasti bisa handle apapun masalah yang bakal dateng.. 💫🦋<br><br>Jangan lupa bahagia ya!",
    options: [
      { text: "BYEEE :)))", next: 0 }
    ]
  }
];

let typingSpeed = 30;
let currentScene = 0;
let isTyping = false;

function playSound(sound) {
  sound.currentTime = 0;
  sound.volume = 0.3;
  sound.play().catch(e => console.log("Sound play failed:", e));
}

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

function createButton(opt, sceneIndex) {
  const btn = document.createElement("button");
  btn.textContent = opt.text;
  btn.className = "choice-btn";
  btn.onclick = () => {
    if (isTyping) return; // Prevent clicking while typing
    
    playSound(clickSound);
    
    // Add click feedback
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
    
    if (opt.next !== null) {
      setTimeout(() => showScene(opt.next), 300);
    } else {
      endScene();
    }
  };
  
  // Add hover effects
  btn.addEventListener('mouseenter', () => {
    if (!isTyping) {
      btn.style.transform = 'translateY(-4px) scale(1.05)';
    }
  });
  
  btn.addEventListener('mouseleave', () => {
    if (!isTyping) {
      btn.style.transform = '';
    }
  });
  
  return btn;
}

function showScene(sceneIndex) {
  const scene = scenes[sceneIndex];
  if (!scene) return;
  
  currentScene = sceneIndex;
  
  card.classList.remove("active");

  setTimeout(() => {
    textEl.innerHTML = "";
    optionsEl.innerHTML = "";
    
    typeText(scene.text, () => {
      // Clear previous buttons first
      optionsEl.innerHTML = "";
      
      // Create new buttons
      scene.options.forEach(opt => {
        const btn = createButton(opt, sceneIndex);
        optionsEl.appendChild(btn);
      });
      
      // Add progress bar
      const progress = (sceneIndex / (scenes.length - 1)) * 100;
      updateProgressBar(progress);
    });
    
    setTimeout(() => card.classList.add("active"), 150);
  }, 400);
}

function updateProgressBar(progress) {
  let progressBar = document.querySelector('.progress-bar');
  if (!progressBar) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressContainer.appendChild(progressBar);
    document.querySelector('.controls').prepend(progressContainer);
  }
  progressBar.style.width = progress + '%';
}

function endScene() {
  textEl.innerHTML = "Terima kasih udah mau curhat dan ngobrol sama gw!<br><br>Ingat, lu tuh amazing banget! 🌟<br>Jangan lupa istirahat yang cukup ya!";
  optionsEl.innerHTML = "";
  
  document.getElementById("restart").classList.remove("hidden");
  
  // Special ending effect
  createFireworks();
}

function createFireworks() {
  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      createFloatingHeart();
    }, i * 150);
  }
}

function createFloatingHeart() {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.innerHTML = '<i class="fas fa-heart"></i>';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.bottom = '0';
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
  
  animation.onfinish = () => heart.remove();
}

// Cat interactions - FIXED
function initializeCats() {
  document.querySelectorAll('.cat').forEach((cat, index) => {
    // Remove existing event listeners
    const newCat = cat.cloneNode(true);
    cat.parentNode.replaceChild(newCat, cat);
    
    newCat.addEventListener('click', function() {
      const img = this.querySelector('img');
      img.classList.add('jump');
      
      // Different sounds for different cats
      playSound(meowSound);
      
      // Create paw effect
      createPawEffect(this);
      
      setTimeout(() => img.classList.remove('jump'), 600);
    });
  });
}

function createPawEffect(catElement) {
  const paw = document.createElement('div');
  paw.innerHTML = '🐾';
  paw.style.position = 'absolute';
  paw.style.left = '50%';
  paw.style.top = '50%';
  paw.style.fontSize = '100px';
  paw.style.zIndex = '30';
  paw.style.pointerEvents = 'none';
  catElement.appendChild(paw);
  
  const animation = paw.animate([
    { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
    { opacity: 0, transform: 'translate(-50%, -100%) scale(1.5)' }
  ], {
    duration: 800,
    easing: 'ease-out'
  });
  
  animation.onfinish = () => paw.remove();
}

// Restart button - FIXED
function initializeRestartButton() {
  const restartBtn = document.getElementById("restart");
  
  // Remove existing event listeners
  const newRestartBtn = restartBtn.cloneNode(true);
  restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
  
  newRestartBtn.addEventListener("click", () => {
    playSound(clickSound);
    newRestartBtn.classList.add("hidden");
    showScene(0);
  });
}

// Handle window resize
window.addEventListener('resize', () => {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
});

// Music upload functionality - FIXED
function initializeMusicUpload() {
  const musicInput = document.createElement('input');
  musicInput.type = 'file';
  musicInput.accept = 'audio/*';
  musicInput.style.display = 'none';
  musicInput.id = 'music-input';
  document.body.appendChild(musicInput);

  const musicLabel = document.createElement('div');
  musicLabel.innerHTML = '<i class="fas fa-music"></i>';
  musicLabel.className = 'music-control';
  musicLabel.style.position = 'fixed';
  musicLabel.style.top = '20px';
  musicLabel.style.right = '20px';
  musicLabel.style.background = 'rgba(255,255,255,0.9)';
  musicLabel.style.borderRadius = '50%';
  musicLabel.style.width = '50px';
  musicLabel.style.height = '50px';
  musicLabel.style.display = 'flex';
  musicLabel.style.alignItems = 'center';
  musicLabel.style.justifyContent = 'center';
  musicLabel.style.cursor = 'pointer';
  musicLabel.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
  musicLabel.style.zIndex = '100';
  musicLabel.style.transition = 'all 0.3s ease';
  musicLabel.title = 'Upload Lagu';

  musicLabel.addEventListener('click', () => {
    musicInput.click();
  });

  musicLabel.addEventListener('mouseenter', () => {
    musicLabel.style.transform = 'scale(1.1)';
    musicLabel.style.background = 'rgba(255,255,255,1)';
  });

  musicLabel.addEventListener('mouseleave', () => {
    musicLabel.style.transform = 'scale(1)';
    musicLabel.style.background = 'rgba(255,255,255,0.9)';
  });

  musicInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      bgMusic.src = url;
      bgMusic.volume = 0.4;
      bgMusic.play().catch(e => console.log("Music play failed:", e));
      musicLabel.innerHTML = '<i class="fas fa-pause"></i>';
      musicLabel.style.background = 'linear-gradient(135deg, #ff6b9d, #a566ff)';
      musicLabel.style.color = 'white';
    }
  });

  document.body.appendChild(musicLabel);
}

// Auto-play when music is loaded
bgMusic.addEventListener('loadeddata', () => {
  bgMusic.volume = 0.4;
  bgMusic.play().catch(e => console.log("Auto-play failed, waiting for interaction"));
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeCats();
  initializeRestartButton();
  initializeMusicUpload();
  
  // Start the experience
  showScene(0);

  // Add some initial floating hearts
  setTimeout(() => {
    for (let i = 0; i < 8; i++) {
      setTimeout(createFloatingHeart, i * 300);
    }
  }, 1000);
});

// Fallback initialization
setTimeout(() => {
  initializeCats();
  initializeRestartButton();
}, 100);

