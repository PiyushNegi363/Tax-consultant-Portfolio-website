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
});
