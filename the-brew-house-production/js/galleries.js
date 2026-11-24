/**
 * ====================================================================
 * HANGING & EDITORIAL GALLERIES + LIGHTBOX CONTROLLER
 * Features:
 * - Hanging photo strings with swinging physics and continuous flow
 * - Editorial memory cards with butterfly burst on click
 * - Accessible Full-Screen Lightbox Modal
 * ====================================================================
 */

class GalleryManager {
  constructor(config) {
    this.hangingData = config.hangingGallery;
    this.editorialData = config.editorialGallery;

    this.hangingTrack = document.getElementById('hanging-track');
    this.editorialGrid = document.getElementById('editorial-grid');

    // Lightbox elements
    this.lightbox = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.lightboxTitle = document.getElementById('lightbox-title');
    this.lightboxClose = document.getElementById('lightbox-close-btn');
    this.lightboxPrev = document.getElementById('lightbox-prev-btn');
    this.lightboxNext = document.getElementById('lightbox-next-btn');

    this.activeList = [];
    this.currentIndex = 0;

    this.init();
  }

  init() {
    this.renderHangingGallery();
    this.renderEditorialGallery();
    this.bindLightboxEvents();
  }

  renderHangingGallery() {
    if (!this.hangingTrack) return;
    this.hangingTrack.innerHTML = '';

    // Duplicate list once to create seamless infinite loop flow
    const fullList = [...this.hangingData, ...this.hangingData];

    fullList.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'hanging-item';
      el.style.animationDelay = `${(index % 4) * 0.7}s`;

      el.innerHTML = `
        <div class="hanging-string" style="height: ${item.stringHeight}px;"></div>
        <div class="hanging-clip"></div>
        <div class="polaroid-card" style="transform: rotate(${item.rotation}deg);">
          <img src="${item.image}" alt="${item.title}" class="polaroid-image">
          <h4 class="font-handwriting text-lg text-stone-800 font-bold mt-2 truncate">${item.title}</h4>
          <p class="text-[11px] text-stone-500 font-sans mt-0.5 line-clamp-1">${item.caption}</p>
        </div>
      `;

      el.addEventListener('click', () => {
        this.openLightbox(this.hangingData, index % this.hangingData.length);
        if (window.particleEngine) {
          const rect = el.getBoundingClientRect();
          window.particleEngine.releaseButterflyBurst(rect.left + rect.width / 2, rect.top);
        }
      });

      this.hangingTrack.appendChild(el);
    });
  }

  renderEditorialGallery() {
    if (!this.editorialGrid) return;
    this.editorialGrid.innerHTML = '';

    this.editorialData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `editorial-card group`;

      card.innerHTML = `
        <div class="relative overflow-hidden">
          <img src="${item.image}" alt="${item.title}" class="w-full object-cover">
          <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-stone-700 shadow-sm">
            ${item.tag}
          </span>
        </div>
        <div class="p-5">
          <h4 class="font-serif font-bold text-xl text-stone-800 mb-1 group-hover:text-rose-600 transition-colors">
            ${item.title}
          </h4>
          <p class="text-xs text-stone-600 font-sans leading-relaxed">
            ${item.caption}
          </p>
        </div>
      `;

      card.addEventListener('click', (e) => {
        this.openLightbox(this.editorialData, index);
        if (window.particleEngine) {
          window.particleEngine.releaseButterflyBurst(e.clientX, e.clientY);
        }
      });

      this.editorialGrid.appendChild(card);
    });
  }

  bindLightboxEvents() {
    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }

    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });
    }

    if (this.lightboxPrev) {
      this.lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevImage();
      });
    }

    if (this.lightboxNext) {
      this.lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextImage();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.lightbox?.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
    });
  }

  openLightbox(list, index) {
    this.activeList = list;
    this.currentIndex = index;
    this.updateLightboxContent();
    if (this.lightbox) {
      this.lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.activeList.length - 1;
    }
    this.updateLightboxContent();
  }

  nextImage() {
    if (this.currentIndex < this.activeList.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const item = this.activeList[this.currentIndex];
    if (!item) return;

    if (this.lightboxImg) {
      this.lightboxImg.src = item.image;
      this.lightboxImg.alt = item.title;
    }
    if (this.lightboxTitle) {
      this.lightboxTitle.textContent = item.title;
    }
    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = item.caption;
    }
  }
}

window.GalleryManager = GalleryManager;
