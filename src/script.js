/* ===================
   THEME MANAGER
   =================== */

const ThemeManager = {
  toggleBtn: document.getElementById('theme-toggle'),

  apply(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      if (this.toggleBtn) this.toggleBtn.textContent = '☀️';
    } else {
      document.body.classList.remove('dark');
      if (this.toggleBtn) this.toggleBtn.textContent = '🌙';
    }
  },

  initialize() {
    const stored = localStorage.getItem('theme');
    const theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.apply(theme);
    
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        this.apply(newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }
  }
};

/* ===================
   SPLASH SCREEN
   =================== */

const SplashScreen = {
  async typewriter(element, text, speed = 100) {
    return new Promise((resolve) => {
      let i = 0;
      element.classList.add('typewriter-cursor');
      
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          element.classList.remove('typewriter-cursor');
          resolve();
        }
      }
      type();
    });
  },

  fadeInElements(elements) {
    requestAnimationFrame(() => {
      elements.forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    });
  },

  hide() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    splash.style.opacity = '0';
    splash.style.transition = 'opacity 0.7s ease-out';
    
    setTimeout(() => {
      splash.remove();
      document.body.style.overflow = '';
      NavigationManager.initialize();
      MarqueeSystem.initialize();
    }, 700);
  },

  async initialize() {
    document.body.style.overflow = 'hidden';
    
    const typewriterEl = document.getElementById('typewriter-text');
    const subtitle = document.getElementById('subtitle-text');
    const clickText = document.getElementById('click-text');
    const splash = document.getElementById('splash-screen');
    
    if (!typewriterEl || !splash) return;

    await this.typewriter(typewriterEl, "Hi, I'm Andre", 150);
    this.fadeInElements([subtitle, clickText]);
    
    setTimeout(() => {
      if (clickText) clickText.classList.add('flash');
    }, 800);
    
    splash.addEventListener('click', () => this.hide(), { once: true });
  }
};

/* ===================
   NAVIGATION MANAGER
   =================== */

const NavigationManager = {
  links: document.querySelectorAll('nav a[data-page]'),
  sections: document.querySelectorAll('main section.page'),
  
  activeClasses: ['active-tab', 'bg-slate-500', 'text-white', 'dark:bg-slate-200', 'dark:text-black'],
  hoverClasses: ['hover:bg-slate-400', 'dark:hover:bg-slate-200', 'hover:text-white', 'dark:hover:text-black'],

  updateActiveLink(activeId) {
    this.links.forEach(link => {
      this.activeClasses.forEach(cls => link.classList.remove(cls));
      link.classList.remove('bg-slate-400', 'text-white', 'dark:bg-slate-500');
      this.hoverClasses.forEach(cls => link.classList.add(cls));
      
      if (link.dataset.page === activeId) {
        this.hoverClasses.forEach(cls => link.classList.remove(cls));
        link.classList.add('bg-slate-400', 'text-white', 'dark:bg-slate-500');
      }
    });
  },

  setupScrollObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveLink(entry.target.dataset.nav);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => observer.observe(section));
  },

  setupClickHandlers() {
    this.links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.page);
        if (!target) return;

        const headerHeight = document.querySelector('nav').offsetHeight;
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      });
    });
  },

  initialize() {
    this.setupScrollObserver();
    this.setupClickHandlers();
    this.updateActiveLink('home');
    
    if (!window.waveField) {
      window.waveField = new WaveField();
    }
  }
};

/* ===================
   MARQUEE SYSTEM
   =================== */

const MarqueeSystem = {
  initialize() {
    document.querySelectorAll('.marquee-row').forEach(row => {
      const content = row.querySelector('.marquee-content');
      if (!content) return;
      
      // Get all original icons
      const icons = Array.from(content.children);
      if (icons.length === 0) return;
      
      // Calculate how many icons we need to fill the screen plus buffer
      const iconWidth = 100; // min-width from CSS
      const gap = 32; // 2rem = 32px
      const iconTotalWidth = iconWidth + gap;
      const viewportWidth = window.innerWidth;
      
      // We need enough duplicates so that we have 2x the viewport width worth of icons
      // This ensures when one set scrolls off, the duplicate is already in position
      const iconsNeeded = Math.ceil((viewportWidth * 2) / iconTotalWidth);
      const duplications = Math.ceil(iconsNeeded / icons.length);
      
      // Duplicate the entire set enough times
      for (let i = 0; i < duplications; i++) {
        icons.forEach(icon => {
          const clone = icon.cloneNode(true);
          content.appendChild(clone);
        });
      }
      
      // Calculate animation duration based on content width for consistent speed
      const totalIcons = content.children.length;
      const contentWidth = totalIcons * iconTotalWidth;
      
      // Speed: pixels per second (adjust this value to change speed)
      const speed = 50; // pixels per second
      const duration = (contentWidth / 2) / speed; // Divide by 2 because we animate 50% of content
      
      content.style.animationDuration = `${duration}s`;
    });
  }
};

/* ===================
   WAVE FIELD
   =================== */

class WaveField {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'wave-field';
    this.ctx = this.canvas.getContext('2d');

    document.body.prepend(this.canvas);
    Object.assign(this.canvas.style, {
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      zIndex: '-1',
      pointerEvents: 'none'
    });

    this.mouse = { x: 0.5, y: 0.5 };
    this.waves = [];
    this.config = {
      bands: 3,
      wavesPerBand: 3,
      resizeDebounce: 150
    };

    this.resize();
    this.setupWaves();
    this.bindEvents();
    this.animate();
  }

  setupWaves() {
    const isDark = document.body.classList.contains('dark');
    const baseColors = isDark
      ? ['#5eead4', '#2dd4bf', '#67e8f9']
      : ['#22c55e', '#16a34a', '#4ade80'];

    this.waves = [];
    const bandHeight = this.height / this.config.bands;

    for (let b = 0; b < this.config.bands; b++) {
      for (let i = 0; i < this.config.wavesPerBand; i++) {
        this.waves.push({
          bandIndex: b,
          amplitude: bandHeight / (3 + i),
          wavelength: 200 + i * 60,
          speed: 0.015 + i * 0.006,
          direction: (b + i) % 2 === 0 ? 1 : -1,
          color: baseColors[(b + i) % baseColors.length],
          alpha: 0.22 - i * 0.03,
          phaseOffset: Math.random() * Math.PI * 2,
          isCos: (b + i) % 2 === 0
        });
      }
    }
  }

  bindEvents() {
    window.addEventListener('resize', this.debouncedResize.bind(this));
    
    document.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX / window.innerWidth;
      this.mouse.y = e.clientY / window.innerHeight;
    });

    document.addEventListener('touchmove', e => {
      if (e.touches[0]) {
        this.mouse.x = e.touches[0].clientX / window.innerWidth;
        this.mouse.y = e.touches[0].clientY / window.innerHeight;
      }
    });

    const observer = new MutationObserver(() => this.setupWaves());
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
  }

  debouncedResize() {
    clearTimeout(this._resizeTimeout);
    this._resizeTimeout = setTimeout(() => this.resize(), this.config.resizeDebounce);
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.setupWaves();
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const ampReact = 1 + (this.mouse.y - 0.5) * 0.8;
    const phaseReact = (this.mouse.x - 0.5) * Math.PI;

    this.waves.forEach(wave => {
      this.ctx.beginPath();
      const bandTop = (wave.bandIndex + 0.5) * (this.height / this.config.bands);
      wave.phaseOffset += wave.speed * wave.direction * 0.4;
      const phaseShift = wave.phaseOffset + phaseReact * 1.5;
      const fn = wave.isCos ? Math.cos : Math.sin;

      for (let x = 0; x <= this.width; x++) {
        const y = bandTop + fn((x / wave.wavelength) * 2 * Math.PI + phaseShift) * wave.amplitude * ampReact;
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }

      this.ctx.strokeStyle = this.hexToRgba(wave.color, wave.alpha);
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });
  }

  hexToRgba(hex, alpha) {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
}

/* ===================
   INITIALIZATION
   =================== */

document.addEventListener('DOMContentLoaded', async () => {
  ThemeManager.initialize();
  await SplashScreen.initialize();
});