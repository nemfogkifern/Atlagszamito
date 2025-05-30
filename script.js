
const translations = {
  hu: {
    title: "Corvinus Átlagkalkulátor",
    subjectName: "Tantárgy neve",
    subjectCredit: "Kredit",
    subjectGrade: "Jegy (1-5)",
    mandatory: "Kötelező",
    addBtn: "Hozzáadás",
    thSubject: "Tantárgy",
    thCredit: "Kredit",
    thGrade: "Jegy",
    thMandatory: "K",
    thDelete: "",
    resultScholarshipAvg: "Ösztöndíjátlag: ",
    resultWeightedAvg: "Kreditekkel súlyozott tanulmányi átlag: ",
    resultScholarshipIndex: "Ösztöndíjindex: ",
  },
  en: {
    title: "Corvinus GPA Calculator",
    subjectName: "Subject Name",
    subjectCredit: "Credit",
    subjectGrade: "Grade (1-5)",
    mandatory: "Mandatory",
    addBtn: "Add",
    thSubject: "Subject",
    thCredit: "Credit",
    thGrade: "Grade",
    thMandatory: "M",
    thDelete: "",
    resultScholarshipAvg: "Scholarship Average: ",
    resultWeightedAvg: "Weighted Study Average: ",
    resultScholarshipIndex: "Scholarship Index: ",
  },
};

let currentLang = "hu";

const form = document.getElementById("subjectForm");
const tbody = document.querySelector("#subjectsTable tbody");
const langButtons = document.querySelectorAll(".lang-btn");

const inputSubject = document.getElementById("subjectName");
const inputCredit = document.getElementById("subjectCredit");
const inputGrade = document.getElementById("subjectGrade");
const inputMandatory = document.getElementById("mandatory");
const addBtn = document.getElementById("addBtn");

const resultScholarshipAvg = document.getElementById("resultScholarshipAvg");
const resultWeightedAvg = document.getElementById("resultWeightedAvg");
const resultScholarshipIndex = document.getElementById("resultScholarshipIndex");

let subjects = [];

function setLanguage(lang) {
  currentLang = lang;

  document.getElementById("title").textContent = translations[lang].title;
  inputSubject.placeholder = translations[lang].subjectName;
  inputCredit.placeholder = translations[lang].subjectCredit;
  inputGrade.placeholder = translations[lang].subjectGrade;
  document.getElementById("mandatoryLabel").textContent = translations[lang].mandatory;
  addBtn.textContent = translations[lang].addBtn;

  document.getElementById("thSubject").textContent = translations[lang].thSubject;
  document.getElementById("thCredit").textContent = translations[lang].thCredit;
  document.getElementById("thGrade").textContent = translations[lang].thGrade;
  document.getElementById("thMandatory").textContent = translations[lang].thMandatory;
  document.getElementById("thDelete").textContent = translations[lang].thDelete;

  updateTable();
  updateResults();
  updateLangButtons();
}

function updateLangButtons() {
  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

function updateTable() {
  tbody.innerHTML = "";

  subjects.forEach((subj, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${subj.name}</td>
      <td>${subj.credit}</td>
      <td>
      <span class="grade-text">${subj.grade}</span>
      <select class="grade-select" data-index="${index}" style="display:none;">
          ${[1, 2, 3, 4, 5].map(i => `<option value="${i}" ${i === subj.grade ? "selected" : ""}>${i}</option>`).join("")}
      </select>
      </td>

      <td>${subj.mandatory ? (currentLang === "hu" ? "Igen" : "Yes") : (currentLang === "hu" ? "Nem" : "No")}</td>
      <td><button aria-label="${currentLang === "hu" ? "Törlés" : "Delete"}" data-index="${index}">×</button></td>
    `;

    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button").forEach((btn) =>
    btn.addEventListener("click", () => {
      subjects.splice(btn.dataset.index, 1);
      saveToCookies();
      updateTable();
      updateResults();
    })
  );
  tbody.querySelectorAll(".grade-text").forEach(span => {
  span.addEventListener("click", () => {
    const td = span.parentElement;
    const select = td.querySelector(".grade-select");
    span.style.display = "none";
    select.style.display = "inline";
  });
});

tbody.querySelectorAll(".grade-select").forEach(select => {
  select.addEventListener("change", () => {
    const index = parseInt(select.dataset.index);
    const newGrade = parseInt(select.value);
    subjects[index].grade = newGrade;
    saveToCookies();
    updateTable();
    updateResults();
  });

  select.addEventListener("blur", () => {
    updateTable(); // Elrejtjük a selectet, visszavált spanra
  });
});

}

function updateResults() {
  if (subjects.length === 0) {
    resultScholarshipAvg.textContent = translations[currentLang].resultScholarshipAvg + "-";
    resultWeightedAvg.textContent = translations[currentLang].resultWeightedAvg + "-";
    resultScholarshipIndex.textContent = translations[currentLang].resultScholarshipIndex + "-";
    return;
  }

  let sumScholarshipNumerator = 0;
  let sumScholarshipDenominator = 0;

  let sumWeightedNumerator = 0;
  let sumWeightedDenominator = 0;

  let totalPassedCredits = 0;

  subjects.forEach(({ credit, grade, mandatory }) => {
    const weight = 1;
    sumScholarshipNumerator += credit * grade * weight;
    sumScholarshipDenominator += credit * weight;

    if (grade > 1) {
      sumWeightedNumerator += credit * grade * weight;
      sumWeightedDenominator += credit * weight;
      totalPassedCredits += credit;
    }
  });

  const scholarshipAvg = sumScholarshipDenominator > 0 ? sumScholarshipNumerator / sumScholarshipDenominator : 0;
  const weightedAvg = sumWeightedDenominator > 0 ? sumWeightedNumerator / sumWeightedDenominator : 0;
  const scholarshipIndex = scholarshipAvg + (((totalPassedCredits / 27) - 1) / 2);

  resultScholarshipAvg.textContent =
    translations[currentLang].resultScholarshipAvg + scholarshipAvg.toFixed(2);
  resultWeightedAvg.textContent =
    translations[currentLang].resultWeightedAvg + weightedAvg.toFixed(2);
  resultScholarshipIndex.textContent =
    translations[currentLang].resultScholarshipIndex + scholarshipIndex.toFixed(2);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = inputSubject.value.trim();
  const credit = Number(inputCredit.value);
  const grade = Number(inputGrade.value);
  const mandatory = inputMandatory.checked;

  if (!name || credit < 1 || credit > 30 || grade < 1 || grade > 5) {
    alert(currentLang === "hu" ? "Kérlek töltsd ki helyesen az adatokat!" : "Please fill the data correctly!");
    return;
  }

  subjects.push({ name, credit, grade, mandatory });

  saveToCookies();
  updateTable();
  updateResults();

  form.reset();
  inputSubject.focus();
  if (mandatory) {
    inputMandatory.checked = true;
  }
});

function saveToCookies() {
  const json = JSON.stringify(subjects);
  document.cookie = `subjects=${encodeURIComponent(json)};path=/;max-age=${60*60*24*365}`;
}

function loadFromCookies() {
  const cookies = document.cookie.split(";").map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith("subjects=")) {
      const json = decodeURIComponent(cookie.split("=")[1]);
      try {
        subjects = JSON.parse(json);
      } catch {
        subjects = [];
      }
      break;
    }
  }
}

loadFromCookies();
setLanguage(currentLang);
updateTable();
updateResults();

const autocompleteList = document.createElement("ul");
autocompleteList.classList.add("autocomplete-list");
inputSubject.parentNode.appendChild(autocompleteList);

inputSubject.addEventListener("input", () => {
  const value = inputSubject.value.toLowerCase();
  autocompleteList.innerHTML = "";

  if (value.length < 2) return;

  const matches = subjectDatabase.filter((s) =>
    s.name.toLowerCase().includes(value)
  );

  matches.slice(0, 10).forEach((match) => {
    const item = document.createElement("li");
    item.textContent = match.name;
    item.addEventListener("click", () => {
      inputSubject.value = match.name;
      inputCredit.value = match.credit;
      autocompleteList.innerHTML = "";
    });
    autocompleteList.appendChild(item);
  });
});

document.addEventListener("click", (e) => {
  if (!autocompleteList.contains(e.target) && e.target !== inputSubject) {
    autocompleteList.innerHTML = "";
  }
});

let subjectDatabase = [];

function loadSubjectCSV() {
  fetch("tantargyak.csv")
    .then(response => response.text())
    .then(csv => {
      const lines = csv.trim().split("\n");
      const headers = lines[0].split(",");

      subjectDatabase = lines.slice(1).map(line => {
        const values = line.split(",");
        return {
          name: values[0],
          credit: parseInt(values[1]),
          instructor: values[2],
          language: values[3],
          link: values[4]
        };
      });
      subjectDatabase = subjectDatabase.reduce((acc, curr) => {
        const existing = acc.find(s => s.name === curr.name && s.credit === curr.credit);
        if (existing) {
          return acc;
        } else {
          return [...acc, curr];
        }
      }, []);
    })
    .catch(err => {
      console.error("Nem sikerült betölteni a tantárgylistát:", err);
    });
}

loadSubjectCSV();
