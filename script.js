const form = document.getElementById("subject-form");
const subjectsList = document.getElementById("subjects-list");
const results = document.getElementById("results");

let subjects = [];
let currentLanguage = "hu";

const translations = {
  hu: {
    title: "Corvinus Átlag Kalkulátor",
    subjectName: "Tantárgy neve",
    credit: "Kredit",
    grade: "Jegy (1-5)",
    mandatory: "Kötelező",
    add: "Hozzáadás",
    subjects: "Tantárgyak",
    weightedAverage: "Súlyozott átlag",
    creditIndex: "Kreditindex",
    delete: "Törlés",
    noSubjects: "Nincs még felvett tárgy."
  },
  en: {
    title: "Corvinus Grade Calculator",
    subjectName: "Subject name",
    credit: "Credits",
    grade: "Grade (1-5)",
    mandatory: "Mandatory",
    add: "Add",
    subjects: "Subjects",
    weightedAverage: "Weighted average",
    creditIndex: "Credit index",
    delete: "Delete",
    noSubjects: "No subjects added yet."
  }
};

function setLanguage(lang) {
  currentLanguage = lang;
  const dict = translations[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.placeholder = dict[key];
  });

  renderSubjects();
  calculateResults();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const credit = parseFloat(document.getElementById("credit").value);
  const grade = parseFloat(document.getElementById("grade").value);
  const mandatory = document.getElementById("mandatory").checked;

  subjects.push({ name, credit, grade, mandatory });
  form.reset();
  renderSubjects();
  calculateResults();
});

function renderSubjects() {
  if (subjects.length === 0) {
    subjectsList.innerHTML = `<p>${translations[currentLanguage].noSubjects}</p>`;
    return;
  }

  subjectsList.innerHTML =
    "<ul>" +
    subjects
      .map(
        (s, index) => `
    <li>
      ${s.name} – ${s.credit} ${translations[currentLanguage].credit}, ${translations[currentLanguage].grade.toLowerCase()}: ${s.grade} ${s.mandatory ? `(${translations[currentLanguage].mandatory})` : ""}
      <button onclick="removeSubject(${index})">${translations[currentLanguage].delete}</button>
    </li>
  `
      )
      .join("") +
    "</ul>";
}

function removeSubject(index) {
  subjects.splice(index, 1);
  renderSubjects();
  calculateResults();
}

function calculateResults() {
  if (subjects.length === 0) {
    results.innerHTML = "";
    return;
  }

  const totalCredits = subjects.reduce((sum, s) => sum + s.credit, 0);
  const weightedSum = subjects.reduce((sum, s) => sum + s.credit * s.grade, 0);
  const average = (weightedSum / totalCredits).toFixed(2);
  const index = weightedSum;

  results.innerHTML = `
    ${translations[currentLanguage].weightedAverage}: ${average}<br>
    ${translations[currentLanguage].creditIndex}: ${index}
  `;
}

// Induláskor magyar nyelv
setLanguage("hu");
