console.log("SCRIPT LOADED");

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
/*****************************************
 * Navigation dots click
 *****************************************/
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.querySelector(dot.dataset.target);
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/*****************************************
 * MASTER AUDIO TOGGLE BUTTON WITH FADE
 *****************************************/
 document.addEventListener("DOMContentLoaded", () => {

   const audio = document.getElementById("bg-audio");
   const btn = document.getElementById("audio-toggle");

   if (!audio) {
     console.error("Audio element #bg-audio NOT FOUND");
     return;
   } else {
     console.log("Audio element found");
   }

   if (!btn) {
     console.error("Button #audio-toggle NOT FOUND");
     return;
   } else {
     console.log("Button element found");
   }

   let audioPlaying = false;

   // Settings
   const targetVolume = 0.45;   // Volume when playing
   const fadeDuration = 1000;   // ms fade in/out


   // Fade function
   function fadeAudio(target) {
     const stepTime = 50;
     const steps = fadeDuration / stepTime;
     const volumeStep = (target - audio.volume) / steps;

     const interval = setInterval(() => {
       audio.volume = Math.min(Math.max(audio.volume + volumeStep, 0), targetVolume);

       if ((volumeStep > 0 && audio.volume >= target) ||
           (volumeStep < 0 && audio.volume <= target)) {
         clearInterval(interval);
         audio.volume = target;
       }
     }, stepTime);
   }


   // Toggle handler
   function toggleAudio() {
     if (!audioPlaying) {
       // Turn ON
       console.log("Turning audio on");
       audioPlaying = true;
       audio.volume = 0;
       audio.play().catch(err => console.error("Audio failed to play:", err));
       fadeAudio(targetVolume);
       btn.textContent = "⏹️ Stop Audio";

     } else {
       // Turn OFF
       console.log("Turning audio off");
       audioPlaying = false;
       fadeAudio(0);

       setTimeout(() => {
         if (!audioPlaying) {
           audio.pause();
           audio.currentTime = 0;
         }
       }, fadeDuration);

       btn.textContent = "▶️ Play Audio";
     }
   }

   btn.addEventListener("click", toggleAudio);

 });
