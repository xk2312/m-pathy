// === CONFIGURATION ===
const targetDate = new Date("2025-09-13T00:00:00").getTime();
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
function formatTime(msLeft) {
  const totalSeconds = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}


function startTimer() {
  updateTimer(); // first render
  timerInterval = setInterval(() => {
    updateTimer();
  }, 1000);
}

function updateTimer() {
  const now = Date.now();
  const diff = targetDate - now;

  if (diff <= 0) {
    timerEl.textContent = "00d 00:00:00";
    clearInterval(timerInterval);
    fadeOutSound();
  } else {
    timerEl.textContent = formatTime(diff);
  }
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
const filestackClient = filestack.init('A9825XwAURzeY9sIYkLiMz');

document.getElementById('voiceUpload').addEventListener('click', () => {
  filestackClient.picker({
    accept: ['audio/*'],
    fromSources: ['local_file_system', 'url', 'audio'],
    onUploadDone: (result) => {
      console.log('Upload result:', result);
      const audioURL = result.filesUploaded[0].url;
      console.log('Audio URL:', audioURL);
    },
  }).open();
});
const apiKey = 'A9825XwAURzeY9sIYkLiMz'; // Dein API-Key
const client = filestack.init(apiKey);

const uploadBtn = document.createElement('button');
uploadBtn.textContent = 'Upload Your Voice';
uploadBtn.id = 'upload-voice';
document.getElementById('portal').appendChild(uploadBtn);

uploadBtn.addEventListener('click', () => {
  client.picker({
    accept: ['audio/*'],
    onUploadDone: (result) => {
      const audioUrl = result.filesUploaded[0].url;
      console.log('Voice uploaded:', audioUrl);

      fetch('http://5.161.70.239:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: audioUrl })
      })
      .then(res => res.text())
      .then(res => console.log('Server response:', res))
      .catch(err => console.error('Server error:', err));
      

      const voicePlayer = new Audio(audioUrl);
      voicePlayer.autoplay = true;
      voicePlayer.controls = true;

      // Optional: einfügen ins DOM
      const portal = document.getElementById('portal');
      portal.appendChild(voicePlayer);
    },
  }).open();
});
//<!-- CAPSULA: AUDIO-LOGIC -->

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
          portalStarter(); // Fallback
        });

      welcomeAudio.addEventListener("ended", () => {
        console.log("[m–PATHY] Welcome audio ended. Activating portal...");
        portalStarter();
      });
    } else {
      portalStarter(); // Fallback
    }
  });


