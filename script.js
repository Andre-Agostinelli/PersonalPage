// Select all nav links inside the navbar
const links = document.querySelectorAll('.nav-links a');

// Select all the page sections (home, about, projects, etc.)
const pages = document.querySelectorAll('.page');

// Loop over each nav link and attach a click event listener
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault(); // Prevent default anchor link behavior (no page reload)

    const pageId = link.getAttribute('data-page');
    // Get the page name from the custom data attribute (e.g., "about", "home", etc.)

    // First, hide all page sections
    pages.forEach(page => {
      page.classList.remove('active');
    });

    // Then, show only the selected page by adding the 'active' class
    document.getElementById(pageId).classList.add('active');

    // Remove 'active-tab' class from all links
    links.forEach(link => {
      link.classList.remove('active-tab');
    });

    // Add 'active-tab' class to the clicked link
    link.classList.add('active-tab');
    });
});

// Select the theme toggle button (🌙 / ☀️)
const toggleBtn = document.getElementById('theme-toggle');

// Add a click listener to toggle the theme
toggleBtn.addEventListener('click', () => {
  // Toggle a class on the <body> to switch between light and dark mode
  document.body.classList.toggle('dark-mode');

  // Change the emoji on the button to reflect the current mode
  toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

