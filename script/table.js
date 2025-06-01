import { subjects, currentLang } from './main.js';
import { saveToCookies } from './storage.js';
import { updateResults } from './results.js';

let sortColumn = null;
let sortDirection = 1;

export function updateTable(withAnimation = true) {
  const tbody = document.querySelector("#subjectsTable tbody");

  if (withAnimation) {
    tbody.querySelectorAll("tr").forEach(row => row.classList.add("removed-row"));
  }

  setTimeout(() => {
    tbody.innerHTML = "";

    if (subjects.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = currentLang === "hu" ? "Nincs felvett tárgy." : "No subjects added.";
      td.style.textAlign = "center";
      td.style.padding = "20px";
      td.style.fontStyle = "italic";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    let sorted = [...subjects];
    if (sortColumn !== null) {
      sorted.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (typeof aVal === "string") {
          return aVal.localeCompare(bVal) * sortDirection;
        }
        return (aVal - bVal) * sortDirection;
      });
    }

    sorted.forEach((subj, index) => {
      const tr = document.createElement("tr");
      if (withAnimation) tr.classList.add("added-row");

      tr.innerHTML = `
        <td>${subj.name}</td>
        <td><span class="credit-text">${subj.credit}</span>
          <select class="credit-select" data-index="${index}" style="display:none;">
            ${Array.from({ length: 10 }, (_, i) => i + 1).map(i => `
              <option value="${i}" ${i === subj.credit ? "selected" : ""}>${i}</option>
            `).join("")}
          </select>
        </td>
        <td><span class="grade-text">${subj.grade}</span>
          <select class="grade-select" data-index="${index}" style="display:none;">
            ${[1, 2, 3, 4, 5].map(i => `
              <option value="${i}" ${i === subj.grade ? "selected" : ""}>${i}</option>
            `).join("")}
          </select>
        </td>
        <td><span class="mandatory-text">${subj.mandatory ? (currentLang === "hu" ? "Igen" : "Yes") : (currentLang === "hu" ? "Nem" : "No")}</span>
          <input type="checkbox" class="mandatory-checkbox" data-index="${index}" style="display:none;" ${subj.mandatory ? "checked" : ""}>
        </td>
        <td><button data-index="${index}">🗑️</button></td>
      `;

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("button").forEach(btn =>
      btn.addEventListener("click", () => {
        subjects.splice(btn.dataset.index, 1);
        saveToCookies();
        updateTable(true);
        updateResults();
      })
    );

    tbody.querySelectorAll(".grade-text").forEach(span => {
      span.addEventListener("click", () => {
        const td = span.parentElement;
        span.style.display = "none";
        td.querySelector(".grade-select").style.display = "inline";
      });
    });

    tbody.querySelectorAll(".grade-select").forEach(select => {
      select.addEventListener("change", () => {
        const index = parseInt(select.dataset.index);
        subjects[index].grade = parseInt(select.value);
        saveToCookies();
        updateTable(false);
        updateResults();
      });
      select.addEventListener("blur", () => updateTable(false));
    });

    tbody.querySelectorAll(".credit-text").forEach(span => {
      span.addEventListener("click", () => {
        const td = span.parentElement;
        span.style.display = "none";
        td.querySelector(".credit-select").style.display = "inline";
      });
    });

    tbody.querySelectorAll(".credit-select").forEach(select => {
      select.addEventListener("change", () => {
        const index = parseInt(select.dataset.index);
        subjects[index].credit = parseInt(select.value);
        saveToCookies();
        updateTable(false);
        updateResults();
      });
      select.addEventListener("blur", () => updateTable(false));
    });

    tbody.querySelectorAll(".mandatory-text").forEach(span => {
      span.addEventListener("click", () => {
        const td = span.parentElement;
        span.style.display = "none";
        td.querySelector(".mandatory-checkbox").style.display = "inline";
      });
    });

    tbody.querySelectorAll(".mandatory-checkbox").forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        const index = parseInt(checkbox.dataset.index);
        subjects[index].mandatory = checkbox.checked;
        saveToCookies();
        updateTable(false);
        updateResults();
      });
      checkbox.addEventListener("blur", () => updateTable(false));
    });
  }, withAnimation ? 300 : 0);
}