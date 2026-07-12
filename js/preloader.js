/**
 * preloader.js — Brand Preloader for Negi Tax Consultant
 * PRD: PRD-interaction-animation.md
 *
 * Mechanics:
 * 1. Sequential image flash inside a centered clip-path mask.
 * 2. Octagonal clip-path morphs into a bold "N" lettermark.
 * 3. N scales down & shifts left while "egi" fades in, forming "Negi".
 * 4. "TAX CONSULTANT" subtext fades in below.
 * 5. Preloader panel slides up with a liquid bottom stretching arc.
 * 6. Session bypass (Option A) using sessionStorage.
 * 7. Reduced motion skip & safety load failsafe.
 */

(function() {
  // Failsafe timer registered as early as possible in global scope
  let failsafeTimer = null;
  let animationStarted = false;

  // Allow forcing a replay during development: index.html?replay-preloader
  if (new URLSearchParams(window.location.search).has("replay-preloader")) {
    sessionStorage.removeItem("negi_preloader_shown");
  }
  
  function bypassPreloader(reason) {
    if (failsafeTimer) {
      clearTimeout(failsafeTimer);
      failsafeTimer = null;
    }
    const preloader = document.getElementById("preloader");
    const wrapper = document.getElementById("page-wrapper");
    if (preloader) {
      preloader.style.display = "none";
    }
    if (wrapper) {
      wrapper.classList.add("page-ready");
      // Inline safety fallback to override CSS in case transitions fail
      wrapper.style.opacity = "1";
      wrapper.style.visibility = "visible";
    }
    document.body.classList.remove("preloader-active");
    if (window.observeElements) {
      window.observeElements();
    }
    if (reason) {
      console.info("Preloader bypassed:", reason);
    }
  }

  // Animation runs ~6s; keep a generous failsafe so it is not cut off early
  failsafeTimer = setTimeout(() => {
    console.warn("Preloader failsafe triggered. Restoring scroll.");
    bypassPreloader("failsafe timeout");
  }, 10000);

  function initPreloader() {
    const preloader = document.getElementById("preloader");
    const wrapper = document.getElementById("page-wrapper");

    if (!preloader || !wrapper) {
      bypassPreloader("missing #preloader or #page-wrapper");
      return;
    }

    // Add scroll-lock class to body
    document.body.classList.add("preloader-active");

    // Accessibility & Session Checks
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sessionBypass = sessionStorage.getItem("negi_preloader_shown");

    if (prefersReduced) {
      bypassPreloader("prefers-reduced-motion is enabled");
      return;
    }

    if (sessionBypass === "true") {
      bypassPreloader("already shown this session (use ?replay-preloader to test again)");
      return;
    }

    // Check GSAP availability
    if (typeof gsap === "undefined") {
      console.warn("GSAP not loaded. Bypassing preloader.");
      bypassPreloader("GSAP not loaded");
      return;
    }

    // Initialize main timeline
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("negi_preloader_shown", "true");
        bypassPreloader();
      }
    });

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const vmax = Math.max(vw, vh);

    const targetHeight = Math.min(vh * 0.15, vw * 0.10);
    const originalNHeight = vmax * 0.30;
    const vScale = targetHeight / originalNHeight;

    const scaledHalfWidthPx = vmax * 0.15 * vScale;
    const scaledHalfWidthVw = (scaledHalfWidthPx / vw) * 100;
    const nRightEdgeVw = 50 + scaledHalfWidthVw;

    gsap.set("#rest-of-name", {
      fontSize: targetHeight + "px",
      left: nRightEdgeVw + "vw"
    });

    gsap.set("#brand-media", {
      fontSize: Math.max(targetHeight * 0.22, 11) + "px",
      top: "calc(50% + " + (targetHeight * 0.65) + "px)"
    });

    // Make main content wrapper visible (stays opacity:0 until preloader slides up)
    gsap.set(wrapper, { visibility: "visible" });

    function startPreloaderAnimation() {
      if (animationStarted) return;
      animationStarted = true;

      const restOfName = document.getElementById("rest-of-name");
      if (!restOfName) {
        bypassPreloader("missing #rest-of-name element");
        return;
      }
      
      const textWidthPx = restOfName.getBoundingClientRect().width;
      const textWidthVw = (textWidthPx / vw) * 100;

      const nWidthVw = scaledHalfWidthVw * 2;
      const totalWidthVw = nWidthVw + textWidthVw;
      const currentLeftEdgeVw = 50 - scaledHalfWidthVw;
      const targetLeftEdgeVw = 50 - (totalWidthVw / 2);
      const shiftAmountVw = targetLeftEdgeVw - currentLeftEdgeVw;

      const images = gsap.utils.toArray(".preloader-images img");

      // 1. Initial State: Octagon polygon
      gsap.set(".preloader-images", {
        clipPath: "polygon(-20% -20%, -20% 50%, 50% 120%, 120% 50%, 120% -20%, 85% -20%, 67.5% -20%, 50% -20%, 32.5% -20%, 15% -20%)"
      });

      // 2. Sequential Image Flash
      images.forEach((img, i) => {
        tl.to(img, { opacity: 1, duration: 0.04 });
        if (i < images.length - 1) {
          tl.to(img, { opacity: 0, duration: 0.04, delay: 0.07 });
        }
      });

      // 3. Morph Octagon into a bold "N" lettermark
      tl.to(".preloader-images", {
        clipPath: "polygon(35% 35%, 35% 65%, 42.5% 65%, 42.5% 48%, 57.5% 65%, 65% 65%, 65% 35%, 57.5% 35%, 57.5% 52%, 42.5% 35%)",
        duration: 1.5,
        ease: "power3.inOut"
      }, 0);

      tl.to({}, { duration: 0.2 });

      // 4. Assemble
      tl.to(".preloader-images", {
        x: shiftAmountVw + "vw",
        scale: vScale,
        duration: 1.2,
        ease: "power3.inOut"
      }, "assemble")
      .to(".preloader-images img", {
        opacity: 0,
        duration: 1.2,
        ease: "power3.inOut"
      }, "assemble")
      .to("#rest-of-name", {
        opacity: 1,
        x: shiftAmountVw + "vw",
        duration: 1.2,
        ease: "power3.inOut"
      }, "assemble")
      .to("#brand-media", {
        opacity: 1,
        duration: 1.2,
        ease: "power3.inOut"
      }, "assemble+=0.4");

      tl.to({}, { duration: 0.8 });

      // 5. Liquid stretching exit transition
      tl.to(preloader, {
        yPercent: -100,
        borderBottomLeftRadius: "50% 20vh",
        borderBottomRightRadius: "50% 20vh",
        duration: 1.2,
        ease: "power3.inOut"
      }, "exit")
      .to(wrapper, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "exit+=0.4");
    }

    // Execute with font ready check (with timeout so animation never hangs)
    function scheduleAnimationStart() {
      requestAnimationFrame(startPreloaderAnimation);
    }

    const fontTimeout = setTimeout(scheduleAnimationStart, 2500);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          clearTimeout(fontTimeout);
          scheduleAnimationStart();
        })
        .catch(() => {
          clearTimeout(fontTimeout);
          scheduleAnimationStart();
        });
    } else {
      clearTimeout(fontTimeout);
      scheduleAnimationStart();
    }
  }

  // Safe DOMContentLoaded/Load Trigger
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPreloader);
  } else {
    // Run immediately since DOM is already interactive/complete
    initPreloader();
  }
})();
