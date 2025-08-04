// === STUFE 1 – CURSOR TRAIL + PULSE (Iteration 130) ===

// === TEIL A – DOM & CANVAS INITIALIZATION ===
const wrapper = document.getElementById("bloom-wrapper");
const core = document.getElementById("bloom-core");
const canvas = document.getElementById("fractal-canvas");
const ctx = canvas.getContext("2d");

let width, height, dpr;
const particles = [];
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const maxParticles = isMobile ? 120 : 300;

function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  width = canvas.width = canvas.offsetWidth * dpr;
  height = canvas.height = canvas.offsetHeight * dpr;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// === TEIL B – PARTICLE SYSTEM ===
function createParticle(x, y) {
  return {
    x,
    y,
    radius: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    opacity: Math.random() * 0.4 + 0.3,
  };
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
    }
  }
}

function animateParticles() {
  drawParticles();
  requestAnimationFrame(animateParticles);
}

// === TEIL C – CURSOR/TOUCH MOVE + PULSE INTERAKTION ===
function handleMove(e) {
  const rect = canvas.getBoundingClientRect();
  const input = e.touches ? e.touches[0] : e;
  const x = input.clientX - rect.left;
  const y = input.clientY - rect.top;

  for (let i = 0; i < 4; i++) {
    particles.push(createParticle(x, y));
    if (particles.length > maxParticles) particles.shift();
  }

  const pulseBox = core.getBoundingClientRect();
  const insidePulse = x + rect.left >= pulseBox.left && x + rect.left <= pulseBox.right && y + rect.top >= pulseBox.top && y + rect.top <= pulseBox.bottom;

  if (insidePulse) {
    core.classList.add("hover");
    core.textContent = "Enter M";
    core.style.boxShadow = "0 0 60px rgba(112,224,255,0.4)";
  } else {
    core.classList.remove("hover");
    core.textContent = "";
    core.style.boxShadow = "";
  }
}

function initStageOne() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("mousemove", handleMove);
  canvas.addEventListener("touchmove", handleMove, { passive: true });
  canvas.addEventListener("touchstart", handleMove, { passive: true });
  animateParticles();

  core.addEventListener("click", () => {
    if (!core.classList.contains("hover")) return;
    core.textContent = "Entering...";
    core.style.transition = "all 0.8s ease";
    core.style.transform = "scale(1.3)";
    core.style.opacity = "0";

    setTimeout(() => {
      document.body.classList.add("stage-2");
      wrapper.innerHTML = "";
    }, 1000);
  });
}

window.addEventListener("DOMContentLoaded", initStageOne);