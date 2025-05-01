import './styles/style.scss';

let isInitialized = false;

export function setupMenuToggle() {
  if (isInitialized) return;
  isInitialized = true;

  const menuBtn = document.querySelector(".menu-toggle") as HTMLButtonElement | null;
  const nav = document.querySelector("header nav") as HTMLElement | null;

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    setupMenuToggle();
  });
}