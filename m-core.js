const targetDate = new Date("2025-09-13T00:00:00+02:00").getTime();
let timerInterval = null;
let freqInterval = null;
let mSphereStarted = false;

const timerEl = document.getElementById("m-timer");
const freqEl = document.getElementById("m-freq-value");
const freqContainer = document.getElementById("m-frequency");
const logoEl = document.querySelector("h1");
const portalEl = document.getElementById("m-portal");
const glowEl = document.getElementById("m-glow");
const mSphere = document.getElementById("mSphere");

function formatTime(msLeft) {
  const totalSeconds = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
}

function updateTimer() {
  const now = Date.now();
  const diff = targetDate - now;
  if (diff <= 0) {
    timerEl.textContent = "00d 00h 00m 00s";
    clearInterval(timerInterval);
    fadeOutSound?.();
  } else {
    timerEl.textContent = formatTime(diff);
  }
}

function startTimer() {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

function generateFrequency() {
  const freqs = [396, 417, 432, 528, 639, 741, 852, 963];
  const selected = freqs[Math.floor(Math.random() * freqs.length)];
  freqEl.textContent = `Frequency: ${selected} Hz`;
  freqContainer.classList.add("show");
  freqEl.classList.add("flash");
  setTimeout(() => {
    freqContainer.classList.remove("show");
    freqEl.classList.remove("flash");
  }, 1500);
}

function startFrequencies() {
  freqInterval = setInterval(generateFrequency, 2000);
}

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
  }).catch(err => console.warn("Autoplay error:", err));
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

function activatePortal() {
  startMSphere();
  startTimer();
  startFrequencies();
  portalEl.classList.remove("m-hidden");
  setTimeout(() => {
    portalEl.classList.add("show");
    glowEl.classList.add("visible");
  }, 10);
}

window.addEventListener("DOMContentLoaded", () => {
  const welcomeAudio = document.getElementById("mWelcome");

  const portalStarter = () => {
    console.log("🔁 Triggering fallback portal activation");
    activatePortal();
  };

  if (welcomeAudio) {
    welcomeAudio.volume = 0.88;
    welcomeAudio.play()
      .then(() => console.log("[m–PATHY] Welcome audio playing."))
      .catch(err => {
        console.warn("Autoplay blocked:", err);
        portalStarter();
      });

    welcomeAudio.addEventListener("ended", () => {
      console.log("[m–PATHY] Welcome audio ended. Activating portal...");
      portalStarter();
    });
  } else {
    portalStarter();
  }

  setTimeout(() => {
    if (!timerInterval) {
      console.warn("⚠️ Timer not running — forcing start.");
      startTimer();
    }
  }, 3000);
});

// VOICE UPLOAD
const apiKey = 'A9825XwAURzeY9sIYkLiMz';
const client = filestack.init(apiKey);
document.getElementById('upload-voice').addEventListener('click', () => {
  client.picker({
    accept: ['.mp3', '.wav', '.m4a'],
    maxFiles: 1,
    onUploadDone: (res) => {
      const url = res.filesUploaded[0].url;
      document.getElementById('upload-result').innerText = 'Uploaded to: ' + url;
      console.log('Voice uploaded:', url);
    }
  }).open();
});
