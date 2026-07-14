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
        <span class="team-member-action">
          View Profile
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
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
        whatsappLink.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
          <span>WhatsApp</span>
        `;
      }
      if (callLink) {
        callLink.href = member.tel;
        callLink.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>Call</span>
        `;
      }

      // Populate phone details & copy logic
      const phoneText = document.querySelector("#modal-phone-text");
      const copyBtn = document.querySelector("#modal-copy-phone-btn");

      if (phoneText) phoneText.textContent = member.phone;

      if (copyBtn) {
        // Reset copy button layout
        copyBtn.className = "btn-copy-phone";
        copyBtn.innerHTML = `
          <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="copy-status-text">Copy</span>
        `;
        
        copyBtn.onclick = (e) => {
          e.preventDefault();
          navigator.clipboard.writeText(member.phone)
            .then(() => {
              copyBtn.classList.add("copied");
              copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span class="copy-status-text">Copied!</span>
              `;
              setTimeout(() => {
                copyBtn.classList.remove("copied");
                copyBtn.innerHTML = `
                  <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span class="copy-status-text">Copy</span>
                `;
              }, 2000);
            })
            .catch(err => console.error("Copy failed:", err));
        };
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
