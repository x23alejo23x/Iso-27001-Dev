/**
 * Parsea el texto plano de la descripción del control
 * que contiene etiquetas como OBJETIVO - , DESCRIPCION -, etc.
 * Devuelve un objeto con las secciones encontradas.
 */
export const parseControlDetails = (text) => {
  if (!text || typeof text !== "string") return null;

  const result = {};

  const patterns = {
    objetivo:
      /OBJETIVO\s*-\s*([\s\S]*?)(?=\n\s*(?:DESCRIPCION|RIESGO|DOCUMENTOS|EVIDENCIA|CHECK|TAG|$))/i,
    descripcion:
      /DESCRIPCION\s*-\s*([\s\S]*?)(?=\n\s*(?:RIESGO|DOCUMENTOS|EVIDENCIA|CHECK|TAG|$))/i,
    riesgo:
      /RIESGO ASOCIADO\s*-\s*([\s\S]*?)(?=\n\s*(?:DOCUMENTOS|EVIDENCIA|CHECK|TAG|$))/i,
    documentos:
      /DOCUMENTOS OBLIGATORIOS\s*-\s*([\s\S]*?)(?=\n\s*(?:EVIDENCIA|CHECK|TAG|$))/i,
    evidencia: /EVIDENCIA ESPERADA\s*-\s*([\s\S]*?)(?=\n\s*(?:CHECK|TAG|$))/i,
    checklist: /CHECK LIST DE CUMPLIMIENTO\s*-\s*([\s\S]*?)(?=\n\s*(?:TAG|$))/i,
    tag: /TAG RESPONSABILIDADES POR AREA\s*-\s*([\s\S]*?)$/i,
  };

  for (const [key, regex] of Object.entries(patterns)) {
    const match = text.match(regex);
    if (match && match[1]) {
      // Limpiar saltos de línea excesivos y espacios
      let value = match[1].replace(/\n\s*\n/g, "\n").trim();
      // Si la sección contiene viñetas (✔ o -), las convertimos en array
      if (key === "checklist" && value.includes("✔")) {
        const items = value
          .split(/\n/)
          .filter((line) => line.includes("✔"))
          .map((line) => line.replace(/^[•\-\s]*✔\s*/, "").trim());
        if (items.length) result[key] = items;
        else result[key] = value;
      } else {
        result[key] = value;
      }
    }
  }

  return Object.keys(result).length ? result : null;
};
