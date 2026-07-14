document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("loginSection");
  const loginForm = document.getElementById("loginForm");
  const adminPassword = document.getElementById("adminPassword");
  const loginError = document.getElementById("loginError");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  const loginCard = document.querySelector(".login-card");

  const dashboardSection = document.getElementById("dashboardSection");
  const logoutBtn = document.getElementById("logoutBtn");
  
  const metricTotal = document.getElementById("metricTotal");
  const metricItr = document.getElementById("metricItr");
  const metricGst = document.getElementById("metricGst");
  const metricReg = document.getElementById("metricReg");

  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");

  const tableBody = document.getElementById("tableBody");
  const enquiriesTable = document.getElementById("enquiriesTable");
  const tableLoading = document.getElementById("tableLoading");
  const tableEmpty = document.getElementById("tableEmpty");

  const detailDrawer = document.getElementById("detailDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");

  const drawerDate = document.getElementById("drawerDate");
  const drawerName = document.getElementById("drawerName");
  const drawerPhone = document.getElementById("drawerPhone");
  const drawerEmail = document.getElementById("drawerEmail");
  const drawerService = document.getElementById("drawerService");
  const drawerMessage = document.getElementById("drawerMessage");

  const drawerCallBtn = document.getElementById("drawerCallBtn");
  const drawerWaBtn = document.getElementById("drawerWaBtn");
  const drawerMailBtn = document.getElementById("drawerMailBtn");

  let enquiriesData = [];
  let filteredData = [];
  let readLeads = JSON.parse(localStorage.getItem("admin_read_leads") || "[]");

  const exportCsvBtn = document.getElementById("exportCsvBtn");

  // 1. Initial State: Check for existing session token
  const savedToken = sessionStorage.getItem("admin_session_token");
  if (savedToken) {
    authenticateAndLoad(savedToken);
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", exportToCsv);
  }

  // 2. Login Form Handler
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredPassword = adminPassword.value.trim();
      if (!enteredPassword) {
        showLoginError("Please enter an access key.");
        return;
      }
      authenticateAndLoad(enteredPassword);
    });
  }

  // 3. Authenticate and Load Data
  function authenticateAndLoad(password) {
    if (loginSubmitBtn) {
      loginSubmitBtn.disabled = true;
      loginSubmitBtn.querySelector("span").textContent = "Verifying...";
    }

    const sheetUrl = (typeof siteData !== "undefined") ? siteData.googleSheetsUrl : "";
    const isUrlConfigured = sheetUrl && sheetUrl !== "YOUR_GOOGLE_SHEETS_WEB_APP_URL" && sheetUrl !== "";
    
    if (!isUrlConfigured) {
      // Mock / Preview Mode using test@123 key
      setTimeout(() => {
        if (password === "test@123") {
          sessionStorage.setItem("admin_session_token", password);
          
          loginSection.classList.add("hidden");
          dashboardSection.classList.remove("hidden");
          logoutBtn.classList.remove("hidden");

          // High fidelity mock data for local review
          enquiriesData = [
            {
              timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
              from_name: "Rajesh Kumar",
              from_phone: "9876543210",
              from_email: "rajesh.kumar@gmail.com",
              service_required: "Income Tax Return Filing",
              message: "Hi, I need assistance in filing my ITR-3 for my retail business in Haldwani. Please let me know what documents are required."
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
              from_name: "Sunita Negi",
              from_phone: "9412087654",
              from_email: "sunita.negi12@gmail.com",
              service_required: "Income Tax Return Filing",
              message: "I am a salaried employee in state government. Need help filing my ITR-1 for FY 2025-26. I have my Form 16 ready."
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
              from_name: "Amit Sharma",
              from_phone: "8765432109",
              from_email: "amit.sharma@yahoo.com",
              service_required: "GST Registration",
              message: "I am starting a new wholesale shop near Block Office and need a new GST registration. What is the fee and timeline?"
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 32).toISOString(),
              from_name: "Harish Tiwari",
              from_phone: "7055998877",
              from_email: "tiwari.trading@rediffmail.com",
              service_required: "GST Return Filing",
              message: "Looking for a tax professional to handle my monthly GSTR-1 and GSTR-3B filings regularly. Please contact me."
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
              from_name: "Priya Joshi",
              from_phone: "7654321098",
              from_email: "",
              service_required: "Firm / Company Registration",
              message: "We want to register a Private Limited Company for our tourist agency business. We have 2 directors ready with documents."
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 56).toISOString(),
              from_name: "Deepa Arya",
              from_phone: "9927654321",
              from_email: "deepa.arya.crafts@gmail.com",
              service_required: "MSME / Udyam Registration",
              message: "I run a small handloom business at home. I want to apply for MSME / Udyam registration to get bank loan benefits."
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
              from_name: "Vikram Singh",
              from_phone: "9568021752",
              from_email: "vikram.tax@outlook.com",
              service_required: "Other / Not sure",
              message: "Need consultancy regarding capital gains tax on selling ancestral land in Nainital."
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 96).toISOString(),
              from_name: "Ramesh Chandra",
              from_phone: "8126049581",
              from_email: "ramesh.chandra@outlook.com",
              service_required: "Accounts Book Keeping",
              message: "Need accounting support for a local school's annual audit. We have digital spreadsheets for all entries."
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 120).toISOString(),
              from_name: "Neha Bora",
              from_phone: "9634012345",
              from_email: "nehabora@live.in",
              service_required: "GST Return Filing",
              message: "Urgent help needed with GST annual return GSTR-9. The deadline is approaching. Please callback."
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 150).toISOString(),
              from_name: "Sanjay Rawat",
              from_phone: "9758039281",
              from_email: "",
              service_required: "Firm / Company Registration",
              message: "We want to register a Partnership firm for a new hardware store in Kathgodam. Need partnership deed drafting."
            }
          ];
          
          filteredData = [...enquiriesData];
          initializeFilters();
          calculateMetrics();
          renderTable();
        } else {
          showLoginError("Invalid access key. Use 'test@123' for preview mode.");
          triggerLoginShake();
          sessionStorage.removeItem("admin_session_token");
        }
        resetLoginButton();
      }, 800);
      return;
    }

    // Call doGet of Google Apps Script with password parameter
    fetch(`${sheetUrl}?p=${encodeURIComponent(password)}`)
      .then(res => res.json())
      .then(response => {
        if (response.result === "unauthorized") {
          showLoginError("Invalid access key. Please try again.");
          triggerLoginShake();
          sessionStorage.removeItem("admin_session_token");
        } else if (response.result === "success") {
          // Store session token locally
          sessionStorage.setItem("admin_session_token", password);
          
          // Switch Views
          loginSection.classList.add("hidden");
          dashboardSection.classList.remove("hidden");
          logoutBtn.classList.remove("hidden");

          // Initialize Dashboard
          enquiriesData = response.data || [];
          // Sort reverse chronological (newest first) by timestamp column
          enquiriesData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          filteredData = [...enquiriesData];
          
          initializeFilters();
          calculateMetrics();
          renderTable();
        } else {
          showLoginError("Error connecting to database: " + (response.message || "Unknown error"));
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        showLoginError("Network connection failed. Verify Apps Script Web App deployment settings.");
      })
      .finally(() => {
        resetLoginButton();
      });
  }

  // Helper: Display Login Error
  function showLoginError(message) {
    if (loginError) {
      loginError.textContent = message;
    }
  }

  // Helper: Reset Login Button State
  function resetLoginButton() {
    if (loginSubmitBtn) {
      loginSubmitBtn.disabled = false;
      loginSubmitBtn.querySelector("span").textContent = "Unlock Dashboard";
    }
  }

  // Helper: Trigger Card Shake on Error
  function triggerLoginShake() {
    if (loginCard) {
      loginCard.classList.add("shake");
      setTimeout(() => {
        loginCard.classList.remove("shake");
      }, 400);
      adminPassword.value = "";
      adminPassword.focus();
    }
  }

  // 4. Logout Action
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("admin_session_token");
      enquiriesData = [];
      filteredData = [];
      
      loginSection.classList.remove("hidden");
      dashboardSection.classList.add("hidden");
      logoutBtn.classList.add("hidden");
      
      if (adminPassword) {
        adminPassword.value = "";
        adminPassword.focus();
      }
      showLoginError("");
    });
  }

  // 5. Initialize Category Dropdown Filter
  function initializeFilters() {
    if (!filterSelect) return;
    
    // Keep only the first option ("All Services")
    filterSelect.innerHTML = `<option value="">All Services</option>`;
    
    if (typeof siteData !== "undefined" && siteData.services) {
      siteData.services.forEach(service => {
        const opt = document.createElement("option");
        opt.value = service.title;
        opt.textContent = service.title;
        filterSelect.appendChild(opt);
      });
      // Add 'Other / Not sure' option
      const otherOpt = document.createElement("option");
      otherOpt.value = "Other / Not sure";
      otherOpt.textContent = "Other / Not sure";
      filterSelect.appendChild(otherOpt);
    }
  }

  // 6. Calculate Metrics (Total, ITR, GST, Registration)
  function calculateMetrics() {
    if (!metricTotal) return;
    
    let itrCount = 0;
    let gstCount = 0;
    let regCount = 0;

    enquiriesData.forEach(item => {
      const s = (item.service_required || item.service || "").toLowerCase();
      if (s.includes("itr") || s.includes("income tax")) {
        itrCount++;
      } else if (s.includes("gst")) {
        gstCount++;
      } else if (s.includes("registration") || s.includes("company")) {
        regCount++;
      }
    });

    // Staggered counting animation
    animateValue(metricTotal, 0, enquiriesData.length, 1200);
    setTimeout(() => animateValue(metricItr, 0, itrCount, 1000), 100);
    setTimeout(() => animateValue(metricGst, 0, gstCount, 1000), 200);
    setTimeout(() => animateValue(metricReg, 0, regCount, 1000), 300);
  }

  // Count animation helper with easeOutExpo deceleration curve
  function animateValue(el, start, end, duration) {
    if (!el) return;
    if (start === end) {
      el.textContent = end;
      return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.floor(easeProgress * (end - start) + start);
      el.textContent = val;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  }

  // 7. Render Data Table
  function renderTable() {
    tableLoading.classList.add("hidden");
    
    if (filteredData.length === 0) {
      enquiriesTable.classList.add("hidden");
      tableEmpty.classList.remove("hidden");
      return;
    }

    tableEmpty.classList.add("hidden");
    enquiriesTable.classList.remove("hidden");
    tableBody.innerHTML = "";

    filteredData.forEach((item, index) => {
      const tr = document.createElement("tr");
      
      // Date formatting: e.g. "13 Jul, 10:30 AM"
      const dateObj = new Date(item.timestamp);
      let dateString = "Invalid Date";
      if (!isNaN(dateObj)) {
        const options = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true };
        dateString = dateObj.toLocaleDateString("en-IN", options);
      }

      const isRead = readLeads.includes(item.timestamp);
      const statusCell = isRead 
        ? `<span class="status-badge read">Reviewed</span>` 
        : `<span class="status-badge">New</span>`;

      tr.innerHTML = `
        <td>${statusCell}</td>
        <td class="table-date-col">${dateString}</td>
        <td class="table-name-col">${escapeHtml(item.from_name)}</td>
        <td class="hide-small-mobile">${escapeHtml(item.from_phone)}</td>
        <td><span class="table-tag-badge">${escapeHtml(item.service_required || item.service)}</span></td>
        <td class="hide-mobile">${escapeHtml(item.from_email || "-")}</td>
      `;

      tr.addEventListener("click", () => {
        openDrawer(item, dateString);
      });

      tableBody.appendChild(tr);
    });
  }

  // Helper: Prevent HTML injection
  function escapeHtml(str) {
    if (!str) return "";
    return str.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 8. Filter and Search Input Event Listeners
  if (searchInput) {
    searchInput.addEventListener("input", performSearchAndFilter);
  }
  if (filterSelect) {
    filterSelect.addEventListener("change", performSearchAndFilter);
  }

  function performSearchAndFilter() {
    const query = searchInput.value.trim().toLowerCase();
    const serviceFilter = filterSelect.value;

    filteredData = enquiriesData.filter(item => {
      const matchesSearch = (
        (item.from_name || "").toLowerCase().includes(query) ||
        (item.from_phone || "").toLowerCase().includes(query) ||
        (item.from_email || "").toLowerCase().includes(query) ||
        (item.message || "").toLowerCase().includes(query)
      );

      const matchesService = !serviceFilter || (item.service_required || item.service) === serviceFilter;

      return matchesSearch && matchesService;
    });

    renderTable();
  }

  // 9. Side Drawer Operations
  function openDrawer(item, formattedDate) {
    drawerDate.textContent = formattedDate;
    drawerName.textContent = item.from_name;
    drawerPhone.textContent = item.from_phone;
    drawerEmail.textContent = item.from_email || "Not provided";
    drawerService.textContent = item.service_required || item.service;
    drawerMessage.textContent = item.message || "(No message details provided)";

    // Actions configuration
    drawerCallBtn.href = `tel:${item.from_phone.replace(/\s+/g, "")}`;
    
    const waText = encodeURIComponent(`Hello ${item.from_name}, this is Negi Tax Consultant. We have received your enquiry regarding ${item.service_required || item.service} and would like to connect.`);
    drawerWaBtn.href = `https://wa.me/${item.from_phone.replace(/\D/g, "")}?text=${waText}`;
    
    drawerMailBtn.href = item.from_email 
      ? `mailto:${item.from_email}?subject=Re: Enquiry for ${encodeURIComponent(item.service_required || item.service)}`
      : "#";

    if (!item.from_email) {
      drawerMailBtn.style.opacity = "0.5";
      drawerMailBtn.style.pointerEvents = "none";
    } else {
      drawerMailBtn.style.opacity = "1";
      drawerMailBtn.style.pointerEvents = "auto";
    }

    // Set up click-to-copy fields
    setupClipboardCopy(drawerName, item.from_name, "Client name copied!");
    setupClipboardCopy(drawerPhone, item.from_phone, "Phone number copied!");
    if (item.from_email) {
      setupClipboardCopy(drawerEmail, item.from_email, "Email address copied!");
    } else {
      drawerEmail.onclick = null;
      drawerEmail.style.cursor = "default";
      drawerEmail.title = "";
    }

    // Mark as reviewed
    if (!readLeads.includes(item.timestamp)) {
      readLeads.push(item.timestamp);
      localStorage.setItem("admin_read_leads", JSON.stringify(readLeads));
      performSearchAndFilter(); // Trigger redraw to update reviewed badge
    }

    detailDrawer.classList.add("open");
    drawerOverlay.classList.add("active");
  }

  function setupClipboardCopy(element, text, successMsg) {
    element.style.cursor = "pointer";
    element.title = "Click to copy";
    element.onclick = (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(text)
        .then(() => {
          showToast(successMsg, "success");
        })
        .catch(err => console.error("Copy failed:", err));
    };
  }

  // 10. CSV Export System
  function exportToCsv() {
    if (filteredData.length === 0) {
      showToast("No enquiries to export.", "error");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    // CSV Headers
    csvContent += "Timestamp,Client Name,Phone,Email,Service Requested,Message\r\n";

    filteredData.forEach(row => {
      const timestamp = `"${(row.timestamp || "").replace(/"/g, '""')}"`;
      const name = `"${(row.from_name || "").replace(/"/g, '""')}"`;
      const phone = `"${(row.from_phone || "").replace(/"/g, '""')}"`;
      const email = `"${(row.from_email || "").replace(/"/g, '""')}"`;
      const service = `"${(row.service_required || row.service || "").replace(/"/g, '""')}"`;
      const message = `"${(row.message || "").replace(/"/g, '""')}"`;

      csvContent += `${timestamp},${name},${phone},${email},${service},${message}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    const dateToday = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `negi_tax_enquiries_${dateToday}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Enquiries exported successfully!", "success");
  }

  // 11. Toast System
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

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

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

  function closeDrawer() {
    detailDrawer.classList.remove("open");
    drawerOverlay.classList.remove("active");
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", closeDrawer);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeDrawer);
  }

  // Close drawer on ESC key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
    }
  });
});
