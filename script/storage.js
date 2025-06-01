import { subjects } from './main.js';

export function saveToCookies() {
  const json = JSON.stringify(subjects);
  document.cookie = `subjects=${encodeURIComponent(json)};path=/;max-age=${60*60*24*365}`;
}

export function loadFromCookies() {
  const cookies = document.cookie.split(";").map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith("subjects=")) {
      const json = decodeURIComponent(cookie.split("=")[1]);
      try {
        const loaded = JSON.parse(json);
        subjects.splice(0, subjects.length, ...loaded);
      } catch {
        subjects.length = 0;
      }
      break;
    }
  }
}