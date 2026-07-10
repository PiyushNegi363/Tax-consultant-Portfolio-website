# Component PRD: Services Preview
## Negi Tax Consultant — Landing Page (`index.html`)

**Parent document:** PRD-negi-tax-consultant.md
**Component location:** `index.html` (section 4, below Trust Strip), styles in `home.css`
**Related documents:** PRD-trust-strip-section.md, PRD-interaction-animation.md, parent PRD §7.3 (full Services page spec)
**Scope:** Landing page only. This is a **preview/teaser** of the full Services page — it must not duplicate the full depth defined in parent PRD §7.3.

---

## 1. Purpose

Give visitors a fast, scannable sense of the breadth of services offered, enough for most people to recognize "yes, they do what I need," and route anyone who wants detail to the full Services page. This section should answer "what does this firm do?" in under 5 seconds of scanning — it is not the place for per-service descriptions, documents needed, or pricing (all of that belongs on the Services page per parent PRD §7.3).

---

## 2. Structure

```
<section class="services-preview">
 └── .services-preview-inner (max-width container)
      ├── .section-head
      │    ├── eyebrow (optional, e.g. "What We Do")
      │    ├── H2 ("Our Services")
      │    └── short one-line intro (optional)
      ├── .services-grid (4–6 cards, see §3.1 on count)
      │    ├── .service-card
      │    │    ├── icon (optional — see §8)
      │    │    ├── service name
      │    │    └── one-line description
      │    ├── .service-card
      │    └── ... (repeat)
      └── .services-cta
           └── "View All Services" → services.html
```

---

## 3. Content Specification

### 3.1 Which services to feature (subset decision required)
The full service list has **7 items** (parent PRD §9.1). A preview showing all 7 defeats the purpose of a "preview" — recommend featuring **4–6**, prioritized by what's most commonly searched/needed:

| Priority | Service | Rationale for inclusion |
|---|---|---|
| 1 | Income Tax Return Filing | Highest-volume, most broadly relevant service (individuals + businesses) |
| 2 | GST Registration | High search intent, common new-business need |
| 3 | GST Return Filing | Pairs naturally with GST Registration, recurring-revenue service |
| 4 | Accounts Book Keeping | Core recurring service, broad audience |
| 5 | Firm / Company Registration | Relevant to the startup/new-business segment |
| 6 | E-TDS Filing & Bank Loan Assistance | Lower search volume but differentiating — fewer local firms may offer loan assistance |

**Recommendation:** feature the top 6 above, omitting only "MSME/Udyam Registration" from the preview (still fully covered on the Services page) — keeps the grid visually clean at 6 items (matches well to a 3×2 or 2×3 grid) without omitting anything commonly searched. Final call flagged in §8.

### 3.2 Section header content

| Element | Content |
|---|---|
| Eyebrow (optional) | "What We Do" |
| H2 | "Our Services" — this is an `<h2>`, not `<h1>` (the page's single H1 lives in the Hero per PRD-hero-section.md §3) |
| Intro line (optional) | One factual sentence, e.g. "Accounting, tax and compliance support for individuals and small businesses in Haldwani." — avoid repeating the Hero's sub-headline verbatim |

### 3.3 Per-card content
Each card is deliberately minimal:

| Element | Content | Constraint |
|---|---|---|
| Service name | Exact name matching the full Services page (e.g. "Income Tax Return Filing") | Must match parent PRD §9.1 naming exactly — no shortened/rebranded versions that could confuse cross-page consistency |
| One-line description | Single short sentence — what it covers, in plain language | Hard cap ~60 characters to keep card heights uniform across the grid — this is a scan aid, not a pitch |

### 3.4 CTA
"View All Services" — links to `services.html`. Single CTA for the whole section (not per-card, see §4).

---

## 4. Behavior Specification

- **Cards are not individually clickable links to WhatsApp or a specific enquiry** — unlike the full Services page (parent PRD §7.3, where each service has its own "Enquire about this" WhatsApp deep link), this preview's only interactive element is the single "View All Services" CTA at the end of the section. Keeping the preview's action singular avoids competing CTAs pulling attention in six different directions before a visitor has even reached the real Services page
- Per `PRD-interaction-animation.md` §2: `.service-card` items are `.reveal` elements, staggered 80–100ms apart, animating in as the grid enters the viewport
- Per `PRD-interaction-animation.md` §3.3: cards receive the standard hover lift (`translateY(-4px)` + shadow increase) even though they are not individually clickable — this is intentional, signaling "there's more here" and drawing the eye toward the section's single CTA, not implying each card itself is a link target. **Note:** since cards are not clickable, ensure the hover treatment doesn't visually imply clickability that isn't there (e.g. avoid cursor: pointer on the card itself — only the "View All Services" CTA should show a pointer cursor)

---

## 5. Design Specification

Derived from the approved "Warm Practical" design system (parent PRD §4).

| Property | Value |
|---|---|
| Section background | `var(--color-bg)` (`#FBF9F4`) — consistent with surrounding sections, no band differentiation needed here (Trust Strip already provided visual separation above) |
| Grid | 3 columns desktop, 2 columns tablet, 1 column mobile; consistent gap (~24px) |
| Card background | `var(--color-surface)` (`#FFFFFF`) — cards should read as distinct surfaces against the cream page background |
| Card border | 1px solid `var(--color-border)`, replaced/enhanced by shadow on hover per Interaction PRD |
| Card padding | ~28px |
| Card border-radius | Matches global minimal radius (2–4px, parent PRD §4.4) — no heavily rounded corners |
| Service name typography | `Bitter`, weight 600, ~1.1rem, `var(--color-ink)` |
| Description typography | `Work Sans`, ~0.88rem, `var(--color-secondary)` |
| Section CTA style | Outlined button (matches Hero's secondary CTA style per PRD-hero-section.md §6), centered below the grid |
| Vertical padding (section) | ~72–88px desktop, ~48px mobile |

---

## 6. Error Handling & Edge Cases

| Scenario | Required behavior |
|---|---|
| Description text slightly exceeds the ~60-character guideline in future edits | Truncate gracefully with `text-overflow: ellipsis` on a fixed line-clamp (e.g. 2 lines max) rather than allowing cards to grow uneven heights and break grid alignment |
| Uneven number of cards on final row (e.g. 6 cards in a 3-column grid leaves no orphan, but a future edit to 5 would) | Grid should handle an odd final row gracefully (e.g. last item doesn't stretch to fill full row width oddly) — use `grid-template-columns: repeat(auto-fit, minmax(...))` or explicit column counts with tested edge cases at 4, 5, 6 items |
| `IntersectionObserver`/JS failure | Per Interaction PRD §6 — cards default to fully visible, never permanently hidden |
| Icon assets missing (if icons are added per open question in §8) | Card layout must not depend on an icon being present — reserve space gracefully or omit the icon slot entirely if the asset fails to load, rather than showing a broken image icon |

---

## 7. SEO Considerations

- Service names in this preview should exactly match the full Services page (§3.3) — consistent keyword usage across pages reinforces topical relevance rather than diluting it with inconsistent naming
- This section is a reasonable place to reinforce 2–3 core service keywords in natural prose (the optional intro line, §3.2) without keyword-stuffing individual card descriptions

---

## 8. Open Questions

1. **Confirm the 6 featured services** (§3.1) — recommendation excludes only MSME/Udyam Registration from the preview. Confirm this prioritization reflects real client demand, or adjust based on what N.S. Negi says he's actually asked about most.
2. **Icons per card?** Same open question as raised in Trust Strip PRD §8 — if icons are introduced there, likely worth introducing consistently here too rather than mixing icon/non-icon treatments across sections. Recommend deciding once, applying everywhere.
3. **Intro line — include or omit?** Marked optional in §3.2; adding it risks near-duplicating the Hero's sub-headline. Recommend omitting unless a genuinely distinct, non-repetitive line is written.

---

*End of component PRD.*
