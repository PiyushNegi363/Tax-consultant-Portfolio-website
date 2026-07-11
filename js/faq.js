/**
 * faq.js — FAQ accordion for contact.html
 * PRD: PRD-faq-section.md
 *
 * Pattern: independently expandable (multiple items can be open simultaneously)
 * Animation: CSS grid-template-rows 0fr→1fr (handled by CSS, not JS)
 * No-JS fallback: CSS defaults .faq-answer to visible; this script collapses on load
 * prefers-reduced-motion: handled entirely in CSS (transition: none)
 *
 * Note: document.documentElement.classList.add('js-enabled') is already handled
 * by scroll-reveal.js. This script relies on that class being present to trigger
 * the collapsed CSS state, but sets it itself as a safety fallback.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Safety: ensure js-enabled class is present (scroll-reveal.js also sets this,
  // but faq.js may load on pages without scroll-reveal.js in future)
  document.documentElement.classList.add("js-enabled");

  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("faq-item--open");

      if (isOpen) {
        // Collapse this item
        item.classList.remove("faq-item--open");
        btn.setAttribute("aria-expanded", "false");
        answer.setAttribute("aria-hidden", "true");
      } else {
        // Expand this item (independently — other items are unaffected)
        item.classList.add("faq-item--open");
        btn.setAttribute("aria-expanded", "true");
        answer.setAttribute("aria-hidden", "false");
      }
    });
  });
});
