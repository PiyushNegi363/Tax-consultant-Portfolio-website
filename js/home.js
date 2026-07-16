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
  const trustYearsVal   = document.querySelector("#trust-years-val");
  const trustTeamVal    = document.querySelector("#trust-team-val");
  const trustClientsVal = document.querySelector("#trust-clients-val");

  // Resolve target values from siteData
  const yearsTarget   = parseInt(siteData.principal.experience, 10) || 20;
  const teamTarget    = 1 + siteData.team.length;
  const clientsTarget = 1000;

  // Use IntersectionObserver to start counters the moment the section enters view
  const trustSection = document.querySelector(".trust-strip");
  let countersStarted = false;

  if (trustSection && (trustYearsVal || trustTeamVal || trustClientsVal)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            if (trustYearsVal)   animateCounter(trustYearsVal,   yearsTarget,   "+", 1800);
            if (trustTeamVal)    animateCounter(trustTeamVal,    teamTarget,    "",  1200);
            if (trustClientsVal) animateCounter(trustClientsVal, clientsTarget, "+", 1800);
            observer.disconnect(); // fire once only
          }
        });
      },
      { threshold: 0.4 } // start when 40% of the strip is visible
    );
    observer.observe(trustSection);
  } else {
    // Fallback: set values immediately if observer not available
    if (trustYearsVal)   trustYearsVal.textContent   = yearsTarget + "+";
    if (trustTeamVal)    trustTeamVal.textContent    = teamTarget;
    if (trustClientsVal) trustClientsVal.textContent = clientsTarget + "+";
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

  // 4. Interactive Document Checklist Helper
  const tabButtons = document.querySelectorAll(".checklist-tab-btn");
  const panelContainer = document.querySelector("#checklist-panel");

  function renderChecklist(tabId) {
    if (!panelContainer || !siteData.checklists || !siteData.checklists[tabId]) return;
    const checklistData = siteData.checklists[tabId];
    
    // Build checkmark icons and list items with index for staggered animation
    const listHtml = `
      <ul class="checklist-list">
        ${checklistData.docs.map((doc, idx) => `
          <li class="checklist-item" style="--item-index: ${idx};">
            <svg class="checklist-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${doc}</span>
          </li>
        `).join('')}
      </ul>
    `;
    
    panelContainer.innerHTML = listHtml;
    
    // Trigger CSS fade-in animation
    panelContainer.classList.remove("animating");
    void panelContainer.offsetWidth; // force layout reflow
    panelContainer.classList.add("animating");
  }

  if (tabButtons.length > 0 && panelContainer) {
    // Initial Render (default active tab is ITR) with a slight delay so visual loading is visible
    setTimeout(() => {
      renderChecklist("itr");
    }, 200);

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Remove active state from current tabs
        tabButtons.forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        
        // Add active state to clicked tab
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        
        // Update panel ARIA label
        panelContainer.setAttribute("aria-labelledby", btn.id);
        
        // Render document checklist
        const tabId = btn.getAttribute("data-tab");
        renderChecklist(tabId);
      });
      
      // WAI-ARIA tab navigation
      btn.addEventListener("keydown", (e) => {
        const tabList = Array.from(tabButtons);
        const index = tabList.indexOf(btn);
        let nextBtn;
        
        if (e.key === "ArrowRight") {
          nextBtn = tabList[(index + 1) % tabList.length];
        } else if (e.key === "ArrowLeft") {
          nextBtn = tabList[(index - 1 + tabList.length) % tabList.length];
        }
        
        if (nextBtn) {
          nextBtn.focus();
          nextBtn.click();
        }
      });
    });
  }

  // 5. Re-scan dynamic elements for scroll reveals
  if (typeof window.observeElements === "function") {
    window.observeElements(document.body);
  }
});

