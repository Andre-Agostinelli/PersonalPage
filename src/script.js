// Navigation tabs switching
const links = document.querySelectorAll('nav ul li a');
const pages = document.querySelectorAll('main section.page');

// Define the classes that make a tab "active" in the navbar
const activeTabClasses = [
    'active-tab',
    'bg-slate-500',        // Light mode active background
    'text-white',           // Light mode active text
    'dark:bg-slate-200',    // Dark mode active background
    'dark:text-black'       // Dark mode active text
];

// Define the hover classes for non-active tabs
const hoverTabClasses = [
    'hover:bg-slate-400',
    'dark:hover:bg-slate-200',
    'hover:text-white',
    'dark:hover:text-black'
];

// Function to set the initial active tab and display the corresponding page
function initializePageAndTabs() {
    // Determine the initial page (e.g., "home" by default, or from URL hash if you implement that later)
    const initialPageId = 'home'; 

    // Hide all pages first
    pages.forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('block');
    });

    // Show the initial page
    const initialPage = document.getElementById(initialPageId);
    if (initialPage) {
        initialPage.classList.remove('hidden');
        initialPage.classList.add('block');
    }

    // Set the initial active tab in the navbar
    links.forEach(link => {
        if (link.getAttribute('data-page') === initialPageId) {
            activeTabClasses.forEach(cls => link.classList.add(cls));
            // Ensure the initial active tab doesn't show hover effect
            hoverTabClasses.forEach(cls => link.classList.remove(cls));
        } else {
            // Ensure other tabs have their hover classes
            hoverTabClasses.forEach(cls => link.classList.add(cls));
        }
    });
}

// Run initialization when the DOM is ready
document.addEventListener('DOMContentLoaded', initializePageAndTabs);


// Add click listeners to navigation links
links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');

        // --- Page Switching Logic ---
        pages.forEach(page => {
            page.classList.add('hidden');
            page.classList.remove('block');
        });
        document.getElementById(pageId).classList.remove('hidden');
        document.getElementById(pageId).classList.add('block');

        // --- Active Tab Styling Logic ---
        // Remove active styles from all links and re-add hover styles
        links.forEach(l => {
            activeTabClasses.forEach(cls => l.classList.remove(cls));
            hoverTabClasses.forEach(cls => l.classList.add(cls)); // Ensure non-active links have hover
        });

        // Add active styles to the clicked link and remove its hover styles
        activeTabClasses.forEach(cls => link.classList.add(cls));
        hoverTabClasses.forEach(cls => link.classList.remove(cls)); // Active link should not show hover effect
    });
});