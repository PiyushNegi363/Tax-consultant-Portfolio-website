# Component PRD: Trust Strip
## Negi Tax Consultant — Landing Page (`index.html`)

**Parent document:** PRD-negi-tax-consultant.md
**Component location:** `index.html` (section 3, directly below Hero), styles in `home.css`
**Related documents:** PRD-hero-section.md, PRD-interaction-animation.md
**Scope:** Landing page only for this build pass — the same component pattern is reused (with more detail permitted) on the About page per parent PRD §7.2.

---

## 1. Purpose

The Trust Strip is a fast-scan credibility check — it exists for visitors who read the Hero, aren't fully convinced yet, and need a few concrete, skimmable facts before they'll commit to reading further or reaching out. It should take under 2 seconds to read as a whole.

This section carries real reputational weight: unlike the Hero's copy, these are presented as **facts/figures**, not value propositions — so accuracy here matters more than anywhere else on the page (see §7 on placeholder data risk).

---

## 2. Structure

```
<section class="trust-strip">
 └── .trust-strip-inner (max-width container)
      └── .trust-grid (3 or 4 columns desktop, 2 columns mobile)
           ├── .trust-item
           │    ├── stat/value (large number or short label)
           │    └── caption (what it means)
           ├── .trust-item
           ├── .trust-item
           └── .trust-item (if 4th is used)
```

No heading is required for this section — it functions as a visual continuation of the Hero, not a new topic requiring its own `<h2>`. If a heading is desired for structural/accessibility reasons, it should be visually hidden (`.sr-only`) rather than displayed, so the fast-scan visual rhythm isn't broken.

---

## 3. Content Specification

### 3.1 Stat items (confirm final 3 vs 4 — see §8)

| Stat | Value (placeholder) | Caption | Source status |
|---|---|---|---|
| Years in practice | `18+` | "Years in Practice" | **Placeholder** — parent PRD §9.2 |
| ICAI registration | `FCA` | "ICAI Fellow Member" | **Placeholder** — parent PRD §9.2 |
| Filings/clients handled | `500+` | "Filings Handled" | **Placeholder** — parent PRD §9.2, flagged as possibly unavailable |
| Team size | `3` | "Team Members" | **Confirmed** — N.S. Negi + Ankit Negi + Manoj Tiwari |

Team size is the only stat here backed by confirmed data today. The other three must not go to production without real figures from N.S. Negi — see §7.

### 3.2 Tone
Per ICAI guidance (parent PRD §1.2 and §7.0): these are **factual figures**, not comparative or superlative claims. "18+ Years in Practice" is acceptable (factual); something like "Haldwani's most trusted CA" would not be, and must never appear in this or any section.

---

## 4. Behavior Specification

- Static content — no interactivity, no links, no click targets on individual stat items (this is a credibility scan, not a navigation element)
- Per `PRD-interaction-animation.md` §2: each `.trust-item` is a `.reveal` element, staggered 80–100ms apart, fading/shifting in once as the section enters the viewport
- No hover states apply to `.trust-item` — these are not cards in the interactive sense (§3.3 of the Interaction PRD covers *card* hover; this section is intentionally excluded since these are static facts, not clickable/explorable content)

---

## 5. Design Specification

Derived from the approved "Warm Practical" design system (parent PRD §4).

| Property | Value |
|---|---|
| Section background | Slightly differentiated from the Hero above it — e.g. a subtle warm off-white shift or a thin top/bottom border in `var(--color-border)`, so the strip reads as a distinct band without a jarring color break |
| Grid | 4 columns desktop (or 3, per §8 decision), 2 columns tablet/mobile, equal-width, divided by thin vertical/horizontal `var(--color-border)` rules between items (evokes a simple ledger/tally feel, consistent with site-wide financial-document motif) |
| Stat value typography | `Bitter`, weight 600, large size (`clamp(1.75rem, 3vw, 2.25rem)`), `var(--color-accent)` (`#B85C38`) — this is the one place on the landing page where the accent color is used for large-scale text rather than just buttons/links, making these numbers the visual focal point of the section |
| Caption typography | `Work Sans`, ~0.78rem, uppercase, letter-spacing 0.05em, `var(--color-secondary)` |
| Item alignment | Center-aligned within each grid cell |
| Vertical padding (section) | ~48–56px desktop, ~36px mobile |
| Item internal padding | ~24px, enough breathing room that dividing lines don't feel cramped |

---

## 6. Error Handling & Edge Cases

| Scenario | Required behavior |
|---|---|
| One stat's real figure ends up unavailable at launch (e.g. clients/filings count) | Section must be able to gracefully run with 3 items instead of 4 — grid should not depend on exactly 4 items to look balanced. Do not display a fabricated/unverified number rather than omitting the stat |
| Very long caption text (unlikely, but future edits) | Captions must wrap without breaking the grid's row height alignment across items |
| `IntersectionObserver` unsupported or JS fails | Per Interaction PRD §6: items default to fully visible or the animation is simply skipped — content is never hidden as a result of animation failure |
| Numeric values requiring update over time (e.g. "18+ years" ages every year) | Recommend sourcing this value from `/data/site-data.js` (parent PRD §9.3) rather than hardcoding in `index.html`, so it's a single edit point going forward rather than requiring a markup change |

---

## 7. Data Accuracy Risk (Flagged)

This section is the highest-risk placeholder-data area on the entire landing page: three of four stats are currently invented numbers (§3.1). Presenting fabricated figures as fact — even temporarily during development/preview — carries more real-world risk here than elsewhere on the site (e.g. a placeholder bio paragraph reads as obviously unfinished; a bold stat like "500+ Filings Handled" reads as a real claim if seen by an actual client).

**Recommendation:** during development/staging, visually mark this section (e.g. a dev-only banner or watermark) so placeholder figures are never mistaken for launch-ready content, and treat "confirm real trust-strip figures with N.S. Negi" as a hard pre-launch blocker, not a nice-to-have — consistent with parent PRD §11 pre-launch checklist.

---

## 8. Open Questions

1. **3 stats or 4?** Current draft assumes 4 (three placeholder + team size). If the "filings/clients handled" figure can't be sourced confidently, recommend dropping to 3 confirmed/confirmable stats rather than keeping a guessed number.
2. **Should "ICAI Fellow Member" be included at all as a stat-style item**, given it's a credential rather than a number (it visually fits the pattern here, but it's categorically different from "18+" or "500+" — worth confirming this doesn't read as a data-type mismatch in the row)
3. **Icons vs. numbers-only:** current spec is text-only (large number/label + caption). Should each item also carry a small icon (e.g. calendar for years, badge for ICAI, document stack for filings)? Adds visual interest but introduces another asset dependency (icons don't currently exist in `/assets/icons/`).

---

*End of component PRD.*
