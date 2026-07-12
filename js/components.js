(function() {
  // Helper to update dynamic copyright years in DOM
  const updateCopyrightYear = () => {
    const yearElements = document.querySelectorAll(".dynamic-year");
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
      el.textContent = currentYear;
    });
  };

  function initPageTransitions() {
    document.body.classList.add("js-page-transition");
    
    // Start fade-in transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add("page-loaded");
      });
    });

    // Intercept links for smooth fade-out
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      
      const href = link.getAttribute("href");
      const target = link.getAttribute("target");
      
      if (!href || 
          href.startsWith("#") || 
          href.startsWith("javascript:") ||
          target === "_blank" ||
          link.classList.contains("no-fade") ||
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          href.startsWith("https://wa.me") ||
          href.startsWith("https://www.google.com/maps")
      ) {
        return;
      }
      
      e.preventDefault();
      document.body.classList.remove("page-loaded");
      document.body.classList.add("page-fade-out");
      
      setTimeout(() => {
        window.location.href = href;
      }, 220); // 220ms matches the CSS transition speed
    });

    // Handle bfcache (back-forward cache) restorations
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        document.body.classList.remove("page-fade-out");
        document.body.classList.add("page-loaded");
      }
    });
  }

  function initComponents() {
    // Initialize page transitions
    initPageTransitions();

    // Run immediately to update fallback footer
    updateCopyrightYear();

    // Inject Header
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
      fetch("partials/header.html")
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load header partial: ${response.status} ${response.statusText}`);
          }
          return response.text();
        })
        .then(html => {
          headerPlaceholder.innerHTML = html;
          // Dispatch event so nav.js knows header is ready in the DOM
          document.dispatchEvent(new CustomEvent("header-loaded"));
        })
        .catch(error => {
          console.error("Header injection failed, fallback navigation kept.", error);
        });
    }

    // Inject Footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
      fetch("partials/footer.html")
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load footer partial: ${response.status} ${response.statusText}`);
          }
          return response.text();
        })
        .then(html => {
          footerPlaceholder.innerHTML = html;
          // Run again to update the newly injected footer
          updateCopyrightYear();
          // Dispatch event so scroll-reveal knows footer is ready in DOM
          document.dispatchEvent(new CustomEvent("footer-loaded"));
        })
        .catch(error => {
          console.error("Footer injection failed, fallback footer kept.", error);
        });
    }
  }

  // Safe DOMContentLoaded/Load Trigger
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initComponents);
  } else {
    initComponents();
  }
})();
