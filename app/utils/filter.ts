export function filterMedicalResponse(raw: string): string {
  if (!raw) return `<p class="text-gray-500 italic">No information available.</p>`;

  
  const parts = raw.split(/\s*[•-]\s+/);
  const paragraph = parts[0].trim();
  const bullets = parts.slice(1).map((p) => p.trim()).filter(Boolean);


  let html = `
    <div class="px-4 pt-2 rounded-2xl shadow-lg">
      <p class="text-gray-100 dark:text-gray-900 leading-relaxed text-base mb-5">
        ${paragraph}
      </p>
  `;


  if (bullets.length > 0) {
    html += `
      <ul class="space-y-3 mt-2">
        ${bullets
          .map((point) => {
            
            point = point.replace(/^(\*|\-|•)+\s*/, "").trim();
            const match = point.match(/(?:\*\*)?(.*?)\*\*:\s*(.*)/);

            if (match) {
              const bold = match[1].trim();
              const rest = match[2].trim();
              return `
                <li class="text-gray-300 dark:text-gray-700 text-base pl-4 relative">
                  <span class="absolute left-0 text-teal-400 dark:text-teal-700 text-lg">•</span>
                  <strong class="text-white dark:text-black font-semibold">${bold}</strong>: ${rest}
                </li>`;
            } else {
              return `
                <li class="text-gray-300 dark:text-gray-700 text-base pl-4 relative">
                  <span class="absolute left-0 text-teal-400 dark:text-teal-700 text-lg">•</span>
                  ${point}
                </li>`;
            }
          })
          .join("")}
      </ul>
    `;
  }

  html += `</div>`;
  return html;
}
