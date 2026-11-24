/**
 * ====================================================================
 * INTERACTIVE 3D PHOTO WORLD (3D PERSPECTIVE CYLINDER ENGINE)
 * Inspired by Instagram Reels 3D floating photo world!
 * Features:
 * - Real high-definition images on ornate 3D cards
 * - 360-degree continuous mouse & touch drag orbit with physics damping
 * - Orbiting stardust galaxy particles in background
 * - Click card to inspect in full-screen Lightbox with captions
 * ====================================================================
 */

class ThreeWorld {
  constructor(config) {
    this.config = config.threeDWorld;
    this.container = document.getElementById('three-world-container');
    this.canvas = document.getElementById('three-canvas');

    this.scene = null;
    this.cards = [];
    this.currentAngle = 0;
    this.targetAngle = 0;
    this.isDragging = false;
    this.startX = 0;
    this.lastDeltaX = 0;
    this.autoRotateSpeed = 0.08;

    this.init();
  }

  init() {
    if (!this.container) return;

    // 1. Build background particle canvas
    this.initBackgroundParticles();

    // 2. Build 3D revolving carousel
    this.build3DCarousel();

    // 3. Bind interactive drag and touch controls
    this.bindEvents();

    // 4. Start smooth physics loop
    this.animate();
  }

  initBackgroundParticles() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;

    this.particles = [];
    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        color: Math.random() > 0.5 ? '#F6D6DC' : '#DFB15B',
      });
    }

    window.addEventListener('resize', () => {
      if (this.container && this.canvas) {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
      }
    });
  }

  build3DCarousel() {
    // Create or find carousel container
    let carousel = document.getElementById('carousel-3d-ring');
    if (!carousel) {
      carousel = document.createElement('div');
      carousel.id = 'carousel-3d-ring';
      carousel.className = 'carousel-3d-scene';
      this.container.appendChild(carousel);
    }

    carousel.innerHTML = '';
    const frames = this.config.frames;
    const total = frames.length;
    const radius = window.innerWidth < 640 ? 260 : 360;

    frames.forEach((item, index) => {
      const angle = (index / total) * 360;
      const card = document.createElement('div');
      card.className = 'carousel-3d-card';
      card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

      card.innerHTML = `
        <div class="relative w-full h-[250px] overflow-hidden rounded-xl mb-3 bg-stone-900 shadow-md">
          <img src="${item.image}" alt="${item.title}" class="carousel-3d-img">
          <span class="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[#DFB15B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/30">
            ✨ Diya
          </span>
        </div>
        <h4 class="font-serif font-bold text-base text-stone-900 truncate">${item.title}</h4>
        <p class="font-sans text-[11px] text-stone-500 line-clamp-2 mt-0.5">“${item.caption}”</p>
      `;

      // Click to inspect
      card.addEventListener('click', (e) => {
        // Only trigger click if not dragged significantly
        if (Math.abs(this.lastDeltaX) < 5) {
          this.showCardModal(item);
          if (window.particleEngine) {
            window.particleEngine.triggerConfetti();
          }
        }
      });

      carousel.appendChild(card);
      this.cards.push({ el: card, baseAngle: angle, radius });
    });

    this.scene = carousel;
  }

  bindEvents() {
    const el = this.container;

    // Mouse Drag
    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
      this.lastDeltaX = 0;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.startX;
      this.lastDeltaX = dx;
      this.targetAngle += dx * 0.35;
      this.startX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch Drag (Mobile)
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.lastDeltaX = 0;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.startX;
      this.lastDeltaX = dx;
      this.targetAngle += dx * 0.45;
      this.startX = e.touches[0].clientX;
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  showCardModal(item) {
    const modalBackdrop = document.getElementById('general-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (modalBackdrop && modalTitle && modalBody) {
      modalTitle.textContent = item.title;
      modalBody.innerHTML = `
        <div class="text-center py-2">
          <img src="${item.image}" alt="${item.title}" class="max-h-[60vh] mx-auto rounded-2xl shadow-xl mb-4 object-cover border-4 border-rose-100">
          <p class="font-serif text-lg text-stone-700 italic">“${item.caption}”</p>
        </div>
      `;
      modalBackdrop.classList.add('active');
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Auto rotate gently when not dragging
    if (!this.isDragging) {
      this.targetAngle += this.autoRotateSpeed;
    }

    // Smooth inertial lerp
    this.currentAngle += (this.targetAngle - this.currentAngle) * 0.08;

    if (this.scene) {
      this.scene.style.transform = `rotateY(${this.currentAngle}deg)`;
    }

    // Render starry particle background
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (const p of this.particles) {
        p.y -= p.speed;
        if (p.y < 0) p.y = this.canvas.height;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.shadowBlur = p.r * 3;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    }
  }
}

window.ThreeWorld = ThreeWorld;
