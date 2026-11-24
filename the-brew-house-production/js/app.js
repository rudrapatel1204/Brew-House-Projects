/**
 * ====================================================================
 * MAIN APPLICATION ORCHESTRATOR
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.BIRTHDAY_CONFIG;

  // 1. Initialize Particles & Butterflies
  window.particleEngine = new ParticleEngine();

  // 2. Sequential Fairy Light Bulbs Animation in Opening Scene
  initFairyLights();

  // 3. Initialize Birthday Countdown & Curtain Panels
  window.birthdayCountdown = new BirthdayCountdown(config);

  // 4. Initialize Hero Photo Reveal
  initPhotoReveal(config);

  // 5. Initialize Galleries (Hanging & Editorial) + Lightbox
  window.galleryManager = new GalleryManager(config);

  // 6. Initialize Digital Scrapbook
  window.digitalScrapbook = new DigitalScrapbook(config);

  // 7. Initialize Interactive 3D Photo World
  window.threeWorld = new ThreeWorld(config);

  // 8. Initialize Spotify-style Music Player
  window.musicPlayer = new BirthdayMusicPlayer(config);

  // 9. Additional Features: Progress Bar, Back-To-Top, Secret Modal, Accessibility
  initAdditionalFeatures(config);

  // 10. Hide Preloader smoothly
  hidePreloader();
});

// Sequential Fairy Lights
function initFairyLights() {
  const bulbs = document.querySelectorAll('.fairy-bulb .bulb-glass');
  bulbs.forEach((bulb, idx) => {
    // Start with low light
    bulb.classList.add('bulb-off');
    // Turn on one by one
    setTimeout(() => {
      bulb.classList.remove('bulb-off');
      bulb.style.filter = 'drop-shadow(0 0 16px rgba(255, 220, 130, 0.95))';
    }, 600 + idx * 280);
  });
}

// Dedicated Photo Reveal
function initPhotoReveal(config) {
  const revealBtn = document.getElementById('reveal-photo-btn');
  const mysteryCard = document.getElementById('photo-mystery-card');
  const revealedCard = document.getElementById('photo-revealed-card');
  const revealImg = document.getElementById('reveal-img');
  const revealCaption = document.getElementById('reveal-caption');

  if (revealImg) revealImg.src = config.photoReveal.image;
  if (revealCaption) revealCaption.textContent = config.photoReveal.caption;

  if (revealBtn && mysteryCard && revealedCard) {
    revealBtn.addEventListener('click', (e) => {
      mysteryCard.classList.add('hidden');
      revealedCard.classList.remove('hidden');
      revealedCard.classList.add('animate-scale-up');

      // Celebration confetti & butterflies burst
      if (window.particleEngine) {
        window.particleEngine.triggerConfetti();
        window.particleEngine.releaseButterflyBurst(e.clientX, e.clientY, 8);
      }
    });
  }
}

// Additional Features
function initAdditionalFeatures(config) {
  // Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reduce Motion Toggle
  const reduceMotionBtn = document.getElementById('toggle-motion-btn');
  if (reduceMotionBtn) {
    reduceMotionBtn.addEventListener('click', () => {
      document.body.classList.toggle('reduce-motion');
      const isReduced = document.body.classList.contains('reduce-motion');
      reduceMotionBtn.textContent = isReduced ? '⚡ Enable Animations' : '🍃 Reduce Motion';
    });
  }

  // Secret Hidden Message Trigger
  const secretKeyBtn = document.getElementById('secret-birthday-key-btn');
  if (secretKeyBtn) {
    secretKeyBtn.addEventListener('click', () => {
      const modalBackdrop = document.getElementById('general-modal');
      const modalTitle = document.getElementById('modal-title');
      const modalBody = document.getElementById('modal-body');

      if (modalBackdrop && modalTitle && modalBody) {
        modalTitle.textContent = config.surprises.hiddenMessageTitle;
        modalBody.innerHTML = `
          <div class="text-center py-3">
            <span class="text-4xl block mb-3">👑🎂🌸</span>
            <p class="font-serif text-lg text-stone-700 leading-relaxed italic">
              “${config.surprises.hiddenMessage}”
            </p>
          </div>
        `;
        modalBackdrop.classList.add('active');
        if (window.particleEngine) {
          window.particleEngine.triggerConfetti();
        }
      }
    });
  }

  // General Modal Close buttons
  const modalBackdrop = document.getElementById('general-modal');
  const modalClose = document.getElementById('general-modal-close');
  if (modalClose && modalBackdrop) {
    modalClose.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
    });
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
    });
  }
}

// Preloader fadeout
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => preloader.remove(), 600);
    }, 450);
  }
}
