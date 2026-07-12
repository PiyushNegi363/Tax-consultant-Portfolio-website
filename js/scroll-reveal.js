(function() {
  function initScrollReveal() {
    // Feature detect IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // If unsupported, make all elements visible immediately
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      document.querySelectorAll('.reveal-group').forEach(group => {
        group.querySelectorAll('.reveal-item').forEach(item => item.classList.add('revealed'));
      });
      return;
    }

    // Add js-enabled class to document element for safe styling defaults
    document.documentElement.classList.add('js-enabled');

    const observerOptions = {
      threshold: 0.15, // Trigger when 15% of the target is visible
      rootMargin: "0px 0px -50px 0px" // Trigger slightly before entry
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (target.classList.contains('reveal-group')) {
            // Stagger reveal of child items
            const items = target.querySelectorAll('.reveal-item');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('revealed');
              }, index * 100); // 100ms stagger delay
            });
          } else {
            // Single element reveal
            target.classList.add('revealed');
          }

          // Unobserve once animated
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Helper function to observe target reveal items in a container
    function observeElements(container = document) {
      container.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
        revealObserver.observe(el);
      });
      container.querySelectorAll('.reveal-group:not(.revealed)').forEach(el => {
        revealObserver.observe(el);
      });
    }

    // Initial scan for elements already in DOM
    observeElements();

    // Re-scan placeholder spaces dynamically when header/footer partials load
    document.addEventListener("header-loaded", () => {
      const headerPlaceholder = document.getElementById("header-placeholder");
      if (headerPlaceholder) observeElements(headerPlaceholder);
    });

    document.addEventListener("footer-loaded", () => {
      const footerPlaceholder = document.getElementById("footer-placeholder");
      if (footerPlaceholder) observeElements(footerPlaceholder);
    });

    // Make global helper available for preloader or other triggers
    window.observeElements = observeElements;

    // ==========================================================================
    // Back to Top Button
    // ==========================================================================
    const backToTopBtn = document.createElement("button");
    backToTopBtn.className = "back-to-top";
    backToTopBtn.setAttribute("aria-label", "Back to top");
    backToTopBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    `;
    document.body.appendChild(backToTopBtn);

    // Monitor scroll height to show/hide the button
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }, { passive: true });

    // Scroll to top smoothly on click, respecting prefers-reduced-motion
    backToTopBtn.addEventListener("click", () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? "auto" : "smooth"
      });
    });
  }

  // Safe DOMContentLoaded/Load Trigger
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollReveal);
  } else {
    initScrollReveal();
  }
})();
