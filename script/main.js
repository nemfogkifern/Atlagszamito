import { loadFromCookies, saveToCookies } from './storage.js';
import { updateTable } from './table.js';
import { updateResults } from './results.js';
import { loadSubjectCSV, setupAutocomplete } from './subjectLoader.js';
import { setupExplanations } from './explanation.js';
import { setupThemeToggle } from './theme.js';
setupThemeToggle();



export let subjects = [];
export let currentLang = "hu";

export function setLanguage(lang) {
  currentLang = lang;

  document.getElementById("title").textContent = lang === "hu" ? "Corvinus Átlagkalkulátor" : "Corvinus GPA Calculator";
  document.getElementById("subjectName").placeholder = lang === "hu" ? "Tantárgy neve" : "Subject Name";
  document.getElementById("subjectCredit").placeholder = lang === "hu" ? "Kredit" : "Credit";
  document.getElementById("subjectGrade").placeholder = lang === "hu" ? "Jegy (1-5)" : "Grade (1-5)";
  document.getElementById("mandatoryLabel").textContent = lang === "hu" ? "Kötelező" : "Mandatory";
  document.getElementById("addBtn").textContent = lang === "hu" ? "Hozzáadás" : "Add";

  document.getElementById("thSubject").textContent = lang === "hu" ? "Tantárgy" : "Subject";
  document.getElementById("thCredit").textContent = lang === "hu" ? "Kredit" : "Credit";
  document.getElementById("thGrade").textContent = lang === "hu" ? "Jegy" : "Grade";
  document.getElementById("thMandatory").textContent = lang === "hu" ? "K" : "M";
  document.getElementById("thDelete").textContent = lang === "hu" ? "" : "";

  document.querySelectorAll(".explanation").forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  updateTable(false);
  updateResults();
}

document.addEventListener("DOMContentLoaded", () => {
  loadFromCookies();
  loadSubjectCSV();
  setupAutocomplete();
  setLanguage(currentLang);
  updateTable(false);
  updateResults();
  setupExplanations();

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const form = document.getElementById("subjectForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("subjectName").value.trim();
    const credit = Number(document.getElementById("subjectCredit").value);
    const grade = Number(document.getElementById("subjectGrade").value);
    const mandatory = document.getElementById("mandatory").checked;

    if (!name || credit < 1 || credit > 30 || grade < 1 || grade > 5) {
      alert(currentLang === "hu" ? "Kérlek töltsd ki helyesen az adatokat!" : "Please fill in the data correctly!");
      return;
    }

    subjects.push({ name, credit, grade, mandatory });
    saveToCookies();
    updateTable(true);
    updateResults();

    form.reset();
    document.getElementById("subjectName").focus();
  });
});