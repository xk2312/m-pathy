// === STUFE 1 – CURSOR TRAIL + LIQUID ENTER M ===

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let wrapper: HTMLElement;
let core: HTMLElement;

let width: number, height: number, dpr: number;
const particles: Particle[] = [];
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const maxParticles = isMobile ? 120 : 300;

let lastMove = Date.now();
let frameCounter = 0;
let lastTimestamp = performance.now();


interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
}

// === QUECKSILBER & LICHT MODUS – Ready for Dynamic Field Detection ===
let pulseGlowActive = false;
const pulseThreshold = 100; // pixel radius für Hover-Zentrum

function isCursorNearCore(x: number, y: number): boolean {
  const rect = core.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = x + rect.left - centerX;
  const dy = y + rect.top - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < pulseThreshold;
}


// === INIT CANVAS ===
function resizeCanvas(): void {
  dpr = window.devicePixelRatio || 1;
  width = canvas.width = canvas.offsetWidth * dpr;
  height = canvas.height = canvas.offsetHeight * dpr;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// === PARTICLE LOGIC ===
function createParticle(x: number, y: number): Particle {
  return {
    x,
    y,
    radius: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    opacity: Math.random() * 0.4 + 0.3,
  };
}

function initParticles(): void {
  particles.length = 0;
  for (let i = 0; i < maxParticles; i++) {
    particles.push(createParticle(Math.random() * width, Math.random() * height));
  }
}

function drawParticles(): void {
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

// === DYNAMIC SYSTEM ===
function animateParticles(): void {
  drawParticles();
  requestAnimationFrame(animateParticles);
}

function monitorPerformance(): void {
  const now = performance.now();
  const delta = now - lastTimestamp;
  frameCounter++;

  if (delta >= 1000) {
    const fps = (frameCounter / delta) * 1000;
    if (fps < 30 && particles.length > 100) {
      particles.splice(0, 50);
    }
    frameCounter = 0;
    lastTimestamp = now;
  }

  requestAnimationFrame(monitorPerformance);
}

function resetIfIdle(): void {
  setInterval(() => {
    if (Date.now() - lastMove > 60000) {
      initParticles();
    }
  }, 10000);
}

// === INTERAKTION ===
function handleMove(e: MouseEvent | TouchEvent): void {
  const rect = canvas.getBoundingClientRect();
  const input = (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : (e as MouseEvent);
  const x = input.clientX - rect.left;
  const y = input.clientY - rect.top;
  lastMove = Date.now();

  for (let i = 0; i < 4; i++) {
    particles.push(createParticle(x, y));
    if (particles.length > maxParticles) particles.shift();
  }

  const pulseBox = core.getBoundingClientRect();
  const insidePulse =
    x + rect.left >= pulseBox.left &&
    x + rect.left <= pulseBox.right &&
    y + rect.top >= pulseBox.top &&
    y + rect.top <= pulseBox.bottom;

  if (insidePulse) {
    core.classList.add("hover");
    core.textContent = "Enter M";
    core.style.boxShadow = "0 0 60px rgba(112,224,255,0.4)";
  } else {
    core.classList.remove("hover");
    core.removeAttribute("data-active");
    core.style.boxShadow = "";
  }
}

// === INIT ===
export function initStageOne(): void {
  canvas = document.getElementById("fractal-canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d")!;
  wrapper = document.getElementById("bloom-wrapper")!;
  core = document.getElementById("bloom-core")!;

  resizeCanvas();
  initParticles();
  animateParticles();
  monitorPerformance();
  resetIfIdle();

  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("mousemove", handleMove);
  canvas.addEventListener("touchmove", handleMove, { passive: true });
  canvas.addEventListener("touchstart", handleMove, { passive: true });

  core.addEventListener("click", () => {
    if (!core.classList.contains("hover")) return;
    core.textContent = "Entering...";
    core.style.transition = "all 0.8s ease";
    core.style.transform = "scale(1.3)";
    core.style.opacity = "0";

    setTimeout(() => {
      document.body.classList.add("stage-2");
      // ⚠️ Statt alles zu löschen, nur das Core-Element entfernen
      core.remove(); // oder: core.style.display = "none";
    }, 1000);
  });
}
