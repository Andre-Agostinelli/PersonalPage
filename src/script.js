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

// function hideSplashScreen() {
//     if (splashScreen) {
//         splashScreen.classList.remove('opacity-100'); // Start fade-out
//         splashScreen.classList.add('opacity-0');

//         // Remove the splash screen from the DOM after the transition
//         splashScreen.addEventListener('transitionend', () => {
//             splashScreen.remove();
//             // Ensure the body's overflow is reset if it was hidden for the splash screen
//             document.body.style.overflow = ''; 
//         }, { once: true }); // Use { once: true } to remove the listener after it fires
//     }
// }

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


// Function to set the initial active tab and display the corresponding page
function initializePageAndTabs() {
    const initialPageId = 'home'; // Default to 'home' on load

    pages.forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('block');
    });

    const initialPage = document.getElementById(initialPageId);
    if (initialPage) {
        initialPage.classList.remove('hidden');
        initialPage.classList.add('block');
    }

    links.forEach(link => {
        activeTabClasses.forEach(cls => link.classList.remove(cls));
        hoverTabClasses.forEach(cls => link.classList.remove(cls));

        if (link.getAttribute('data-page') === initialPageId) {
            activeTabClasses.forEach(cls => link.classList.add(cls));
        } else {
            hoverTabClasses.forEach(cls => link.classList.add(cls));
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
  document.body.style.overflow = 'hidden';
  setInitialTheme();
  
  const typewriterElement = document.getElementById('typewriter-text');
  const subtitleText = document.getElementById('subtitle-text');
  const clickText = document.getElementById('click-text');
  const splashScreen = document.getElementById('splash-screen');
  
  if (typewriterElement && splashScreen) {
    // 1. Type the name (subtitle is invisible during this)
    await typewriterEffect(typewriterElement, "Hi, I'm Andre", 150);

    // Brief pause to catch your breath after tyepwritter
    // await new Promise(resolve => setTimeout(resolve, 800));
    
    // 2. Fade in glowing subtitle
    if (subtitleText) {
        subtitleText.classList.add('show');
        if (subtitleText.opacity == 1) {
            subtitleText.classList.remove("show");
            subtitleText.classList.add('pulse-glow');
        }
        // AA: Having trouble here because I am first animating a fade in -> done with show and keyframes
        // then I need to know when done, so I can start glow animation
        // subtitleText.addEventListener('onanimationend', () => {
        //     subtitleText.classList.add('pulse-glow');
        // }, { once: true });

        // subtitleText.classList.add('show');
        // await new Promise(resolve => setTimeout(resolve, 1500));
        // // subtitleText.classList.add('pulse-glow');
    }
    
    // 3. Wait 2 seconds while subtitle glows
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 4. Show click text
    if (clickText) {
      clickText.style.opacity = '1';
    }
    
    // Auto-hide after 4 more seconds
    const autoHideTimeout = setTimeout(hideSplashScreen, 4000);
    
    splashScreen.addEventListener('click', () => {
      clearTimeout(autoHideTimeout);
      hideSplashScreen();
    }, { once: true });
  }
  
  initializePageAndTabs();
});

// document.addEventListener('DOMContentLoaded', () => {
//     // Hide body overflow while splash screen is visible
//     document.body.style.overflow = 'hidden'; 
//     // Initialize theme first
//     setInitialTheme();

//     if (splashScreen) {
//         // Add click listener to the splash screen to hide it
//         splashScreen.addEventListener('click', hideSplashScreen);

//         // Optional: Automatically hide splash screen after a few seconds if no click
//         // setTimeout(hideSplashScreen, 3000); // Hides after 3 seconds
//     }
    
//     // Initialize page and tabs ONLY after the splash screen is dismissed or ready to be dismissed
//     // If you want content to appear immediately after splash dismiss, call this in hideSplashScreen
//     // For now, it initializes on DOMContentLoaded.
//     // If you want content to appear *after* splash screen disappears, move initializePageAndTabs
//     // inside the transitionend listener in hideSplashScreen.
//     initializePageAndTabs(); 
// });

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

// Circuit Animation System
class CircuitSystem {
  constructor() {
    this.paths = [
        // Top right lines - JJust now realizing this wont scale (say user is viewing on iphoneXR dimensions)
        {
            id: 'path1',
            points: [
            {x: 40, y: 0}, {x: 40, y:2}, {x: 50, y: 2}, {x: 50, y: 5}, {x: 70, y: 5}, {x: 70, y: 10},
            {x: 95, y: 10}, {x: 95, y: 70}
            ],
            speed: 8000,
            components: [
            {type: 'cpu', x: 95, y: 70}
            ]
        }, 
        {
            id: 'path2',
            points: [
            {x: 60, y: 0}, {x: 60, y: 2}, {x: 72, y: 2}, {x: 72, y: 7}, {x: 97, y: 7}, {x: 97, y: 75},
            {x: 90, y: 75}, {x: 90, y: 70}
            ],
            speed: 8000,
            components: [
            {type: 'resistor', x: 90, y: 70}
            ]
        },
        {
            id: 'path3',
            points: [
            {x: 74, y: 0}, {x: 74, y: 3}, {x: 99, y: 3}, {x: 99, y: 88}, {x: 97, y: 88}, {x: 97, y: 78}, {x: 95, y: 78},
            {x: 95, y: 88}, {x: 93, y: 88}, {x: 93, y: 78}, {x: 91, y: 78}, {x: 91, y: 88}, {x: 87, y: 88}, {x: 87, y: 55},
            {x: 90, y: 55} 
            ],
            speed: 8000,
            components: [
            {type: 'capacitor', x: 99, y: 3},
            {type: 'capacitor', x: 87, y: 55},
            {type: 'resistor', x: 90, y: 55},
            ]
        },
        {
            id: 'path4',
            points: [
            {x: 90, y: 60}, {x: 90, y: 65}, {x: 92, y: 65}, {x: 92, y: 60}, {x: 93, y: 60}, {x: 93, y: 13}, {x: 68, y: 13}, {x: 68, y: 7},
            {x: 48, y: 7}, {x: 48, y: 4}, {x: 38, y: 4}, {x: 38, y: 0}
            ],
            speed: 8000,
            components: [
            {type: 'battery', x: 90, y: 60}
            ]
        }, 
        // Bottom Left Points
        {
            id: 'path5',
            points: [
            {x: -5, y: 75}, {x: 20, y: 75}, {x: 20, y: 95},
            {x: 105, y: 95}
            ],
            speed: 11000,
            components: []
        },
        
    ];
    
    this.animationIds = new Set(); // Track animation frames
    this.timeouts = new Set(); // Track timeouts for cleanup
    this.init();
  }
  
  init() {
    const container = document.querySelector('.circuit-background');
    if (!container) return;
    
    // Ensure container has relative positioning for proper percentage calculations
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    
    this.paths.forEach(path => {
      this.createPath(path, container);
      this.animateParticle(path, container);
    });
  }
  
  createPath(path, container) {
    const points = path.points;
    
    // Create trace segments
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      
      const segment = document.createElement('div');
      segment.className = 'circuit-trace-segment';
      segment.dataset.pathId = path.id;
      segment.dataset.segmentId = i;
      // Ensure absolute positioning relative to container
      segment.style.position = 'absolute';
      
        if (start.x === end.x) {
        // Vertical segment - particle travels down center
        segment.style.left = `calc(${start.x}% - 2px)`; // Center 4px trace
        segment.style.top = `${Math.min(start.y, end.y)}%`;
        segment.style.width = '4px';
        segment.style.height = `${Math.abs(end.y - start.y)}%`;
        } else {
        // Horizontal segment - particle travels along center
        segment.style.left = `${Math.min(start.x, end.x)}%`;
        segment.style.top = `calc(${start.y}% - 2px)`; // Center 4px trace
        segment.style.width = `${Math.abs(end.x - start.x)}%`;
        segment.style.height = '4px';
        }
    
        container.appendChild(segment);
    }

    // Create components for this path
    if (path.components) {
        path.components.forEach(comp => {
            const component = document.createElement('div');
            component.className = `circuit-component component-${comp.type}`;
            component.style.position = 'absolute';
            component.style.left = `${comp.x}%`;
            component.style.top = `${comp.y}%`;
            container.appendChild(component);
        });
    }    
    
    // Create connection nodes
    points.forEach((point, index) => {
      if (index === 0 || index === points.length - 1) return; // Skip start/end
      
      const node = document.createElement('div');
      node.className = 'circuit-node';
      node.style.position = 'absolute';
      node.style.left = `${point.x}%`;
      node.style.top = `${point.y}%`;
      container.appendChild(node);
    });
  }

animateParticle(path, container) {
    const particle = document.createElement('div');
    particle.className = 'electron-particle';
    particle.dataset.pathId = path.id;
    particle.style.position = 'absolute';
    container.appendChild(particle);
    
    let animationActive = true;
    
    const animateAlongPath = () => {
      if (!animationActive) return;
      
      // Reset particle completely first
      particle.style.transition = 'none';
      particle.style.opacity = '0';
      particle.style.left = `${path.points[0].x}%`;
      particle.style.top = `${path.points[0].y}%`;
      
      // Use requestAnimationFrame instead of forcing reflow
      const startAnimation = () => {
        if (!animationActive) return;
        
        particle.style.opacity = '1';
        let currentSegment = 0;
        const totalSegments = path.points.length - 1;
        const segmentDuration = path.speed / totalSegments;
        
        const moveToNextPoint = () => {
          if (!animationActive || currentSegment >= totalSegments) {
            particle.style.opacity = '0';
            this.clearActiveTraces(path.id);
            // Use setTimeout with cleanup tracking
            const timeoutId = setTimeout(() => {
              this.timeouts.delete(timeoutId);
              if (animationActive) animateAlongPath();
            }, 2000);
            this.timeouts.add(timeoutId);
            return;
          }
          
          const start = path.points[currentSegment];
          const end = path.points[currentSegment + 1];
          
          this.setActiveTrace(path.id, currentSegment, true);
          if (currentSegment > 0) {
            this.setActiveTrace(path.id, currentSegment - 1, false);
          }
          
          particle.style.transition = `all ${segmentDuration}ms linear`;
          particle.style.left = `${end.x}%`;
          particle.style.top = `${end.y}%`;
          
          currentSegment++;
          
          // Use setTimeout with cleanup tracking
          const timeoutId = setTimeout(() => {
            this.timeouts.delete(timeoutId);
            if (animationActive) moveToNextPoint();
          }, segmentDuration);
          this.timeouts.add(timeoutId);
        };
        
        moveToNextPoint();
      };
      
      // Use requestAnimationFrame for smoother animation start
      const frameId = requestAnimationFrame(startAnimation);
      this.animationIds.add(frameId);
    };
    
    // Start with delay using tracked timeout
    const initialTimeoutId = setTimeout(() => {
      this.timeouts.delete(initialTimeoutId);
      if (animationActive) animateAlongPath();
    }, Math.random() * 3000);
    this.timeouts.add(initialTimeoutId);
    
    // Store cleanup function for this particle
    particle._cleanup = () => {
      animationActive = false;
    };
  }
  
  setActiveTrace(pathId, segmentId, active) {
    const segment = document.querySelector(`[data-path-id="${pathId}"][data-segment-id="${segmentId}"]`);
    if (segment) {
      if (active) {
        segment.classList.add('trace-active');
      } else {
        segment.classList.remove('trace-active');
      }
    }
  }
  
  clearActiveTraces(pathId) {
    const segments = document.querySelectorAll(`[data-path-id="${pathId}"]`);
    segments.forEach(segment => segment.classList.remove('trace-active'));
  }
  
  // Cleanup method to call when destroying the circuit system
  destroy() {
    // Cancel all animation frames
    this.animationIds.forEach(id => cancelAnimationFrame(id));
    this.animationIds.clear();
    
    // Clear all timeouts
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts.clear();
    
    // Cleanup particles
    document.querySelectorAll('.electron-particle').forEach(particle => {
      if (particle._cleanup) particle._cleanup();
    });
  }
}

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  // Your existing circuit system code...
  window.circuitSystem = new CircuitSystem();
  
  // ADD THIS: Scroll-based navigation
  const sections = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('nav a[data-page]');
  
  // Function to update active nav link
  function updateActiveNav(activeSection) {
    navLinks.forEach(link => {
        // REMOVE both click active classes AND scroll classes from ALL links
        activeTabClasses.forEach(cls => link.classList.remove(cls));
        link.classList.remove('bg-slate-400', 'text-white', 'dark:bg-slate-500');
        
        // ADD back hover classes to all links first
        hoverTabClasses.forEach(cls => link.classList.add(cls));
        
        if (link.dataset.page === activeSection) {
        // Remove hover classes and add scroll active classes for current section
        hoverTabClasses.forEach(cls => link.classList.remove(cls));
        link.classList.add('bg-slate-400', 'text-white', 'dark:bg-slate-500');
        }
    });
  }
  
  // Intersection Observer for scroll detection
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section is 50% visible
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.dataset.nav;
        updateActiveNav(sectionId);
      }
    });
  }, observerOptions);
  
  // Observe all sections
  sections.forEach(section => observer.observe(section));
  
  // Update existing navbar click handlers to smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.page;
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Handle visibility changes for better performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, animations will naturally pause
  } else {
    // Page is visible again, animations will resume
  }
});

  // Set initial active state
  updateActiveNav('home');
});

