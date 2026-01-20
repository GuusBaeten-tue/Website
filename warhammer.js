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

// Enemy armies
// --- Page initialization ---
const page3 = document.getElementById('page3');
const navList = page3.querySelector('.army-nav__list');
const background = page3.querySelector('.army-visual__background');
const foreground = page3.querySelector('.army-visual__foreground');
const arrowLeft = page3.querySelector('.army-arrow-left');
const arrowRight = page3.querySelector('.army-arrow-right');
const descriptionText = page3.querySelector('.army-description__text');

const armyItems = Array.from(navList.querySelectorAll('.army-nav__item'));
let currentArmyIndex = armyItems.findIndex(item => item.classList.contains('active'));
let currentFgIndex = 0;

// Get foregrounds array
function getFgImages(item) {
  return item.dataset.fg.split(',').map(s => s.trim());
}

// Set army visuals + description
function setArmy(index, fgIndex = 0, updateDescription = true) {
  if (index < 0) index = armyItems.length - 1;
  if (index >= armyItems.length) index = 0;
  currentArmyIndex = index;

  const item = armyItems[currentArmyIndex];
  const fgImages = getFgImages(item);

  if (fgIndex < 0) fgIndex = fgImages.length - 1;
  if (fgIndex >= fgImages.length) fgIndex = 0;
  currentFgIndex = fgIndex;

  // Update nav active class
  armyItems.forEach(i => i.classList.remove('active'));
  item.classList.add('active');

  // Update background
  background.style.backgroundImage = `url("${item.dataset.bg}")`;

  // Update foreground with fade
  foreground.style.opacity = 0;
  setTimeout(() => {
    foreground.src = fgImages[currentFgIndex];
    foreground.style.opacity = 1;
  }, 300);

  // Update description **only if flag is true**
  if (updateDescription) {
    descriptionText.style.opacity = 0;
    setTimeout(() => {
      descriptionText.textContent = item.dataset.description || '';
      descriptionText.style.opacity = 1;
    }, 300);
  }
}
// Initialize
setArmy(currentArmyIndex);

// Nav click
navList.addEventListener('click', e => {
  const item = e.target.closest('.army-nav__item');
  if (!item) return;
  const index = armyItems.indexOf(item);
  setArmy(index, 0, true); // true = update description
});


// Arrow buttons
arrowLeft.addEventListener('click', () => {
  setArmy(currentArmyIndex, currentFgIndex - 1, false); // false = don't update description
});

arrowRight.addEventListener('click', () => {
  setArmy(currentArmyIndex, currentFgIndex + 1, false); // false = don't update description
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


// Enable audio button
document.getElementById('enable-sound').addEventListener('click', () => {
  if (activeAudio) activeAudio.play();
  else audios[0].play();

  document.getElementById('enable-sound').style.display = 'none';
});
