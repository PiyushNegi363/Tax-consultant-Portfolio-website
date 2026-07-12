document.addEventListener("DOMContentLoaded", () => {
  if (typeof siteData === "undefined") {
    console.error("siteData is not defined. Skipping dynamic population.");
    return;
  }

  const servicesStackedList = document.querySelector("#services-stacked-list");
  const tabs = document.querySelectorAll(".filter-tab");

  function renderServices(filter = "all") {
    if (!servicesStackedList || !siteData.services) return;

    // Clear list
    servicesStackedList.innerHTML = "";

    // Filter services based on category matching
    const filteredServices = filter === "all"
      ? siteData.services
      : siteData.services.filter(s => s.category === filter);

    if (filteredServices.length === 0) {
      servicesStackedList.innerHTML = `<p class="no-services-message">No services found in this category.</p>`;
      return;
    }

    // Populate
    filteredServices.forEach((service, index) => {
      const block = document.createElement("div");
      const isOdd = index % 2 === 0;
      
      // Add animate class for a smooth fade-in after filtering
      block.className = `service-block reveal-item ${isOdd ? "reveal-left" : "reveal-right"} service-block-animate`;
      
      const waText = encodeURIComponent(`I'd like to enquire about ${service.title}.`);
      const waLink = `${siteData.contact.whatsappLink}?text=${waText}`;

      block.innerHTML = `
        <div class="service-block-header">
          <span class="service-block-number">${service.number}</span>
          <h3 class="service-block-title">${service.title}</h3>
        </div>
        <p class="service-block-desc">${service.desc}</p>
        <p class="service-block-audience"><strong>Best suited for:</strong> ${service.audience}</p>
        <a href="${waLink}" class="service-block-link" target="_blank" rel="noopener">Enquire about this</a>
      `;
      servicesStackedList.appendChild(block);
    });

    // Re-scan dynamic elements for scroll reveals
    if (typeof window.observeElements === "function") {
      window.observeElements(document.body);
    }
  }

  // Bind tab click events
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        // Toggle active states
        tabs.forEach(t => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        // Filter list
        const filterVal = tab.getAttribute("data-filter");
        renderServices(filterVal);
      });
    });
  }

  // Initial full render
  renderServices("all");
});
