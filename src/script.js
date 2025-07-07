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