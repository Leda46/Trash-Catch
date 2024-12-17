// Get HTML elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const rulesScreen = document.getElementById('rulesScreen');
const customizeScreen = document.getElementById('customizeScreen');
const endScreen = document.getElementById('endScreen');
const hud = document.getElementById('hud');
const finalScore = document.getElementById('finalScore');

// Canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Background clouds
const clouds = Array.from({ length: 5 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * (canvas.height / 2),
  speed: Math.random() * 1 + 0.5,
}));



// Game variables
let score = 0;
let timer = 60;
let gameRunning = false;
let binColor = '#517b56'; // Default bin color

// Bin properties
const bin = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 100,
  width: 60,
  height: 90,
  color: binColor,
  speed: 10,
};

// Trash array
let trash = [];
const trashImages = [
  'https://media.lordicon.com/icons/wired/lineal/1391-paper-waste.svg',
  'https://media.lordicon.com/icons/wired/lineal/1401-metal-waste.svg',
  'https://media.lordicon.com/icons/wired/lineal/1403-glass-waste.svg',
];
const trashImageElements = trashImages.map((src) => {
  const img = new Image();
  img.src = src;
  return img;
});

// Add trash periodically
function addTrash() {
  const x = Math.random() * (canvas.width - 30);
  const img = trashImageElements[Math.floor(Math.random() * trashImageElements.length)];
  trash.push({ x: x, y: 0, width: 30, height: 30, speed: Math.random() * 3 + 2, img });
}
let trashInterval;

// Draw Functions
function drawBin() {
  ctx.fillStyle = bin.color;
  ctx.fillRect(bin.x, bin.y, bin.width, bin.height);
}

function drawTrash() {
  trash.forEach((t) => {
    ctx.drawImage(t.img, t.x, t.y, t.width, t.height);
    t.y += t.speed;
  });
}

// Moving clouds
function drawClouds() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  clouds.forEach((cloud) => {
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, 50, 0, Math.PI * 2);
    ctx.fill();

    cloud.x += cloud.speed;
    if (cloud.x > canvas.width) cloud.x = -50;
  });
}

// Check collisions
function checkCollisions() {
  for (let i = trash.length - 1; i >= 0; i--) {
    const t = trash[i];
    if (t.y + t.height >= bin.y && t.x + t.width >= bin.x && t.x <= bin.x + bin.width) {
      score++;
      trash.splice(i, 1);
    } else if (t.y > canvas.height) {
      trash.splice(i, 1);
    }
  }
}

// HUD Update
function updateHUD() {
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('timer').textContent = `Time Left: ${timer}s`;
}

// Timer countdown
function startTimer() {
  const timerInterval = setInterval(() => {
    if (timer > 0) {
      timer--;
      updateHUD();
    } else {
      clearInterval(timerInterval);
      gameOver();
    }
  }, 1000);
}

// Game Over
function gameOver() {
  gameRunning = false;
  clearInterval(trashInterval);
  trash = [];
  canvas.style.display = 'none';
  hud.style.display = 'none';
  endScreen.style.display = 'flex';
  finalScore.textContent = `Your final score is: ${score}`;
}

// Player Movement
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && bin.x > 0) {
    bin.x -= bin.speed;
  } else if (e.key === 'ArrowRight' && bin.x + bin.width < canvas.width) {
    bin.x += bin.speed;
  }
});

// Game Loop
function gameLoop() {
  if (!gameRunning) return;
  // Draw background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawClouds()
  drawBin();
  drawTrash();
  checkCollisions();
  updateHUD();
  requestAnimationFrame(gameLoop);
}

// Start Game
function startGame() {
  score = 0;
  timer = 60;
  trash = [];
  gameRunning = true;
  startScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  customizeScreen.style.display = 'none';
  endScreen.style.display = 'none';
  canvas.style.display = 'block';
  hud.style.display = 'block';
  trashInterval = setInterval(addTrash, 1000);
  startTimer();
  gameLoop();
}

// Customize Bin
function customizeBin() {
  drawClouds()
  startScreen.style.display = 'none';
  customizeScreen.style.display = 'flex';
}

// Show Rules Screen
function showRules() {
  drawClouds()
  startScreen.style.display = 'none';
  rulesScreen.style.display = 'flex';
}

function saveCustomization() {
  bin.color = document.getElementById('binColor').value;
  drawClouds()
  backToStart();
}


// Back to Start Screen
function backToStart() {
  drawClouds()
  startScreen.style.display = 'flex';
  customizeScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  endScreen.style.display = 'none';
}




