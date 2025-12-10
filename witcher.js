const pages = document.querySelectorAll('.page');
const audios = document.querySelectorAll('audio');
const dots = document.querySelectorAll('.dot');

let activeAudio = null;

// Per-page volume
const initialVolume = 0.15; // 👈 Change volume here (0.0 – 1.0)
const fadeInDuration = 2000; // ms (smooth fade)

// IntersectionObserver for scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const pageId = entry.target.id;

    // Update navigation dots
    dots.forEach(dot => dot.classList.remove('active'));
    document.querySelector(`.dot[data-target="#${pageId}"]`)?.classList.add('active');
  });
}, { threshold: 0.6});

pages.forEach(page => observer.observe(page));

// Navigation dots click
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.querySelector(dot.dataset.target);
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/******************************
 * GLOBAL BACKGROUND AUDIO PLAY
 ******************************/
const audio = document.getElementById("bg-audio");
let audioStarted = false;

function startAudio() {
  if (audioStarted || !audio) return;
  audioStarted = true;

  audio.volume = 0; // start silent
  audio.play().catch(err => console.warn("Autoplay blocked:", err));

  // Smooth fade-in
  const stepTime = 50;
  const steps = fadeInDuration / stepTime;
  const volumeStep = initialVolume / steps;

  const fadeInterval = setInterval(() => {
    audio.volume = Math.min(audio.volume + volumeStep, initialVolume);
    if (audio.volume >= initialVolume) clearInterval(fadeInterval);
  }, stepTime);

  // Remove listeners once triggered
  removeAudioListeners();
}

// Remove triggers after start
function removeAudioListeners() {
  ["wheel", "touchmove", "click", "keydown"].forEach(evt =>
    document.removeEventListener(evt, startAudio)
  );
}

/*
  Active gesture triggers for all platforms:
  - wheel: mouse scroll (desktop)
  - touchmove: finger scroll (mobile)
  - click: any click (button or anywhere)
  - keydown: PageDown/Arrow scroll
*/
document.addEventListener("wheel", startAudio, { passive: true });
document.addEventListener("touchmove", startAudio, { passive: true });
document.addEventListener("click", startAudio);
document.addEventListener("keydown", startAudio);



// Enable audio button
document.getElementById('enable-sound').addEventListener('click', () => {
  if (activeAudio) activeAudio.play();
  else audios[0].play();

  document.getElementById('enable-sound').style.display = 'none';
});
