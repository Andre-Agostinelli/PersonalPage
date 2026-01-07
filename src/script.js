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
   TIMELINE SYSTEM
   =================== */
// Timeline configuration
const timelineEvents = [
  {
    date: '1995',
    title: 'Born',
    description: 'Started my journey in the world',
    phase: 0
  },
  {
    date: '2000',
    title: 'First Computer',
    description: 'Got my first computer and fell in love with technology',
    phase: 0
  },
  {
    date: '2008',
    title: 'Started Coding',
    description: 'Wrote my first "Hello World" program',
    phase: 1
  },
  {
    date: '2013',
    title: 'High School',
    description: 'Began competitive programming',
    phase: 1
  },
  {
    date: '2017',
    title: 'College',
    description: 'Started Computer Science degree',
    phase: 2
  },
  {
    date: '2019',
    title: 'First Internship',
    description: 'Software engineering intern at tech company',
    phase: 2
  },
  {
    date: '2021',
    title: 'Graduated',
    description: 'BS in Computer Science',
    phase: 3
  },
  {
    date: '2022',
    title: 'First Job',
    description: 'Software Engineer at startup',
    phase: 3
  },
  {
    date: '2024',
    title: 'Senior Engineer',
    description: 'Promoted to senior position',
    phase: 4
  },
  {
    date: '2025',
    title: 'Present',
    description: 'Building amazing things',
    phase: 4
  }
];

// Phase colors
const phaseColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

class Timeline {
  constructor(events) {
    this.events = events;
    this.svg = document.querySelector('.timeline-svg');
    this.segmentsGroup = document.querySelector('.timeline-segments');
    this.eventsGroup = document.querySelector('.timeline-events');
    this.tooltipsContainer = document.querySelector('.timeline-tooltips');
    this.width = 1400;
    this.height = 400;
    this.rowHeight = 120;
    this.pointsPerRow = 4;
    this.margin = 100; // More margin for wider use of page
    
    this.init();
  }
  
  init() {
    this.calculatePoints();
    this.renderSegments();
    this.renderEvents();
    this.adjustSVGHeight();
  }
  
  calculatePoints() {
    const points = [];
    const rows = Math.ceil(this.events.length / this.pointsPerRow);
    const availableWidth = this.width - (2 * this.margin);
    const spacing = availableWidth / (this.pointsPerRow - 1);
    
    this.events.forEach((event, i) => {
      const row = Math.floor(i / this.pointsPerRow);
      const colInRow = i % this.pointsPerRow;
      
      // Alternate direction each row
      const isReverse = row % 2 === 1;
      const col = isReverse ? (this.pointsPerRow - 1 - colInRow) : colInRow;
      
      const x = this.margin + (spacing * col);
      const y = row * this.rowHeight + 80;
      
      points.push({ x, y, event, index: i });
    });
    
    this.points = points;
  }
  
  renderSegments() {
    this.segmentsGroup.innerHTML = '';
    
    for (let i = 0; i < this.points.length - 1; i++) {
      const start = this.points[i];
      const end = this.points[i + 1];
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Create smooth curved path
      const startRow = Math.floor(i / this.pointsPerRow);
      const endRow = Math.floor((i + 1) / this.pointsPerRow);
      
      let pathData;
      if (startRow !== endRow) {
        // Row transition - smooth S curve
        const midY = (start.y + end.y) / 2;
        const controlOffset = 80;
        pathData = `M ${start.x} ${start.y} 
                    C ${start.x} ${start.y + controlOffset}, 
                      ${end.x} ${end.y - controlOffset}, 
                      ${end.x} ${end.y}`;
      } else {
        // Same row - gentle curve
        const controlOffset = 30;
        const midX = (start.x + end.x) / 2;
        pathData = `M ${start.x} ${start.y} 
                    Q ${midX} ${start.y - controlOffset}, 
                      ${end.x} ${end.y}`;
      }
      
      path.setAttribute('d', pathData);
      path.setAttribute('stroke-width', 4);
      path.setAttribute('fill', 'none');
      
      // Color based on phase transition
      const startPhase = start.event.phase;
      const endPhase = end.event.phase;
      
      if (startPhase === endPhase) {
        // Same phase - solid color
        path.setAttribute('stroke', phaseColors[startPhase]);
      } else {
        // Phase transition - gradient
        const gradientId = `gradient-${i}`;
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
        gradient.setAttribute('x1', start.x);
        gradient.setAttribute('y1', start.y);
        gradient.setAttribute('x2', end.x);
        gradient.setAttribute('y2', end.y);
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', `stop-color:${phaseColors[startPhase]};stop-opacity:1`);
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', `stop-color:${phaseColors[endPhase]};stop-opacity:1`);
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        
        const defs = this.svg.querySelector('defs') || this.svg.insertBefore(
          document.createElementNS('http://www.w3.org/2000/svg', 'defs'),
          this.svg.firstChild
        );
        defs.appendChild(gradient);
        
        path.setAttribute('stroke', `url(#${gradientId})`);
      }
      
      this.segmentsGroup.appendChild(path);
    }
  }
  
  renderEvents() {
    this.eventsGroup.innerHTML = '';
    this.tooltipsContainer.innerHTML = '';
    
    this.points.forEach((point, i) => {
      // Create circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x);
      circle.setAttribute('cy', point.y);
      circle.setAttribute('r', 10);
      circle.setAttribute('fill', 'white');
      circle.setAttribute('stroke', phaseColors[point.event.phase]);
      circle.setAttribute('stroke-width', 4);
      circle.classList.add('timeline-point');
      circle.dataset.index = i;
      
      this.eventsGroup.appendChild(circle);
      
      // Determine tooltip position
      const row = Math.floor(i / this.pointsPerRow);
      const colInRow = i % this.pointsPerRow;
      
      // Alternate above/below
      const isAbove = i % 2 === 0;
      
      // Check if at edge (first or last in row)
      const isLeftEdge = colInRow === 0;
      const isRightEdge = colInRow === this.pointsPerRow - 1;
      
      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.classList.add('timeline-tooltip');
      tooltip.dataset.index = i;
      tooltip.innerHTML = `
        <div class="font-bold text-lg mb-1">${point.event.title}</div>
        <div class="text-sm opacity-75 mb-2">${point.event.date}</div>
        ${point.event.description ? `<div class="text-sm">${point.event.description}</div>` : ''}
      `;
      
      // Store position info
      tooltip.dataset.position = isAbove ? 'above' : 'below';
      tooltip.dataset.edge = isLeftEdge ? 'left' : isRightEdge ? 'right' : 'center';
      
      this.tooltipsContainer.appendChild(tooltip);
      
      // Create connector line
      const connector = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      connector.classList.add('tooltip-connector');
      connector.dataset.index = i;
      connector.setAttribute('stroke', phaseColors[point.event.phase]);
      connector.setAttribute('stroke-width', 2);
      connector.style.opacity = '0';
      this.eventsGroup.appendChild(connector);
      
      // Event listeners
      circle.addEventListener('mouseenter', () => this.showTooltip(i, point));
      circle.addEventListener('mouseleave', () => this.hideTooltip(i));
    });
  }
  
  showTooltip(index, point) {
    const circle = this.eventsGroup.querySelector(`circle[data-index="${index}"]`);
    const tooltip = this.tooltipsContainer.querySelector(`.timeline-tooltip[data-index="${index}"]`);
    const connector = this.eventsGroup.querySelector(`.tooltip-connector[data-index="${index}"]`);
    
    circle.setAttribute('r', 14);
    
    // Get positions relative to the SVG container
    const svgRect = this.svg.getBoundingClientRect();
    const tooltipsRect = this.tooltipsContainer.getBoundingClientRect();
    
    const scaleX = svgRect.width / this.width;
    const scaleY = svgRect.height / this.svg.viewBox.baseVal.height;
    
    // Calculate point position in screen coordinates
    const pointScreenX = point.x * scaleX;
    const pointScreenY = point.y * scaleY;
    
    // Get offset between SVG and tooltips container
    const offsetX = svgRect.left - tooltipsRect.left;
    const offsetY = svgRect.top - tooltipsRect.top;
    
    const position = tooltip.dataset.position;
    const edge = tooltip.dataset.edge;
    
    // Position relative to tooltips container
    let tooltipX = pointScreenX + offsetX;
    let tooltipY = (position === 'above' ? pointScreenY - 100 : pointScreenY + 100) + offsetY;
    
    // Adjust for edges
    if (edge === 'left') {
      tooltipX = pointScreenX + 80 + offsetX;
    } else if (edge === 'right') {
      tooltipX = pointScreenX - 80 + offsetX;
    }
    
    tooltip.style.left = `${tooltipX}px`;
    tooltip.style.top = `${tooltipY}px`;
    tooltip.classList.add('active');
    
    // Update connector line
    const tooltipCenterX = tooltipX - offsetX;
    const tooltipCenterY = (tooltipY - offsetY) + 40;
    
    connector.setAttribute('x1', point.x);
    connector.setAttribute('y1', point.y);
    connector.setAttribute('x2', tooltipCenterX / scaleX);
    connector.setAttribute('y2', tooltipCenterY / scaleY);
    connector.style.opacity = '0.6';
  }
  
  hideTooltip(index) {
    const circle = this.eventsGroup.querySelector(`circle[data-index="${index}"]`);
    const tooltip = this.tooltipsContainer.querySelector(`.timeline-tooltip[data-index="${index}"]`);
    const connector = this.eventsGroup.querySelector(`.tooltip-connector[data-index="${index}"]`);
    
    circle.setAttribute('r', 10);
    tooltip.classList.remove('active');
    connector.style.opacity = '0';
  }
  
  adjustSVGHeight() {
    const rows = Math.ceil(this.events.length / this.pointsPerRow);
    const newHeight = rows * this.rowHeight + 160;
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${newHeight}`);
  }
}

// Initialize timeline
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Timeline(timelineEvents);
  });
} else {
  new Timeline(timelineEvents);
}

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