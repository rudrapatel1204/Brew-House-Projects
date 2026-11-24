/**
 * ====================================================================
 * PARTICLES, BUTTERFLIES, BALLOONS & CURSOR ENGINE
 * ====================================================================
 */

class ParticleEngine {
  constructor() {
    this.starsCanvas = document.getElementById('stars-canvas');
    this.cursorCanvas = document.getElementById('cursor-canvas');
    this.starsCtx = this.starsCanvas ? this.starsCanvas.getContext('2d') : null;
    this.cursorCtx = this.cursorCanvas ? this.cursorCanvas.getContext('2d') : null;
    
    this.stars = [];
    this.cursorParticles = [];
    this.mouse = { x: -100, y: -100, prevX: -100, prevY: -100, speed: 0 };
    
    this.isReducedMotion = false;
    this.init();
  }

  init() {
    this.resizeCanvases();
    window.addEventListener('resize', () => this.resizeCanvases());
    
    // Check reduced motion setting
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isReducedMotion = true;
    }

    if (this.starsCanvas && !this.isReducedMotion) {
      this.createStars(120);
    }

    this.bindCursorTrail();
    this.spawnButterflies();
    this.spawnBalloons();
    this.animate();
  }

  resizeCanvases() {
    if (this.starsCanvas) {
      this.starsCanvas.width = window.innerWidth;
      this.starsCanvas.height = window.innerHeight;
    }
    if (this.cursorCanvas) {
      this.cursorCanvas.width = window.innerWidth;
      this.cursorCanvas.height = window.innerHeight;
    }
  }

  createStars(count) {
    this.stars = [];
    const w = this.starsCanvas.width;
    const h = this.starsCanvas.height;

    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: Math.random() > 0.4 ? '#FFFDF9' : (Math.random() > 0.5 ? '#F6D6DC' : '#DFB15B'),
      });
    }
  }

  bindCursorTrail() {
    // Only on desktop pointer
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        const dx = e.clientX - this.mouse.x;
        const dy = e.clientY - this.mouse.y;
        this.mouse.speed = Math.sqrt(dx * dx + dy * dy);
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        if (!this.isReducedMotion && Math.random() > 0.3) {
          this.addCursorSparkle(e.clientX, e.clientY);
        }
      });
    }
  }

  addCursorSparkle(x, y) {
    const isHeart = Math.random() > 0.7;
    const colors = ['#F6D6DC', '#DFB15B', '#FFFDF9', '#F9E3E6'];
    this.cursorParticles.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      size: isHeart ? Math.random() * 12 + 8 : Math.random() * 4 + 2,
      isHeart: isHeart,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * -1.5 - 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      life: 1,
      decay: Math.random() * 0.02 + 0.015,
    });
  }

  animate() {
    // Starry sky rendering
    if (this.starsCtx && this.starsCanvas && !this.isReducedMotion) {
      this.starsCtx.clearRect(0, 0, this.starsCanvas.width, this.starsCanvas.height);
      for (const s of this.stars) {
        s.alpha += Math.sin(Date.now() * s.twinkleSpeed) * 0.01;
        s.alpha = Math.max(0.15, Math.min(0.95, s.alpha));

        this.starsCtx.beginPath();
        this.starsCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        this.starsCtx.fillStyle = s.color;
        this.starsCtx.globalAlpha = s.alpha;
        this.starsCtx.shadowBlur = s.radius * 4;
        this.starsCtx.shadowColor = s.color;
        this.starsCtx.fill();
        this.starsCtx.shadowBlur = 0;
      }
    }

    // Cursor particles rendering
    if (this.cursorCtx && this.cursorCanvas && !this.isReducedMotion) {
      this.cursorCtx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
      for (let i = this.cursorParticles.length - 1; i >= 0; i--) {
        const p = this.cursorParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        if (p.life <= 0) {
          this.cursorParticles.splice(i, 1);
          continue;
        }

        this.cursorCtx.save();
        this.cursorCtx.translate(p.x, p.y);
        this.cursorCtx.rotate(p.rotation);
        this.cursorCtx.globalAlpha = p.life;
        this.cursorCtx.fillStyle = p.color;

        if (p.isHeart) {
          // Draw tiny delicate heart
          const s = p.size / 15;
          this.cursorCtx.beginPath();
          this.cursorCtx.moveTo(0, 0);
          this.cursorCtx.bezierCurveTo(-5 * s, -10 * s, -15 * s, -5 * s, 0, 10 * s);
          this.cursorCtx.bezierCurveTo(15 * s, -5 * s, 5 * s, -10 * s, 0, 0);
          this.cursorCtx.fill();
        } else {
          // Draw sparkling 4-point star
          this.drawSparkleStar(this.cursorCtx, 0, 0, p.size);
        }
        this.cursorCtx.restore();
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  drawSparkleStar(ctx, cx, cy, size) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.quadraticCurveTo(cx, cy, cx + size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size);
    ctx.quadraticCurveTo(cx, cy, cx - size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size);
    ctx.fill();
  }

  spawnButterflies(containerId = 'butterfly-container', count = 12) {
    const container = document.getElementById(containerId);
    if (!container || this.isReducedMotion) return;

    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'butterfly';
      
      const left = Math.random() * 90 + 5;
      const delay = Math.random() * 12;
      const duration = Math.random() * 10 + 14;
      const scale = Math.random() * 0.4 + 0.7;

      b.style.left = `${left}%`;
      b.style.bottom = `${Math.random() * 15}%`;
      b.style.animationDelay = `${delay}s`;
      b.style.animationDuration = `${duration}s`;
      b.style.transform = `scale(${scale})`;

      b.innerHTML = `
        <div class="wing wing-left"></div>
        <div class="wing wing-right"></div>
      `;

      container.appendChild(b);
    }
  }

  spawnBalloons(containerId = 'balloon-container', count = 18) {
    const container = document.getElementById(containerId);
    if (!container || this.isReducedMotion) return;

    container.innerHTML = '';
    const colors = [
      'radial-gradient(circle at 35% 35%, #FFF0F3 0%, #F6D6DC 60%, #E8A8B4 100%)',
      'radial-gradient(circle at 35% 35%, #FFFDF9 0%, #F9E3E6 60%, #E8B4B8 100%)',
      'radial-gradient(circle at 35% 35%, #FFF8E7 0%, #DFB15B 65%, #C2933F 100%)',
      'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F7F2EC 70%, #D4C9BA 100%)',
      'radial-gradient(circle at 35% 35%, #F4EEFB 0%, #D8C3E5 65%, #B69AC8 100%)',
    ];

    for (let i = 0; i < count; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';

      const size = Math.random() * 30 + 50; // 50px - 80px
      const left = Math.random() * 92 + 4;
      const delay = Math.random() * 14;
      const duration = Math.random() * 8 + 12;
      const bg = colors[i % colors.length];

      balloon.style.width = `${size}px`;
      balloon.style.height = `${size * 1.25}px`;
      balloon.style.left = `${left}%`;
      balloon.style.background = bg;
      balloon.style.animationDelay = `${delay}s`;
      balloon.style.animationDuration = `${duration}s`;

      container.appendChild(balloon);
    }
  }

  // Release a burst of flying butterflies on click
  releaseButterflyBurst(x, y, count = 6) {
    if (this.isReducedMotion) return;
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'butterfly';
      b.style.position = 'fixed';
      b.style.left = `${x}px`;
      b.style.top = `${y}px`;
      b.style.zIndex = '9999';
      b.style.animation = `butterflyFlight ${Math.random() * 3 + 4}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;

      b.innerHTML = `
        <div class="wing wing-left"></div>
        <div class="wing wing-right"></div>
      `;

      document.body.appendChild(b);
      setTimeout(() => b.remove(), 7000);
    }
  }

  // Trigger celebration confetti
  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F6D6DC', '#DFB15B', '#FFFDF9', '#E8B4B8', '#F9E3E6'],
      });
    }
  }
}

window.ParticleEngine = ParticleEngine;
