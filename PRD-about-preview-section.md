# Component PRD: About Preview
## Negi Tax Consultant — Landing Page (`index.html`)

**Parent document:** PRD-negi-tax-consultant.md
**Component location:** `index.html` (section 6, below Why Choose Us), styles in `home.css`
**Related documents:** PRD-why-choose-us-section.md, PRD-interaction-animation.md, parent PRD §7.2 (full About page spec)
**Scope:** Landing page only. This is a **teaser** of the full About page — must not duplicate its depth (parent PRD §7.2: full CA profile, team section, credentials, principles).

---

## 1. Purpose

Put a real person behind everything the visitor has read so far. The Trust Strip gave numbers, Services gave capability, Why Choose Us gave working-style reassurance — this section personalizes all of it by introducing N.S. Negi directly, then routes anyone who wants more (credentials, team, full bio) to the About page.

This is also the first (and only, on the landing page) section built around a specific individual rather than the firm generally — so it must read as a person, not another feature block.

---

## 2. Structure

```
<section class="about-preview">
 └── .about-preview-inner (max-width container, two-column on desktop)
      ├── .about-preview-visual
      │    └── photo or placeholder avatar (see §5)
      └── .about-preview-content
           ├── eyebrow (optional, e.g. "Meet Your CA")
           ├── H2 (name or framing headline)
           ├── short bio paragraph (2-3 sentences max)
           └── "Learn More" CTA → about.html
```

On mobile: single column, visual stacks above content (photo/avatar first, since it's the personalizing element — reversed from a typical "text first" mobile stack, deliberately).

---

## 3. Content Specification

| Element | Content | Notes |
|---|---|---|
| Eyebrow (optional) | "Meet Your CA" | Sets expectation this is about a person, not the firm generally |
| H2 | "N. S. Negi" or "About N. S. Negi" | This is a page-level `<h2>` — the single `<h1>` remains in the Hero (PRD-hero-section.md §3) |
| Bio paragraph | 2–3 sentences: qualification, years in practice, general approach/focus area. **Must be short** — full bio lives on the About page (parent PRD §7.2) | Draft direction only, not final copy — see §8. Must stay within the same ICAI tone rules as Why Choose Us (PRD-why-choose-us-section.md §3.2): factual, no superlatives, no comparative claims |
| CTA | "Learn More" or "Read Full Profile" → `about.html` | Single CTA, same pattern as Services Preview's "View All Services" |

**Example draft direction (not final copy):**
> "N. S. Negi is a Chartered Accountant based in Haldwani, with [X] years of experience in accounting, taxation and compliance for individuals and small businesses across the region."

The `[X]` years figure must not be filled with a placeholder number here — this section should either wait for the real figure (per the unresolved Trust Strip data issue, PRD-trust-strip-section.md §7) or omit the specific year count and speak more generally until confirmed.

---

## 4. Behavior Specification

- Static content, single CTA (`about.html`) — no WhatsApp link in this section specifically; the "get in touch" action is handled by the CTA Banner immediately following this section (parent PRD §7.1, item 7) and persistently by the header
- Per `PRD-interaction-animation.md` §2: the section reveals once as a whole (photo + content together, not staggered internally — this is a single cohesive unit, not a grid of independent items like Trust Strip or Services Preview)
- The "Learn More" CTA follows standard link hover behavior (PRD-interaction-animation.md §3.1/3.2 — treat as a text link or outline button consistent with other secondary CTAs on the page, not the primary WhatsApp button styling)

---

## 5. `.about-preview-visual` — Content Options

Same underlying dependency issue as the Hero's visual slot (PRD-hero-section.md §5) — a real photo of N.S. Negi does not yet exist (parent PRD §9.2).

**Option A — Placeholder avatar (initials or simple icon)**
Consistent with a "launch now, refine later" approach. Low visual impact but avoids blocking the build.

**Option B — Wait for real photo before building this section**
Since this section's entire purpose is personalization, an initials placeholder somewhat undermines the point (unlike the Hero, where omitting the visual entirely was viable — see PRD-hero-section.md §5, Option C). A blank/generic avatar next to "Meet Your CA" may read as unfinished in a way that's more noticeable here than elsewhere.

**Recommendation:** build the section now with a clearly-styled placeholder avatar (Option A), but flag this as one of the **first assets to swap** once available — treat "get a professional photo" as a real pre-launch task, not a someday item, given how central it is to this specific section's purpose.

---

## 6. Design Specification

Derived from the approved "Warm Practical" design system (parent PRD §4).

| Property | Value |
|---|---|
| Section background | `var(--color-bg)`, consistent with surrounding sections |
| Layout | Two-column, roughly 40/60 or 45/55 split (visual/content), desktop; single column mobile |
| Visual container | Square or portrait-oriented frame, modest size (not full-bleed/dominant) — this is a preview, not a hero photo treatment; minimal border-radius consistent with site-wide radius token (parent PRD §4.4) |
| Placeholder avatar style | Consistent with the avatar treatment already used elsewhere if applicable (e.g. initials on a solid `var(--color-ink)` background, per the earlier rejected design's avatar pattern) — reuse this pattern rather than inventing a new placeholder style |
| Eyebrow typography | `Work Sans`, ~0.75rem, uppercase, letter-spacing, `var(--color-accent)` |
| H2 typography | `Bitter`, weight 600, `clamp(1.5rem, 2.5vw, 2rem)`, `var(--color-ink)` |
| Bio paragraph typography | `Work Sans`, ~1rem, `var(--color-secondary)`, max-width ~48 characters per line |
| CTA style | Text link with underline-grow hover (per Interaction PRD §3.2) or outline button — recommend text-link style here specifically, to keep this section feeling personal/understated rather than another button-heavy conversion block |
| Vertical padding (section) | ~64–80px desktop, ~48px mobile |

---

## 7. Error Handling & Edge Cases

| Scenario | Required behavior |
|---|---|
| Photo asset fails to load (once a real photo is added) | Fallback to initials avatar rather than a broken image icon — implement via `onerror` handling or a CSS background-image fallback pattern, not left to fail silently |
| Bio paragraph edited to be longer in the future | Must not break the two-column layout's vertical balance — allow natural height growth, don't fix a max-height that would clip text |
| `IntersectionObserver`/JS failure | Section defaults to fully visible per Interaction PRD §6 |
| Years-in-practice figure still unconfirmed at build time | Per §3, do not insert a guessed number — use general phrasing until the real figure is available (cross-reference parent PRD §9.2 and Trust Strip PRD §7) |

---

## 8. Open Questions

1. **Bio paragraph final copy** — draft direction only (§3). Depends on the same unresolved years-in-practice figure flagged in Trust Strip PRD §7 — this is now the **second section** blocked by that missing data point, worth prioritizing getting it from N.S. Negi soon rather than letting it block multiple sections independently.
2. **Photo timeline** — confirm whether a professional photo is realistically obtainable before launch (per §5 recommendation, this should be treated as a priority asset, not deferred indefinitely).
3. **CTA wording** — "Learn More" vs. "Read Full Profile" vs. "Meet the Team" (if this CTA should also imply access to the team info housed on the About page, not just N.S. Negi's profile).

---

*End of component PRD.*
