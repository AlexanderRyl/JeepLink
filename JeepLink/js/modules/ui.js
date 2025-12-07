export function initMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav-links");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");

      // Swap Icon between List and X (Close)
      const icon = toggle.querySelector("i");
      if (nav.classList.contains("open")) {
        icon.classList.replace("ph-list", "ph-x");
      } else {
        icon.classList.replace("ph-x", "ph-list");
      }
    });
  }
}
