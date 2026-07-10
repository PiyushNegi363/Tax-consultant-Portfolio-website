# Component PRD: Hero Section
## Negi Tax Consultant — Landing Page (`index.html`)

**Parent document:** PRD-negi-tax-consultant.md
**Component location:** `index.html` (section 2, directly below header), styles in `home.css`
**Scope:** Landing page only — this is not a shared component like the header/footer.

---

## 1. Purpose

The hero is the first content a visitor reads after the header. Within a few seconds it must communicate:
1. **What this business is** (Chartered Accountancy practice)
2. **Where it operates** (Haldwani/Nainital — local search intent matters here, see SEO in parent PRD §6)
3. **Who to reach and how** (immediate path to WhatsApp or the Contact page)

It is the highest-priority conversion point on the entire site — most scroll-away decisions happen here.

---

## 2. Structure

```
<section class="hero"> (directly below header)
 └── .hero-inner (max-width container, two-column on desktop)
      ├── .hero-content
      │    ├── eyebrow text (small label above headline)
      │    ├── H1 (main value proposition)
      │    ├── sub-headline / lede paragraph
      │    └── .hero-ctas
      │         ├── Primary CTA — "WhatsApp Us"
      │         └── Secondary CTA — "Book a Consultation" (→ Contact page)
      └── .hero-visual
           └── credential/trust visual (see §5)
```

On mobile: single column, `.hero-visual` stacks below or above `.hero-content` (decision needed — see §8).

---

## 3. Content Specification

| Element | Content | Notes |
|---|---|---|
| Eyebrow | "Chartered Accountancy · Haldwani, Uttarakhand" | Small uppercase label; reinforces location for SEO/scanning, sits above H1 |
| H1 (headline) | One clear value proposition combining service + location, e.g. *"Accounting, GST & Tax Compliance for Haldwani Businesses"* | Must contain real keywords per SEO requirements (parent PRD §6) — not purely clever/abstract copy. This is the single `<h1>` for the entire landing page — no other H1 should exist on this page |
| Sub-headline / lede | 1–2 sentences expanding on the H1 — who this serves and what makes engaging simple, staying factual per ICAI tone rules (no superlatives, no comparative claims) | Example direction: *"CA N.S. Negi and team provide accounting, taxation and compliance support for individuals, traders and small businesses across Haldwani and Nainital."* |
| Primary CTA | "WhatsApp Us" | Links to `wa.me` deep link with a generic pre-filled enquiry message (pending resolution of Header PRD §8, question 3 — the two CTAs should be treated consistently once that's decided) |
| Secondary CTA | "Book a Consultation" | Links to `contact.html` (not an anchor scroll — since Contact is now a full separate page per current site structure) |

---

## 4. Behavior Specification

- **No auto-playing animation/carousel** — hero content is static on load (aligns with "warm, practical" tone; avoids flashy patterns)
- Both CTAs are real `<a>` tags (not JS-triggered buttons), so they work with JS disabled and are crawlable
- Primary CTA (WhatsApp) opens in a new tab (`target="_blank" rel="noopener"`)
- Secondary CTA (Contact page) opens in the same tab (standard internal navigation)
- If a hero image/graphic is used in `.hero-visual`, it must not push CTAs below the fold on common mobile viewport heights (test at 360×640 minimum)

---

## 5. `.hero-visual` — Content Options

This slot needs one concrete decision (see §8, open question 1). Options, consistent with the "Warm Practical" design direction and ICAI-safe tone:

**Option A — Credential badge/seal graphic**
A simple, static badge summarizing trust markers (e.g. "FCA · ICAI Member · 18+ Yrs") — visual, not a photo, avoids needing a professional photograph immediately.

**Option B — Photograph of N.S. Negi**
More personal/human, but depends on a real photo being available (currently a placeholder gap per parent PRD §9.2).

**Option C — Omit `.hero-visual` entirely**
Single-column hero, text-only, wider measure for the headline. Simplest to build, no dependency on missing assets (photo) or additional graphic design work.

**Recommendation:** Option C for the first build (removes a dependency on the missing photo), with Option A or B revisited once a real photograph is provided.

---

## 6. Design Specification

Derived from the approved "Warm Practical" design system (parent PRD §4).

| Property | Value |
|---|---|
| Section background | `var(--color-bg)` (`#FBF9F4`) |
| Vertical padding | ~72–96px desktop, ~48–56px mobile |
| Eyebrow typography | `Work Sans`, ~0.75rem, uppercase, letter-spacing 0.08em, `var(--color-accent)` |
| H1 typography | `Bitter`, weight 600–700, `clamp(2rem, 4vw, 3rem)`, `var(--color-ink)`, line-height ~1.1 |
| Sub-headline typography | `Work Sans`, ~1.05rem, `var(--color-secondary)`, max-width ~46 characters per line for readability |
| Primary CTA style | Filled button, `var(--color-whatsapp)` background, white text, subtle shadow (matches header CTA styling for consistency) |
| Secondary CTA style | Outlined button, `var(--color-ink)` border and text, fills to `var(--color-ink)`/inverts text on hover |
| CTA spacing | 14–16px gap between buttons, wrap to stacked full-width buttons on narrow mobile (<400px) |
| Content max-width | Matches global container (`1120px`), per parent PRD §4.4 |

---

## 7. Error Handling & Edge Cases

| Scenario | Required behavior |
|---|---|
| Headline text length varies (future copy edits) | Layout must not break with a slightly longer/shorter H1 — use `clamp()` for font-size, avoid fixed heights on `.hero-content` |
| `.hero-visual` image fails to load (if Option A/B chosen later) | Reserve space via defined `width`/`height` attributes to prevent layout shift; provide meaningful `alt` text so failure doesn't leave an unlabeled broken-image icon |
| WhatsApp CTA tapped with no internet | `wa.me` link simply fails to load in the new tab — this is expected browser/OS behavior, no custom handling required |
| Very small viewport (e.g. 320px) | CTAs stack vertically, full width; eyebrow/H1/sub-headline all remain legible without horizontal scroll |
| JS disabled | Hero must render and function fully — nothing in this section should depend on JavaScript execution |

---

## 8. Open Questions

1. **`.hero-visual` content** — confirm Option A, B, or C from §5. Recommendation is Option C (omit) for the first build.
2. **Exact H1 wording** — the example in §3 is a placeholder direction; needs final copy sign-off (should be checked against real keyword targets from the SEO section before finalizing).
3. **CTA consistency with header** — once Header PRD §8 Q3 (generic vs. context-specific WhatsApp pre-filled message) is resolved, apply the same decision to the hero's primary CTA for consistency across the page.

---

*End of component PRD.*
