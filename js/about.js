document.addEventListener("DOMContentLoaded", () => {
  if (typeof siteData === "undefined") {
    console.error("siteData is not defined. Skipping dynamic population.");
    return;
  }

  // 1. Populate CA Profile Details
  const caName = document.querySelector("#ca-profile-name");
  const caRole = document.querySelector("#ca-profile-role");
  const caQual = document.querySelector("#ca-credential-qualification");
  const caMemberNo = document.querySelector("#ca-credential-membership");
  const caFrnRow = document.querySelector("#ca-credential-frn-row");
  const caFrn = document.querySelector("#ca-credential-frn");
  const caExp = document.querySelector("#ca-credential-experience");
  const caBioContainer = document.querySelector("#ca-profile-bio-container");

  if (caName) caName.textContent = siteData.principal.name;
  if (caRole) caRole.textContent = siteData.principal.role;
  if (caQual) caQual.textContent = siteData.principal.qualification;
  if (caMemberNo) caMemberNo.textContent = siteData.principal.membershipNo;
  
  if (caFrnRow && caFrn) {
    if (siteData.principal.frn) {
      caFrn.textContent = siteData.principal.frn;
      caFrnRow.style.display = "";
    } else {
      caFrnRow.style.display = "none";
    }
  }

  if (caExp) caExp.textContent = caExp.textContent = siteData.principal.experienceDetail;

  if (caBioContainer && siteData.principal.bio) {
    caBioContainer.innerHTML = siteData.principal.bio
      .map(para => `<p>${para}</p>`)
      .join("");
  }

  // 2. Populate Team Grid
  const teamGrid = document.querySelector("#about-team-grid");
  if (teamGrid && siteData.team) {
    teamGrid.innerHTML = "";
    siteData.team.forEach(member => {
      const card = document.createElement("div");
      card.className = "team-member-card";
      card.innerHTML = `
        <div class="team-avatar" aria-label="${member.name}">
          <span class="team-avatar-initials">${member.avatarInitials}</span>
        </div>
        <h3 class="team-member-name">${member.name}</h3>
        <p class="team-member-role">${member.role}</p>
      `;
      teamGrid.appendChild(card);
    });
  }

  // 3. Re-scan dynamic elements for scroll reveals
  if (typeof window.observeElements === "function") {
    window.observeElements(document.body);
  }
});
