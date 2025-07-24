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

// Splash screen logic
const splashScreen = document.getElementById('splash-screen');

function hideSplashScreen() {
    if (splashScreen) {
        splashScreen.classList.remove('opacity-100'); // Start fade-out
        splashScreen.classList.add('opacity-0');

        // Remove the splash screen from the DOM after the transition
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.remove();
            // Ensure the body's overflow is reset if it was hidden for the splash screen
            document.body.style.overflow = ''; 
        }, { once: true }); // Use { once: true } to remove the listener after it fires
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


document.addEventListener('DOMContentLoaded', () => {
    // Hide body overflow while splash screen is visible
    document.body.style.overflow = 'hidden'; 
    // Initialize theme first
    setInitialTheme();

    if (splashScreen) {
        // Add click listener to the splash screen to hide it
        splashScreen.addEventListener('click', hideSplashScreen);

        // Optional: Automatically hide splash screen after a few seconds if no click
        // setTimeout(hideSplashScreen, 3000); // Hides after 3 seconds
    }
    
    // Initialize page and tabs ONLY after the splash screen is dismissed or ready to be dismissed
    // If you want content to appear immediately after splash dismiss, call this in hideSplashScreen
    // For now, it initializes on DOMContentLoaded.
    // If you want content to appear *after* splash screen disappears, move initializePageAndTabs
    // inside the transitionend listener in hideSplashScreen.
    initializePageAndTabs(); 
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

// Circuit Animation System
class CircuitSystem {
  constructor() {
    this.paths = [
        // Horizontal Line 1: Top - Battery to CPU (PRIORITY LINE)
        {
            id: 'path1',
            points: [
            {x: 10, y: 15}, {x: 22, y: 15}, {x: 22, y: 2},
            {x: 28, y: 2}, {x: 28, y: 15}, {x: 90, y: 15}
            ],
            speed: 8000,
            components: [
            {type: 'battery', x: 10, y: 15},
            {type: 'cpu', x: 90, y: 15}
            ]
        },
        
        // Vertical Line 1: Left - Battery to resistor (PRIORITY LINE) 
        {
            id: 'path2',
            points: [
            {x: 25, y: 5}, {x: 25, y: 85}
            ],
            speed: 9000,
            components: [
            {type: 'battery', x: 25, y: 5},
            {type: 'resistor', x: 25, y: 85}
            ]
        },
        
        // Horizontal Line 2: Routes ABOVE path1, BEFORE path2 starts
        {
            id: 'path3',
            points: [
            {x: -5, y: 35}, {x: 20, y: 35}, {x: 20, y: 45}, 
            {x: 75, y: 45}
            ],
            speed: 12000,
            components: [
            {type: 'capacitor', x: 75, y: 45}
            ]
        },
        
        // Horizontal Line 3: Routes BELOW path2's endpoint
        {
            id: 'path4',
            points: [
            {x: -5, y: 75}, {x: 20, y: 75}, {x: 20, y: 95},
            {x: 105, y: 95}
            ],
            speed: 11000,
            components: []
        },
        
        // Vertical Line 2: Routes completely RIGHT of path1
        {
            id: 'path5',
            points: [
            {x: 95, y: -5}, {x: 95, y: 60}
            ],
            speed: 13000,
            components: [
            {type: 'cpu', x: 95, y: 60}
            ]
        },
        
        // Vertical Line 3: Routes between path2 and path5, avoids all horizontals
        {
            id: 'path6',
            points: [
            {x: 60, y: -5}, {x: 60, y: 10}, {x: 50, y: 10},
            {x: 50, y: 25}, {x: 60, y: 25}, {x: 60, y: 30},
            {x: 70, y: 30}, {x: 70, y: 105}
            ],
            speed: 15000,
            components: []
        }
    ];
    
    this.init();
  }
  
  init() {
    const container = document.querySelector('.circuit-background');
    if (!container) return;
    
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
      
        // Create components for this path
    if (path.components) {
    path.components.forEach(comp => {
        const component = document.createElement('div');
        component.className = `circuit-component component-${comp.type}`;
        component.style.left = `${comp.x}%`;
        component.style.top = `${comp.y}%`;
        container.appendChild(component);
        });
    }
      container.appendChild(segment);
    }
    
    // Create connection nodes
    points.forEach((point, index) => {
      if (index === 0 || index === points.length - 1) return; // Skip start/end
      
      const node = document.createElement('div');
      node.className = 'circuit-node';
      node.style.left = `${point.x}%`;
      node.style.top = `${point.y}%`;
      container.appendChild(node);
    });
  }
  
  animateParticle(path, container) {
    const particle = document.createElement('div');
    particle.className = 'electron-particle';
    particle.dataset.pathId = path.id;
    container.appendChild(particle);
    
    const animateAlongPath = () => {
        // Reset particle completely first
        particle.style.transition = 'none';
        particle.style.opacity = '0';
        particle.style.left = `${path.points[0].x}%`;
        particle.style.top = `${path.points[0].y}%`;
        
        // Force reflow to ensure position is set
        particle.offsetHeight;
        
        setTimeout(() => {
            particle.style.opacity = '1';
            let currentSegment = 0;
            const totalSegments = path.points.length - 1;
            const segmentDuration = path.speed / totalSegments;
            
            const moveToNextPoint = () => {
            if (currentSegment >= totalSegments) {
                particle.style.opacity = '0';
                this.clearActiveTraces(path.id);
                setTimeout(animateAlongPath, 2000);
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
            setTimeout(moveToNextPoint, segmentDuration);
            };
            
            moveToNextPoint();
            }, 100);
    };
    
    // Start with delay
    setTimeout(animateAlongPath, Math.random() * 3000);
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
}

// Initialize circuit system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // ... your existing DOMContentLoaded code ...
  
  // Add circuit system
  new CircuitSystem();
});