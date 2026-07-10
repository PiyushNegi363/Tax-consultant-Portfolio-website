# Component PRD: Footer
## Negi Tax Consultant — Shared Footer (all pages)

**Parent document:** PRD-negi-tax-consultant.md
**Component file(s):** `/partials/footer.html`, styles in `style.css`, injection via `components.js`
**Scope:** Shared across all four pages (Home, About, Services, Contact) via runtime injection — build once, applies everywhere. Same injection pattern as the header (see PRD-header-section.md §4.4).

---

## 1. Purpose

The footer is the site's information backstop — the place a visitor checks when they've scrolled to the bottom looking for something the page above didn't surface: contact details, quick navigation, and (for this business specifically) the mandatory ICAI compliance disclaimer. It also carries SEO-relevant structured contact information (see §6).

---

## 2. Structure

```
<footer>
 └── .footer-inner (max-width container)
      ├── .footer-brand
      │    ├── firm name
      │    └── short tagline/description (1 line)
      ├── .footer-contact
      │    ├── address (semantic <address>)
      │    ├── phone (click-to-call)
      │    └── email (click-to-mail)
      ├── .footer-links
      │    └── quick nav: Home, About, Services, Contact
      ├── .footer-social (optional — see §8)
      ├── .footer-disclaimer
      │    └── ICAI compliance notice (mandatory, full text)
      └── .footer-bottom
           └── copyright line with dynamic year
```

On mobile: columns stack vertically in the order listed above.

---

## 3. Content Specification

| Element | Content | Notes |
|---|---|---|
| Firm name | "Negi Tax Consultant" | Styled prominently, matches header brand treatment |
| Tagline | Short one-liner, e.g. "Chartered Accountancy services in Haldwani, Uttarakhand" | Reinforces location for SEO, consistent with header tagline |
| Address | "Near Block Office, Haldwani (Nainital), Uttarakhand" | Must be wrapped in a semantic `<address>` tag, not a generic `<p>` or `<div>` |
| Phone | "+91 96908 22761" | N.S. Negi's primary number; wrapped in `<a href="tel:+919690822761">` |
| Email | "nsnegi.hld@gmail.com" | Wrapped in `<a href="mailto:nsnegi.hld@gmail.com">` |
| Quick links | Home, About, Services, Contact | Same destinations as header nav; label text can match header exactly for consistency |
| ICAI disclaimer | Mandatory compliance text — see §3.1 | Must appear on every page, cannot be omitted or shortened below the required substance |
| Copyright line | "© [dynamic year] Negi Tax Consultant. All rights reserved." | Year populated via JS (`new Date().getFullYear()`), not hardcoded |

### 3.1 ICAI Disclaimer — Required Substance
Per ICAI advertising guidelines (parent PRD §1.2), the footer disclaimer must communicate, at minimum:
- The website is for **informational purposes only**
- It is **not intended to solicit clients** or advertise achievements
- Content complies with ICAI guidelines for chartered accountants

Exact wording can be refined, but none of the three points above should be dropped. This text block should be treated as **legally/professionally sensitive** — flag any wording changes for N.S. Negi's review before publishing, not just a copywriting decision.

---

## 4. Behavior Specification

- Footer injection follows the same technical pattern as the header: `components.js` fetches `/partials/footer.html` and injects it into a placeholder element (e.g. `<div id="footer-placeholder"></div>`) present on every page
- No interactive/collapsible behavior required — footer is static content, no JS-dependent functionality beyond the dynamic copyright year and the injection itself
- `tel:` and `mailto:` links require no custom JS — standard anchor behavior, OS-handled
- Quick nav links do **not** need active-page highlighting (unlike the header nav) — this is a secondary/backup navigation, not the primary wayfinding mechanism

---

## 5. Design Specification

Derived from the approved "Warm Practical" design system (parent PRD §4).

| Property | Value |
|---|---|
| Background | `var(--color-ink)` (`#2C3639`) — dark footer, deliberately contrasts with the cream page body to clearly mark "end of page" |
| Text color (primary) | `var(--color-bg)` (`#FBF9F4`) or a slightly muted off-white for body text |
| Text color (secondary/links) | Muted warm grey (e.g. `#B9C0B4`-range, derived from `--color-secondary` lightened for dark background) for lower-emphasis text like the disclaimer |
| Link hover color | `var(--color-accent)` (`#B85C38`) — consistent with the site's accent usage elsewhere |
| Firm name typography | `Bitter`, weight 600, ~1.2rem |
| Body/link typography | `Work Sans`, ~0.85–0.9rem |
| Disclaimer typography | `Work Sans`, ~0.72rem, muted color, line-height ~1.6 for legibility despite small size |
| Padding | ~48px top, ~28px bottom (desktop); ~36px/20px (mobile) |
| Divider | 1px border (low-opacity light color) separating main footer content from the disclaimer/copyright block |
| Layout | Multi-column flex/grid on desktop (brand+contact | links | disclaimer spans full width below), single stacked column on mobile |

---

## 6. SEO & Structured Data Considerations

- `<address>` tag usage (see §3) is a semantic SEO signal or local business info — required, not optional styling choice
- The footer is a reasonable place to include the `LocalBusiness`/`AccountingService` JSON-LD structured data block referenced in parent PRD §6.6, since it naturally co-locates with the name/address/phone content already present here. **Recommendation:** place the `<script type="application/ld+json">` block adjacent to the footer partial so NAP (Name, Address, Phone) data and structured data stay in sync if edited later
- Ensure NAP (Name, Address, Phone) format is **identical** across the footer, the Contact page, and any future Google Business Profile listing — inconsistent formatting across sources weakens local SEO signal

---

## 7. Error Handling & Edge Cases

| Scenario | Required behavior |
|---|---|
| `fetch('/partials/footer.html')` fails | Same principle as header (PRD-header-section.md §6): page must not lose all footer information silently. Minimum fallback: hardcoded phone/email/address directly in a placeholder default, so contact info is never fully unreachable even if injection fails |
| JS disabled | Same as above — footer contact info must not depend entirely on JS to exist; fallback content in the placeholder element is required |
| Dynamic year script fails/JS error | Copyright line should have a hardcoded fallback year in the static HTML (updated manually if ever stale) rather than rendering blank if the script errors |
| Long address/email text on narrow screens | Must wrap gracefully, no horizontal overflow or clipped text |
| Disclaimer text length changes (future legal review edits) | Layout must accommodate longer disclaimer text without breaking column alignment — treat as variable-length content, not fixed |

---

## 8. Accessibility Requirements

- `<footer>` uses the semantic tag, not a generic `<div>`
- `<address>` tag used correctly for the physical address block
- All `tel:`/`mailto:` links and quick nav links keyboard-reachable with visible focus states
- Sufficient color contrast for text against the dark `var(--color-ink)` background — must meet WCAG AA (4.5:1 for body text, including the small-print disclaimer text, which is at higher risk of failing contrast checks due to its reduced size and often-lighter color choice)
- Disclaimer text, despite being small/secondary in visual hierarchy, must remain in the normal document flow and readable by screen readers — not hidden or truncated

---

## 9. Open Questions

1. **Social links (`.footer-social`)** — no social media presence has been mentioned anywhere in prior discussion. Confirm whether this sub-section should be included (empty/hidden for now) or omitted from the structure entirely until/unless the firm has social profiles to link.
2. **Exact ICAI disclaimer wording** — §3.1 defines required substance, not final copy. Recommend this specific text block be reviewed by N.S. Negi (or checked against current ICAI guidelines directly) before treating it as final, given the compliance sensitivity.
3. **JSON-LD placement** — confirm footer is the right place to co-locate structured data (§6), or whether it should instead live once in a shared `<head>`-level include rather than tied to the footer partial specifically.

---

*End of component PRD.*
