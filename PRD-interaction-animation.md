# Component PRD: Interaction & Animation Spec
## Negi Tax Consultant — Site-Wide Motion Design

**Parent document:** PRD-negi-tax-consultant.md
**Applies to:** Header, Footer, and Landing Page sections (Hero, Trust Strip, Services Preview, Why Choose Us, About Preview, CTA Banner) — and should be treated as the default motion standard for About, Services, and Contact pages as they're built
**Related documents:** PRD-header-section.md, PRD-hero-section.md, PRD-footer-section.md

---

## 1. Purpose

Add restrained, purposeful motion to the site — scroll-triggered reveals and hover feedback — so the site feels considered and modern without undermining the "Warm Practical" tone (parent PRD §4.1). This is **not** a license for heavy, decorative animation; the practice this site represents is a CA firm, not a creative agency, so motion should read as *polish*, not *spectacle*.

**Guiding principle:** every animation must communicate something (state change, hierarchy, "new content has arrived") — not exist purely for visual flair.

---

## 2. Scroll Animation Spec

### 2.1 What animates on scroll
Section-level content **fades and shifts in slightly** as it enters the viewport, once, on first scroll into view. Applies to:
- Each landing page section as a whole (Hero excluded — see §2.4), or
- Individual cards/items within a section (e.g. each service card in the Services Preview, each stat in the Trust Strip) — **staggered**, so items within one section reveal in sequence rather than all at once

### 2.2 Motion parameters

| Property | Value |
|---|---|
| Initial state | `opacity: 0; transform: translateY(16px);` |
| Final state | `opacity: 1; transform: translateY(0);` |
| Duration | 500–600ms |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out, decelerating — feels settled, not bouncy) |
| Stagger delay (grouped items, e.g. cards) | 80–100ms between each item |
| Trigger | Element enters viewport at ~15–20% visibility (not full visibility — should start before the item is fully on-screen) |
| Repeat behavior | **Animate once only.** Do not re-trigger on scroll-up/scroll-down re-entry — a revealed section stays visible permanently once shown |

### 2.3 Technical implementation
- Use the **Intersection Observer API** (`IntersectionObserver`) — do not use scroll event listeners with manual position math (this is what causes the janky, unreliable scroll animations that lower-quality sites are known for)
- Elements to animate should be marked with a shared class (e.g. `.reveal`) and the observer adds a `.revealed` (or `.in-view`) class once triggered, which the CSS transition responds to
- Unobserve each element after it has animated once (`observer.unobserve(el)`) — no reason to keep watching elements that will never animate again

### 2.4 Hero exception
The Hero section (`PRD-hero-section.md` §4) is explicitly **excluded** from scroll-reveal — it's above the fold and visible on page load, so a scroll-triggered animation doesn't apply. If any load-in animation is wanted for the Hero specifically, it should be a simple one-time fade-in on page load (not scroll-triggered), and must be minimal — see §4 for the reduced-motion requirement, which applies here too.

---

## 3. Hover Animation Spec

Hover states apply only on devices that support hover (desktop/pointer devices) — see §3.4 for touch device handling.

### 3.1 Buttons & CTAs (Primary/Secondary, header WhatsApp CTA, hero CTAs, section CTAs)

| State | Behavior |
|---|---|
| Hover | Slight lift: `transform: translateY(-2px)`, plus background color shift already spec'd per-component (e.g. WhatsApp button darkens to `#1DA851` per Header PRD §5) |
| Transition | `transition: transform 150ms ease, background-color 200ms ease;` |
| Active/pressed | Return to `translateY(0)` or slightly below baseline (`translateY(1px)`) to simulate a physical press — combined with the existing box-shadow specs (e.g. header/hero CTA shadows), the shadow should compress slightly on press for a tactile "button" feel |

### 3.2 Navigation links (header nav, footer quick links)

| State | Behavior |
|---|---|
| Hover | Color transitions to `var(--color-accent)` (already spec'd in Header PRD §5 and Footer PRD §5) — add a short underline-grow effect: a bottom border/pseudo-element that animates from `width: 0` to `width: 100%` on hover, rather than an instant color swap alone |
| Transition | `transition: color 200ms ease;` for color, `transition: width 200ms ease;` for the underline |

### 3.3 Cards (service cards, trust strip stats, team member cards — wherever card-style components appear across pages)

| State | Behavior |
|---|---|
| Hover | Subtle lift + shadow increase: `transform: translateY(-4px)`, shadow deepens from a light resting shadow to a slightly more pronounced one |
| Transition | `transition: transform 200ms ease, box-shadow 200ms ease;` |
| Do not | Scale the card (`transform: scale()`) — scaling cards in a grid causes neighboring elements to visually compete/overlap awkwardly; lift-only is safer and reads as equally polished |

### 3.4 Touch device handling
- Hover-only effects (lift, underline-grow, shadow changes) should not be relied upon for any information the user *needs* — touch devices have no hover state, so all of the above must be treated as enhancement only, never a requirement to understand or use the site
- No additional touch-specific animation is required; standard `:active` states (brief opacity/scale dip on tap) are sufficient and often handled adequately by default browser/OS behavior

---

## 4. Reduced Motion Requirement (Mandatory)

This is not optional polish — it's an accessibility requirement already flagged in the parent PRD (§5.4) and must be honored here specifically:

```css
@media (prefers-reduced-motion: reduce) {
  /* All scroll-reveal and hover transform/transition animations
     must be disabled or reduced to near-instant */
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

Content must be **fully visible and usable** with this preference enabled — scroll-reveal must not leave content permanently hidden/opacity-0 for users with this setting on. This is the most common real-world failure mode for scroll-animation implementations and must be explicitly tested, not assumed to work.

---

## 5. Performance Requirements

- Only animate `transform` and `opacity` properties — these are GPU-accelerated and won't trigger layout recalculation. **Do not** animate `width`, `height`, `top`, `left`, `margin`, or similar layout-affecting properties for hover/scroll effects (the nav-link underline in §3.2 is the one exception, using `width` on a small pseudo-element only — acceptable since it's a thin, isolated element rather than a layout-critical one)
- Intersection Observer thresholds and root margins should be tuned so animations do not visibly "chase" fast scrolling (i.e. avoid a jarring pop-in when a user scrolls quickly past a section) — test at both slow and fast scroll speeds
- No animation library dependency required — all of the above is achievable with native CSS transitions + the Intersection Observer API, consistent with the "no framework" tech stack decision (parent PRD §2)

---

## 6. Error Handling & Edge Cases

| Scenario | Required behavior |
|---|---|
| `IntersectionObserver` unsupported (very old browsers) | Feature-detect before use (`if ('IntersectionObserver' in window)`); if unsupported, elements marked `.reveal` should default to fully visible (`opacity: 1`) rather than permanently hidden — never let a missing API result in invisible content |
| JS fails to load/execute entirely | Same principle as above — `.reveal` elements must not rely on JS as the only path to visibility. Base CSS state for `.reveal` (pre-animation) should ideally be set via a JS-added class on `<html>` (e.g. `.js-enabled`) so that without JS, elements simply render at full opacity by default rather than requiring JS to reveal them |
| User scrolls extremely fast past multiple sections | Staggered animations should not queue up and play out awkwardly after the user has already scrolled past — acceptable to let sections that are scrolled past quickly simply snap to visible rather than forcing the full animation timeline |
| Animation on a very long page (Services page with 7 service blocks) | Stagger delay (§2.2) should reset per section, not accumulate an increasingly long delay across the entire page — each section's items stagger relative to that section's own entry, not a global counter |

---

## 7. Explicitly Out of Scope

- No parallax scrolling effects
- No scroll-hijacking / scroll-jacking (e.g. forcing snap-to-section scroll behavior)
- No looping/continuous animations (e.g. pulsing buttons, auto-rotating carousels) — these read as "salesy" and work against the ICAI-safe, understated tone
- No page-transition animations between the four separate HTML pages (each is a standard full page load/navigation, not a single-page app — no shared animation state needed between them)

---

## 8. Open Questions

1. Should the **Hero** section have any load-in animation at all (per §2.4), or should it render fully static/immediate on page load with zero motion, reserving all animation for scroll-revealed content below the fold?
2. Confirm whether the underline-grow hover treatment (§3.2) should also apply to the **active** nav link state (Header PRD §4.2), or whether active-state styling should remain static/different from the hover treatment to avoid visual confusion between "this is hovered" and "this is the current page."

---

*End of component PRD.*
