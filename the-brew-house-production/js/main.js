/**
 * THE BREW HOUSE — PRODUCTION CLIENT-SIDE APPLICATION
 * Crafted for WebBlaze Studio | Alkapuri, Vadodara, Gujarat
 * Brand Philosophy: "Where Great Coffee Meets Good Energy."
 * 
 * Architecture & Features:
 * - Centralized Production Configuration (`CONFIG`)
 * - Responsive ScrollSpy with IntersectionObserver
 * - Accessible Mobile Navigation Drawer (ARIA, Focus, Escape)
 * - Full-Viewport Dynamic Vibe & Time Engine
 * - Web Audio API Ambient Soundscape Generator
 * - Structured Masterpiece Menu Filtering & Tasting Notes Modal
 * - Accessible Full-Resolution Editorial Gallery Lightbox
 * - Table Reservation System with Client-Side Validation & Direct WhatsApp Routing
 * - Supabase Cloud Synchronization & Local Persistent Fallback
 * - Built-in Live Data & Café Manager Dashboard (Portal)
 * - Slide-out Live Order Simulator Drawer with Promo Engine
 * - Interactive Vadodara Map Navigator
 * - Theme Switcher (Golden Hour vs Midnight Velvet)
 */

/* ===================================================================
   CENTRALIZED PRODUCTION CONFIGURATION
   =================================================================== */
const CONFIG = {
  // Live business WhatsApp concierge number (Format: country code + 10 digits, e.g. "919876543210")
  WHATSAPP_PHONE: "919876543210",
  
  // Supabase Cloud Configuration (Can be updated via Live Data Portal UI anytime!)
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key",
  
  // Display contact placeholders
  CAFE_PHONE_DISPLAY: "+91 (0265) 234-8900",
  CAFE_EMAIL: "concierge@thebrewhouse.example",
  LOCATION_ADDRESS: "14, Heritage Avenue, Opposite Circuit House, Alkapuri, Vadodara, Gujarat 390007",
  
  // Sample operational schedule
  SAMPLE_HOURS: {
    WEEKDAY: "Monday – Thursday: 08:00 AM – 11:30 PM",
    WEEKEND: "Friday – Sunday: 08:00 AM – 01:00 AM"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollSpy();
  initMobileNav();
  initVibeClock();
  initAudioEngine();
  initSpacesExplorer();
  initMenuSystem();
  initOrderDrawer();
  initEditorialGallery();
  initReservationValidation();
  initNewsletterIntegration();
  initInteractiveMap();
  initDataPortalUI();
});

/* ===================================================================
   1. THEME SWITCHER (GOLDEN HOUR / MIDNIGHT VELVET)
   =================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('tbh_theme') || 'midnight';
  if (savedTheme === 'golden-hour') {
    document.body.classList.add('theme-golden-hour');
    updateThemeBtnIcon(true);
  }

  themeToggleBtn.addEventListener('click', () => {
    const isGolden = document.body.classList.toggle('theme-golden-hour');
    localStorage.setItem('tbh_theme', isGolden ? 'golden-hour' : 'midnight');
    updateThemeBtnIcon(isGolden);
    showToast(isGolden ? "🌅 Golden Hour Atmosphere Enabled" : "🌙 Midnight Velvet Mode Enabled");
  });
}

function updateThemeBtnIcon(isGolden) {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;
  if (isGolden) {
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> <span>Midnight Mode</span>';
    themeToggleBtn.setAttribute('aria-label', 'Switch to Midnight Espresso theme');
  } else {
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> <span>Golden Hour</span>';
    themeToggleBtn.setAttribute('aria-label', 'Switch to Golden Hour theme');
  }
}

/* ===================================================================
   2. RESPONSIVE SCROLLSPY (INTERSECTION OBSERVER)
   =================================================================== */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ===================================================================
   3. ACCESSIBLE MOBILE NAVIGATION DRAWER
   =================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleBtn || !navLinks) return;

  function openMenu() {
    navLinks.classList.add('mobile-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('mobile-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('mobile-open');
    isOpen ? closeMenu() : openMenu();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('mobile-open') && 
        !navLinks.contains(e.target) && 
        !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ===================================================================
   4. DYNAMIC VIBE & TIME ENGINE
   =================================================================== */
function initVibeClock() {
  const vibeStatusText = document.getElementById('vibeStatusText');
  const heroNowPlaying = document.getElementById('heroNowPlaying');
  if (!vibeStatusText) return;

  const vibes = [
    { hour: 8, name: "Morning Pour-Overs & Sunlit Journaling", track: "Ludovico Einaudi - Nuvole Bianche" },
    { hour: 12, name: "Deep Work Flow & Cold Brew Velocity", track: "Tycho - Awake (Lo-Fi Roastery Edit)" },
    { hour: 16, name: "Golden Hour Matchas & Creative Catch-ups", track: "Norah Jones - Come Away With Me" },
    { hour: 19, name: "Cozy Acoustic Jams & Sourdough Bites", track: "Cigarettes After Sex - Apocalypse (Vinyl)" },
    { hour: 22, name: "Late Night Vinyl & Spiced Elixirs", track: "Bill Evans Trio - Autumn Leaves (Live 1968)" }
  ];

  const now = new Date();
  const currentHour = now.getHours();

  let activeVibe = vibes[0];
  for (let i = 0; i < vibes.length; i++) {
    if (currentHour >= vibes[i].hour) {
      activeVibe = vibes[i];
    }
  }

  vibeStatusText.innerHTML = `Current Vibe: <span>${activeVibe.name}</span>`;
  if (heroNowPlaying) {
    heroNowPlaying.textContent = activeVibe.track;
  }
}

/* ===================================================================
   5. WEB AUDIO API AMBIENT SOUNDSCAPE ENGINE
   =================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let masterGain = null;
let rainNode = null;
let loFiOsc1 = null;
let loFiOsc2 = null;

function initAudioEngine() {
  const toggleBtn = document.getElementById('ambientAudioToggle');
  const soundwaveBars = document.getElementById('soundwaveBars');
  const soundLabel = document.getElementById('soundLabel');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      setupSynthesizer();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      startAmbientAudio();
      isAudioPlaying = true;
      if (soundwaveBars) soundwaveBars.classList.add('playing');
      if (soundLabel) soundLabel.textContent = "Ambient Audio: On";
      toggleBtn.style.borderColor = 'var(--amber-gold)';
      showToast("🎶 Ambient Café Soundscape Playing");
    } else {
      stopAmbientAudio();
      isAudioPlaying = false;
      if (soundwaveBars) soundwaveBars.classList.remove('playing');
      if (soundLabel) soundLabel.textContent = "Ambient Audio";
      toggleBtn.style.borderColor = '';
      showToast("🔇 Ambient Soundscape Paused");
    }
  });
}

function setupSynthesizer() {
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);
}

function startAmbientAudio() {
  if (!audioCtx) return;

  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(650, audioCtx.currentTime);

  const rainGain = audioCtx.createGain();
  rainGain.gain.setValueAtTime(0.2, audioCtx.currentTime);

  whiteNoise.connect(lowpass);
  lowpass.connect(rainGain);
  rainGain.connect(masterGain);
  whiteNoise.start(0);
  rainNode = whiteNoise;

  loFiOsc1 = audioCtx.createOscillator();
  loFiOsc2 = audioCtx.createOscillator();
  loFiOsc1.type = 'triangle';
  loFiOsc2.type = 'sine';

  loFiOsc1.frequency.setValueAtTime(174.61, audioCtx.currentTime); // F3
  loFiOsc2.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4

  const padFilter = audioCtx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.setValueAtTime(420, audioCtx.currentTime);

  const padGain = audioCtx.createGain();
  padGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

  loFiOsc1.connect(padFilter);
  loFiOsc2.connect(padFilter);
  padFilter.connect(padGain);
  padGain.connect(masterGain);

  loFiOsc1.start();
  loFiOsc2.start();
}

function stopAmbientAudio() {
  try {
    if (rainNode) { rainNode.stop(); rainNode.disconnect(); }
    if (loFiOsc1) { loFiOsc1.stop(); loFiOsc1.disconnect(); }
    if (loFiOsc2) { loFiOsc2.stop(); loFiOsc2.disconnect(); }
  } catch (e) {
    // Graceful stop
  }
}

/* ===================================================================
   6. THE SPACES EXPLORER (CURATED SPATIAL ZONES)
   =================================================================== */
const spacesData = {
  greenhouse: {
    name: "The Sunlit Greenhouse Corner",
    tag: "Zone 01 • Reading & Plants",
    desc: "Bathed in natural morning sunlight filtered through our floor-to-ceiling glass atrium, surrounded by 40+ exotic monsteras, fiddle-leaf figs, and trailing pothos. The undisputed sanctuary for slow journaling, book club meetups, and contemplative pour-overs.",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Natural Golden Hour Sunlight",
      "Vintage Velvet Armchairs",
      "Botanical Curated Library",
      "Gentle Acoustic Volume Policy"
    ]
  },
  creator: {
    name: "The Creator Den & Co-Work Loft",
    tag: "Zone 02 • High Velocity Work",
    desc: "Engineered specifically for Vadodara's founders, designers, coders, and writers. Equipped with enterprise-grade 300 Mbps Wi-Fi 6, dual universal power outlets at every desk, noise-dampened acoustic ceilings, and endless specialty espresso fuel.",
    image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
    features: [
      "300 Mbps Fiber Wi-Fi 6",
      "Universal Charging at Every Seat",
      "Ergonomic Solid Oak Desks",
      "Complimentary Sparkling Water"
    ]
  },
  acoustic: {
    name: "The Acoustic Lounge & Vinyl Nook",
    tag: "Zone 03 • Music & Community",
    desc: "Featuring deep cognac leather Chesterfield sofas, a restored 1970s Technics turntable, and hundreds of original vinyl records spanning Motown, 90s indie rock, and Japanese jazz fusion. Our weekend live acoustic jam session stage.",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Analog Vinyl Turntable Station",
      "Warm Tungsten Edison Lighting",
      "Weekend Live Unplugged Sessions",
      "Intimate Communal Velvet Sofas"
    ]
  },
  roastery: {
    name: "The Cupping & Roastery Brew Bar",
    tag: "Zone 04 • Artisanal Craftsmanship",
    desc: "Sit front row at our manual brew bar. Experience live extractions on Chemex, V60, and Syphon pots with single-origin beans sourced directly from estates in Chikmagalur, Coorg, and Ethiopia. Led by SCA-certified baristas.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Live Manual V60 & Chemex Brewing",
      "Single-Origin Tasting Flights",
      "Certified Q-Grader Consultations",
      "Fresh Whole Bean Retail Counter"
    ]
  }
};

function initSpacesExplorer() {
  const tabs = document.querySelectorAll('.space-tab-btn');
  const spaceImg = document.getElementById('spaceImg');
  const spaceTag = document.getElementById('spaceTag');
  const spaceName = document.getElementById('spaceName');
  const spaceDesc = document.getElementById('spaceDesc');
  const spaceFeatures = document.getElementById('spaceFeatures');

  if (!tabs.length || !spaceName) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const zoneKey = tab.getAttribute('data-zone');
      const data = spacesData[zoneKey];
      if (!data) return;

      spaceImg.style.opacity = '0.3';
      setTimeout(() => {
        spaceImg.src = data.image;
        spaceTag.textContent = data.tag;
        spaceName.textContent = data.name;
        spaceDesc.textContent = data.desc;

        spaceFeatures.innerHTML = data.features.map(f => `
          <li><i class="fa-solid fa-circle-check"></i> ${f}</li>
        `).join('');

        spaceImg.style.opacity = '1';
      }, 200);
    });
  });
}

/* ===================================================================
   7. STRUCTURED MASTERPIECE MENU & TASTING NOTES
   =================================================================== */
const menuItems = [
  {
    id: 1,
    name: "Rose Cardamom Latte",
    category: "coffee",
    price: 280,
    badge: "Specialty Craft",
    badgeClass: "badge-special",
    desc: "Signature double espresso, steamed creamy oat milk, infused with organic Damask rose reduction and cracked green cardamom dust.",
    flavor: "Delicate floral, velvety warmth, aromatic spice",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    origin: "Chikmagalur Red Honey Process",
    calories: "165 kcal",
    allergens: "Oat"
  },
  {
    id: 2,
    name: "Vietnamese Iced Coffee",
    category: "coffee",
    price: 260,
    badge: "Café Favorite",
    badgeClass: "badge-bestseller",
    desc: "Traditional slow Phin drip dark roast coffee over silky sweetened condensed milk, poured over cracked mountain crystal ice.",
    flavor: "Dark cocoa, burnt caramel, bold richness",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    origin: "Da Lat Highland Robusta & Arabica blend",
    calories: "210 kcal",
    allergens: "Dairy"
  },
  {
    id: 3,
    name: "Spanish Latte",
    category: "coffee",
    price: 270,
    badge: "Popular Classic",
    badgeClass: "badge-special",
    desc: "Rich double ristretto layered over sweet caramelized whole milk, finished with a whisper of freshly grated Ceylon cinnamon.",
    flavor: "Toffee, smooth espresso punch, warm cinnamon",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
    origin: "Coorg Arabica Micro-lot",
    calories: "195 kcal",
    allergens: "Dairy"
  },
  {
    id: 4,
    name: "Single-Origin Chemex Pour-Over",
    category: "coffee",
    price: 240,
    badge: "Artisan Pour",
    badgeClass: "badge-bestseller",
    desc: "Hand-poured slow extraction. Highlights crisp fruit acidity, tea-like clarity, and subtle peach blossom aromatics.",
    flavor: "Jasmine, white peach, bergamot sweetness",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    origin: "Ethiopia Yirgacheffe Washed G1",
    calories: "5 kcal",
    allergens: "None"
  },
  {
    id: 5,
    name: "Belgian Hot Chocolate & Marshmallows",
    category: "beverages",
    price: 290,
    badge: "House Signature",
    badgeClass: "badge-special",
    desc: "Simmered 70% Callebaut dark chocolate with whole steamed milk, crowned with torched vanilla marshmallow fluff.",
    flavor: "Decadent bittersweet cacao, caramelized vanilla",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    origin: "Belgian Callebaut 70%",
    calories: "320 kcal",
    allergens: "Dairy"
  },
  {
    id: 6,
    name: "Ceremonial Uji Matcha Latte",
    category: "beverages",
    price: 320,
    badge: "Plant-Based",
    badgeClass: "badge-vegan",
    desc: "First-harvest ceremonial grade Japanese matcha, hand-whisked with bamboo chasen, Madagascar vanilla, and steamed oat milk.",
    flavor: "Grassy umami sweetness, velvety creaminess",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    origin: "Uji, Kyoto, Japan",
    calories: "140 kcal",
    allergens: "Oat"
  },
  {
    id: 7,
    name: "Hibiscus Wild Berry Cooler",
    category: "beverages",
    price: 220,
    badge: "Plant-Based",
    badgeClass: "badge-vegan",
    desc: "Cold-steeped ruby hibiscus flowers, muddled fresh blackberries, kaffir lime spritz, topped with effervescent sparkling soda.",
    flavor: "Tangy pomegranate, wild berry, refreshing floral fizz",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    origin: "Nilgiri Mountain Botanicals",
    calories: "85 kcal",
    allergens: "None"
  },
  {
    id: 8,
    name: "Truffle Mushroom Flaky Croissant",
    category: "snacks",
    price: 360,
    badge: "Bakery Special",
    badgeClass: "badge-special",
    desc: "Pure French butter laminated croissant stuffed with sautéed wild shiitake and button mushrooms, Gruyère cheese, and black truffle drizzle.",
    flavor: "Flaky butter crunch, earthy umami truffle, melted Gruyère",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    origin: "Artisanal bakery batch made fresh daily",
    calories: "380 kcal",
    allergens: "Gluten, Dairy"
  },
  {
    id: 9,
    name: "Avocado Sourdough Smash",
    category: "snacks",
    price: 340,
    badge: "Plant-Based",
    badgeClass: "badge-vegan",
    desc: "Thick slice of 36-hour fermented country sourdough, Hass avocado smash, charred cherry tomatoes, za'atar spice, radish pearls.",
    flavor: "Tangy sourdough crumb, creamy avocado, zesty herbal crunch",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    origin: "In-house stone-milled starter sourdough",
    calories: "310 kcal",
    allergens: "Gluten"
  },
  {
    id: 10,
    name: "Peri-Peri Paneer Brioche Pockets",
    category: "snacks",
    price: 290,
    badge: "Gourmet Bite",
    badgeClass: "badge-bestseller",
    desc: "Charred cottage cheese cubes tossed in house peri-peri glaze, smoked bell pepper relish, fresh mint herb aioli in toasted brioche pockets.",
    flavor: "Smoky heat, creamy herb coolness, buttery brioche",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    origin: "Local organic dairy cottage paneer",
    calories: "340 kcal",
    allergens: "Dairy, Gluten"
  },
  {
    id: 11,
    name: "Nutella Espresso Brownie Skillet",
    category: "desserts",
    price: 310,
    badge: "Dessert Special",
    badgeClass: "badge-special",
    desc: "Served warm in a cast-iron skillet. Fudgy espresso dark chocolate brownie with a molten Nutella center, Madagascar vanilla gelato.",
    flavor: "Warm molten chocolate, hazelnut indulgence, cold vanilla contrast",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    origin: "Single-origin Ghana Cocoa & house espresso",
    calories: "450 kcal",
    allergens: "Dairy, Nuts, Gluten"
  },
  {
    id: 12,
    name: "Pistachio Rose Milk Cake (Tres Leches)",
    category: "desserts",
    price: 330,
    badge: "Royal Sweet",
    badgeClass: "badge-bestseller",
    desc: "Pillow sponge cake soaked in three-milk saffron rose reduction, blanketed in whipped mascarpone and toasted Iranian pistachios.",
    flavor: "Melts-in-the-mouth sponge, fragrant rose saffron, crunchy pistachio",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    origin: "Inspired by Persian tea salons & royal Vadodara recipes",
    calories: "390 kcal",
    allergens: "Dairy, Gluten, Nuts"
  }
];

function initMenuSystem() {
  const menuContainer = document.getElementById('menuGridContainer');
  const filterBtns = document.querySelectorAll('.menu-filter-btn');

  if (!menuContainer) return;

  renderMenuItems(menuItems);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        renderMenuItems(menuItems);
      } else if (filter === 'vegan') {
        renderMenuItems(menuItems.filter(item => item.badge.includes('Plant-Based')));
      } else {
        renderMenuItems(menuItems.filter(item => item.category === filter));
      }
    });
  });
}

function renderMenuItems(items) {
  const menuContainer = document.getElementById('menuGridContainer');
  if (!menuContainer) return;

  menuContainer.style.opacity = '0.4';
  setTimeout(() => {
    menuContainer.innerHTML = items.map(item => `
      <article class="menu-card" data-category="${item.category}">
        <div class="menu-card-img-wrapper">
          <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
          <div class="menu-card-badges">
            <span class="menu-badge ${item.badgeClass}">${item.badge}</span>
          </div>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-header">
            <h3 class="menu-item-name">${item.name}</h3>
            <span class="menu-item-price">₹${item.price}</span>
          </div>
          <p class="menu-item-desc">${item.desc}</p>
          <div class="menu-flavor-notes">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>${item.flavor}</span>
          </div>
          <div class="menu-card-footer">
            <button class="btn-tasting-notes" onclick="openTastingNotes(${item.id})" aria-label="View tasting notes for ${item.name}">Tasting Notes</button>
            <button class="btn-add-tray" onclick="addToOrder(${item.id})" aria-label="Add ${item.name} to order tray">
              <i class="fa-solid fa-plus"></i> Add to Tray
            </button>
          </div>
        </div>
      </article>
    `).join('');
    menuContainer.style.opacity = '1';
  }, 120);
}

window.openTastingNotes = function(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return;

  const modalOverlay = document.getElementById('tastingModalOverlay');
  const modalContent = document.getElementById('tastingModalContent');
  if (!modalOverlay || !modalContent) return;

  modalContent.innerHTML = `
    <div style="display:flex; gap:1.2rem; align-items:center; margin-bottom:1.5rem;">
      <img src="${item.image}" style="width:100px; height:100px; border-radius:12px; object-fit:cover; border:1px solid var(--glass-border-strong);" alt="${item.name}">
      <div>
        <span class="section-tag" style="margin-bottom:0.4rem; padding:0.2rem 0.6rem;">${item.badge}</span>
        <h3 style="font-size:1.6rem; margin-top:0.2rem;">${item.name}</h3>
        <span style="font-family:var(--font-serif); font-size:1.3rem; color:var(--amber-gold); font-weight:700;">₹${item.price}</span>
      </div>
    </div>
    
    <div style="display:flex; flex-direction:column; gap:0.9rem; font-size:0.9rem; color:var(--toasted-oat); border-top:1px solid var(--border-subtle); border-bottom:1px solid var(--border-subtle); padding:1.2rem 0; margin-bottom:1.5rem;">
      <div><strong style="color:var(--text-main);">Origin / Source:</strong> ${item.origin}</div>
      <div><strong style="color:var(--text-main);">Flavor Profile:</strong> ${item.flavor}</div>
      <div><strong style="color:var(--text-main);">Nutrition:</strong> ${item.calories}</div>
      <div><strong style="color:var(--text-main);">Dietary / Allergens:</strong> ${item.allergens}</div>
    </div>

    <p style="font-size:0.92rem; line-height:1.6; margin-bottom:1.5rem; color:var(--soft-amber);">${item.desc}</p>

    <div style="display:flex; justify-content:flex-end; gap:0.8rem;">
      <button class="btn-secondary" onclick="closeTastingModal()">Close</button>
      <button class="btn-primary" onclick="addToOrder(${item.id}); closeTastingModal();">
        <i class="fa-solid fa-plus"></i> Add to Table Order (₹${item.price})
      </button>
    </div>
  `;

  modalOverlay.classList.add('open');
};

window.closeTastingModal = function() {
  const modalOverlay = document.getElementById('tastingModalOverlay');
  if (modalOverlay) modalOverlay.classList.remove('open');
};

/* ===================================================================
   8. ACCESSIBLE EDITORIAL GALLERY & LIGHTBOX
   =================================================================== */
const galleryItems = [
  {
    title: "Morning Golden Hour on Sourdough Bar",
    category: "Culinary Craft",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Single-Origin Manual Chemex Extraction",
    category: "Brew Bar",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Swan Latte Art with Organic Rose Dust",
    category: "Signature Coffee",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Analog Vinyl Listening Corner & Turntables",
    category: "Sound Sanctuary",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Floor-to-Ceiling Botanical Greenhouse Nook",
    category: "Spaces & Light",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "First-Harvest Stone-Ground Ceremonial Uji Matcha",
    category: "Japanese Elixirs",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=80"
  }
];

let currentLightboxIndex = 0;

function initEditorialGallery() {
  const container = document.getElementById('editorialGalleryGrid');
  const lightbox = document.getElementById('accessibleLightbox');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  if (!container || !lightbox) return;

  container.innerHTML = galleryItems.map((item, index) => `
    <article class="gallery-card" tabindex="0" role="button" aria-label="Open image: ${item.title}" onclick="openLightbox(${index})" onkeydown="if(event.key==='Enter') openLightbox(${index})">
      <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async">
      <div class="gallery-overlay">
        <h4 class="gallery-caption">${item.title}</h4>
        <span class="gallery-category-tag">${item.category}</span>
      </div>
    </article>
  `).join('');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => changeLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightbox(-1);
    if (e.key === 'ArrowRight') changeLightbox(1);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

window.openLightbox = function(index) {
  currentLightboxIndex = index;
  updateLightboxContent();
  const lightbox = document.getElementById('accessibleLightbox');
  if (lightbox) {
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    const closeBtn = document.getElementById('lightboxCloseBtn');
    if (closeBtn) closeBtn.focus();
  }
};

window.closeLightbox = function() {
  const lightbox = document.getElementById('accessibleLightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
};

function changeLightbox(delta) {
  currentLightboxIndex = (currentLightboxIndex + delta + galleryItems.length) % galleryItems.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const counter = document.getElementById('lightboxCounter');
  const item = galleryItems[currentLightboxIndex];

  if (!item) return;
  if (img) img.src = item.image;
  if (title) title.textContent = item.title;
  if (counter) counter.textContent = `Image ${currentLightboxIndex + 1} of ${galleryItems.length}`;
}

/* ===================================================================
   9. TABLE RESERVATIONS & DIRECT WHATSAPP ROUTING
   =================================================================== */
function initReservationValidation() {
  const form = document.getElementById('reservationForm');
  const zoneTiles = document.querySelectorAll('.zone-tile');
  const previewZone = document.getElementById('previewTicketZone');
  const previewTime = document.getElementById('previewTicketTime');
  const previewGuests = document.getElementById('previewTicketGuests');
  const previewDate = document.getElementById('previewTicketDate');

  let selectedZone = "The Sunlit Greenhouse Corner";

  zoneTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      zoneTiles.forEach(t => t.classList.remove('selected'));
      tile.classList.add('selected');
      selectedZone = tile.getAttribute('data-zone-name');
      if (previewZone) previewZone.textContent = selectedZone;
    });
  });

  const resDateInput = document.getElementById('resDate');
  const resTimeInput = document.getElementById('resTime');
  const resGuestsInput = document.getElementById('resGuests');

  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.value = today;
    resDateInput.min = today;
    resDateInput.addEventListener('change', (e) => {
      if (previewDate) previewDate.textContent = e.target.value;
    });
  }

  if (resTimeInput) {
    resTimeInput.addEventListener('change', (e) => {
      if (previewTime) previewTime.textContent = e.target.options[e.target.selectedIndex].text;
    });
  }

  if (resGuestsInput) {
    resGuestsInput.addEventListener('change', (e) => {
      if (previewGuests) previewGuests.textContent = `${e.target.value} Guests`;
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('resName');
      const phoneInput = document.getElementById('resPhone');
      const dateInput = document.getElementById('resDate');
      const timeInput = document.getElementById('resTime');
      const guestsInput = document.getElementById('resGuests');
      const notesInput = document.getElementById('resNotes');

      let isValid = true;

      // Validate Name
      const nameVal = nameInput.value.trim();
      const nameErr = document.getElementById('resNameError');
      if (nameVal.length < 2) {
        nameInput.classList.add('invalid');
        if (nameErr) { nameErr.textContent = "Please enter your full name (minimum 2 characters)"; nameErr.classList.add('visible'); }
        isValid = false;
      } else {
        nameInput.classList.remove('invalid');
        if (nameErr) nameErr.classList.remove('visible');
      }

      // Validate Phone
      const phoneVal = phoneInput.value.trim();
      const phoneErr = document.getElementById('resPhoneError');
      const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneVal.replace(/\s+/g, ''))) {
        phoneInput.classList.add('invalid');
        if (phoneErr) { phoneErr.textContent = "Please enter a valid 10-digit Indian phone number"; phoneErr.classList.add('visible'); }
        isValid = false;
      } else {
        phoneInput.classList.remove('invalid');
        if (phoneErr) phoneErr.classList.remove('visible');
      }

      // Validate Date
      const dateVal = dateInput.value;
      const dateErr = document.getElementById('resDateError');
      const today = new Date().toISOString().split('T')[0];
      if (!dateVal || dateVal < today) {
        dateInput.classList.add('invalid');
        if (dateErr) { dateErr.textContent = "Please select today or a future date"; dateErr.classList.add('visible'); }
        isValid = false;
      } else {
        dateInput.classList.remove('invalid');
        if (dateErr) dateErr.classList.remove('visible');
      }

      if (!isValid) {
        showToast("⚠️ Please correct the marked fields before submitting");
        return;
      }

      const reservationData = {
        name: nameVal,
        phone: phoneVal,
        date: dateVal,
        time: timeInput.options[timeInput.selectedIndex].text,
        guests: guestsInput.value,
        zone: selectedZone,
        notes: notesInput ? notesInput.value.trim() : ""
      };

      // 1. SAVE TO DATABASE (Supabase + Local Database)
      if (window.BrewDB) {
        await window.BrewDB.addReservation(reservationData);
      }

      // 2. SHOW DIRECT CONFIRMATION MODAL WITH DIRECT WHATSAPP LINK
      showReservationTransparencyModal(reservationData);
    });
  }
}

function showReservationTransparencyModal(details) {
  const modalOverlay = document.getElementById('tastingModalOverlay');
  const modalContent = document.getElementById('tastingModalContent');
  if (!modalOverlay || !modalContent) return;

  const waMessage = encodeURIComponent(
    `Hello The Brew House Concierge! I'd like to reserve a table at the Alkapuri café.\n\n` +
    `• Name: ${details.name}\n` +
    `• Phone: ${details.phone}\n` +
    `• Date: ${details.date}\n` +
    `• Time Session: ${details.time}\n` +
    `• Party Size: ${details.guests} Guests\n` +
    `• Spatial Zone: ${details.zone}\n` +
    (details.notes ? `• Special Requests: ${details.notes}\n` : '') +
    `\nPlease confirm table availability. Thank you!`
  );

  // Direct clean WhatsApp link — ZERO alerts!
  const targetPhone = (CONFIG.WHATSAPP_PHONE && CONFIG.WHATSAPP_PHONE !== "YOUR_PHONE_NUMBER_HERE") 
    ? CONFIG.WHATSAPP_PHONE 
    : "919876543210";

  const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${waMessage}`;

  modalContent.innerHTML = `
    <div style="text-align:center; padding:1.2rem 0;">
      <div style="font-size:3.2rem; color:#2ECC71; margin-bottom:0.8rem;">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <span class="section-tag" style="margin-bottom:0.6rem; background:rgba(46,204,113,0.15); color:#2ECC71; border-color:#2ECC71;">Saved to Database ✓</span>
      <h3 style="font-size:1.8rem; margin:0.3rem 0;">Reservation Request Confirmed!</h3>
      
      <p style="color:var(--toasted-oat); font-size:0.92rem; max-width:480px; margin:0 auto 1.4rem; line-height:1.6;">
        Your reservation for <strong>${details.name}</strong> has been stored in the database. Click below to instantly connect with our concierge on WhatsApp with your pre-filled details!
      </p>

      <div class="booking-preview-ticket" style="margin-bottom:1.5rem; text-align:left;">
        <div class="ticket-header">
          <span class="ticket-tag">CONFIRMED RESERVATION PASS</span>
          <h4 style="font-size:1.2rem; margin-top:0.2rem;">${details.zone}</h4>
        </div>
        <div class="ticket-rows">
          <div class="ticket-row"><span class="label">Primary Guest:</span><span class="val">${details.name}</span></div>
          <div class="ticket-row"><span class="label">Contact Phone:</span><span class="val">${details.phone}</span></div>
          <div class="ticket-row"><span class="label">Date:</span><span class="val">${details.date}</span></div>
          <div class="ticket-row"><span class="label">Time Session:</span><span class="val">${details.time}</span></div>
          <div class="ticket-row"><span class="label">Party Size:</span><span class="val">${details.guests} Guests</span></div>
        </div>
      </div>

      <div style="display:flex; justify-content:center; gap:0.8rem; flex-wrap:wrap;">
        <a href="${waUrl}" target="_blank" rel="noopener" class="btn-whatsapp">
          <i class="fa-brands fa-whatsapp"></i> Open in WhatsApp Concierge
        </a>
        <button class="btn-secondary" onclick="openLivePortal('reservations'); closeTastingModal();">
          <i class="fa-solid fa-database"></i> View in Live Portal
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
}

/* ===================================================================
   10. NEWSLETTER & DATABASE INTEGRATION (THE SECRET BREW LIST)
   =================================================================== */
function initNewsletterIntegration() {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('newsletterEmailInput');

  if (!form || !input) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email) return;

    if (window.BrewDB) {
      const res = await window.BrewDB.addNewsletter(email);
      if (res.alreadyExists) {
        showToast(`ℹ️ ${email} is already in the database!`);
      } else {
        showToast(`✓ ${email} saved to database! Click 'Live Portal' to view.`);
      }
    } else {
      showToast(`✓ Subscribed: ${email}`);
    }

    input.value = '';
    // Refresh portal if open
    if (typeof renderPortalData === 'function') {
      renderPortalData();
    }
  });
}

/* ===================================================================
   11. LIVE DATA & CAFÉ MANAGER PORTAL (ADMIN DASHBOARD)
   =================================================================== */
function initDataPortalUI() {
  // Global keyboard shortcut: Ctrl+Shift+D to open portal
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      openLivePortal();
    }
  });
}

window.openLivePortal = function(defaultTab = 'newsletter') {
  const portalOverlay = document.getElementById('portalModalOverlay');
  if (!portalOverlay) return;

  portalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  switchPortalTab(defaultTab);
  renderPortalData();
};

window.closeLivePortal = function() {
  const portalOverlay = document.getElementById('portalModalOverlay');
  if (portalOverlay) {
    portalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.switchPortalTab = function(tabName) {
  const tabBtns = document.querySelectorAll('.portal-tab-btn');
  const tabPanes = document.querySelectorAll('.portal-tab-content');

  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  tabPanes.forEach(pane => {
    if (pane.id === `portalPane_${tabName}`) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });
};

function renderPortalData() {
  if (!window.BrewDB) return;

  const reservations = window.BrewDB.getReservations();
  const newsletter = window.BrewDB.getNewsletter();
  const orders = window.BrewDB.getOrders();
  const config = window.BrewDB.getSupabaseConfig();

  // Update counters
  const countRes = document.getElementById('portalCountReservations');
  const countNl = document.getElementById('portalCountNewsletter');
  const countOrd = document.getElementById('portalCountOrders');

  if (countRes) countRes.textContent = reservations.length;
  if (countNl) countNl.textContent = newsletter.length;
  if (countOrd) countOrd.textContent = orders.length;

  // Update connection status badge
  const statusBadge = document.getElementById('portalConnectionStatus');
  if (statusBadge) {
    if (config.isConnected) {
      statusBadge.className = 'db-badge-confirmed';
      statusBadge.innerHTML = '<i class="fa-solid fa-cloud"></i> Supabase Cloud Active';
    } else {
      statusBadge.className = 'db-badge-pending';
      statusBadge.innerHTML = '<i class="fa-solid fa-hard-drive"></i> Local Persistent Storage (Zero-Config Active)';
    }
  }

  // 1. Render Newsletter Subscribers Table
  const nlBody = document.getElementById('portalNewsletterTableBody');
  if (nlBody) {
    if (newsletter.length === 0) {
      nlBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-dim);">No newsletter subscribers yet. Submit the footer form to test!</td></tr>`;
    } else {
      nlBody.innerHTML = newsletter.map((item, idx) => `
        <tr>
          <td><strong>${idx + 1}</strong></td>
          <td><span style="color:var(--amber-gold); font-weight:600;">${item.email}</span></td>
          <td>${new Date(item.created_at).toLocaleString()}</td>
          <td>
            <button class="btn-db-action" onclick="deleteNewsletterItem('${item.id}')">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  // 2. Render Reservations Table
  const resBody = document.getElementById('portalReservationsTableBody');
  if (resBody) {
    if (reservations.length === 0) {
      resBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-dim);">No reservations received yet.</td></tr>`;
    } else {
      resBody.innerHTML = reservations.map(r => `
        <tr>
          <td><strong>${r.guest_name}</strong></td>
          <td>${r.phone}</td>
          <td>${r.reservation_date} (${r.time_session})</td>
          <td>${r.spatial_zone}</td>
          <td><span style="font-weight:700;">${r.party_size}</span></td>
          <td><span class="db-badge-confirmed">${r.status}</span></td>
          <td>
            <button class="btn-db-action" onclick="deleteReservationItem('${r.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  // 3. Render Orders Table
  const ordBody = document.getElementById('portalOrdersTableBody');
  if (ordBody) {
    if (orders.length === 0) {
      ordBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-dim);">No tray orders simulated yet.</td></tr>`;
    } else {
      ordBody.innerHTML = orders.map(o => `
        <tr>
          <td><strong>${o.order_code}</strong></td>
          <td>${o.items ? o.items.map(i => `${i.qty}x ${i.name}`).join(', ') : 'Items'}</td>
          <td><span style="color:var(--amber-gold); font-weight:700;">₹${o.total_amount}</span></td>
          <td>${new Date(o.created_at).toLocaleString()}</td>
          <td><span class="db-badge-confirmed">${o.status}</span></td>
        </tr>
      `).join('');
    }
  }

  // 4. Fill in Supabase config inputs
  const urlInput = document.getElementById('portalSupabaseUrl');
  const keyInput = document.getElementById('portalSupabaseKey');
  if (urlInput && !urlInput.value) urlInput.value = config.url;
  if (keyInput && !keyInput.value) keyInput.value = config.key;
}

window.deleteNewsletterItem = function(id) {
  if (window.BrewDB) {
    window.BrewDB.deleteNewsletter(id);
    renderPortalData();
    showToast("Email deleted from database");
  }
};

window.deleteReservationItem = function(id) {
  if (window.BrewDB) {
    window.BrewDB.deleteReservation(id);
    renderPortalData();
    showToast("Reservation deleted from database");
  }
};

window.exportNewsletterCSV = function() {
  if (!window.BrewDB) return;
  const list = window.BrewDB.getNewsletter();
  if (list.length === 0) {
    showToast("⚠️ No emails to export");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Email,Source,SubscribedAt\n";
  list.forEach(item => {
    csvContent += `"${item.email}","${item.source || 'Website'}","${item.created_at}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `the_brew_house_subscribers_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("📥 Exported CSV file successfully!");
};

window.saveSupabaseConfigFromUI = function() {
  const url = document.getElementById('portalSupabaseUrl').value.trim();
  const key = document.getElementById('portalSupabaseKey').value.trim();

  if (!url || !key) {
    showToast("⚠️ Please enter both Supabase URL and Key");
    return;
  }

  if (window.BrewDB) {
    window.BrewDB.setSupabaseConfig(url, key);
    renderPortalData();
    showToast("⚡ Supabase credentials saved! Testing cloud connection...");
  }
};

window.copySupabaseSQL = function() {
  const sql = document.getElementById('supabaseSchemaCode').innerText;
  navigator.clipboard.writeText(sql).then(() => {
    showToast("📋 Supabase SQL Schema copied to clipboard!");
  }).catch(() => {
    showToast("Please copy manually from the box below.");
  });
};

/* ===================================================================
   12. LIVE ORDER SIMULATOR & DRAWER
   =================================================================== */
let orderTray = [];
let appliedDiscount = 0;

function initOrderDrawer() {
  const cartTrigger = document.getElementById('cartDrawerTrigger');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cartTrigger) {
    cartTrigger.addEventListener('click', () => toggleCartDrawer(true));
  }
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => toggleCartDrawer(false));
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => toggleCartDrawer(false));
  }

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', applyPromoCode);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleSimulatedCheckout);
  }
}

function toggleCartDrawer(open) {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  if (open) {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
  } else {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
  }
}

window.addToOrder = function(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return;

  const existing = orderTray.find(i => i.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    orderTray.push({ ...item, qty: 1 });
  }

  updateCartUI();
  showToast(`✨ Added "${item.name}" to tray`);
  toggleCartDrawer(true);
};

window.updateCartQty = function(itemId, delta) {
  const item = orderTray.find(i => i.id === itemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    orderTray = orderTray.filter(i => i.id !== itemId);
  }
  updateCartUI();
};

function updateCartUI() {
  const cartList = document.getElementById('cartItemsList');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTax = document.getElementById('cartTax');
  const cartDiscount = document.getElementById('cartDiscount');
  const cartGrandTotal = document.getElementById('cartGrandTotal');

  const totalCount = orderTray.reduce((acc, item) => acc + item.qty, 0);
  if (cartCountBadge) cartCountBadge.textContent = totalCount;

  if (!cartList) return;

  if (orderTray.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-mug-saucer"></i>
        <h4>Your tray is currently empty</h4>
        <p style="font-size:0.85rem; margin-top:0.4rem;">Select your favorite artisan brews & gourmet bites from our menu to simulate an order.</p>
      </div>
    `;
  } else {
    cartList.innerHTML = orderTray.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-meta">
          <h5>${item.name}</h5>
          <span>₹${item.price} each</span>
        </div>
        <div class="cart-qty-controls">
          <button class="btn-qty" onclick="updateCartQty(${item.id}, -1)" aria-label="Decrease quantity">-</button>
          <span style="font-weight:600; font-size:0.9rem;">${item.qty}</span>
          <button class="btn-qty" onclick="updateCartQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
    `).join('');
  }

  const subtotal = orderTray.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = Math.round(subtotal * 0.05);
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const grandTotal = Math.max(0, subtotal + tax - discountAmount);

  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
  if (cartTax) cartTax.textContent = `₹${tax}`;
  if (cartDiscount) cartDiscount.textContent = `-₹${discountAmount}`;
  if (cartGrandTotal) cartGrandTotal.textContent = `₹${grandTotal}`;
}

function applyPromoCode() {
  const input = document.getElementById('promoCodeInput');
  const msg = document.getElementById('promoMsg');
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (code === 'BREWVIBE10') {
    appliedDiscount = 0.10;
    msg.style.color = '#2ECC71';
    msg.textContent = '🎉 10% Discount Applied!';
  } else if (code === 'CREATORPASS') {
    appliedDiscount = 0.15;
    msg.style.color = '#2ECC71';
    msg.textContent = '🚀 15% Creator Pass Discount Applied!';
  } else {
    msg.style.color = 'var(--terracotta)';
    msg.textContent = 'Promo codes: "BREWVIBE10" or "CREATORPASS"';
  }
  updateCartUI();
}

async function handleSimulatedCheckout() {
  if (orderTray.length === 0) {
    showToast("⚠️ Please add at least one item to place an order");
    return;
  }

  const orderId = `TBH-${Math.floor(1000 + Math.random() * 9000)}`;
  const subtotal = orderTray.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const grandTotal = Math.round(subtotal * (1 - appliedDiscount) * 1.05);
  const orderSummary = orderTray.map(i => `${i.qty}x ${i.name}`).join(', ');

  // Save to Database
  if (window.BrewDB) {
    await window.BrewDB.addOrder({
      orderCode: orderId,
      items: orderTray,
      total: grandTotal,
      phone: 'Table Order'
    });
  }

  const waText = encodeURIComponent(
    `Hello The Brew House! I would like to place an order from table / pickup.\n\n` +
    `• Order ID: ${orderId}\n` +
    `• Items: ${orderSummary}\n` +
    `• Estimated Total: ₹${grandTotal}\n\n` +
    `Looking forward to the brew!`
  );

  const targetPhone = CONFIG.WHATSAPP_PHONE || "919876543210";
  const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${waText}`;

  toggleCartDrawer(false);

  const modalOverlay = document.getElementById('tastingModalOverlay');
  const modalContent = document.getElementById('tastingModalContent');
  if (modalOverlay && modalContent) {
    modalContent.innerHTML = `
      <div style="text-align:center; padding:1.2rem 0;">
        <div style="font-size:3rem; color:#2ECC71; margin-bottom:0.8rem;">
          <i class="fa-solid fa-mug-saucer"></i>
        </div>
        <span class="section-tag" style="margin-bottom:0.6rem; background:rgba(46,204,113,0.15); color:#2ECC71; border-color:#2ECC71;">Saved to Database ✓</span>
        <h3 style="font-size:1.7rem; margin:0.3rem 0;">Order #${orderId} Dispatched!</h3>
        <p style="color:var(--toasted-oat); font-size:0.9rem; max-width:440px; margin:0 auto 1.4rem;">
          Your order is saved into the database and ready to send to our barista team on WhatsApp.
        </p>

        <div style="background:rgba(255,255,255,0.04); border:1px dashed var(--glass-border-strong); border-radius:12px; padding:1.2rem; margin-bottom:1.5rem; text-align:left; font-size:0.88rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span style="color:var(--text-dim);">Items:</span>
            <span style="color:var(--text-main); font-weight:600;">${orderSummary}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-dim);">Total Amount:</span>
            <span style="color:var(--amber-gold); font-weight:700;">₹${grandTotal}</span>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:0.8rem; flex-wrap:wrap;">
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn-whatsapp">
            <i class="fa-brands fa-whatsapp"></i> Send to WhatsApp Concierge
          </a>
          <button class="btn-secondary" onclick="openLivePortal('orders'); closeTastingModal();">
            <i class="fa-solid fa-database"></i> View in Live Portal
          </button>
        </div>
      </div>
    `;
    modalOverlay.classList.add('open');
  }

  orderTray = [];
  updateCartUI();
}

/* ===================================================================
   13. INTERACTIVE VADODARA MAP LANDMARKS & STYLES
   =================================================================== */
function initInteractiveMap() {
  const styleBtns = document.querySelectorAll('.map-style-btn');
  const mapSvg = document.getElementById('mapGridSvg');
  const landmarkPills = document.querySelectorAll('.landmark-pill');
  const distanceEstimate = document.getElementById('landmarkDistanceText');

  styleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      styleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const style = btn.getAttribute('data-style');
      if (style === 'golden') {
        mapSvg.style.filter = 'sepia(0.8) hue-rotate(330deg) saturate(1.4)';
      } else if (style === 'streets') {
        mapSvg.style.filter = 'contrast(1.3) brightness(0.9)';
      } else {
        mapSvg.style.filter = 'none';
      }
    });
  });

  landmarkPills.forEach(pill => {
    pill.addEventListener('click', () => {
      landmarkPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const dist = pill.getAttribute('data-dist');
      const name = pill.textContent.trim();
      if (distanceEstimate) {
        distanceEstimate.textContent = `📍 ${name}: Approx. ${dist} driving distance to The Brew House Alkapuri.`;
      }
    });
  });
}

/* ===================================================================
   TOAST NOTIFICATION HELPER
   =================================================================== */
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translate3d(-50%, 100px, 0)';
    toast.style.background = 'rgba(26, 18, 11, 0.95)';
    toast.style.color = '#F3EFEA';
    toast.style.padding = '0.75rem 1.4rem';
    toast.style.borderRadius = '9999px';
    toast.style.border = '1px solid var(--glass-border-strong)';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    toast.style.fontSize = '0.88rem';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '99999';
    toast.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translate3d(-50%, 0, 0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate3d(-50%, 100px, 0)';
  }, 3200);
}
