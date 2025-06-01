export function setupThemeToggle() {
  const btn = document.createElement("button");
  btn.id = "themeToggle";
  btn.setAttribute("aria-label", "Toggle theme");
  btn.title = "Téma váltása (Sötét/Világos)";
  btn.style.position = "absolute";
  btn.style.top = "25px";
  btn.style.right = "10px";
  // btn.style.padding = "1px";
  btn.style.background = "transparent";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.style.zIndex = "1000";
  // btn.style.color = "white";

  const sunSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" fill="currentColor">
      <path d="M12 18.3q-2.625 0-4.463-1.837Q5.7 14.625 5.7 12q0-2.625 1.837-4.462Q9.375 5.7 12 5.7q2.625 0 4.463 1.838Q18.3 9.375 18.3 12q0 2.625-1.837 4.463Q14.625 18.3 12 18.3Zm0-1.65q2 0 3.325-1.325Q16.65 14 16.65 12q0-2-1.325-3.325Q14 7.35 12 7.35q-2 0-3.325 1.325Q7.35 10 7.35 12q0 2 1.325 3.325Q10 16.65 12 16.65Zm0-4.65Z"/>
    </svg>
  `;

  const moonSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" fill="currentColor">
      <path d="M15.85 22q-3.25 0-5.637-2.388Q7.825 17.225 7.825 14q0-1.8.838-3.375Q9.5 9.05 11 8.1q.125-.075.213-.063.087.013.162.063.225.125.188.375-.075.625-.113 1.2-.037.575-.037 1.125 0 3.025 2.112 5.137Q15.625 18.15 18.65 18.15q.55 0 1.125-.037.575-.038 1.2-.113.25-.037.387.188.138.225.038.45-1.05 2.025-3.05 3.063Q17.35 22 15.85 22Z"/>
    </svg>
  `;

  const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";

  function updateIcon() {
    btn.innerHTML = isDark() ? sunSVG : moonSVG;
  }

  btn.addEventListener("click", () => {
    if (isDark()) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    updateIcon();
  });

  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  updateIcon();
  document.body.appendChild(btn);
}