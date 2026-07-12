document.addEventListener("DOMContentLoaded", () => {
  if (typeof siteData === "undefined") {
    console.error("siteData is not defined. Skipping dynamic population.");
    return;
  }

  // 1. Populate Trust Strip
  const trustYearsVal = document.querySelector("#trust-years-val");
  const trustTeamVal = document.querySelector("#trust-team-val");
  const trustMemberVal = document.querySelector("#trust-member-val");

  if (trustYearsVal) {
    trustYearsVal.textContent = siteData.principal.experience;
  }
  if (trustMemberVal) {
    const qual = siteData.principal.qualification;
    const match = qual.match(/\b(FCA|ACA)\b/);
    trustMemberVal.textContent = match ? match[0] : "FCA";
  }
  if (trustTeamVal) {
    // Principal (1) + Associates
    trustTeamVal.textContent = 1 + siteData.team.length;
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
  const aboutBio = document.querySelector("#about-preview-bio");
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
