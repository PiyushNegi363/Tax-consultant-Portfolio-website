document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic contact details population
  if (typeof siteData !== "undefined") {
    // Left column details
    const phoneLink = document.getElementById("contact-phone-link");
    if (phoneLink) {
      phoneLink.href = siteData.contact.phoneTel;
      phoneLink.textContent = siteData.contact.phone;
    }

    const waLink = document.getElementById("contact-whatsapp-link");
    if (waLink) {
      waLink.href = siteData.contact.whatsappLink;
      waLink.textContent = siteData.contact.whatsapp;
    }

    const emailLink = document.getElementById("contact-email-link");
    if (emailLink) {
      emailLink.href = siteData.contact.emailMailto;
      emailLink.textContent = siteData.contact.email;
    }

    const addressBlock = document.getElementById("contact-address");
    if (addressBlock) {
      const parts = siteData.contact.address.split(", ");
      if (parts.length >= 3) {
        addressBlock.innerHTML = `${parts[0]},<br>${parts[1]}, ${parts[2]},<br>${parts.slice(3).join(", ")}`;
      } else {
        addressBlock.textContent = siteData.contact.address;
      }
    }

    const hoursEl = document.getElementById("contact-hours");
    if (hoursEl) {
      hoursEl.textContent = siteData.contact.officeHours;
    }

    const mapIframe = document.getElementById("contact-map-iframe");
    if (mapIframe) {
      mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(siteData.contact.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }

    const directionsLink = document.getElementById("contact-map-directions-link");
    if (directionsLink) {
      directionsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteData.contact.address)}`;
    }

    // Team Contact cards row
    const teamContactGrid = document.getElementById("contact-team-grid");
    if (teamContactGrid && siteData.team) {
      teamContactGrid.innerHTML = "";
      siteData.team.forEach(member => {
        const card = document.createElement("div");
        card.className = "team-contact-card reveal-item";
        card.innerHTML = `
          <span class="team-contact-name">${member.name}</span>
          <span class="team-contact-role">${member.role}</span>
          <a href="${member.tel}" class="team-contact-phone">${member.phone}</a>
        `;
        teamContactGrid.appendChild(card);
      });
    }
  }

  // 2. Enquiry Form Logic
  const form = document.getElementById("enquiryForm");
  const serviceSelect = document.getElementById("serviceRequired");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  if (!form) return;

  // Programmatically populate the service dropdown
  if (serviceSelect && typeof siteData !== "undefined") {
    // Keep first (placeholder) and last ("Other / Not sure") options
    const firstOption = serviceSelect.firstElementChild;
    const lastOption = serviceSelect.lastElementChild;
    serviceSelect.innerHTML = "";
    if (firstOption) serviceSelect.appendChild(firstOption);
    
    siteData.services.forEach(service => {
      const option = document.createElement("option");
      option.value = service.title;
      option.textContent = service.title;
      serviceSelect.appendChild(option);
    });

    if (lastOption) serviceSelect.appendChild(lastOption);
  } else if (serviceSelect && typeof servicesList !== "undefined") {
    // Fallback if siteData is not present but servicesList is
    servicesList.forEach(service => {
      const option = document.createElement("option");
      option.value = service;
      option.textContent = service;
      serviceSelect.insertBefore(option, serviceSelect.lastElementChild);
    });
  }

  // Validation Constraints
  const validationRules = {
    fullName: (val) => {
      if (!val.trim()) return "Full name is required.";
      if (val.trim().length < 2) return "Name must be at least 2 characters.";
      if (/^[0-9\s]+$/.test(val)) return "Name cannot contain numbers only.";
      return null;
    },
    phoneNumber: (val) => {
      if (!val.trim()) return "Phone number is required.";
      if (!/^\d{10}$/.test(val.trim())) return "Phone number must be exactly 10 digits.";
      return null;
    },
    emailAddress: (val) => {
      if (!val.trim()) return null; // optional
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) return "Enter a valid email address.";
      return null;
    },
    serviceRequired: (val) => {
      if (!val) return "Please select a service.";
      return null;
    }
  };

  // Helper to validate a specific field
  function validateField(inputEl) {
    const fieldId = inputEl.id;
    const rule = validationRules[fieldId];
    if (!rule) return true; // no rule defined

    const val = inputEl.value;
    const errorMsg = rule(val);
    const groupEl = document.getElementById(`${fieldId}Group`);
    const errorEl = document.getElementById(`${fieldId}Error`);

    if (errorMsg) {
      if (groupEl) groupEl.classList.add("error");
      if (errorEl) {
        errorEl.textContent = errorMsg;
        inputEl.setAttribute("aria-invalid", "true");
        inputEl.setAttribute("aria-describedby", `${fieldId}Error`);
      }
      return false;
    } else {
      if (groupEl) groupEl.classList.remove("error");
      if (errorEl) {
        errorEl.textContent = "";
        inputEl.removeAttribute("aria-invalid");
        inputEl.removeAttribute("aria-describedby");
      }
      return true;
    }
  }

  // Attach Event Listeners for blur
  const inputsToValidate = form.querySelectorAll("input[required], select[required], input[type='email']");
  inputsToValidate.forEach(input => {
    input.addEventListener("blur", () => {
      validateField(input);
    });
  });

  // Submit Event Handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isFormValid = true;
    let firstInvalidInput = null;

    // Validate all inputs
    inputsToValidate.forEach(input => {
      const isValid = validateField(input);
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = input;
      }
    });

    if (!isFormValid) {
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    // Build WhatsApp message
    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("emailAddress").value.trim();
    const service = serviceSelect.value;
    const message = document.getElementById("messageText").value.trim();

    let waMessage = `New enquiry from the website:\n`;
    waMessage += `Name: ${name}\n`;
    waMessage += `Phone: ${phone}\n`;
    if (email) waMessage += `Email: ${email}\n`;
    waMessage += `Service: ${service}\n`;
    if (message) waMessage += `Message: ${message}`;

    const encodedMsg = encodeURIComponent(waMessage);
    
    // Retrieve phone dynamically
    const rawPhone = (typeof siteData !== "undefined") ? siteData.contact.whatsapp : "+91 96908 22761";
    const cleanPhone = rawPhone.replace(/\D/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    // Temporarily disable submit button
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    // Open in new tab
    window.open(waUrl, "_blank", "noopener");

    // Display on-page success
    if (formStatus) {
      formStatus.textContent = "Thank you! Your enquiry has been compiled. WhatsApp has been opened in a new tab to complete your message.";
      formStatus.className = "form-status ok";
    }

    // Re-enable button
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }, 2000);
  });

  // Re-scan dynamic elements for scroll reveals
  if (typeof window.observeElements === "function") {
    window.observeElements(document.body);
  }
});
