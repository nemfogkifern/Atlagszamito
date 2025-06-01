export function setupExplanations() {
  const ids = ["resultWeightedAvg", "resultScholarshipAvg", "resultScholarshipIndex"];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const row = el.closest(".result-row");
        row.classList.toggle("open");
      });
    }
  });
}
