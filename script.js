/* ================= GLOBAL ================= */
let fireworksCount = 0;
let biggestExplosion = 0;

/* ================= COUNTDOWN (AMAN) ================= */
function initCountdown() {
  let targetYear = new Date().getFullYear() + 1;

  function updateTitle() {
    const title = document.querySelector(".countdown-container h2");
    if (title) {
      title.textContent = `Hitungan Mundur Menuju ${targetYear}`;
    }
  }

  function updateCountdown() {
    const now = new Date();
    let targetDate = new Date(targetYear, 0, 1, 0, 0, 0);
    let diff = targetDate - now;

    // kalau sudah lewat tahun baru → pindah ke tahun berikutnya
    if (diff <= 0) {
      targetYear++;
      updateTitle();
      targetDate = new Date(targetYear, 0, 1, 0, 0, 0);
      diff = targetDate - now;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = days.toString().padStart(2, "0");
    document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
  }

  updateTitle();
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ================= FIREWORK CANVAS (UPGRADE ONLY) ================= */
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];
let stars = [];

/* STAR BACKGROUND */
for (let i = 0; i < 120; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.15 + 0.05
  });
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

/* ================= PETASAN BARU ================= */
function launchFirework(x, y) {
  const baseHue = Math.random() * 360;
  const count = 90;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = random(2.5, 7);

    particles.push({
      x: x || random(100, canvas.width - 100),
      y: y || random(80, canvas.height / 2),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.045,
      alpha: 1,
      decay: random(0.008, 0.015),
      size: random(1.5, 3),
      color: `hsl(${baseHue + random(-25, 25)},100%,65%)`
    });
  }

  const sound = document.getElementById("fireworkSound");
  if (sound) {
    sound.currentTime = 0;
    sound.volume = 0.5;
    sound.play().catch(() => {});
  }
}

/* ================= ANIMATION ================= */
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // stars
  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > canvas.height) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();
  });

  // fireworks
  particles.forEach((p, i) => {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color.replace(")", `,${p.alpha})`).replace("hsl", "hsla");
    ctx.fill();

    if (p.alpha <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}
animate();

/* ================= INTERACTION ================= */
const fireworksArea = document.getElementById("fireworksArea");
fireworksArea.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  launchFirework(e.clientX - rect.left, e.clientY - rect.top);
});

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();

  const bgm = document.getElementById("backgroundMusic");
  bgm.volume = 0.3;
  document.body.addEventListener("click", () => {
    if (bgm.paused) bgm.play().catch(() => {});
  }, { once: true });
});

