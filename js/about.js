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
  const modal = document.querySelector("#team-modal");
  const closeBtn = document.querySelector("#modal-close-btn");
  let lastFocusedElement = null;

  if (teamGrid && siteData.team) {
    teamGrid.innerHTML = "";
    siteData.team.forEach((member, index) => {
      const card = document.createElement("div");
      card.className = "team-member-card reveal-item reveal-left";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", `View profile of ${member.name}`);
      card.setAttribute("data-index", index);
      card.innerHTML = `
        <div class="team-avatar" aria-hidden="true">
          <span class="team-avatar-initials">${member.avatarInitials}</span>
        </div>
        <h3 class="team-member-name">${member.name}</h3>
        <p class="team-member-role">${member.role}</p>
      `;
      teamGrid.appendChild(card);
    });

    // Open Modal Logic
    const openTeamModal = (index, triggeringCard) => {
      if (!modal || !siteData.team[index]) return;
      const member = siteData.team[index];

      // Populate modal data
      const avatarInitials = document.querySelector("#modal-avatar-initials");
      const name = document.querySelector("#modal-name");
      const role = document.querySelector("#modal-role");
      const experience = document.querySelector("#modal-experience");
      const focus = document.querySelector("#modal-focus");
      const bio = document.querySelector("#modal-bio");
      const whatsappLink = document.querySelector("#modal-whatsapp-link");
      const callLink = document.querySelector("#modal-call-link");

      if (avatarInitials) avatarInitials.textContent = member.avatarInitials;
      if (name) name.textContent = member.name;
      if (role) role.textContent = member.role;
      if (experience) experience.textContent = member.experience || "";
      if (focus) focus.textContent = member.focus || "";
      if (bio) bio.textContent = member.bio || "";
      
      if (whatsappLink) {
        const digits = member.phone.replace(/[^0-9]/g, "");
        whatsappLink.href = `https://wa.me/${digits}`;
      }
      if (callLink) {
        callLink.href = member.tel;
      }

      // Track card for accessibility focus return
      lastFocusedElement = triggeringCard;
      
      // Open modal
      modal.showModal();

      // Set focus inside the modal for accessibility
      const firstFocusable = modal.querySelector("#modal-close-btn");
      if (firstFocusable) {
        firstFocusable.focus();
      }
    };

    // Card click listener (event delegation)
    teamGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".team-member-card");
      if (card) {
        const index = parseInt(card.getAttribute("data-index"), 10);
        openTeamModal(index, card);
      }
    });

    // Card keyboard listener (event delegation)
    teamGrid.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const card = e.target.closest(".team-member-card");
        if (card) {
          e.preventDefault(); // Prevent page scroll on spacebar press
          const index = parseInt(card.getAttribute("data-index"), 10);
          openTeamModal(index, card);
        }
      }
    });
  }

  // Close Modal logic
  if (modal) {
    // Close button click
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.close();
      });
    }

    // Close on backdrop click (outside the modal container wrapper)
    modal.addEventListener("click", (e) => {
      const wrapper = modal.querySelector(".modal-wrapper");
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const clickInWrapper = (
          rect.top <= e.clientY && e.clientY <= rect.bottom &&
          rect.left <= e.clientX && e.clientX <= rect.right
        );
        if (!clickInWrapper) {
          modal.close();
        }
      }
    });

    // Return focus on close
    modal.addEventListener("close", () => {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    });
  }

  // 3. Re-scan dynamic elements for scroll reveals
  if (typeof window.observeElements === "function") {
    window.observeElements(document.body);
  }
});
