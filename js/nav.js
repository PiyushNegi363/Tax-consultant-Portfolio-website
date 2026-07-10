document.addEventListener("header-loaded", () => {
  initNavigation();
});

function initNavigation() {
  const header = document.querySelector("header");
  const burger = document.querySelector(".burger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // 1. Mobile Menu Toggle
  if (burger && navMenu) {
    burger.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      burger.classList.toggle("open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2. Active Link Highlighting
  // Normalizes a URL path to handle index.html, subfolders, and trailing slashes
  const normalizePath = (urlStr) => {
    try {
      const url = new URL(urlStr, window.location.href);
      return url.pathname
        .replace(/\/index\.html$/, '/') // treat index.html as root /
        .replace(/\/$/, '');            // strip trailing slash for consistent matching
    } catch (e) {
      return '';
    }
  };

  const currentPath = normalizePath(window.location.href);

  navLinks.forEach(link => {
    const linkPath = normalizePath(link.getAttribute("href"));
    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 3. Scroll Behavior (Opaque background + shadow on scroll)
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    
    // Check on initial load
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
}
