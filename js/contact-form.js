document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("enquiryForm");
  const serviceSelect = document.getElementById("serviceRequired");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  if (!form) return;

  // 1. Programmatically populate the service dropdown (ensures consistency)
  if (serviceSelect && typeof servicesList !== "undefined") {
    // Insert options before the final "Other / Not sure" option
    servicesList.forEach(service => {
      const option = document.createElement("option");
      option.value = service;
      option.textContent = service;
      // Insert option before the last child option ("Other / Not sure")
      serviceSelect.insertBefore(option, serviceSelect.lastElementChild);
    });
  }

  // 2. Validation Constraints
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

  // 3. Helper to validate a specific field
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

  // 4. Attach Event Listeners for blur (validate when leaving field)
  const inputsToValidate = form.querySelectorAll("input[required], select[required], input[type='email']");
  inputsToValidate.forEach(input => {
    input.addEventListener("blur", () => {
      validateField(input);
    });
  });

  // 5. Submit Event Handler
  if (form) {
    form.addEventListener("submit", (e) => {
      // Prevent default action (so native mailto is not triggered if JS is active)
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
        // Move focus to first invalid input
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      // If valid, build WhatsApp message
      const name = document.getElementById("fullName").value.trim();
      const phone = document.getElementById("phoneNumber").value.trim();
      const email = document.getElementById("emailAddress").value.trim();
      const service = serviceSelect.value;
      const message = document.getElementById("messageText").value.trim();

      // Compile raw text format
      let waMessage = `New enquiry from the website:\n`;
      waMessage += `Name: ${name}\n`;
      waMessage += `Phone: ${phone}\n`;
      if (email) waMessage += `Email: ${email}\n`;
      waMessage += `Service: ${service}\n`;
      if (message) waMessage += `Message: ${message}`;

      // URL Encode message
      const encodedMsg = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/919690822761?text=${encodedMsg}`;

      // Temporarily disable submit button to avoid double taps
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");

      // Open in new tab
      window.open(waUrl, "_blank", "noopener");

      // Display on-page success
      if (formStatus) {
        formStatus.textContent = "Thank you! Your enquiry has been compiled. WhatsApp has been opened in a new tab to complete your message.";
        formStatus.className = "form-status ok";
      }

      // Re-enable button after small delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
      }, 2000);
    });
  }
});
