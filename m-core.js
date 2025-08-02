// === CONFIGURATION ===
const targetDate = new Date("2025-09-13T00:00:00+02:00").getTime(); // +02:00 = MESZ (Mitteleuropäische Sommerzeit)
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

// === TIMER ===
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
    fadeOutSound?.(); // fallback safe
  } else {
    timerEl.textContent = formatTime(diff);
  }
}

function startTimer() {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}



// === FREQUENCY ===
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

// === SOUND ===
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

// === PORTAL ===
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

// === CLICK HANDLER ===
let clickCooldown = false;
logoEl.addEventListener("click", () => {
  if (clickCooldown) return;
  clickCooldown = true;
  activatePortal();
  setTimeout(() => clickCooldown = false, 1500);
});

// === UNLOAD CLEANUP ===
window.addEventListener("beforeunload", () => {
  clearInterval(timerInterval);
  clearInterval(freqInterval);
});

// === VOICE UPLOAD (Filestack) ===
const apiKey = 'A9825XwAURzeY9sIYkLiMz';
const client = filestack.init(apiKey);

const uploadBtn = document.createElement('button');
uploadBtn.textContent = 'Upload Your Voice';
uploadBtn.id = 'upload-voice';
document.getElementById('portal').appendChild(uploadBtn);

uploadBtn.addEventListener('click', () => {
  client.picker({
    accept: ['audio/*'],
    onUploadDone: result => {
      const audioUrl = result.filesUploaded[0].url;
      console.log('Voice uploaded:', audioUrl);

      fetch('http://5.161.70.239:5000/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: audioUrl })
      })
      .then(res => res.text())
      .then(res => console.log('Server response:', res))
      .catch(err => console.error('Server error:', err));

      const voicePlayer = new Audio(audioUrl);
      voicePlayer.autoplay = true;
      voicePlayer.controls = true;
      document.getElementById('portal').appendChild(voicePlayer);
    }
  }).open();
});

// === WELCOME AUDIO ===
window.addEventListener("DOMContentLoaded", () => {
  const welcomeAudio = document.getElementById("mWelcome");
  const portalStarter = () => {
    if (typeof activatePortal === "function") {
      activatePortal();
    } else {
      console.warn("activatePortal() not found");
    }
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
});
