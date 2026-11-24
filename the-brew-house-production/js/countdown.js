/**
 * ====================================================================
 * MOVING PANELS & BIRTHDAY COUNTDOWN CONTROLLER
 * Target: 29 October 2026 00:00:00 (Asia/Kolkata timezone)
 * ====================================================================
 */

class BirthdayCountdown {
  constructor(config) {
    this.config = config;
    this.targetDate = new Date(config.person.targetDate).getTime();
    this.previewMode = config.countdown.previewCelebrationState || false;

    this.panelsWrapper = document.getElementById('panels-wrapper');
    this.timerContainer = document.getElementById('timer-container');
    this.celebrationContainer = document.getElementById('countdown-celebration');
    
    this.daysEl = document.getElementById('timer-days');
    this.hoursEl = document.getElementById('timer-hours');
    this.minutesEl = document.getElementById('timer-minutes');
    this.secondsEl = document.getElementById('timer-seconds');
    
    this.interval = null;
    this.panelsOpened = false;
    this.isCelebration = false;

    this.init();
  }

  init() {
    this.updateCountdown();
    this.interval = setInterval(() => this.updateCountdown(), 1000);
    this.bindEvents();
  }

  bindEvents() {
    // Opening Enter button triggers the panel separation
    const enterBtn = document.getElementById('enter-magic-btn');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        this.openPanels();
        // Smoothly scroll down to countdown scene
        setTimeout(() => {
          const targetSection = document.getElementById('countdown-section');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      });
    }

    // "A Little Surprise" button scrolls smoothly to Big 18 section
    const surpriseBtn = document.getElementById('countdown-surprise-btn');
    if (surpriseBtn) {
      surpriseBtn.addEventListener('click', () => {
        const big18Section = document.getElementById('big-18-section');
        if (big18Section) {
          big18Section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Toggle Preview Mode Button (Convenient for testing both modes!)
    const toggleModeBtn = document.getElementById('toggle-mode-btn');
    if (toggleModeBtn) {
      toggleModeBtn.addEventListener('click', () => {
        this.previewMode = !this.previewMode;
        toggleModeBtn.textContent = this.previewMode ? '🕒 Switch to Live Countdown' : '🎉 Preview 18th Birthday Mode';
        this.updateCountdown();
      });
    }
  }

  openPanels() {
    if (this.panelsOpened) return;
    this.panelsOpened = true;
    if (this.panelsWrapper) {
      this.panelsWrapper.classList.add('panels-opened');
    }
  }

  updateCountdown() {
    const now = Date.now();
    let distance = this.targetDate - now;

    // If preview mode is activated, force distance <= 0
    if (this.previewMode) {
      distance = -1;
    }

    if (distance <= 0) {
      // Birthday has arrived!
      if (!this.isCelebration) {
        this.showCelebrationState();
      }
      return;
    }

    // Still in the future -> calculate time remaining
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.renderDigits(this.daysEl, days);
    this.renderDigits(this.hoursEl, hours);
    this.renderDigits(this.minutesEl, minutes);
    this.renderDigits(this.secondsEl, seconds);

    if (this.isCelebration) {
      this.showCountdownState();
    }
  }

  renderDigits(element, value) {
    if (!element) return;
    const strVal = String(value).padStart(2, '0');
    if (element.textContent !== strVal) {
      element.textContent = strVal;
      element.classList.remove('pulse-digit');
      void element.offsetWidth; // trigger reflow
      element.classList.add('pulse-digit');
    }
  }

  showCelebrationState() {
    this.isCelebration = true;
    if (this.timerContainer) this.timerContainer.classList.add('hidden');
    if (this.celebrationContainer) {
      this.celebrationContainer.classList.remove('hidden');
      this.celebrationContainer.classList.add('fade-in');
    }
    // Fire festive celebration confetti!
    if (window.particleEngine) {
      window.particleEngine.triggerConfetti();
    }
  }

  showCountdownState() {
    this.isCelebration = false;
    if (this.timerContainer) this.timerContainer.classList.remove('hidden');
    if (this.celebrationContainer) this.celebrationContainer.classList.add('hidden');
  }
}

window.BirthdayCountdown = BirthdayCountdown;
