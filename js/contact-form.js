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
      mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(siteData.contact.addressMapQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }

    const directionsLink = document.getElementById("contact-map-directions-link");
    if (directionsLink) {
      directionsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteData.contact.addressMapQuery)}`;
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
          ${member.focus ? `<span class="team-contact-focus">${member.focus}</span>` : ""}
          <a href="${member.tel}" class="team-contact-phone">${member.phone}</a>
        `;
        teamContactGrid.appendChild(card);
      });
    }
  }

  // Initialize EmailJS
  if (typeof emailjs !== "undefined" && typeof siteData !== "undefined" && siteData.emailjs && siteData.emailjs.publicKey !== "YOUR_PUBLIC_KEY") {
    emailjs.init({
      publicKey: siteData.emailjs.publicKey
    });
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

    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("emailAddress").value.trim();
    const service = serviceSelect.value;
    const message = document.getElementById("messageText").value.trim();

    // Prepare EmailJS Template parameters
    const templateParams = {
      from_name: name,
      from_phone: phone,
      from_email: email || "Not provided",
      service_required: service,
      message: message || "No message details provided."
    };

    // Temporarily disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    const btnText = submitBtn.querySelector("span");
    const originalText = btnText ? btnText.textContent : "Send Message";
    if (btnText) btnText.textContent = "Sending...";


    // Check if EmailJS keys are configured
    const isConfigured = (
      typeof emailjs !== "undefined" &&
      typeof siteData !== "undefined" &&
      siteData.emailjs &&
      siteData.emailjs.publicKey &&
      siteData.emailjs.publicKey !== "YOUR_PUBLIC_KEY" &&
      siteData.emailjs.serviceId !== "YOUR_SERVICE_ID" &&
      siteData.emailjs.adminTemplateId !== "YOUR_TEMPLATE_ID"
    );

    if (!isConfigured) {
      console.warn("EmailJS is not configured. Falling back to default mailto link submission.");
      if (formStatus) {
        formStatus.textContent = "Developer Notice: Please configure your EmailJS API keys in data/site-data.js. Opening fallback mailto link...";
        formStatus.className = "form-status ok";
      }
      form.submit();
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        if (btnText) btnText.textContent = originalText;
      }, 2000);
      return;
    }

    // 1. Send Admin Notification Email
    const adminPromise = emailjs.send(siteData.emailjs.serviceId, siteData.emailjs.adminTemplateId, templateParams);

    // 2. Send Client Auto-Reply Email (if clientTemplateId is provided and client provided an email address)
    const clientEmail = email.trim();
    const hasClientTemplate = (
      siteData.emailjs.clientTemplateId &&
      siteData.emailjs.clientTemplateId !== "YOUR_TEMPLATE_ID" &&
      siteData.emailjs.clientTemplateId !== ""
    );

    const promises = [adminPromise];

    if (clientEmail && hasClientTemplate) {
      const clientPromise = emailjs.send(siteData.emailjs.serviceId, siteData.emailjs.clientTemplateId, templateParams);
      promises.push(clientPromise);
    }

    // 3. Post to Google Sheets Web App (if configured)
    const sheetUrl = (typeof siteData !== "undefined") ? siteData.googleSheetsUrl : "";
    const hasSheetUrl = sheetUrl && sheetUrl !== "YOUR_GOOGLE_SHEETS_WEB_APP_URL" && sheetUrl !== "";

    if (hasSheetUrl) {
      const sheetPromise = fetch(sheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(templateParams)
      }).catch(err => console.error("Google Sheets logging failed:", err));
      
      promises.push(sheetPromise);
    }

    Promise.all(promises)
      .then(() => {
        if (formStatus) {
          formStatus.textContent = "Thank you! Your enquiry has been sent successfully. We will get back to you shortly.";
          formStatus.className = "form-status ok";
        }
        showToast("Message sent successfully!", "success");
        form.reset();
        // Reset character counter if it exists
        const charCounter = document.getElementById("messageCharCounter");
        if (charCounter) charCounter.textContent = "0 / 500";
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        if (formStatus) {
          formStatus.textContent = "Unable to send your message. Please try again later or contact us directly via Phone / WhatsApp.";
          formStatus.className = "form-status error";
        }
        showToast("Failed to send message. Please try again.", "error");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        if (btnText) btnText.textContent = originalText;
      });
  });

  // 3. Textarea Character Counter
  const messageText = document.getElementById("messageText");
  const charCounter = document.getElementById("messageCharCounter");
  if (messageText && charCounter) {
    const maxLen = messageText.getAttribute("maxlength") || 500;
    const updateCounter = () => {
      const len = messageText.value.length;
      charCounter.textContent = `${len} / ${maxLen}`;
      if (len >= maxLen) {
        charCounter.classList.add("at-max");
      } else {
        charCounter.classList.remove("at-max");
      }
    };
    messageText.addEventListener("input", updateCounter);
    updateCounter(); // Initialize
  }

  // Toast Notification System
  function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    const iconSvg = type === "success" 
      ? `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger slide-down transition
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Auto dismiss toast after 4s
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 400);
    }, 4000);
  }

  // Re-scan dynamic elements for scroll reveals
  if (typeof window.observeElements === "function") {
    window.observeElements(document.body);
  }
});
