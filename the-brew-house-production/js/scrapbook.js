/**
 * ====================================================================
 * DIGITAL BIRTHDAY SCRAPBOOK CONTROLLER
 * Features:
 * - 9 Handcrafted interactive memory pages with real taped photos of Diya!
 * - Realistic washi tape, stamps, paper clips, polaroid tilts, and cursive notes
 * - Interactive 50 Reasons envelope system
 * - Secret Golden Heart Seal on final page
 * ====================================================================
 */

class DigitalScrapbook {
  constructor(config) {
    this.config = config.scrapbook;
    this.currentPage = 1;
    this.totalPages = this.config.pages.length;
    
    this.container = document.getElementById('scrapbook-page-content');
    this.prevBtn = document.getElementById('scrapbook-prev-btn');
    this.nextBtn = document.getElementById('scrapbook-next-btn');
    this.pageNumberEl = document.getElementById('scrapbook-page-number');
    this.indicatorsContainer = document.getElementById('scrapbook-indicators');

    this.init();
  }

  init() {
    this.buildIndicators();
    this.renderPage(this.currentPage);
    this.bindEvents();
  }

  buildIndicators() {
    if (!this.indicatorsContainer) return;
    this.indicatorsContainer.innerHTML = '';
    for (let i = 1; i <= this.totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === this.currentPage ? 'bg-[#DFB15B] w-6' : 'bg-rose-200 hover:bg-rose-300'}`;
      dot.setAttribute('aria-label', `Go to page ${i}`);
      dot.addEventListener('click', () => this.goToPage(i));
      this.indicatorsContainer.appendChild(dot);
    }
  }

  updateIndicators() {
    if (!this.indicatorsContainer) return;
    const dots = this.indicatorsContainer.children;
    for (let i = 0; i < dots.length; i++) {
      if (i + 1 === this.currentPage) {
        dots[i].className = 'w-6 h-2.5 rounded-full bg-[#DFB15B] transition-all duration-300';
      } else {
        dots[i].className = 'w-2.5 h-2.5 rounded-full bg-rose-200 hover:bg-rose-300 transition-all duration-300';
      }
    }
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevPage());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextPage());
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      const rect = document.getElementById('scrapbook-section')?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowLeft') this.prevPage();
        if (e.key === 'ArrowRight') this.nextPage();
      }
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPage(num) {
    if (num < 1 || num > this.totalPages) return;
    this.currentPage = num;
    this.renderPage(this.currentPage);
    this.updateIndicators();
  }

  renderPage(pageIdx) {
    if (!this.container) return;
    const pageData = this.config.pages[pageIdx - 1];

    if (this.pageNumberEl) {
      this.pageNumberEl.textContent = `Page ${pageIdx} of ${this.totalPages}`;
    }

    if (this.prevBtn) {
      this.prevBtn.disabled = pageIdx === 1;
      this.prevBtn.style.opacity = pageIdx === 1 ? '0.3' : '1';
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = pageIdx === this.totalPages;
      this.nextBtn.style.opacity = pageIdx === this.totalPages ? '0.3' : '1';
    }

    this.container.style.opacity = '0';
    this.container.style.transform = 'translateY(8px)';

    setTimeout(() => {
      this.container.innerHTML = this.getPageHTML(pageData);
      this.container.style.transition = 'all 0.35s ease-out';
      this.container.style.opacity = '1';
      this.container.style.transform = 'translateY(0)';
      this.attachPageInteractions(pageData);
    }, 150);
  }

  getPageHTML(data) {
    switch (data.type) {
      case 'cover':
        return `
          <div class="py-4 flex flex-col md:flex-row items-center justify-between gap-8">
            <!-- Left Side: Cover Title & Note -->
            <div class="flex-1 text-center md:text-left">
              <span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#F9E3E6] text-[#2C2C2C] mb-4">
                ${data.badge}
              </span>
              <h2 class="font-serif text-3xl sm:text-5xl font-bold text-[#2C2C2C] mb-4 leading-tight">
                ${data.title}
              </h2>
              <p class="font-handwriting text-2xl text-rose-500 mb-6">
                ${data.subtitle}
              </p>
              <div class="w-20 h-1 bg-[#DFB15B] rounded-full mb-6 mx-auto md:mx-0"></div>
              <div class="flex gap-4 text-3xl mb-6 justify-center md:justify-start">
                ${data.stickers.map(s => `<span class="transform hover:scale-125 transition-transform cursor-pointer">${s}</span>`).join('')}
              </div>
              <p class="text-xs text-stone-500 font-sans tracking-wide">
                ${data.decorativeNote}
              </p>
            </div>

            <!-- Right Side: Real Taped Polaroid of Diya -->
            <div class="relative w-64 sm:w-72 flex-shrink-0">
              <div class="absolute -top-3 left-10 w-24 h-6 tape-pink rounded-sm rotate-[-4deg] z-20"></div>
              <div class="scrapbook-polaroid rotate-[3deg]">
                <img src="${data.photo}" alt="Diya" class="w-full h-72 object-cover rounded-sm mb-3">
                <p class="font-handwriting text-xl text-stone-800 text-center font-bold">Diya • Chapter 18 🎂</p>
                <span class="text-[10px] text-stone-400 font-sans block text-center uppercase tracking-widest mt-0.5">29 October 2026</span>
              </div>
            </div>
          </div>
        `;

      case 'note':
        return `
          <div class="py-4 flex flex-col md:flex-row items-center gap-8">
            <!-- Left: Taped Polaroid -->
            <div class="relative w-60 sm:w-64 flex-shrink-0">
              <div class="absolute -top-3 right-8 w-24 h-6 tape-gold rounded-sm rotate-[5deg] z-20"></div>
              <div class="scrapbook-polaroid rotate-[-2.5deg]">
                <img src="${data.photo}" alt="Diya" class="w-full h-64 object-cover rounded-sm mb-2">
                <p class="font-handwriting text-lg text-rose-600 text-center font-bold">Sweetest Smile 🌸</p>
              </div>
            </div>

            <!-- Right: The Note -->
            <div class="flex-1">
              <span class="text-xs font-semibold uppercase tracking-widest text-[#DFB15B] block mb-2 font-sans">${data.header}</span>
              <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-4">${data.title}</h3>
              <blockquote class="font-serif italic text-base sm:text-lg text-rose-600 bg-rose-50/80 p-4 rounded-xl border-l-4 border-rose-300 mb-4 shadow-sm">
                ${data.quote}
              </blockquote>
              <div class="space-y-3 text-stone-700 leading-relaxed font-sans text-sm">
                ${data.body.map(p => `<p>${p}</p>`).join('')}
              </div>
              <div class="mt-6 text-right font-handwriting text-2xl text-rose-600">
                ${data.signature}
              </div>
            </div>
          </div>
        `;

      case 'personality':
        return `
          <div class="py-4 flex flex-col md:flex-row items-center gap-8">
            <!-- Left: Traits List -->
            <div class="flex-1">
              <span class="text-xs font-semibold uppercase tracking-widest text-[#DFB15B] block mb-1 font-sans">${data.header}</span>
              <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-1">${data.title}</h3>
              <p class="text-xs text-stone-500 mb-4 font-sans">${data.subtitle}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${data.traits.map(t => `
                  <div class="bg-white p-3 rounded-xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-base">${t.icon}</span>
                      <h4 class="font-serif font-bold text-sm text-stone-800">${t.title}</h4>
                    </div>
                    <p class="text-[11px] text-stone-600 font-sans leading-relaxed">${t.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Right: Photo of Diya with Tape -->
            <div class="relative w-56 sm:w-64 flex-shrink-0">
              <div class="absolute -top-3 left-10 w-24 h-6 tape-pink rounded-sm rotate-[-3deg] z-20"></div>
              <div class="scrapbook-polaroid rotate-[2deg]">
                <img src="${data.photo}" alt="Diya" class="w-full h-72 object-cover rounded-sm mb-2">
                <p class="font-handwriting text-lg text-stone-800 text-center font-bold">Pure Heart & Soul ✨</p>
              </div>
            </div>
          </div>
        `;

      case 'story':
        return `
          <div class="py-4">
            <span class="text-xs font-semibold uppercase tracking-widest text-[#DFB15B] block mb-1 font-sans">${data.header}</span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-2">${data.title}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-4">
              <!-- Memory Story Text -->
              <div class="md:col-span-2 space-y-3 text-stone-700 leading-relaxed font-sans bg-amber-50/50 p-5 rounded-2xl border border-amber-200/50 text-sm">
                <div class="inline-block bg-[#F9E3E6] text-stone-800 text-xs px-3 py-1 rounded-md font-medium mb-2">
                  📅 ${data.firstConversationDate}
                </div>
                ${data.paragraphs.map(p => `<p>${p}</p>`).join('')}
              </div>

              <!-- Memory Photo -->
              <div class="relative w-52 mx-auto">
                <div class="absolute -top-3 left-8 w-20 h-5 tape-gold rounded-sm rotate-[-4deg] z-20"></div>
                <div class="scrapbook-polaroid rotate-[3deg]">
                  <img src="${data.photo}" alt="Memory" class="w-full h-56 object-cover rounded-sm mb-2">
                  <p class="font-handwriting text-sm text-stone-700 text-center font-bold">Unforgettable Day 🤍</p>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center text-xs text-stone-400 mt-2">
              <span class="tracking-widest uppercase font-semibold text-rose-400">✨ ${data.stampText}</span>
              <span class="text-lg">☕ 📖 💌</span>
            </div>
          </div>
        `;

      case 'memories_grid':
        return `
          <div class="py-4">
            <span class="text-xs font-semibold uppercase tracking-widest text-[#DFB15B] block mb-1 font-sans">${data.header}</span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-4">${data.title}</h3>
            
            <!-- 4 Taped Mini Polaroids Collage -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              ${data.photos.map((p, idx) => `
                <div class="relative">
                  <div class="absolute -top-2 left-6 w-14 h-4 ${idx % 2 === 0 ? 'tape-pink' : 'tape-gold'} rounded-sm z-20"></div>
                  <div class="scrapbook-polaroid rotate-[${idx % 2 === 0 ? '-2' : '2'}deg]">
                    <img src="${p}" alt="Memory ${idx+1}" class="w-full h-36 object-cover rounded-sm mb-1.5">
                    <p class="font-handwriting text-xs text-stone-700 text-center">Memory #${idx+1} 🌸</p>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Memory Notes Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${data.memories.map(m => `
                <div class="bg-white/80 p-3.5 rounded-xl border border-rose-100 shadow-sm text-xs">
                  <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-600 mb-1">
                    ${m.tag}
                  </span>
                  <p class="text-stone-700 font-sans leading-relaxed">${m.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'fifty_reasons':
        return `
          <div class="py-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-semibold uppercase tracking-widest text-[#DFB15B] block font-sans">${data.header}</span>
              <span class="text-xs text-rose-500 font-semibold" id="reasons-opened-count">0 / 50 Opened 💌</span>
            </div>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-2">${data.title}</h3>
            <p class="text-xs text-stone-500 mb-4 font-sans">${data.subtitle}</p>
            <div class="reasons-grid custom-scrollbar">
              ${data.reasons.map((r, i) => `
                <div class="reason-envelope" data-index="${i}">
                  <span class="text-lg block mb-1">💌</span>
                  <span class="text-xs font-semibold text-stone-700">#${i + 1}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'future_wishes':
        return `
          <div class="py-4 flex flex-col md:flex-row items-center gap-8">
            <!-- Left: Wishes -->
            <div class="flex-1">
              <span class="text-xs font-semibold uppercase tracking-widest text-[#DFB15B] block mb-1 font-sans">${data.header}</span>
              <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-1">${data.title}</h3>
              <p class="text-xs text-stone-600 mb-4 font-sans">${data.subtitle}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${data.wishes.map(w => `
                  <div class="p-3 bg-white/90 rounded-xl border border-amber-200/60 shadow-sm text-xs">
                    <h4 class="font-serif font-bold text-sm text-amber-700 mb-1">✨ ${w.heading}</h4>
                    <p class="text-[11px] text-stone-600 font-sans leading-relaxed">${w.body}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Right: Photo of Diya with Tape -->
            <div class="relative w-56 sm:w-64 flex-shrink-0">
              <div class="absolute -top-3 right-8 w-24 h-6 tape-gold rounded-sm rotate-[4deg] z-20"></div>
              <div class="scrapbook-polaroid rotate-[-2deg]">
                <img src="${data.photo}" alt="Future Diya" class="w-full h-72 object-cover rounded-sm mb-2">
                <p class="font-handwriting text-lg text-stone-800 text-center font-bold">Dreams Taking Flight 🌠</p>
              </div>
            </div>
          </div>
        `;

      case 'letter':
        return `
          <div class="py-4 font-serif flex flex-col md:flex-row items-start gap-8">
            <!-- Left: Clipped Photo of Diya -->
            <div class="relative w-52 sm:w-56 flex-shrink-0 mx-auto md:mx-0">
              <div class="absolute -top-3 left-10 w-24 h-6 tape-pink rounded-sm rotate-[-3deg] z-20"></div>
              <div class="scrapbook-polaroid rotate-[2deg]">
                <img src="${data.photo}" alt="Diya" class="w-full h-64 object-cover rounded-sm mb-2">
                <p class="font-handwriting text-lg text-rose-600 text-center font-bold">Always Special 🤍</p>
              </div>
            </div>

            <!-- Right: Personal Letter -->
            <div class="flex-1">
              <span class="text-xs font-semibold uppercase tracking-widest text-[#DFB15B] block mb-1 font-sans">${data.header}</span>
              <h3 class="text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-1">${data.title}</h3>
              <span class="text-xs text-stone-500 italic block mb-3 font-sans">Written on ${data.letterDate}</span>
              <div class="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/50 text-stone-800 text-xs sm:text-sm leading-relaxed space-y-2.5 font-sans">
                <p class="font-serif font-semibold text-stone-900">${data.salutation}</p>
                ${data.letterBody.map(p => `<p>${p}</p>`).join('')}
                <div class="pt-3 text-right">
                  <p class="text-stone-600 text-[11px]">${data.valediction}</p>
                  <p class="font-handwriting text-2xl text-rose-600">${data.signature}</p>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'final_surprise':
        return `
          <div class="text-center py-6 flex flex-col items-center justify-center">
            <span class="text-xs font-semibold uppercase tracking-widest text-[#DFB15B] block mb-2 font-sans">${data.header}</span>
            <h3 class="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] mb-4">${data.title}</h3>
            
            <div class="relative w-52 mb-6">
              <div class="absolute -top-3 left-10 w-20 h-5 tape-pink rounded-sm rotate-[-4deg] z-20"></div>
              <div class="scrapbook-polaroid rotate-[2deg]">
                <img src="${data.photo}" alt="Diya Celebration" class="w-full h-56 object-cover rounded-sm mb-2">
                <p class="font-handwriting text-base text-rose-600 font-bold">Forever Cherished 🤍</p>
              </div>
            </div>

            <p class="font-serif text-base sm:text-lg text-stone-700 max-w-xl mb-6 leading-relaxed">
              ${data.message}
            </p>
            <button id="secret-seal-btn" class="px-6 py-3.5 bg-gradient-to-r from-[#F6D6DC] to-[#DFB15B] text-stone-900 font-semibold text-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
              <span>💖</span>
              <span>${data.interactiveSealText}</span>
            </button>
            <div id="secret-message-box" class="hidden mt-6 p-5 bg-rose-50 border border-rose-200 rounded-2xl max-w-lg text-rose-800 font-serif italic text-base animate-fade-in shadow-md">
              ${data.secretMessage}
            </div>
          </div>
        `;

      default:
        return `<div class="p-4">Page content</div>`;
    }
  }

  attachPageInteractions(data) {
    if (data.type === 'fifty_reasons') {
      const envelopes = this.container.querySelectorAll('.reason-envelope');
      let opened = 0;
      const countEl = document.getElementById('reasons-opened-count');

      envelopes.forEach(env => {
        env.addEventListener('click', () => {
          const idx = parseInt(env.getAttribute('data-index'), 10);
          const reasonText = data.reasons[idx];
          
          if (!env.classList.contains('opened')) {
            env.classList.add('opened');
            env.innerHTML = `<span class="text-base block mb-0.5">💖</span><span class="text-[10px] font-bold text-rose-600">Revealed</span>`;
            opened++;
            if (countEl) countEl.textContent = `${opened} / 50 Opened 💌`;
          }

          this.showReasonModal(idx + 1, reasonText);
          if (window.particleEngine) {
            window.particleEngine.triggerConfetti();
          }
        });
      });
    } else if (data.type === 'final_surprise') {
      const sealBtn = document.getElementById('secret-seal-btn');
      const secretBox = document.getElementById('secret-message-box');
      if (sealBtn && secretBox) {
        sealBtn.addEventListener('click', () => {
          secretBox.classList.toggle('hidden');
          if (window.particleEngine) {
            window.particleEngine.triggerConfetti();
          }
        });
      }
    }
  }

  showReasonModal(number, text) {
    const modalBackdrop = document.getElementById('general-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (modalBackdrop && modalTitle && modalBody) {
      modalTitle.textContent = `Reason #${number} 💖`;
      modalBody.innerHTML = `
        <p class="font-serif text-xl text-stone-800 leading-relaxed py-4 text-center">
          “${text}”
        </p>
      `;
      modalBackdrop.classList.add('active');
    }
  }
}

window.DigitalScrapbook = DigitalScrapbook;
