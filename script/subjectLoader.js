import { currentLang } from './main.js';

let subjectDatabase = [];

export function loadSubjectCSV() {
  fetch("tantargyak.csv")
    .then(response => response.text())
    .then(csv => {
      const lines = csv.trim().split("\n");
      subjectDatabase = lines.slice(1).map(line => {
        const [name, credit, instructor, language, link] = line.split(",");
        return { name, credit: parseInt(credit), instructor, language, link };
      });
      subjectDatabase = subjectDatabase.filter((value, index, self) =>
        index === self.findIndex(v => v.name === value.name && v.credit === value.credit)
      );
    })
    .catch(err => console.error("Nem sikerült betölteni a tantárgylistát:", err));
}

export function setupAutocomplete() {
  const input = document.getElementById("subjectName");
  const creditInput = document.getElementById("subjectCredit");
  const list = document.createElement("ul");
  list.className = "autocomplete-list";
  input.parentNode.appendChild(list);

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    list.innerHTML = "";
    if (value.length < 2) return;

    const matches = subjectDatabase.filter(s => s.name.toLowerCase().includes(value));
    matches.slice(0, 10).forEach(match => {
      const item = document.createElement("li");
      item.textContent = match.name;
      item.addEventListener("click", () => {
        input.value = match.name;
        creditInput.value = match.credit;
        list.innerHTML = "";
      });
      list.appendChild(item);
    });
  });

  document.addEventListener("click", (e) => {
    if (!list.contains(e.target) && e.target !== input) {
      list.innerHTML = "";
    }
  });
}