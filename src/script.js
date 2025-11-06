// Navigation tabs switching
const links = document.querySelectorAll('nav a[data-page]');
const pages = document.querySelectorAll('main section.page');

const activeTabClasses = [
    'active-tab',
    'bg-slate-500',        
    'text-white',           
    'dark:bg-slate-200',    
    'dark:text-black'       
];

const hoverTabClasses = [
    'hover:bg-slate-400',
    'dark:hover:bg-slate-200',
    'hover:text-white',
    'dark:hover:text-black',
];

// Typewriter effect for splash screen
function typewriterEffect(element, text, speed = 100) {
  return new Promise((resolve) => {
    let i = 0;
    element.classList.add('typewriter-cursor');
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        // Remove cursor and resolve promise when done
        element.classList.remove('typewriter-cursor');
        resolve();
      }
    }
    
    type();
  });
}

function hideSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  initializePageAndTabs();

  if (splashScreen) {
    splashScreen.style.opacity = '0';
    splashScreen.style.transition = 'opacity 0.7s ease-out';
    
    setTimeout(() => {
      splashScreen.remove();
      document.body.style.overflow = '';
    }, 700);
  }
}

// Theme toggle button logic
const themeToggleBtn = document.getElementById('theme-toggle');

// Function to apply a theme
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = '☀️'; // Sun icon for dark mode
        }
    } else {
        document.body.classList.remove('dark');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = '🌙'; // Moon icon for light mode
        }
    }
}

// Function to set the initial theme based on localStorage or system preference
function setInitialTheme() {
    // 1. Check localStorage first for explicit user preference
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
        applyTheme(storedTheme);
    } else {
        // 2. If no stored preference, check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }
}

// Event listener for theme toggle button
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark')) {
            applyTheme('light');
            localStorage.setItem('theme', 'light'); // Save preference
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark'); // Save preference
        }
    });
}

// On content DOM load (page refresh)
document.addEventListener('DOMContentLoaded', async () => {
  document.body.style.overflow = 'hidden';
  setInitialTheme();
  requestAnimationFrame(()=>requestAnimationFrame(initCircularMarquees));
  window.addEventListener('resize',resizeMarquee); 
  
  const typewriterElement = document.getElementById('typewriter-text');
  const subtitleText = document.getElementById('subtitle-text');
  const clickText = document.getElementById('click-text');
  const splashScreen = document.getElementById('splash-screen');
  
  if (typewriterElement && splashScreen) {
    // 1. Type the name (subtitle is invisible during this)
    await typewriterEffect(typewriterElement, "Hi, I'm Andre", 150);

  // ------------------ ROBUST INLINE FADE (replace existing subtitle/click code) ------------------
    // Use rAF so the browser registers the starting values, then flip to animated values
    requestAnimationFrame(() => {
      if (subtitleText) {
        subtitleText.style.opacity = '1';
        subtitleText.style.transform = 'translateY(0)';
      }
      if (clickText) {
        clickText.style.opacity = '1';
        clickText.style.transform = 'translateY(0)';
        // add the flashing effect after fade-in completes
        setTimeout(() => {
          clickText.classList.add('flash');
        }, 800); // wait for the fade duration (~0.7s) before flashing
      }
    });
    
    splashScreen.addEventListener('click', () => {
      //clearTimeout(autoHideTimeout);
      hideSplashScreen();
    }, { once: true });
  }
});

// Add click listeners to navigation links (existing logic)
links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');

        pages.forEach(page => {
            page.classList.add('hidden');
            page.classList.remove('block');
        });
        document.getElementById(pageId).classList.remove('hidden');
        document.getElementById(pageId).classList.add('block');

        links.forEach(l => {
            activeTabClasses.forEach(cls => l.classList.remove(cls));
            hoverTabClasses.forEach(cls => l.classList.add(cls));
        });

        activeTabClasses.forEach(cls => link.classList.add(cls));
        hoverTabClasses.forEach(cls => link.classList.remove(cls));
    });
});

// attach once during initialization
function initializePageAndTabs() {
  const initialPageId = 'home';
  pages.forEach(p => { p.classList.add('hidden'); p.classList.remove('block'); });
  const initialPage = document.getElementById(initialPageId);
  if (initialPage) { initialPage.classList.remove('hidden'); initialPage.classList.add('block'); }

  links.forEach(link => {
    activeTabClasses.forEach(c => link.classList.remove(c));
    hoverTabClasses.forEach(c => link.classList.remove(c));
    if (link.dataset.page === initialPageId) activeTabClasses.forEach(c => link.classList.add(c));
    else hoverTabClasses.forEach(c => link.classList.add(c));
  });

  // Global persistent background
  if (!window.waveField) window.waveField = new WaveField();

  // Scroll detection stays identical
  const sections = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('nav a[data-page]');
  function updateActiveNav(activeSection) {
    navLinks.forEach(link => {
      activeTabClasses.forEach(c => link.classList.remove(c));
      link.classList.remove('bg-slate-400', 'text-white', 'dark:bg-slate-500');
      hoverTabClasses.forEach(c => link.classList.add(c));
      if (link.dataset.page === activeSection) {
        hoverTabClasses.forEach(c => link.classList.remove(c));
        link.classList.add('bg-slate-400', 'text-white', 'dark:bg-slate-500');
      }
    });
  }
  const observerOptions = { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) updateActiveNav(entry.target.dataset.nav);
    });
  }, observerOptions);
  sections.forEach(section => observer.observe(section));

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.page);
      if (target) {
        // dynamically calculates header hieght and therefore respective scroll height necessary
        const headerHeight = document.querySelector('nav').offsetHeight;
        // target page top y + scrolled y pixels - header height = resulting top of section
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      };
    });
  });

  updateActiveNav('home');
}

/* ==============================
   MARQUEE SYSTEM
   ============================== */

/* MARQUEE: true circular motion, continuous queue, alternating rows */

const MARQUEE_SPEED = 20;   // base px/sec at 640px width
const ICON_VISIBLE = 10;     // ~visible icons per row
const FRAME_MS = 16;         // ~60fps

/* --- helpers --- */
function vw() { return Math.max(320, window.innerWidth); }
function speedForWidth(w) { return MARQUEE_SPEED * Math.max(1, 640 / w); }
function iconWidth(row) { return row.clientWidth / ICON_VISIBLE; }
function initMarqueeRow(row, index) {
  const dir = index % 2 === 0 ? -1 : 1; // alternate
  const icons = Array.from(row.querySelectorAll('.skill-icon'));
  if(!icons.length) return;
  const w = row.clientWidth;
  const iw = iconWidth(row);
  const need = Math.ceil((ICON_VISIBLE + 1) / icons.length);
  for(let i=1;i<need;i++) icons.forEach(c=>{
    const clone=c.cloneNode(true);clone.dataset.marqueeClone='1';row.querySelector('.marquee-content').appendChild(clone);
  });
  const all = Array.from(row.querySelectorAll('.skill-icon'));
  all.forEach((icon,i)=>{icon.style.position='absolute';icon.style.left=(i*iw)+'px';icon.style.width=iw+'px';});
  const speed = speedForWidth(vw())*dir;
  animateRow(row,all,iw,speed);
}

/* --- core animation --- */
function animateRow(row,icons,iw,speed){
  let lastTime=null;
  function frame(t){
    if(!lastTime) lastTime=t;
    const dt=(t-lastTime)/1000;lastTime=t;
    icons.forEach(icon=>{
      let x=parseFloat(icon.style.left)||0;
      x+=speed*dt;
      if(speed<0 && x+iw<0) x+=icons.length*iw;
      if(speed>0 && x>row.clientWidth) x-=icons.length*iw;
      icon.style.left=x+'px';
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* --- setup all rows --- */
function initCircularMarquees(){
  document.querySelectorAll('.marquee-row').forEach((row,i)=>{
    const content=row.querySelector('.marquee-content');
    if(!content) return;
    row.style.position='relative';
    content.style.position='absolute';
    content.style.inset='0';
    initMarqueeRow(row,i);
  });
}

/* --- responsive rebuild --- */
let _rto=null;
function resizeMarquee() {
  clearTimeout(_rto);
  _rto=setTimeout(initCircularMarquees,200);
}

/* --- start after DOM + splashHidden --- */
// window.addEventListener('splashHidden',initCircularMarquees);


// ---- Enhanced Global WaveField Background ---- //
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
      pointerEvents: 'none',
    });

    this.mouse = { x: 0.5, y: 0.5 };
    this.phase = 0;
    this.bands = 3; // number of stacked wave bands
    this.wavesPerBand = 3;
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
    const bandHeight = this.height / this.bands;
    for (let b = 0; b < this.bands; b++) {
      for (let i = 0; i < this.wavesPerBand; i++) {
        this.waves.push({
          bandIndex: b,
          amplitude: bandHeight / (3 + i), // stronger amplitude than before
          wavelength: 200 + i * 60,
          speed: 0.015 + i * 0.006,
          direction: (b + i) % 2 === 0 ? 1 : -1, // alternate direction
          color: baseColors[(b + i) % baseColors.length],
          alpha: 0.22 - i * 0.03,
          phaseOffset: Math.random() * Math.PI * 2,
          isCos: (b + i) % 2 === 0, // alternate sine/cos
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
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  debouncedResize() {
    clearTimeout(this._resizeTimeout);
    this._resizeTimeout = setTimeout(() => this.resize(), 150);
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
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const ampReact = 1 + (this.mouse.y - 0.5) * 0.8;
    const phaseReact = (this.mouse.x - 0.5) * Math.PI;

    this.waves.forEach(wave => {
      ctx.beginPath();
      const bandTop = (wave.bandIndex + 0.5) * (this.height / this.bands);

      // constant drift left/right + mouse phase shift
      wave.phaseOffset += wave.speed * wave.direction * 0.4;

      const phaseShift =
        wave.phaseOffset + phaseReact * 1.5; // keep mouse effect strong

      const fn = wave.isCos ? Math.cos : Math.sin;
      for (let x = 0; x <= this.width; x++) {
        const y =
          bandTop +
          fn((x / wave.wavelength) * 2 * Math.PI + phaseShift) *
            wave.amplitude *
            ampReact;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = this.applyAlpha(wave.color, wave.alpha);
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  applyAlpha(hex, alpha) {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
}


