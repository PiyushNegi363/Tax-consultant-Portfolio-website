document.addEventListener("DOMContentLoaded", () => {
  if (typeof siteData === "undefined") {
    console.error("siteData is not defined. Skipping dynamic population.");
    return;
  }

  // ─── Animated Counter Helper ──────────────────────────────────────────────
  /**
   * Animates a numeric counter from 0 up to `target`.
   * @param {HTMLElement} el      - The element to update
   * @param {number}      target  - Final numeric value
   * @param {string}      suffix  - Text suffix appended after the number (e.g. "+")
   * @param {number}      duration - Animation duration in ms
   */
  function animateCounter(el, target, suffix = "", duration = 1600) {
    // Respect reduced-motion preference — skip animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = target + suffix;
      return;
    }
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic: starts fast, slows down at end for natural feel
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // 1. Populate Trust Strip with animated counters
  const trustYearsVal  = document.querySelector("#trust-years-val");
  const trustTeamVal   = document.querySelector("#trust-team-val");
  const trustMemberVal = document.querySelector("#trust-member-val");

  // Resolve target values from siteData
  const yearsTarget = parseInt(siteData.principal.experience, 10) || 18;
  const teamTarget  = 1 + siteData.team.length;

  // Set non-numeric FCA label immediately (no counter)
  if (trustMemberVal) {
    const qual  = siteData.principal.qualification;
    const match = qual.match(/\b(FCA|ACA)\b/);
    trustMemberVal.textContent = match ? match[0] : "FCA";
  }

  // Use IntersectionObserver to start counters the moment the section enters view
  const trustSection = document.querySelector(".trust-strip");
  let countersStarted = false;

  if (trustSection && (trustYearsVal || trustTeamVal)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            if (trustYearsVal) animateCounter(trustYearsVal, yearsTarget, "+", 1800);
            if (trustTeamVal)  animateCounter(trustTeamVal,  teamTarget,  "",  1200);
            observer.disconnect(); // fire once only
          }
        });
      },
      { threshold: 0.4 } // start when 40% of the strip is visible
    );
    observer.observe(trustSection);
  } else {
    // Fallback: set values immediately if observer not available
    if (trustYearsVal) trustYearsVal.textContent = yearsTarget + "+";
    if (trustTeamVal)  trustTeamVal.textContent  = teamTarget;
  }

  // 2. Populate Services Preview
  const servicesGrid = document.querySelector("#services-preview-grid");
  if (servicesGrid) {
    servicesGrid.innerHTML = "";
    // Show up to 6 services in preview
    const previewServices = siteData.services.slice(0, 6);
    previewServices.forEach(service => {
      const card = document.createElement("div");
      card.className = "service-card reveal-item";
      card.innerHTML = `
        <span class="service-tag">${service.tag}</span>
        <h3 class="service-name">${service.title}</h3>
        <p class="service-desc">${service.desc}</p>
      `;
      servicesGrid.appendChild(card);
    });
  }

  // 3. Populate About Preview
  const aboutName = document.querySelector("#about-preview-name");
  const aboutBio  = document.querySelector("#about-preview-bio");
  if (aboutName) {
    aboutName.textContent = siteData.principal.name;
  }
  if (aboutBio) {
    aboutBio.textContent = siteData.principal.bio[0];
  }

  // 4. Re-scan dynamic elements for scroll reveals
  if (typeof window.observeElements === "function") {
    window.observeElements(document.body);
  }
});

