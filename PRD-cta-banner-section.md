# Component PRD: CTA Banner
## Negi Tax Consultant — Landing Page (`index.html`)

**Parent document:** PRD-negi-tax-consultant.md
**Component location:** `index.html` (section 7, below About Preview, directly above Footer), styles in `home.css`
**Related documents:** PRD-about-preview-section.md, PRD-footer-section.md, PRD-interaction-animation.md
**Scope:** Landing page only. This is the **final** landing-page section PRD — after this, the full section set (Header → Hero → Trust Strip → Services Preview → Why Choose Us → About Preview → CTA Banner → Footer) is spec'd.

---

## 1. Purpose

This is the second, and last, dedicated conversion point on the landing page (the first being the Hero's CTAs). Its job is narrow and specific: catch visitors who scrolled through the entire page, read everything, but did not click anything along the way — and give them one final, low-friction, unmissable prompt before they hit the footer and (likely) leave.

Unlike every other landing-page section, this one is not trying to inform, persuade, or build trust — all of that has already happened by this point in the scroll. This section's only job is **conversion**, and it should be built accordingly: short, focused, visually distinct from the sections above it.

---

## 2. Structure

```
<section class="cta-banner">
 └── .cta-banner-inner (max-width container, centered content)
      ├── H2 (short, direct prompt)
      ├── one-line supporting text (optional)
      └── .cta-banner-actions
           ├── Primary CTA — "WhatsApp Us"
           └── Secondary CTA — "Send an Enquiry" → contact.html (optional, see §8)
```

This is the simplest structural section on the landing page — deliberately so.

---

## 3. Content Specification

| Element | Content | Notes |
|---|---|---|
| H2 | "Have a Query? Reach Out on WhatsApp" (per parent PRD §7.1, item 7) | This is the page's final `<h2>` — short, direct, imperative framing is appropriate here since it's a call-to-action rather than a descriptive section header |
| Supporting text (optional) | One line, e.g. "We typically respond within a few hours during office hours." | Sets a realistic expectation, reduces hesitation — must be factual (matches actual office hours from parent PRD §9.1), not a promotional claim |
| Primary CTA | "WhatsApp Us" | Same destination/pattern as the Header CTA (PRD-header-section.md §3) and Hero primary CTA (PRD-hero-section.md §3) — **all three should resolve consistently** once Header PRD §8 Q3 (generic vs. contextual pre-filled message) is finalized |
| Secondary CTA (optional) | "Send an Enquiry" → `contact.html` | For visitors who prefer the form over WhatsApp — see §8 for whether this is necessary here given the Contact page is already reachable via the header nav on every scroll position |

---

## 4. Behavior Specification

- Per `PRD-interaction-animation.md` §2: this section can use a simple single-block reveal (not staggered — there's only one H2 + one action row, no grid of independent items)
- Primary CTA follows the same button behavior as the Header/Hero WhatsApp CTAs: opens in a new tab, `rel="noopener"`
- Secondary CTA (if included) is standard internal navigation to `contact.html`, same tab
- No dismissible/closeable behavior — this is a normal scrolling section, not a sticky/floating banner that overlays content (see §8 for whether a sticky variant should be considered separately)

---

## 5. Design Specification

Derived from the approved "Warm Practical" design system (parent PRD §4). This section should look **visually distinct** from the sections above it — it is the one place on the page where a slightly bolder treatment is appropriate, since its only job is to be noticed.

| Property | Value |
|---|---|
| Section background | `var(--color-ink)` (`#2C3639`) — a dark band, consistent with the Footer's background (PRD-footer-section.md §5), which also creates a natural visual transition into the Footer immediately below it rather than an abrupt light-to-dark jump only at the very last footer boundary |
| Text color | `var(--color-bg)` (`#FBF9F4`) for the H2, muted warm-white for supporting text — mirrors Footer's text treatment for consistency between these two adjacent dark sections |
| H2 typography | `Bitter`, weight 600, `clamp(1.5rem, 3vw, 2.1rem)`, centered |
| Supporting text typography | `Work Sans`, ~0.95rem, muted color, centered |
| Primary CTA style | Same filled `var(--color-whatsapp)` button as Header/Hero, but sized slightly larger here given this is the section's sole focus (no competing content) |
| Secondary CTA style (if included) | Outline button, but using a light/cream border and text (since the background here is dark, unlike the Hero's outline CTA which sits on a light background) — **do not reuse the Hero's exact outline styling unmodified**, it needs an inverted color treatment to remain legible on this dark section |
| Content alignment | Centered (text-align + flex-centered actions) — the only centered section on the landing page, appropriate given its singular focused purpose versus the left-aligned/grid content above |
| Vertical padding (section) | ~64–72px desktop, ~48px mobile — noticeably more contained than a full content section, reinforcing that this is a short, punchy moment rather than another block to read through |

---

## 6. Error Handling & Edge Cases

| Scenario | Required behavior |
|---|---|
| Both CTAs present and text wraps on narrow mobile | Stack vertically, full width, consistent with Hero CTA stacking behavior (PRD-hero-section.md §6) |
| `IntersectionObserver`/JS failure | Section defaults to fully visible per Interaction PRD §6 |
| WhatsApp CTA message inconsistency across Header/Hero/CTA Banner | If these three CTAs ever end up with different pre-filled WhatsApp message text due to independent implementation, that's a bug, not a variation — flag in code review, not just visually similar-looking buttons with silently different behavior |

---

## 7. Relationship to Other CTAs on the Page

This section is the **third** WhatsApp CTA a visitor may encounter on the landing page (after the Header, which is persistent, and the Hero). This repetition is intentional — the header CTA is easy to forget exists once scrolling begins, and the Hero CTA is only seen by visitors who haven't scrolled past it yet. Repeating the same action at the natural end of the reading flow is a standard, low-risk pattern here, not redundant clutter — provided the CTA banner does not appear so frequently elsewhere on the page that it feels repetitive within a single scroll (it should not, e.g., also appear mid-page).

---

## 8. Open Questions

1. **Include the secondary "Send an Enquiry" CTA, or WhatsApp-only?** Given the Contact page is already one click away via the sticky header at all times, a second CTA here may be unnecessary — a single, unambiguous WhatsApp CTA might convert better than presenting a choice at the very last moment before the footer. Recommend testing/deciding based on preference for simplicity vs. optionality.
2. **Sticky/floating variant instead of a static in-flow section?** An alternative pattern (common on similar local-business sites) is a persistent floating WhatsApp button (bottom-right corner) that stays visible throughout the entire scroll, rather than (or in addition to) this static banner section. This was not part of the original section list (parent PRD §7.1) but is worth flagging as a possible addition — would need its own scope decision if pursued, since it changes site-wide behavior, not just this one section.
3. **Supporting text response-time claim** — "a few hours during office hours" is a draft placeholder; confirm this is realistic and something N.S. Negi is comfortable committing to publicly, since it sets a client expectation that should be honored in practice.

---

*End of component PRD.*

---

## Landing Page — Section PRD Set Complete

All 8 landing page sections now have dedicated component PRDs:

1. Header — `PRD-header-section.md`
2. Hero — `PRD-hero-section.md`
3. Trust Strip — `PRD-trust-strip-section.md`
4. Services Preview — `PRD-services-preview-section.md`
5. Why Choose Us — `PRD-why-choose-us-section.md`
6. About Preview — `PRD-about-preview-section.md`
7. CTA Banner — this document
8. Footer — `PRD-footer-section.md`

Plus the site-wide `PRD-interaction-animation.md` and the parent `PRD-negi-tax-consultant.md`.

**Outstanding blockers before any of this goes to build**, consolidated:
- Real "years in practice" figure (blocks Trust Strip §7, About Preview §8)
- Real ICAI membership no., FRN, exact qualification (FCA vs. ACA vs. CA) — parent PRD §9.2
- ICAI-compliance review of Why Choose Us copy and Footer disclaimer wording, ideally by N.S. Negi directly
- Confirm whether "MSY Registration" is real or a typo (parent PRD §9.2)
- Professional photo — flagged as a priority asset, not a someday item
- Header PRD §8 Q3 (WhatsApp CTA message consistency) — affects Header, Hero, and this CTA Banner section identically, so worth resolving once and applying to all three
