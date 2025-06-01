import { subjects, currentLang } from './main.js';

export function updateResults() {
  const scholarshipAvgEl = document.getElementById("resultScholarshipAvg");
  const weightedAvgEl = document.getElementById("resultWeightedAvg");
  const indexEl = document.getElementById("resultScholarshipIndex");

  if (subjects.length === 0) {
    scholarshipAvgEl.innerHTML = (currentLang === "hu" ? "Ösztöndíjátlag: " : "Scholarship Average: ") + "- <span class='arrow'>▼</span>";
    weightedAvgEl.innerHTML = (currentLang === "hu" ? "Kreditekkel súlyozott tanulmányi átlag: " : "Weighted Study Average: ") + "- <span class='arrow'>▼</span>";
    indexEl.innerHTML = (currentLang === "hu" ? "Ösztöndíjindex: " : "Scholarship Index: ") + "- <span class='arrow'>▼</span>";
    renderChart(0, 0, 0);
    return;
  }

  let sumScholarshipNumerator = 0;
  let sumScholarshipDenominator = 0;
  let sumWeightedNumerator = 0;
  let sumWeightedDenominator = 0;
  let totalPassedCredits = 0;

  subjects.forEach(({ credit, grade }) => {
    sumScholarshipNumerator += credit * grade;
    sumScholarshipDenominator += credit;
    if (grade > 1) {
      sumWeightedNumerator += credit * grade;
      sumWeightedDenominator += credit;
      totalPassedCredits += credit;
    }
  });

  const scholarshipAvg = sumScholarshipDenominator ? sumScholarshipNumerator / sumScholarshipDenominator : 0;
  const weightedAvg = sumWeightedDenominator ? sumWeightedNumerator / sumWeightedDenominator : 0;
  const scholarshipIndex = scholarshipAvg + ((totalPassedCredits / 27 - 1) / 2);

  setExpandableText(scholarshipAvgEl, currentLang === "hu" ? "Ösztöndíjátlag: " : "Scholarship Average: ", scholarshipAvg);
  setExpandableText(weightedAvgEl, currentLang === "hu" ? "Kreditekkel súlyozott tanulmányi átlag: " : "Weighted Study Average: ", weightedAvg);
  setExpandableText(indexEl, currentLang === "hu" ? "Ösztöndíjindex: " : "Scholarship Index: ", scholarshipIndex);

  renderChart(weightedAvg, scholarshipAvg, scholarshipIndex);
}

function setExpandableText(element, label, value) {
  element.innerHTML = `${label}${value.toFixed(2)} <span class="arrow">▼</span>`;
}

let chart = null;

export function renderChart(weighted, scholarship, index) {
  const canvas = document.getElementById("chartCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        currentLang === "hu" ? "Súlyozott átlag" : "Weighted Avg",
        currentLang === "hu" ? "Ösztöndíjátlag" : "Scholarship Avg",
        currentLang === "hu" ? "Ösztöndíjindex" : "Scholarship Index"
      ],
      datasets: [{
        label: currentLang === "hu" ? "Átlagok" : "Averages",
        data: [weighted, scholarship, index],
        backgroundColor: ["#0070c0", "#1c213c", "#3a447f"]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 5
        }
      }
    }
  });
}