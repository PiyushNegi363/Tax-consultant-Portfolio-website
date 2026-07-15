# Negi Tax Consultant — Portfolio & Admin Dashboard

A premium, modern, and highly responsive portfolio website for **Negi Tax Consultant**, a Chartered Accountancy firm in Haldwani, Nainital, Uttarakhand. The site features client enquiry management via a serverless Google Sheets database, real-time EmailJS notifications, and an automated Dialogflow AI chatbot.

---

## 🌟 Key Features

1. **Premium & Responsive Design**
   - Curated high-contrast earth-tone palette styled dynamically with Vanilla CSS variables.
   - Mobile-first layouts with smooth scroll transitions and entrance animations.
   - Print-friendly style declarations designed for client-ready PDF downloads.

2. **Dual-Channel Enquiry Pipeline**
   - **Database Logging**: Captures contact form inquiries and posts them concurrently to a serverless Google Sheets database.
   - **Email Notifications**: Triggers immediate client-details notifications directly to your email inbox via EmailJS.

3. **Secure Admin Dashboard Panel (`admin.html`)**
   - Dedicated dashboard featuring key metrics (ITR, GST, Registrations volume charts).
   - Live query tables with search indexing, filters, unread badges, and CSV spreadsheet exports.
   - Interactive client communication drawer offering quick-action Call, Email, and WhatsApp links.
   - **Mock Mode Fallback**: Allows preview testing using local credentials when remote database links are unconfigured.

4. **Aesthetic & Structural Improvements**
   - Centered filter categories and reduced spacing layouts on Services tabs.
   - Practice values pill card aligned cleanly in the About page.
   - Interactive card clickability indicators with micro-animated arrows on Team profiles.

---

## 📂 File Architecture

```text
├── about.html          # About page layout (Team profiles, Practice values)
├── admin.html          # Enquiry admin console (Metrics, Query listing, Search)
├── contact.html        # Contact page (Map, Contact Form, FAQs)
├── index.html          # Home landing page (Hero details, Quick-action services)
├── services.html       # Services directory (GST, ITR, Audits, Accounting)
├── css/
│   ├── about.css       # About page grid and profiles styling
│   ├── admin.css       # Metrics panel, data tables, and slide drawers
│   ├── contact.css     # FAQ card styling and inputs layout
│   ├── home.css        # Hero slideshow, grid layouts, animations
│   ├── services.css    # Center-aligned tabs and listing cards
│   └── style.css       # Global base CSS variables, fonts, reset styles
├── js/
│   ├── about.js        # Dynamic modal content injector for team members
│   ├── admin.js        # Admin auth, dashboard metrics, filter table, exports
│   ├── components.js   # Dynamic header/footer loading logic
│   ├── contact-form.js # Form submits interceptor, Google Sheet & EmailJS hooks
│   ├── nav.js          # Responsive navigation dropdown toggle, sticky header
│   └── scroll-reveal.js# Scroll animation scroll observer trigger
├── data/
│   ├── config.js       # Local credentials file (GIT-IGNORED)
│   └── site-data.js    # Global site configuration, values, team details JSON
└── partials/
    ├── header.html     # Reused navigation header template
    └── footer.html     # Reused footer with copyright script anchor
```

---

## 🔒 Security & Separation of Credentials

To protect sensitive keys (such as EmailJS IDs or Google Sheets Web App URLs), the repository separates configuration parameters into local files:
- **`data/config.js`**: Contains local, private variables (e.g. EmailJS template keys, API endpoint).
- **`.gitignore`**: Excludes `data/config.js` from Git version control to prevent pushing private keys to public GitHub repositories.
- **Dynamic Check System**: `data/site-data.js` automatically checks if the `config` object is defined, falling back to placeholder strings to prevent crashes on new code checkouts.

---

## 🚀 Setup & Deployment Guide

### Step 1: Configure Credentials File
Create a `data/config.js` file in the root `data/` directory and structure it as follows:
```javascript
// data/config.js
const config = {
  emailjs: {
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    adminTemplateId: "YOUR_ADMIN_NOTIFICATION_TEMPLATE_ID",
    clientTemplateId: "YOUR_CLIENT_AUTO_REPLY_TEMPLATE_ID", // Set to "" to disable
    publicKey: "YOUR_PUBLIC_KEY"
  },
  googleSheetsUrl: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"
};
```

### Step 2: Set Up Google Sheets Logging Database
To securely capture and fetch enquiry data, deploy a Google Apps Script linked to a Google Sheet:
1. Create a new Google Sheet named `Enquiries Database`.
2. Enter the following headers in Row 1:
   - Column A: `Timestamp` | Column B: `Name` | Column C: `Phone` | Column D: `Email` | Column E: `Service` | Column F: `Message`
3. Go to **Extensions > Apps Script**. Paste the database hook code into the script editor:
   ```javascript
    var SHEET_NAME = "Sheet1";
    var ADMIN_PASSWORD = "YOUR_DESIRED_ADMIN_PASSWORD"; // Change to your admin console password

    function doPost(e) {
      try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
        if (!sheet) {
          sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; // Fallback to first tab
        }
        var data = JSON.parse(e.postData.contents || "{}");
        sheet.appendRow([
          new Date().toISOString(),
          data.name || data.from_name || "",
          "'" + (data.phone || data.from_phone || ""), // Prefix with quote to preserve leading zeros
          data.email || data.from_email || "",
          data.service || data.service_required || "",
          data.message || ""
        ]);
        return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
          .setMimeType(ContentService.MimeType.JSON);
      } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    function doGet(e) {
      var pass = e.parameter.p;
      if (pass !== ADMIN_PASSWORD) {
        return ContentService.createTextOutput(JSON.stringify({ result: "unauthorized" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; // Fallback to first tab
      }
      var rows = sheet.getDataRange().getValues();
      var headers = rows[0];
      var list = [];
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var obj = {};
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j].toLowerCase()] = row[j];
        }
        list.push(obj);
      }
      return ContentService.createTextOutput(JSON.stringify({ result: "success", data: list }))
        .setMimeType(ContentService.MimeType.JSON);
    }
   ```
4. Click **Deploy > New deployment**. Select type **Web app**.
   - **Execute as**: `Me (your-gmail-account@gmail.com)`
   - **Who has access**: `Anyone` (required to allow client-side contact forms to post enquiries).
