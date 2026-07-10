# Component PRD: Why Choose Us
## Negi Tax Consultant — Landing Page (`index.html`)

**Parent document:** PRD-negi-tax-consultant.md
**Component location:** `index.html` (section 5, below Services Preview), styles in `home.css`
**Related documents:** PRD-services-preview-section.md, PRD-interaction-animation.md
**Scope:** Landing page only.

---

## 1. Purpose

This section builds emotional/practical confidence after the Services Preview has established *what* the firm does. Where the Trust Strip made a factual/numeric case and the Services Preview made a breadth-of-capability case, "Why Choose Us" makes a **working-relationship** case — answering the visitor's unspoken question of "what will it actually be like to work with this firm?"

This is the section most at risk of drifting into promotional/comparative language, given ICAI restrictions (parent PRD §1.2, §7.0) — see §3.2 for the tone guardrail this section must follow more strictly than any other.

---

## 2. Structure

```
<section class="why-choose-us">
 └── .why-inner (max-width container)
      ├── .section-head
      │    ├── eyebrow (optional, e.g. "How We Work")
      │    └── H2 ("Why Clients Work With Us" or similar — see §8)
      └── .why-grid (3 items)
           ├── .why-item
           │    ├── icon or number marker (see §8)
           │    ├── short title (2-4 words)
           │    └── one-sentence explanation
           ├── .why-item
           └── .why-item
```

---

## 3. Content Specification

### 3.1 The three points
Per parent PRD §7.1 (item 5) and §7.2 (item 5, "What we stand for" — a near-duplicate concept on the About page, see §7 below for how these relate), the three points should be **factual practice characteristics**, not comparative claims:

| # | Title | Explanation (draft direction) |
|---|---|---|
| 1 | Direct Access | You deal directly with the CA and team — not a call center or a rotating point of contact. |
| 2 | On-Time Filing | Returns and compliance deadlines are tracked and filed on schedule. |
| 3 | Local & Reachable | Based in Haldwani, reachable by phone or WhatsApp during office hours — not a distant, faceless service. |

These are draft directions, not final copy — see §8 for sign-off requirement.

### 3.2 Tone guardrail (stricter than other sections)
This section is structurally the closest thing on the site to a "sales pitch" section, which makes it the highest-risk section for accidentally crossing into ICAI-restricted territory. Explicit rules:

- **No comparative language** — never "unlike other firms," "better than," "the only CA who...," even implicitly
- **No superlatives** — no "best," "fastest," "most trusted," "top-rated"
- **No implied competitor comparison** — even indirect phrasing like "no long waits" implies a comparison to firms that *do* have long waits; rephrase as a direct factual statement about this practice only (e.g. "Filings tracked against deadlines" rather than "Never miss a deadline like other firms might")
- Every point must be phrased as a **statement of fact about this practice**, not a claim of relative superiority

**Recommendation:** this section's final copy should go through the same review flagged for the Footer's ICAI disclaimer (PRD-footer-section.md §3.1) — treat as compliance-sensitive, not just a copywriting pass.

### 3.3 Section header
| Element | Content |
|---|---|
| Eyebrow (optional) | "How We Work" |
| H2 | Working title: "Why Clients Work With Us" — flagged in §8, as even this phrase borders on implying differentiation; alternative neutral framing: "How We Work With You" |

---

## 4. Behavior Specification

- Fully static — no links, no CTA within this section (the section's job is persuasion/reassurance, not conversion; the next section, About Preview, and the CTA Banner after it handle routing onward)
- Per `PRD-interaction-animation.md` §2: the 3 `.why-item` blocks are `.reveal` elements, staggered 80–100ms
- No hover interactivity — these are not cards linking anywhere, so per the same logic applied in Services Preview PRD §4, no `cursor: pointer` or hover-lift should be applied here, since it would incorrectly imply clickability. **Difference from Services Preview:** Services Preview cards get hover-lift as a "there's more, go explore" signal toward a real CTA; this section has no equivalent CTA per item, so that treatment does not apply here — keep these static on hover, or apply, at most, a very subtle non-directional treatment (e.g. slight background tint) if visual feedback is wanted without implying a link

---

## 5. Design Specification

Derived from the approved "Warm Practical" design system (parent PRD §4).

| Property | Value |
|---|---|
| Section background | `var(--color-bg)`, or a very subtle alternate tint if visual separation from Services Preview above is needed — **recommend keeping identical to surrounding sections** and relying on spacing/headers alone for separation, avoiding an overly "striped" page as more sections are added |
| Layout | 3-column grid desktop, stacks to 1 column mobile (no intermediate 2-column state needed for only 3 items — unlike 4/6-item grids elsewhere) |
| Item marker | Numbered marker (`01`, `02`, `03`) in `var(--color-accent)`, `Bitter` weight 600 — reinforces the ledger/document motif already used in Services Preview and Trust Strip, rather than introducing generic icon iconography |
| Item title typography | `Bitter`, weight 600, ~1.05rem, `var(--color-ink)` |
| Item explanation typography | `Work Sans`, ~0.9rem, `var(--color-secondary)`, max-width constrained per item (~32 characters per line) for readability |
| Vertical padding (section) | ~64–80px desktop, ~44px mobile |
| Item spacing | Generous gap (~32–40px) between the 3 items — this section should feel unhurried/confident, not dense, reinforcing the "personal, unhurried service" message the content itself is making |

---

## 6. Error Handling & Edge Cases

| Scenario | Required behavior |
|---|---|
| Explanation text runs longer than expected in future edits | Must wrap gracefully without breaking the 3-column grid's vertical alignment across items |
| `IntersectionObserver`/JS failure | Per Interaction PRD §6 — items default to fully visible |
| Only 2 or 4 points decided on later instead of 3 | Grid should not be hard-coded to assume exactly 3 items only — build with a flexible grid (`auto-fit`/`minmax`) so a future content change doesn't require a CSS rewrite |

---

## 7. Relationship to the About Page's "What We Stand For"

Parent PRD §7.2 (About page, item 5) defines a very similarly-scoped section: **"What we stand for" — 3-4 factual principles.** These two sections risk becoming redundant if built independently with overlapping content.

**Recommendation:** treat this landing-page section as the **short, 3-point teaser version**, and the About page's "What We Stand For" as the fuller version (potentially 4 points, or the same 3 points with a longer explanation each). Do not let both sections be written independently without cross-referencing — whoever writes final copy for either should have both specs open at once to avoid word-for-word duplication, which would read as lazy/repetitive to a visitor who reads both pages.

---

## 8. Open Questions

1. **Final copy sign-off** — per §3.2, this section's language is compliance-sensitive. The 3 draft points in §3.1 need explicit review/approval (ideally by N.S. Negi directly, not just approved by you on his behalf) before being treated as final.
2. **H2 wording** — "Why Clients Work With Us" vs. more neutral alternatives (e.g. "How We Work With You," "Our Approach"). Worth deciding alongside the copy review in Q1, since the heading itself carries some of the same tone risk as the body content.
3. **Exactly 3 points, or could a 4th be added later** to mirror the About page's "3-4 principles" range (parent PRD §7.2)? Recommend keeping this landing-page version at exactly 3 for scannability, reserving a 4th (if one exists) for the fuller About page treatment only.

---

*End of component PRD.*
