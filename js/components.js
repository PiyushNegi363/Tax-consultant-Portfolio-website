document.addEventListener("DOMContentLoaded", () => {
  // Inject Header
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch("partials/header.html")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load header partial: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
        // Dispatch event so nav.js knows header is ready in the DOM
        document.dispatchEvent(new CustomEvent("header-loaded"));
      })
      .catch(error => {
        console.error("Header injection failed, fallback navigation kept.", error);
      });
  }

  // Inject Footer
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("partials/footer.html")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load footer partial: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        footerPlaceholder.innerHTML = html;
        // Update dynamic copyright year
        const yearSpan = document.getElementById("dynamic-year");
        if (yearSpan) {
          yearSpan.textContent = new Date().getFullYear();
        }
        // Dispatch event so scroll-reveal knows footer is ready in DOM
        document.dispatchEvent(new CustomEvent("footer-loaded"));
      })
      .catch(error => {
        console.error("Footer injection failed, fallback footer kept.", error);
      });
  }
});
