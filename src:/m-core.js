// === CONFIGURATION ===
let time = 13 * 60; // 13 Minuten
let timerInterval = null;
let freqInterval = null;
let mSphereStarted = false;

// === DOM ELEMENTS ===
const timerEl = document.getElementById("timer");
const freqEl = document.getElementById("freq-value");
const freqContainer = document.getElementById("frequency");
const logoEl = document.querySelector("h1");
const portalEl = document.getElementById("portal");
const glowEl = document.getElementById("glow");
const mSphere = document.getElementById("mSphere");

// === UTILITY FUNCTIONS ===
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function startTimer() {
  updateTimer(); // Initial render
  timerInterval = setInterval(() => {
    if (time > 0) {
      time--;
      updateTimer();
    } else {
      clearInterval(timerInterval);
      fadeOutSound();
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = formatTime(time);
}

function generateFrequency() {
  const specialFrequencies = [396, 417, 432, 528, 639, 741, 852, 963];
  const freq = specialFrequencies[Math.floor(Math.random() * specialFrequencies.length)];
  freqEl.textContent = `Frequency: ${freq} Hz`;
  freqContainer.classList.add("show");

  // Visual Flash Feedback
  freqEl.classList.add("flash");
  setTimeout(() => {
    freqContainer.classList.remove("show");
    freqEl.classList.remove("flash");
  }, 1500);
}

function startFrequencies() {
  freqInterval = setInterval(generateFrequency, 2000);
}

function stopLoops() {
  clearInterval(timerInterval);
  clearInterval(freqInterval);
}

// === SOUND CONTROL ===
function startMSphere() {
  if (!mSphere || mSphereStarted) return;
  mSphere.loop = true;
  mSphere.volume = 0;
  mSphere.play().then(() => {
    mSphereStarted = true;
    const fade = setInterval(() => {
      if (mSphere.volume < 0.99) {
        mSphere.volume = Math.min(1, mSphere.volume + 0.01);
      } else {
        clearInterval(fade);
      }
    }, 50);
  }).catch((err) => {
    console.warn("Autoplay blocked or error:", err);
  });
}

function fadeOutSound() {
  if (!mSphere) return;
  const fade = setInterval(() => {
    if (mSphere.volume > 0.01) {
      mSphere.volume -= 0.01;
    } else {
      mSphere.pause();
      mSphere.currentTime = 0;
      clearInterval(fade);
    }
  }, 50);
}

// === MAIN ENTRY ===
function activatePortal() {
  startMSphere();
  startTimer();
  startFrequencies();

  portalEl.classList.remove("hidden");
  setTimeout(() => {
    portalEl.classList.add("show");
    glowEl.classList.add("visible");
  }, 10);
}

// === SINGLE CLICK HANDLER ===
let clickCooldown = false;
logoEl.addEventListener("click", () => {
  if (clickCooldown) return;
  clickCooldown = true;
  activatePortal();
  setTimeout(() => (clickCooldown = false), 1500); // debounce
});

// === CLEANUP on UNLOAD ===
window.addEventListener("beforeunload", () => {
  stopLoops();
});
