/**
 * STAR ELECTRICALS - Modern Business Website Interactivity & Multilingual Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Active Navigation link updater on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // 3. Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeDrawer = () => {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 4. Multilingual Language Switcher Logic
  initLanguageSwitcher();

  // 5. Modal Event Listeners
  const openModalButtons = document.querySelectorAll('.open-quote-modal');
  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      openQuoteModal();
    });
  });

  // Close modals on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuoteModal();
      closeDetailLightbox();
      closeDrawer();
      closeLangDropdown();
    }
  });

  // Close modal when clicking on overlay background
  const quoteModalOverlay = document.getElementById('quoteModalOverlay');
  if (quoteModalOverlay) {
    quoteModalOverlay.addEventListener('click', (e) => {
      if (e.target === quoteModalOverlay) {
        closeQuoteModal();
      }
    });
  }

  const detailLightbox = document.getElementById('detailLightbox');
  if (detailLightbox) {
    detailLightbox.addEventListener('click', (e) => {
      if (e.target === detailLightbox) {
        closeDetailLightbox();
      }
    });
  }
});

/**
 * Multilingual Language Engine
 */
const langDisplayNames = {
  en: "English",
  ta: "தமிழ்",
  hi: "हिन्दी",
  te: "తెలుగు",
  ml: "മലയാളം",
  kn: "ಕನ್ನಡ"
};

function initLanguageSwitcher() {
  const langDropdownContainer = document.getElementById('langDropdownContainer');
  const langBtn = document.getElementById('langBtn');
  const langOptions = document.querySelectorAll('.lang-option');
  const mobileLangBtns = document.querySelectorAll('.mobile-lang-btn');

  // Toggle Dropdown
  if (langBtn && langDropdownContainer) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdownContainer.classList.toggle('open');
      const isExpanded = langDropdownContainer.classList.contains('open');
      langBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!langDropdownContainer.contains(e.target)) {
        closeLangDropdown();
      }
    });
  }

  // Desktop Language Option Click
  langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedLang = opt.getAttribute('data-lang');
      setLanguage(selectedLang);
      closeLangDropdown();
    });
  });

  // Mobile Language Button Click
  mobileLangBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      setLanguage(selectedLang);
    });
  });

  // Load Initial Language (Stored or Default)
  const savedLang = localStorage.getItem('star_elect_lang') || 'en';
  setLanguage(savedLang);
}

function closeLangDropdown() {
  const container = document.getElementById('langDropdownContainer');
  const langBtn = document.getElementById('langBtn');
  if (container) {
    container.classList.remove('open');
  }
  if (langBtn) {
    langBtn.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Apply Selected Language to the entire page
 */
function setLanguage(lang) {
  if (typeof translations === 'undefined' || !translations[lang]) {
    lang = 'en';
  }

  const dict = translations[lang];
  document.documentElement.lang = lang;
  localStorage.setItem('star_elect_lang', lang);

  // Update current language label
  const currentLangLabel = document.getElementById('currentLangLabel');
  if (currentLangLabel) {
    currentLangLabel.textContent = langDisplayNames[lang] || 'English';
  }

  // Update desktop active state
  document.querySelectorAll('.lang-option').forEach(opt => {
    if (opt.getAttribute('data-lang') === lang) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  // Update mobile active state
  document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Translate all [data-i18n] text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Translate all [data-i18n-placeholder] input fields
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

/**
 * Open Quick Quote Modal
 */
function openQuoteModal(defaultService = '') {
  const modal = document.getElementById('quoteModalOverlay');
  const serviceSelect = document.getElementById('modalService');
  if (serviceSelect && defaultService) {
    serviceSelect.value = defaultService;
  }
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close Quick Quote Modal
 */
function closeQuoteModal() {
  const modal = document.getElementById('quoteModalOverlay');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Select Service & Smooth scroll to Quote form or open modal
 */
function selectServiceInForm(serviceName) {
  const formService = document.getElementById('formService');
  if (formService) {
    formService.value = serviceName;
  }
  
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    const nameField = document.getElementById('formName');
    if (nameField) {
      setTimeout(() => nameField.focus(), 600);
    }
  } else {
    openQuoteModal(serviceName);
  }
}

/**
 * STAR ELECTRICALS - Products Catalog Data
 */
const productsCatalog = {
  led: {
    key: "led",
    category: "LIGHTING SOLUTIONS",
    title: "LED Street & Focus Lights",
    badge: "24W to 400W",
    image: "assets/images/product-led-hd.jpg",
    description: "High-power energy-efficient outdoor and industrial LED lighting engineered for superior lumen output, extended operational lifespan, and heavy weather resistance.",
    specs: [
      "LED Street Lights: 24W to 400W (High Lumen)",
      "Focus / Flood Lights: 50W to 400W Heavy-Duty",
      "Commercial High-Bay Fixtures & Downlights",
      "IP65 / IP66 Dust & Water Ingress Protection",
      "Inbuilt 4kV / 10kV Surge & Spike Protection",
      "IS / ISI Certified with High Heat-Dissipation Housing"
    ],
    serviceName: "High-Mast Lighting"
  },
  poles: {
    key: "poles",
    category: "INFRASTRUCTURE & LIGHTING",
    title: "High-Mast & Lighting Poles",
    badge: "5m to 30m Height",
    image: "assets/images/product-pole-hd.jpg",
    description: "Heavy-duty hot-dip galvanized steel high-mast towers and octagonal/tubular poles engineered to withstand high wind velocities for highways, stadiums, and industrial yards.",
    specs: [
      "High Mast Poles: 5m to 30m Height Available",
      "Octagonal & Polygonal Street Light Poles",
      "Hot-Dip Galvanized (GI) Anti-Rust Protection",
      "Motorized / Manual Winch & Headframe Assemblies",
      "Custom Multi-Fixture Luminaire Brackets & Flanges",
      "Structural Wind-Load & Safety Standards Compliant"
    ],
    serviceName: "High-Mast Lighting"
  },
  solar: {
    key: "solar",
    category: "RENEWABLE ENERGY",
    title: "Solar Panels, Inverters & Battery Storage",
    badge: "1 kW to Multi-MW",
    image: "assets/images/product-solar-hd.jpg",
    description: "Tier-1 solar photovoltaic panels, hybrid and grid-tie inverters, and scalable battery energy storage systems (BESS) from residential rooftop setups up to multi-megawatt industrial solar plants.",
    specs: [
      "Mono PERC, TOPCon & Bifacial Solar PV Panels",
      "Hybrid, On-Grid & Off-Grid Solar Inverters",
      "Battery Storage Systems: 1 kW to MW Capacity",
      "Lithium-Ion (LiFePO4) & Solar Tubular Batteries",
      "Galvanized Module Mounting Structures & Walkways",
      "MNRE / Net-Metering Approved Quality Standards"
    ],
    serviceName: "Solar Panel Solutions"
  },
  timers: {
    key: "timers",
    category: "AUTOMATION & CONTROL",
    title: "Automatic Timers",
    badge: "1,000W to 4,000W",
    image: "assets/images/product-timers-hd.jpg",
    description: "Astronomical and programmable digital timer switches designed for automated dawn-to-dusk control and cyclic scheduling of electrical loads without manual intervention.",
    specs: [
      "Load Capacity: 1,000W to 4,000W (1 kW to 4 kW)",
      "Astronomical Auto Sunset/Sunrise Street Light Switching",
      "Digital 24-Hour & 7-Day Cyclic Event Scheduling",
      "Agricultural Pump & Motor Automation Support",
      "Inbuilt Battery Backup (Saves Program During Outages)",
      "Din-Rail & Control Box Enclosure Mounting"
    ],
    serviceName: "Automatic Timer Installation"
  },
  panels: {
    key: "panels",
    category: "SWITCHGEAR & METERING",
    title: "Distribution Panels & Energy Meters",
    badge: "Digital Meters & DB Panels",
    image: "assets/images/product-panels-hd.jpg",
    description: "Precision digital energy meters, custom power distribution boards, motor control centers, and phase changers for residential, commercial, and industrial electrical systems.",
    specs: [
      "Single-Phase & 3-Phase Digital Energy Meters",
      "CT / PT Operated Industrial Sub-meters & KWh Meters",
      "Custom Fabricated MCB / MCCB Distribution Enclosures",
      "Automatic Phase Changers & Busbar Chambers",
      "Powder-Coated Weatherproof IP55 / IP65 Sheet Steel",
      "Complete Short-Circuit & Overload Protection"
    ],
    serviceName: "Electrical Installation"
  },
  cables: {
    key: "cables",
    category: "ELECTRICAL MATERIAL",
    title: "Cables & Wires",
    badge: "Armored & Submersible",
    image: "assets/images/product-cables-hd.jpg",
    description: "Copper and Aluminum insulated power transmission conductors, flexible house wiring, armored underground cables, and submersible pump flat cables.",
    specs: [
      "Armored Power Cables (LT & HT Under-Ground)",
      "Copper & Aluminum Multi-Strand Flexible Wires",
      "Heavy-Duty Flat Submersible Pump Cables",
      "IS / ISI Certified Flame Retardant (FR / FRLS)",
      "Multi-Core Industrial Flexible Sheathed Cables",
      "Bulk Wholesale & Retail Project Supply"
    ],
    serviceName: "Electrical Material Supply"
  },
  switches: {
    key: "switches",
    category: "WIRING DEVICES",
    title: "Switches & Sockets",
    badge: "Modular & Smart Touch",
    image: "assets/images/product-switches-hd.jpg",
    description: "Modern designer modular switch plates, smart WiFi/touch automation controllers, metal-clad industrial high-amp sockets, and heavy-duty motor isolators.",
    specs: [
      "Designer Modular Switch Plates & Luxury Touches",
      "Smart Touch & WiFi Automation Switches",
      "Industrial Metal-Clad Waterproof Sockets (16A–63A)",
      "Heavy-Duty AC & Motor Rotary Isolators",
      "Fire-Resistant Polycarbonate Safety Material",
      "Certified Shock-Proof & Child-Safety Shutters"
    ],
    serviceName: "Electrical Material Supply"
  },
  other: {
    key: "other",
    category: "HARDWARE & ACCESSORIES",
    title: "Other Electrical Materials",
    badge: "Trays, Conduits & Earthing",
    image: "assets/images/product-other-hd.jpg",
    description: "Complete inventory of commercial electrical installation hardware including cable trays, conduit pipes, chemical earthing electrodes, lugs, and safety equipment.",
    specs: [
      "Perforated & Ladder-Type Hot-Dip GI Cable Trays",
      "GI & PVC Rigid Conduit Pipes and Accessories",
      "Chemical Earthing Electrodes, Copper Rods & Compound",
      "Copper / Aluminum Cable Lugs & Brass Cable Glands",
      "Lightning Protection Arrestors & Surge Suppressors",
      "Safety Rubber Mats, Warning Tapes & Crimping Tools"
    ],
    serviceName: "Electrical Material Supply"
  }
};

/**
 * Open Product Information Modal with Custom Specifications
 */
function openProductModal(productKey) {
  const modal = document.getElementById('detailLightbox');
  const content = document.getElementById('lightboxContent');
  const prod = productsCatalog[productKey] || productsCatalog.led;
  
  if (modal && content) {
    const specsHtml = prod.specs.map(item => `
      <li style="display: flex; align-items: flex-start; gap: 8px;">
        <i class="fa-solid fa-circle-check" style="color: var(--primary-orange); margin-top: 3px; font-size: 0.85rem; flex-shrink: 0;"></i>
        <span>${item}</span>
      </li>
    `).join('');

    content.innerHTML = `
      <div style="text-align: left;">
        <div style="width: 100%; height: 180px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 16px; background: #f8fafc; border: 1px solid var(--border-light); display: flex; align-items: center; justify-content: center; padding: 12px;">
          <img src="${prod.image}" alt="${prod.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
          <span class="section-tag" style="margin-bottom: 0;">${prod.category}</span>
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary-orange); background: rgba(255, 122, 0, 0.1); padding: 3px 10px; border-radius: var(--radius-full); text-transform: uppercase;">${prod.badge}</span>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--primary-navy); margin-bottom: 8px; font-weight: 700;">${prod.title}</h3>
        <p style="color: var(--text-secondary); line-height: 1.55; margin-bottom: 18px; font-size: 0.92rem;">
          ${prod.description}
        </p>
        <div style="background-color: var(--bg-subtle); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px; border: 1px solid var(--border-light);">
          <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-list-check" style="color: var(--primary-orange);"></i> Available Specifications & Ratings:
          </h4>
          <ul class="modal-specs-list">
            ${specsHtml}
          </ul>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn-primary" style="flex: 1;" onclick="closeDetailLightbox(); selectServiceInForm('${prod.serviceName}');">
            <span>Inquire About ${prod.title}</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Backward compatibility wrapper
 */
function openProductDetail(title, description) {
  // Check if title maps to a known key
  const t = (title || '').toLowerCase();
  if (t.includes('pole')) return openProductModal('poles');
  if (t.includes('led')) return openProductModal('led');
  if (t.includes('solar')) return openProductModal('solar');
  if (t.includes('timer')) return openProductModal('timers');
  if (t.includes('panel') || t.includes('meter')) return openProductModal('panels');
  if (t.includes('cable') || t.includes('wire')) return openProductModal('cables');
  if (t.includes('switch') || t.includes('socket')) return openProductModal('switches');
  if (t.includes('other')) return openProductModal('other');

  // Fallback to custom
  openProductModal('led');
}

/**
 * STAR ELECTRICALS - Real Projects Showcase Catalog Data
 */
const projectsCatalog = {
  'solar-rooftop': {
    title: 'Solar PV & Hybrid Inverter Systems',
    category: 'RESIDENTIAL & COMMERCIAL ROOFTOP',
    badge: '1 kW to MW Scale',
    image: 'assets/images/project-solar-residential-hd.jpg',
    description: 'Turnkey rooftop and ground-mounted solar photovoltaic installations. Engineered with high-efficiency Mono PERC / TOPCon bifacial modules, hybrid grid-tied inverters, and battery storage configurations ranging from 1 kW residential setups to industrial megawatt projects.',
    specs: [
      'Capacity Scalability: 1 kW Rooftop to MW Ground Mount',
      'Tier-1 Mono PERC & TOPCon High-Efficiency Solar PV Modules',
      'Hybrid Inverters with Smart Net-Metering & Grid-Export Support',
      'Lithium LiFePO4 / Tubular Battery Energy Storage Systems',
      'Hot-Dip Galvanized Module Mounting Structure (150+ km/h Wind Rated)',
      'TANGEDCO Net-Metering Grid Approval & Subsidy Guidance'
    ],
    serviceName: 'Solar Panel Solutions'
  },
  'high-mast': {
    title: 'High-Mast Lighting Towers',
    category: 'INDUSTRIAL & HIGHWAY ILLUMINATION',
    badge: '5m to 30m Height',
    image: 'assets/images/project-highmast-industrial-hd.jpg',
    description: 'Fabrication, civil foundation casting, erection, and commissioning of heavy-duty polygonal galvanized high-mast lighting towers and street poles. Tailored for highway junctions, industrial yards, sports arenas, and toll plazas across Tamil Nadu.',
    specs: [
      'High-Mast Tower Heights: 5 meters to 30 meters',
      'Floodlight Luminaires: 50W to 400W High-Lumen Outdoor Fixtures',
      'Dual-Drum Motorized / Manual Winch & Trailing Cable Assembly',
      'Hot-Dip Galvanized Coating for 25+ Years Corrosion Prevention',
      'Astronomical Automated Dusk-to-Dawn Timer Control Panel',
      'Tested to IS:875 Wind-Load Standards with Lightning Arrestors'
    ],
    serviceName: 'High-Mast Lighting'
  },
  'street-lighting': {
    title: 'Municipal LED Street Lighting & Poles',
    category: 'SMART MUNICIPAL INFRASTRUCTURE',
    badge: '24W – 400W LED & Poles',
    image: 'assets/images/project-street-lighting-hd.jpg',
    description: 'Government and municipal road lighting projects featuring energy-efficient 24W to 400W outdoor LED street luminaires & poles, octagonal hot-dip galvanized poles, underground armored cable routing, and automated sectional switching.',
    specs: [
      'LED Street Light Luminaires: 24W to 400W High-Lumen Fixtures',
      'Octagonal & Swaged Galvanized Iron (GI) Poles (5m to 12m)',
      'Underground 4-Core Armored XLPE Cable Trenching & Laying',
      'Integrated Inbuilt 4kV / 10kV Surge & Lightning Protection',
      'Energy Saving Phase Timer Panels with Overload Cutoffs',
      'IP66 Rated Water-Proof & Dust-Tight Die-Cast Aluminum Enclosures'
    ],
    serviceName: 'High-Mast Lighting'
  },
  'automatic-timers': {
    title: 'Automated Astronomical Timer Panels',
    category: 'HEAVY LOAD & PUMP AUTOMATION',
    badge: '1,000W to 4,000W',
    image: 'assets/images/product-timers-hd.jpg',
    description: 'Automated scheduling panels using astronomical and programmable micro-controller timers. Engineered for street light grids, warehouse lighting, and agricultural motor pump automation with capacities from 1 kW up to 4 kW.',
    specs: [
      'Rated Load Switching: 1,000W to 4,000W (1 kW to 4 kW)',
      'Astronomical Location-Based Auto Sunset / Sunrise Switching',
      'Heavy-Duty Contactor & Overload Relay Protection Enclosures',
      'Agricultural Submersible Pump Cyclic Timer Automation',
      'Internal Rechargeable Lithium Battery Keeps Settings During Blackouts',
      'Substantial Energy & Labor Savings with Zero Manual Dependency'
    ],
    serviceName: 'Automatic Timer Installation'
  },
  'institutional-solar': {
    title: 'Institutional Solar & Battery Microgrid',
    category: 'INSTITUTIONAL & UTILITY SCALE',
    badge: 'Battery Storage Microgrid',
    image: 'assets/images/project-solar-institutional-hd.jpg',
    description: 'High-capacity clean energy systems for educational campuses, hospitals, and commercial facilities. Featuring integrated solar array networks, heavy-duty industrial inverters, and battery energy storage for 24/7 continuous mission-critical power.',
    specs: [
      'Multi-Rooftop Solar Array Integration with Microgrid Support',
      'LiFePO4 Lithium Iron Phosphate Energy Storage Units',
      'Zero-Export Grid Limiters & DG-Synchronization Systems',
      'Cloud-Based Real-Time Remote Energy Monitoring & App Telemetry',
      'Uninterrupted Power Backup for Critical Medical & Institutional Loads',
      'Long-Term Maintenance & Preventive Inspection Service Contract'
    ],
    serviceName: 'Solar Panel Solutions'
  }
};

/**
 * Open Project Lightbox Preview with Detailed Specifications
 */
function openProjectLightbox(projectKey, categoryFallback, imageFallback) {
  const modal = document.getElementById('detailLightbox');
  const content = document.getElementById('lightboxContent');
  
  const proj = projectsCatalog[projectKey] || {
    title: projectKey || 'Featured Electrical Project',
    category: categoryFallback || 'PROJECT SHOWCASE',
    badge: 'Turnkey Execution',
    image: imageFallback || 'assets/images/project-solar-residential-hd.jpg',
    description: 'Executed with certified high-grade components, rigorous safety compliance, precision engineering, and dedicated ongoing maintenance by STAR ELECTRICALS.',
    specs: [
      'High-Grade Certified Components & IS/ISI Standards',
      'Complete On-Site Engineering, Erection & Commissioning',
      'Rigorous Safety & Insulation Resistance Testing',
      'Comprehensive Warranty & Lifetime Technical Support'
    ],
    serviceName: 'Electrical Installation'
  };

  if (modal && content) {
    const specsHtml = (proj.specs || []).map(item => `
      <li style="display: flex; align-items: flex-start; gap: 8px;">
        <i class="fa-solid fa-circle-check" style="color: var(--primary-orange); margin-top: 3px; font-size: 0.85rem; flex-shrink: 0;"></i>
        <span>${item}</span>
      </li>
    `).join('');

    content.innerHTML = `
      <div style="text-align: left;">
        <div style="width: 100%; height: 220px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 16px; border: 1px solid var(--border-light); background: #0f172a; position: relative;">
          <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <span style="position: absolute; top: 12px; left: 12px; background: rgba(10, 25, 49, 0.88); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.25); color: #ffaa5b; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; padding: 4px 10px; border-radius: var(--radius-full); text-transform: uppercase;">
            ${proj.badge}
          </span>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
          <span class="section-tag" style="margin-bottom: 0;">${proj.category}</span>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--primary-navy); margin-bottom: 8px; font-weight: 700;">${proj.title}</h3>
        <p style="color: var(--text-secondary); line-height: 1.55; margin-bottom: 16px; font-size: 0.92rem;">
          ${proj.description}
        </p>
        <div style="background-color: var(--bg-subtle); padding: 14px 16px; border-radius: var(--radius-md); margin-bottom: 20px; border: 1px solid var(--border-light);">
          <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-screwdriver-wrench" style="color: var(--primary-orange);"></i> Project Scope & Technical Capabilities:
          </h4>
          <ul class="modal-specs-list">
            ${specsHtml}
          </ul>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn-primary" style="flex: 1;" onclick="closeDetailLightbox(); selectServiceInForm('${proj.serviceName}');">
            <span>Inquire About Similar Project</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close Detail Lightbox
 */
function closeDetailLightbox() {
  const modal = document.getElementById('detailLightbox');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Send Quote Submission to starelectrical801@gmail.com
 * Powered by direct API transmission with mailto fallback
 */
async function sendQuoteEmail(quoteData, submitBtn, formElement) {
  const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending to starelectrical801@gmail.com...</span>`;
  }

  const payload = {
    "Client Name": quoteData.name,
    "Phone Number": quoteData.phone,
    "Email Address": quoteData.email || "Not Provided",
    "Service Requested": quoteData.service,
    "Project Requirements": quoteData.message || "No additional requirements specified",
    "_subject": `[STAR ELECTRICALS] New Quote Request: ${quoteData.service} - ${quoteData.name}`,
    "_template": "table",
    "_captcha": "false"
  };

  try {
    const response = await fetch("https://formsubmit.co/ajax/starelectrical801@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const currentLang = localStorage.getItem('star_elect_lang') || 'en';
    let thankMsg = `✓ Thank you, ${quoteData.name}! Your quote request has been sent to starelectrical801@gmail.com. We will contact you at ${quoteData.phone} shortly.`;
    if (currentLang === 'ta') {
      thankMsg = `✓ நன்றி, ${quoteData.name}! உங்கள் மேற்கோள் கோரிக்கை starelectrical801@gmail.com முகவரிக்கு வெற்றிகரமாக அனுப்பப்பட்டது. விரைவில் ${quoteData.phone} எண்ணில் தொடர்புகொள்வோம்.`;
    } else if (currentLang === 'hi') {
      thankMsg = `✓ धन्यवाद, ${quoteData.name}! आपका अनुरोध starelectrical801@gmail.com पर भेज दिया गया है। हम जल्द ही ${quoteData.phone} पर संपर्क करेंगे।`;
    }

    showToast(thankMsg, 6000);
    if (formElement) formElement.reset();

  } catch (error) {
    console.warn("Direct API submission encountered issue, falling back to mailto link:", error);
    
    // Direct Mailto Fallback
    const mailtoSubject = encodeURIComponent(`[Quote Request] ${quoteData.service} - ${quoteData.name}`);
    const mailtoBody = encodeURIComponent(
      `Hello STAR ELECTRICALS,\n\nI would like to request a quote with the following details:\n\n` +
      `Name: ${quoteData.name}\n` +
      `Phone: ${quoteData.phone}\n` +
      `Email: ${quoteData.email || 'N/A'}\n` +
      `Service: ${quoteData.service}\n` +
      `Requirements / Message:\n${quoteData.message || 'N/A'}\n\n` +
      `Please provide estimation and details.\nThank you!`
    );

    window.location.href = `mailto:starelectrical801@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    showToast(`Opening your email client to send to starelectrical801@gmail.com!`, 5000);
    if (formElement) formElement.reset();
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  }
}

/**
 * Send Quote details directly via WhatsApp (+91 73975 25538)
 */
function sendQuoteViaWhatsApp(formId) {
  let name, phone, email, service, message;
  if (formId === 'modalQuoteForm') {
    name = document.getElementById('modalName')?.value?.trim();
    phone = document.getElementById('modalPhone')?.value?.trim();
    email = document.getElementById('modalEmail')?.value?.trim();
    service = document.getElementById('modalService')?.value || 'General Inquiry';
    message = document.getElementById('modalMessage')?.value?.trim();
  } else {
    name = document.getElementById('formName')?.value?.trim();
    phone = document.getElementById('formPhone')?.value?.trim();
    email = document.getElementById('formEmail')?.value?.trim();
    service = document.getElementById('formService')?.value || 'General Inquiry';
    message = document.getElementById('formMessage')?.value?.trim();
  }

  if (!name || !phone) {
    showToast("Please enter your name and phone number before sending via WhatsApp.", 4000);
    return;
  }

  let text = `*New Quote Request - STAR ELECTRICALS*\n\n` +
             `*Client Name:* ${name}\n` +
             `*Phone Number:* ${phone}\n` +
             (email ? `*Email:* ${email}\n` : '') +
             `*Service Required:* ${service}\n`;
  if (message) {
    text += `*Requirements:* ${message}\n`;
  }
  text += `\nPlease provide estimation and details.`;

  const waUrl = `https://wa.me/917397525538?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  
  if (formId === 'modalQuoteForm') {
    closeQuoteModal();
  }
}

/**
 * Handle Contact Section Quote Form Submission
 */
async function handleQuoteSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('quoteForm');
  const submitBtn = document.getElementById('btnSubmitQuote') || form.querySelector('button[type="submit"]');
  const name = document.getElementById('formName').value.trim();
  const phone = document.getElementById('formPhone').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const service = document.getElementById('formService').value;
  const message = document.getElementById('formMessage').value.trim();

  await sendQuoteEmail({ name, phone, email, service, message }, submitBtn, form);
}

/**
 * Handle Modal Quote Form Submission
 */
async function handleModalQuoteSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('modalQuoteForm');
  const submitBtn = document.getElementById('btnSubmitModalQuote') || form.querySelector('button[type="submit"]');
  const name = document.getElementById('modalName').value.trim();
  const phone = document.getElementById('modalPhone').value.trim();
  const email = document.getElementById('modalEmail').value.trim();
  const service = document.getElementById('modalService').value;
  const message = document.getElementById('modalMessage').value.trim();

  closeQuoteModal();
  await sendQuoteEmail({ name, phone, email, service, message }, submitBtn, form);
}

/**
 * Display Animated Toast Notification
 */
function showToast(message, duration = 4500) {
  const toast = document.getElementById('toastBox');
  const toastMsg = document.getElementById('toastMessage');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
}
