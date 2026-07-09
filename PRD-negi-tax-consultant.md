# Product Requirements Document
## Negi Tax Consultant — Business Portfolio Website

**Version:** 1.0
**Prepared for:** Development handoff (AI-assisted build)
**Project type:** Static multi-page website (no backend, no database)

---

## 1. Project Overview

### 1.1 Purpose
A business portfolio website for a Chartered Accountancy practice, **Negi Tax Consultant**, based in Haldwani, Uttarakhand. The site establishes credibility, communicates services offered, and funnels visitors to contact the firm via WhatsApp or a contact form.

### 1.2 Business Context
- **Practice type:** Sole proprietor CA firm with associate staff
- **Principal:** N.S. Negi, Chartered Accountant (CA)
- **Associates:** Ankit Negi, Manoj Tiwari
- **Location:** Near Block Office, Haldwani (Nainital), Uttarakhand, India
- **Regulatory constraint:** The firm is bound by **ICAI (Institute of Chartered Accountants of India) advertising guidelines**. Content must remain informational, not promotional. No client testimonials, no comparative claims, no solicitation language.

### 1.3 Goals
- Present the firm and its services clearly to prospective clients
- Make it effortless to make contact (WhatsApp-first, since this is the dominant contact channel for the target audience)
- Rank for local search intent (e.g. "CA in Haldwani," "GST registration Nainital")
- Remain simple enough for non-technical maintenance going forward

### 1.4 Non-Goals (explicitly out of scope for v1)
- No backend server, database, or CMS
- No admin panel / login-protected content editing (revisit post-launch if needed)
- No online payments
- No client portal / document upload system
- No pricing displayed (standard practice for CA firms)

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Markup | HTML5 | Semantic tags required (see §7.3) |
| Styling | CSS3 | No framework (no Bootstrap/Tailwind) — hand-written, using CSS variables for design tokens |
| Behavior | Vanilla JavaScript (ES6+) | No React/Vue/frameworks — this is a static brochure site |
| Shared components | JS-based partial injection | `header.html` / `footer.html` fetched and injected at runtime via `components.js` |
| Local dev server | Required | `fetch()` for partials will not work over `file://` — use VS Code Live Server or an equivalent local static server |
| Hosting target | Static hosting (GitHub Pages or Vercel) | No server-side code, so any static host works |
| Forms | Client-side only | Submissions open a pre-filled WhatsApp deep link (`wa.me`) — no backend form processor |

**Explicitly rejected for this scope:** Next.js/React (no dynamic data or auth to justify it), 11ty/Astro (adds a build step for only 4 pages), any headless CMS (deferred — see admin panel decision in §10).

---

## 3. Folder Structure

```
negi-tax-consultant/
│
├── index.html                 # Landing page
├── about.html                  # About Us page
├── services.html                # Services page
├── contact.html                  # Contact page
│
├── /partials/
│   ├── header.html              # Shared nav — injected via JS on every page
│   └── footer.html              # Shared footer — injected via JS on every page
│
├── /css/
│   ├── style.css                # Global: CSS variables, typography, header/footer, buttons, form base styles
│   ├── home.css                  # Landing page specific styles
│   ├── about.css                 # About page specific styles
│   ├── services.css              # Services page specific styles
│   └── contact.css               # Contact page specific styles
│
├── /js/
│   ├── components.js             # Fetches & injects header.html/footer.html into every page
│   ├── nav.js                     # Mobile menu toggle, active nav-link highlighting
│   └── contact-form.js            # Form validation + WhatsApp deep-link submission logic
│
├── /data/
│   └── site-data.js               # Single source of truth for editable content (see §9)
│
├── /assets/
│   ├── /images/
│   │   ├── logo.png
│   │   ├── ca-photo.jpg           # N.S. Negi's photo (placeholder until provided)
│   │   └── favicon.ico
│   └── /icons/                     # Service icons, UI icons — SVG format preferred
│
├── sitemap.xml                     # For search engine crawling
├── robots.txt                       # Crawl directives
└── README.md                         # Setup/local-dev/deploy instructions
```

**Rationale:**
- One CSS file per page (plus a shared global file) isolates page-specific styling so editing one page cannot visually break another.
- `/partials/` + `components.js` avoids duplicating header/footer markup across four HTML files — edit once, reflects everywhere.
- `/data/site-data.js` centralizes editable business content (phone numbers, services, address) in one file, so future content updates don't require touching page markup — see §9.

---

## 4. Design System

### 4.1 Direction
**"Warm Practical"** — warm, human, small-firm feel. Deliberately avoids generic "corporate blue" and avoids common AI-generated-site defaults (cream + terracotta clichés, dark-mode neon accents, broadsheet newspaper layouts) by grounding choices in the subject: a local, personally-accountable CA practice.

### 4.2 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-ink` | `#2C3639` | Headings, primary body text, header/footer background |
| `--color-bg` | `#FBF9F4` | Page background (warm cream, not stark white) |
| `--color-accent` | `#B85C38` | CTAs, links, active states, highlights (rust/terracotta) |
| `--color-secondary` | `#6B705C` | Secondary/muted text (sage grey) |
| `--color-surface` | `#FFFFFF` | Cards, form backgrounds |
| `--color-border` | `#E4DFD3` | Dividers, input borders |
| `--color-success` | `#3E7C5C` | Form success states |
| `--color-error` | `#B3261E` | Form validation error states |
| `--color-whatsapp` | `#25D366` | WhatsApp CTA buttons specifically (recognizable brand color, functional not aesthetic) |

Accessibility requirement: all text/background pairings must meet **WCAG 2.1 AA contrast ratios** (4.5:1 for body text, 3:1 for large text/headings).

### 4.3 Typography

| Role | Typeface | Usage |
|---|---|---|
| Display / Headings | **Bitter** (slab serif) | H1–H3, section headers — sturdy, approachable, not corporate |
| Body | **Work Sans** | Paragraphs, nav, buttons, form labels |
| Data / Numbers (optional) | System monospace fallback | Phone numbers, membership numbers if visual distinction is wanted |

Load via Google Fonts with `font-display: swap` to avoid layout shift/blocking render.

**Type scale (suggested, adjust in build):**
- H1: 2.25rem / 36px (mobile: 1.75rem)
- H2: 1.75rem / 28px
- H3: 1.25rem / 20px
- Body: 1rem / 16px, line-height 1.6
- Small/caption: 0.85rem / 13.6px

### 4.4 Spacing & Layout
- Base spacing unit: 8px grid
- Max content width: 1120px, centered, with 24–28px side padding on mobile
- Border radius: minimal/sharp (2–4px) — consistent with the grounded, practical feel; avoid heavily rounded "app-like" corners

---

## 5. Site-Wide Requirements

### 5.1 Shared Header (all pages)
- Firm name/logo
- Nav links: Home, About, Services, Contact
- Persistent WhatsApp CTA button (desktop: visible in nav bar; mobile: inside hamburger menu)
- Active page indicator in nav (highlight current page link)
- Sticky on scroll

### 5.2 Shared Footer (all pages)
- Firm name and tagline
- Address (Near Block Office, Haldwani, Nainital, Uttarakhand)
- Phone (N.S. Negi — primary)
- Email
- Quick links (repeat of nav)
- **ICAI compliance disclaimer** (mandatory, all pages): informational-only notice, no solicitation language
- Copyright line with dynamic year (JS: `new Date().getFullYear()`)

### 5.3 Responsive Requirements
- Mobile-first build; must render correctly at 360px width minimum
- Breakpoints: mobile (<600px), tablet (600–900px), desktop (>900px)
- Hamburger nav below 900px
- All interactive elements must have touch targets ≥ 44x44px on mobile

### 5.4 Accessibility Requirements
- Semantic HTML throughout (see §7.3)
- Visible keyboard focus states on all interactive elements (links, buttons, form fields)
- All images require descriptive `alt` text (see §6 SEO)
- Form fields require associated `<label>` elements (not placeholder-only labeling)
- Reduced-motion respected: wrap any animation in `@media (prefers-reduced-motion: no-preference)`
- Color is never the only indicator of state (e.g. form errors must include icon/text, not just red border)

---

## 6. SEO Requirements

Applies to all four pages:

1. **Unique `<title>` and `<meta name="description">` per page**, written naturally with real local + service keywords (e.g. `GST Registration & Filing in Haldwani | Negi Tax Consultant`)
2. **One `<h1>` per page**, matching page intent; proper `H1 → H2 → H3` nesting — no skipped levels
3. **Location + service keywords** worked naturally into real copy (Haldwani, Nainital, Uttarakhand, Chartered Accountant, service names) — never keyword-stuffed
4. **Descriptive `alt` text** on every image (e.g. `alt="N.S. Negi, Chartered Accountant in Haldwani"`, never generic `alt="photo"`)
5. **Semantic HTML** — `<nav>`, `<main>`, `<section>`, `<footer>`, `<address>` used correctly (see §7.3)
6. **JSON-LD structured data** — `LocalBusiness` / `AccountingService` schema with name, address, phone, hours, on at minimum the homepage (ideally all pages)
7. **`sitemap.xml`** listing all four pages
8. **`robots.txt`** allowing crawling of the full site
9. **Performance**: no render-blocking heavy assets, optimized images (WebP where possible, defined width/height to avoid layout shift), fast Largest Contentful Paint

Note (context, not a dev requirement): on-page SEO alone won't drive local ranking — a **Google Business Profile** should be set up separately once the site is live. Flagged here for awareness, not part of this build.

---

## 7. Page-by-Page Specification

### 7.0 Global Note on Content Tone
All page copy must stay **factual and informational**, per ICAI restrictions — no superlatives ("best," "No. 1"), no comparative claims, no client testimonials attributed by name.

---

### 7.1 Landing Page (`index.html`)

| # | Section | Content |
|---|---|---|
| 1 | Header/Nav | Shared (see §5.1) |
| 2 | Hero | One-line value proposition, CA name + credential mention, two CTAs: "WhatsApp Us" (primary) and "Book a Consultation" → links to Contact page |
| 3 | Trust strip | 3–4 stats/badges: years in practice, ICAI membership status, filings/clients handled (values to be confirmed — see §9.2 dummy data) |
| 4 | Services preview | 4–6 service cards (name + one-line description only), "View All Services" → Services page |
| 5 | Why choose us | 3 short factual points (e.g. direct access, on-time filing, local team) — no comparative language |
| 6 | About preview | One paragraph + photo teaser of N.S. Negi, "Learn More" → About page |
| 7 | CTA banner | Focused second conversion strip: "Have a query? Reach out on WhatsApp" |
| 8 | Footer | Shared (see §5.2) |

---

### 7.2 About Us Page (`about.html`)

| # | Section | Content |
|---|---|---|
| 1 | Header/Nav | Shared |
| 2 | Page header | "About Us" + one-line firm philosophy |
| 3 | CA Profile | Photo, full name, qualifications (B.Com, FCA — placeholder), ICAI membership no. (placeholder), FRN (placeholder), years in practice (placeholder), short bio paragraph |
| 4 | Team section | Ankit Negi and Manoj Tiwari — name, role, area of focus if differentiated |
| 5 | What we stand for | 3–4 factual principles (timely filing, direct access, transparent process) |
| 6 | Credentials/trust strip | Same component as landing page, more detail permitted here |
| 7 | CTA banner | "Want to work with us?" → Contact page/WhatsApp |
| 8 | Footer | Shared |

---

### 7.3 Services Page (`services.html`)

| # | Section | Content |
|---|---|---|
| 1 | Header/Nav | Shared |
| 2 | Page header | "Services" + one-line framing |
| 3 | Services list | One block per service, all 7: Accounts Book Keeping, GST Registration, GST Return Filing, Firm/Company Registration, Income Tax Return Filing, MSME/Udyam Registration, E-TDS Filing & Bank Loan Assistance. Each block: name, 2–3 line description, who it's for, "Enquire about this" → service-specific WhatsApp deep link |
| 4 | Process strip | Optional — simple 3–4 step "How it works" |
| 5 | Documents checklist | **Open item — not yet confirmed for v1** (see §10) |
| 6 | CTA banner | "Not sure which service you need?" → Contact page/WhatsApp |
| 7 | Footer | Shared |

---

### 7.4 Contact Page (`contact.html`)

| # | Section | Content |
|---|---|---|
| 1 | Header/Nav | Shared |
| 2 | Page header | "Get in Touch" + reassurance line (e.g. response time expectation) |
| 3 | Contact details block | Phone (click-to-call `tel:`), WhatsApp (click-to-chat, pre-filled), Email (click-to-mail `mailto:`), Address, Office hours |
| 4 | Enquiry form | See §8 for full field/validation spec |
| 5 | Map embed | Google Maps embed (no API key required for basic embed) |
| 6 | Team contact row | Ankit and Manoj — name, role, phone, click-to-call |
| 7 | FAQ | Optional — 2–3 short factual Q&As (e.g. documents needed for ITR) |
| 8 | Footer | Shared |

---

## 8. Contact Form — Functional Spec

### 8.1 Fields

| Field | Type | Required | Validation |
|---|---|---|---|
| Full name | text | Yes | Non-empty, min 2 characters, no numeric-only input |
| Phone number | tel | Yes | Exactly 10 digits, numeric only (Indian mobile format); reject leading `0` sequences of invalid length |
| Email | email | No | If provided, must match standard email pattern |
| Service required | select (dropdown) | Yes | Must match one of the 7 defined services or "Other / Not sure" |
| Message | textarea | No | Max length cap (e.g. 500 characters) to keep WhatsApp message reasonable |

### 8.2 Submission Behavior
- On submit: **prevent default form submission** (no page reload/backend post)
- Validate all required fields client-side; on failure, show inline error messages per field (not just a generic banner) — see §8.3
- On success: construct a pre-filled message string from field values, URL-encode it, and open `https://wa.me/91<phone>?text=<encoded_message>` in a new tab, where `<phone>` is the firm's primary WhatsApp number
- Show a visible on-page confirmation state after successful submission (e.g. "Opening WhatsApp with your details filled in…")
- No data is stored, logged, or transmitted anywhere other than the resulting WhatsApp message — this should be stated in a form note for user trust

### 8.3 Error Handling Requirements (general, applies site-wide)
- **Form validation errors**: inline, field-level, in plain language (e.g. "Enter a valid 10-digit phone number" — not "Invalid input")
- **Empty required field on submit**: focus moves to first invalid field, error shown, submission blocked
- **JS/partial load failure**: if `fetch()` for header/footer partials fails (e.g. served incorrectly over `file://`, or file missing), the page must not break entirely — provide a fallback (either inline critical nav links in each page as a no-JS fallback, or a visible console warning plus graceful degradation, so the page remains navigable)
- **Broken image**: all images should have meaningful `alt` text so a failed image load doesn't leave an unlabeled gap
- **Map embed failure**: if the iframe fails to load (e.g. no internet), it should not break page layout — reserve fixed height/space regardless of load state
- **404 handling**: since this is a static site, provide a simple `404.html` with navigation back to Home (relevant once hosted; not needed for local dev)
- **External link failures** (WhatsApp/tel/mailto links on a device without the relevant app): these are OS-handled; no special JS handling required, but links should degrade gracefully (e.g. `tel:` links simply do nothing harmful on desktop browsers without calling capability)

---

## 9. Content & Data

### 9.1 Confirmed Business Data

| Field | Value |
|---|---|
| Firm name | Negi Tax Consultant |
| CA / Principal | N.S. Negi |
| Primary contact (WhatsApp/calls) | +91 96908 22761 |
| Associate | Ankit Negi — +91 84778 65564 |
| Associate | Manoj Tiwari — +91 95680 21752 |
| Address | Near Block Office, Haldwani (Nainital), Uttarakhand |
| Email | nsnegi.hld@gmail.com |
| Services (7) | Accounts Book Keeping (yearly/monthly), GST Registration, GST Return Filing, Firm/Company Registration, Income Tax Return Filing, MSME/MSY Registration, E-TDS Filing & Bank Loan |

### 9.2 Placeholder / Dummy Data — Must Be Replaced Before Launch

| Field | Current placeholder | Action needed |
|---|---|---|
| ICAI Membership No. | `134582` | Replace with N.S. Negi's real membership number |
| Firm Registration No. (FRN) | `021845C` | Replace with real FRN, or remove if not applicable |
| Qualifications | `B.Com, FCA` | Confirm actual qualifications |
| Years of experience | `18+ years` | Confirm actual figure |
| "MSY Registration" | Currently merged into "MSME/Udyam Registration" | Confirm with N.S. Negi whether this is a typo for MSME or a distinct scheme, and separate if needed |
| CA photo | Placeholder/initials avatar | Replace with real photograph |
| Trust strip stats (clients/filings handled) | Placeholder numbers | Confirm real figures or remove section if unavailable |

### 9.3 Data Centralization
All of the above should live in `/data/site-data.js` as a single exported object, referenced by page scripts — so future edits to phone numbers, services, or credentials happen in one file rather than across multiple HTML pages.

---

## 10. Open Items (Not Yet Finalized)

1. **Documents checklist section on Services page** — useful but requires accurate per-service document lists; decide whether to include in v1 or add post-launch
2. **FAQ section on Contact page** — optional, content not yet drafted
3. **Admin panel** — explicitly deferred; current approach is direct file edits via `/data/site-data.js`. Revisit only if update frequency post-launch justifies the backend/auth complexity
4. **Real business data** listed in §9.2 — must be collected before production launch
5. **Google Business Profile setup** — recommended but outside the website build itself

---

## 11. Deployment

- **Hosting:** GitHub Pages or Vercel (static, free tier sufficient)
- **Domain:** Not yet decided — needs a domain name if not using default subdomain
- **Local development:** Requires a local static server (e.g. VS Code Live Server) due to `fetch()`-based partial injection — opening HTML files directly via `file://` will not correctly load shared header/footer
- **Pre-launch checklist:**
  - [ ] All placeholder data from §9.2 replaced with real values
  - [ ] All images have final assets and alt text
  - [ ] Forms tested on both mobile and desktop, including WhatsApp deep link behavior
  - [ ] Lighthouse/accessibility audit passed (performance, accessibility, SEO, best practices)
  - [ ] `sitemap.xml` and `robots.txt` in place
  - [ ] Cross-browser check (Chrome, Safari, Firefox mobile + desktop)

---

*End of document.*
