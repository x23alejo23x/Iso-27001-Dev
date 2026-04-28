// utils/parseAnalisisTexto.js

/**
 * Parsea un texto plano del estilo:
 * "RESUMEN EJECUTIVO: El documento... CUMPLIMIENTO: 60% | RIESGO: Alto JUSTIFICACIÓN TÉCNICA: ..."
 * a un objeto estructurado.
 */
export const parseAnalisisTexto = (texto) => {
  if (!texto || typeof texto !== "string") return null;

  const result = {};

  // Expresiones regulares para capturar cada sección
  const patrones = {
    resumen_ejecutivo:
      /RESUMEN\s+EJECUTIVO:\s*([\s\S]*?)(?=\n\s*(?:CUMPLIMIENTO|JUSTIFICACIÓN|ASPECTOS\s+QUE\s+CUMPLE|ASPECTOS\s+QUE\s+FALTAN|RECOMENDACIONES|ANÁLISIS\s+COMPARATIVO|$))/i,
    cumplimiento_riesgo: /CUMPLIMIENTO:\s*(\d+)%\s*\|\s*RIESGO:\s*(\w+)/i,
    justificacion_tecnica:
      /JUSTIFICACIÓN\s+TÉCNICA:\s*([\s\S]*?)(?=\n\s*(?:ASPECTOS\s+QUE\s+CUMPLE|ASPECTOS\s+QUE\s+FALTAN|RECOMENDACIONES|ANÁLISIS\s+COMPARATIVO|$))/i,
    aspectos_cumple:
      /ASPECTOS\s+QUE\s+CUMPLE:\s*([\s\S]*?)(?=\n\s*(?:ASPECTOS\s+QUE\s+FALTAN|RECOMENDACIONES|ANÁLISIS\s+COMPARATIVO|$))/i,
    aspectos_faltan:
      /ASPECTOS\s+QUE\s+FALTAN:\s*([\s\S]*?)(?=\n\s*(?:RECOMENDACIONES|ANÁLISIS\s+COMPARATIVO|$))/i,
    recomendaciones:
      /RECOMENDACIONES:\s*([\s\S]*?)(?=\n\s*(?:ANÁLISIS\s+COMPARATIVO|$))/i,
    analisis_comparativo: /ANÁLISIS\s+COMPARATIVO:\s*([\s\S]*?)$/i,
  };

  // 1. Resumen ejecutivo
  const matchResumen = texto.match(patrones.resumen_ejecutivo);
  if (matchResumen && matchResumen[1]) {
    result.resumen_ejecutivo = matchResumen[1].trim();
  }

  // 2. Cumplimiento y riesgo
  const matchCumplimiento = texto.match(patrones.cumplimiento_riesgo);
  if (matchCumplimiento) {
    result.nivel_cumplimiento_porcentaje = parseInt(matchCumplimiento[1], 10);
    result.riesgo_incumplimiento = matchCumplimiento[2];
  }

  // 3. Justificación técnica
  const matchJustificacion = texto.match(patrones.justificacion_tecnica);
  if (matchJustificacion && matchJustificacion[1]) {
    result.justificacion_ia = matchJustificacion[1].trim();
  }

  // 4. Aspectos que cumple (lista con guiones)
  const matchCumple = texto.match(patrones.aspectos_cumple);
  if (matchCumple && matchCumple[1]) {
    const items = matchCumple[1]
      .split(/\n\s*[-•*]\s*/)
      .filter((s) => s.trim().length > 0)
      .map((s) => s.trim());
    result.aspectos_que_cumple = items;
  }

  // 5. Aspectos que faltan
  const matchFaltan = texto.match(patrones.aspectos_faltan);
  if (matchFaltan && matchFaltan[1]) {
    const items = matchFaltan[1]
      .split(/\n\s*[-•*]\s*/)
      .filter((s) => s.trim().length > 0)
      .map((s) => s.trim());
    result.aspectos_que_faltan = items;
  }

  // 6. Recomendaciones
  const matchRecom = texto.match(patrones.recomendaciones);
  if (matchRecom && matchRecom[1]) {
    const items = matchRecom[1]
      .split(/\n\s*[-•*]\s*/)
      .filter((s) => s.trim().length > 0)
      .map((s) => s.trim());
    result.recomendaciones = items;
  }

  // 7. Análisis comparativo (formato especial con *)
  const matchComp = texto.match(patrones.analisis_comparativo);
  if (matchComp && matchComp[1]) {
    const lines = matchComp[1].split(/\n/);
    const comparativos = [];
    let current = null;
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith("*")) {
        if (current) comparativos.push(current);
        const titulo = line.replace(/^\*\s*/, "").trim();
        current = {
          aspecto_evaluado: titulo,
          lo_que_exige_la_norma: "",
          lo_que_dice_el_documento: "",
        };
      } else if (current && line.startsWith("- Norma:")) {
        current.lo_que_exige_la_norma = line
          .replace(/^-\s*Norma:\s*/, "")
          .trim();
      } else if (current && line.startsWith("- Documento:")) {
        current.lo_que_dice_el_documento = line
          .replace(/^-\s*Documento:\s*/, "")
          .trim();
      }
    }
    if (current) comparativos.push(current);
    result.analisis_comparativo = comparativos;
  }

  // Si no se pudo extraer nada, devolvemos el texto como justificación
  if (Object.keys(result).length === 0) {
    return { justificacion_ia: texto };
  }

  return result;
};
