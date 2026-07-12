document.addEventListener("DOMContentLoaded", () => {
  if (typeof siteData === "undefined") {
    console.error("siteData is not defined. Skipping dynamic population.");
    return;
  }

  // Populate Services Stacked List
  const servicesStackedList = document.querySelector("#services-stacked-list");
  if (servicesStackedList && siteData.services) {
    servicesStackedList.innerHTML = "";
    siteData.services.forEach((service, index) => {
      const block = document.createElement("div");
      const isOdd = index % 2 === 0;
      block.className = `service-block reveal-item ${isOdd ? "reveal-left" : "reveal-right"}`;
      
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
  }

  // Re-scan dynamic elements for scroll reveals
  if (typeof window.observeElements === "function") {
    window.observeElements(document.body);
  }
});
