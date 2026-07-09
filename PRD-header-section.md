# Component PRD: Header / Navigation
## Negi Tax Consultant — Shared Header (all pages)

**Parent document:** PRD-negi-tax-consultant.md
**Component file(s):** `/partials/header.html`, styles in `style.css`, behavior in `components.js` + `nav.js`
**Scope:** This component is shared across all four pages (Home, About, Services, Contact) via runtime injection — build once, applies everywhere.

---

## 1. Purpose

The header is the first thing every visitor sees and the primary navigation mechanism across the site. Its job:
1. Identify the firm immediately (name, not just a logo mark)
2. Provide access to all four pages from anywhere on the site
3. Surface the single highest-priority action — **contact via WhatsApp** — persistently, regardless of scroll position
4. Work identically and reliably on mobile and desktop

---

## 2. Structure

```
<header> (sticky)
 └── .nav-inner (max-width container)
      ├── .brand
      │    ├── firm name (text or logo)
      │    └── tagline / subtitle (e.g. "Chartered Accountant · Haldwani")
      ├── .nav-links (desktop only, hidden <900px)
      │    ├── Home
      │    ├── About
      │    ├── Services
      │    └── Contact
      ├── .nav-cta (WhatsApp button — desktop, hidden <900px)
      └── .burger (mobile menu toggle — visible <900px only)
           └── .mobile-panel (collapsible, contains nav links + WhatsApp CTA)
```

---

## 3. Content Specification

| Element | Content | Notes |
|---|---|---|
| Firm name | "Negi Tax Consultant" | Always links to `index.html` |
| Tagline | "Chartered Accountant · Haldwani" | Small text under/beside firm name; omit on very small screens if space is tight |
| Nav links | Home, About, Services, Contact | Exact labels; link to `index.html`, `about.html`, `services.html`, `contact.html` respectively |
| WhatsApp CTA label | "WhatsApp Us" | Not "Contact Us" — must be explicit about channel per prior decisions |
| WhatsApp CTA link | `https://wa.me/919690822761?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20your%20services.` | Opens in new tab (`target="_blank" rel="noopener"`) |

---

## 4. Behavior Specification

### 4.1 Sticky positioning
- Header remains fixed to the top of the viewport on scroll (`position: sticky; top: 0;`)
- Must include a subtle background (not fully transparent) and a bottom border/shadow once content scrolls beneath it, so it stays legible over any page content
- `z-index` must be high enough to stay above all page content but should not clip open dropdowns/modals if any are added later

### 4.2 Active page indicator
- The nav link corresponding to the **currently open page** must be visually distinguished (e.g. underline, color change, or bold weight) from the other links
- This applies to both desktop nav links and the mobile panel links
- Implementation: since header is injected via JS into every page, `nav.js` must detect the current page (`window.location.pathname`) after injection and apply an `.active` class to the matching link

### 4.3 Mobile menu (burger)
- Below 900px viewport width: `.nav-links` and the desktop `.nav-cta` are hidden; `.burger` button becomes visible
- Tapping `.burger` toggles `.mobile-panel` open/closed (class toggle, e.g. `.open`)
- `.mobile-panel` contains: all 4 nav links + the WhatsApp CTA (styled consistently, full width)
- Tapping any link inside `.mobile-panel` must close the panel (so navigating doesn't leave it stuck open on the next page, though a fresh page load resets state regardless — this matters if a link is an in-page anchor)
- Burger icon should visually indicate state (e.g. hamburger ↔ X) — optional but recommended
- `.burger` must have `aria-expanded` reflecting open/closed state, and `aria-label="Open menu"` / `"Close menu"` updated accordingly

### 4.4 Header injection (technical)
- `components.js` fetches `/partials/header.html` and injects it into a placeholder element present on every page (e.g. `<div id="header-placeholder"></div>`)
- Injection must complete **before** `nav.js` runs its active-link and burger-toggle logic — sequence this with a callback/promise, not a fixed timeout
- If the fetch fails (see error handling in §6), the page must not be left without any means of navigation

---

## 5. Design Specification

Derived from the approved "Warm Practical" design system (see parent PRD §4).

| Property | Value |
|---|---|
| Background | `var(--color-bg)` at ~92% opacity with backdrop blur, OR solid `var(--color-ink)` if a dark header is preferred — **needs final call, see open question in §8** |
| Firm name typography | `Bitter`, weight 600, ~1.15rem |
| Tagline typography | `Work Sans`, ~0.7rem, uppercase, letter-spacing, `var(--color-secondary)` |
| Nav link typography | `Work Sans`, 500 weight, ~0.9rem |
| Nav link color (default) | `var(--color-ink)` |
| Nav link color (active/hover) | `var(--color-accent)` (`#B85C38`) |
| WhatsApp CTA background | `var(--color-whatsapp)` (`#25D366`), white text, slight box-shadow for a pressed/tactile look |
| WhatsApp CTA hover | Darker green (`#1DA851`) |
| Border/divider | 1px solid `var(--color-border)` at the base of the header |
| Padding | 16px vertical, 28px horizontal (desktop); 14px/20px (mobile) |
| Burger icon | 3 horizontal bars, `var(--color-ink)`, inside a bordered tap target ≥44x44px |

---

## 6. Error Handling & Edge Cases

| Scenario | Required behavior |
|---|---|
| `fetch('/partials/header.html')` fails (network issue, wrong path, opened via `file://`) | Page must not be left with a blank top and no navigation. Minimum acceptable fallback: log a clear console error AND ensure the placeholder element has a hardcoded minimal fallback (firm name + link to `index.html`) written directly in each page's HTML, so total nav loss cannot happen even if JS fails entirely |
| JS disabled in browser | Since header depends on JS injection, this is a real risk for a no-JS visitor. Fallback nav content (as above) should be present in the placeholder by default and only get *replaced* by the richer injected version — not solely rely on JS to render nav from nothing |
| Very long firm name / tagline on narrow screens | Text must not overflow or break layout — use `text-overflow: ellipsis` or allow wrapping to a second line without breaking the header's fixed height awkwardly |
| Rapid repeated burger taps | Toggle logic must be idempotent (simple class toggle is fine) — no animation queue buildup or broken state from fast tapping |
| Active-link detection on `index.html` vs `/` root | Handle both `index.html` and `/` (root) resolving to "Home" as active — don't let trailing slashes or missing filenames cause no link to be marked active |
| WhatsApp CTA on desktop without WhatsApp installed | `wa.me` links fall back to WhatsApp Web in browser — no special handling needed, this is expected default behavior |

---

## 7. Accessibility Requirements

- `<header>` and `<nav>` must use correct semantic tags (not generic `<div>`s)
- Nav `<ul>`/`<li>` structure for links (not bare `<a>` tags floating in a `<div>`), for correct screen-reader list semantics
- Burger button must be a real `<button>` element (not a `<div>` with a click handler) for keyboard/screen-reader accessibility
- Burger button requires `aria-label` and `aria-expanded` attributes, updated on toggle
- All nav links and the CTA must be reachable and operable via keyboard (Tab + Enter), with a visible focus outline (do not remove `outline` without providing a replacement focus style)
- Color contrast for nav link text against header background must meet WCAG AA (4.5:1)

---

## 8. Open Questions

1. **Header background:** light (cream, matching page background, with a border to separate it) vs. dark (deep charcoal-green `--color-ink`, high-contrast against page content)? This significantly affects the visual weight of the header — needs a decision before build.
2. **Logo vs. text-only brand mark:** currently spec'd as text-only ("Negi Tax Consultant" + tagline). Confirm whether a logo image exists or should be designed, or if text-only is final.
3. Should the WhatsApp CTA in the header link with a **generic** pre-filled message (as currently spec'd), or remain a bare link with no pre-filled text, since context ("I'd like to enquire about your services") may not fit every entry point (e.g. someone clicking it from the Services page enquiring about something specific)?

---

*End of component PRD.*
