// components/AnalisisIAView.jsx
import { motion } from "framer-motion";
import { parseAnalisisTexto } from "../../../utils/parseAnalisisTexto";
import { CheckCircle2, XCircle, Lightbulb, Scale } from "lucide-react";

const EstadoIABadge = ({ estado }) => {
  const s = {
    Cumple: "bg-green-100 text-green-900 border-green-300",
    "No Cumple": "bg-red-100 text-red-900 border-red-300",
    Parcial: "bg-amber-100 text-amber-900 border-amber-300",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${s[estado] || s.Parcial}`}
    >
      {estado}
    </span>
  );
};

const RiesgoBadge = ({ riesgo }) => {
  const color = {
    Alto: "bg-red-100 text-red-800 border-red-200",
    Medio: "bg-amber-100 text-amber-800 border-amber-200",
    Bajo: "bg-green-100 text-green-800 border-green-200",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${color[riesgo] || color.Medio}`}
    >
      {riesgo}
    </span>
  );
};

const AnalisisIAView = ({ data, onClose }) => {
  if (!data) return null;

  // ---------- 1. Normalizar los datos ----------
  let parsedData = {};

  // Caso A: data es un string plano (el texto completo)
  if (typeof data === "string") {
    parsedData = parseAnalisisTexto(data);
  }
  // Caso B: data es un objeto con campos, pero la justificacion_ia puede ser texto plano
  else if (typeof data === "object") {
    // Copia base
    parsedData = { ...data };

    // Si existe justificacion_ia y parece ser el texto plano con etiquetas
    if (
      data.justificacion_ia &&
      typeof data.justificacion_ia === "string" &&
      (data.justificacion_ia.includes("RESUMEN EJECUTIVO:") ||
        data.justificacion_ia.includes("CUMPLIMIENTO:"))
    ) {
      const extraido = parseAnalisisTexto(data.justificacion_ia);
      // Fusionar: los campos extraídos tienen prioridad (resumen_ejecutivo, aspectos_que_cumple, etc.)
      parsedData = {
        ...parsedData,
        ...extraido,
        // Pero conservamos el original justificacion_ia como fallback
        justificacion_ia_raw: data.justificacion_ia,
      };
    }
  }

  // Si después de todo no tenemos estructura mínima, usamos lo que venga
  const finalData = parsedData;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-5 overflow-y-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 pb-2 z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
            <span className="text-xs font-medium text-violet-700 dark:text-violet-400">
              Generado con IA
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <XCircle className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Info del control (si existe) */}
      {finalData.control && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Control analizado
          </p>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
            {finalData.control.codigo} – {finalData.control.nombre}
          </p>
          <p className="text-xs text-slate-500">{finalData.control.area}</p>
        </div>
      )}

      {/* Estado y cumplimiento */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Estado sugerido:</span>
          <EstadoIABadge estado={finalData.estado_sugerido_ia} />
        </div>
        {finalData.nivel_cumplimiento_porcentaje !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Cumplimiento:</span>
            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full"
                style={{ width: `${finalData.nivel_cumplimiento_porcentaje}%` }}
              />
            </div>
            <span className="text-xs font-medium">
              {finalData.nivel_cumplimiento_porcentaje}%
            </span>
          </div>
        )}
        {finalData.riesgo_incumplimiento && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Riesgo:</span>
            <RiesgoBadge riesgo={finalData.riesgo_incumplimiento} />
          </div>
        )}
      </div>

      {/* Resumen ejecutivo */}
      {finalData.resumen_ejecutivo && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border-l-4 border-violet-400">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Resumen ejecutivo
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {finalData.resumen_ejecutivo}
          </p>
        </div>
      )}

      {/* Justificación IA (si no fue absorbida por el resumen) */}
      {finalData.justificacion_ia && !finalData.resumen_ejecutivo && (
        <div className="bg-violet-50/30 dark:bg-violet-500/5 rounded-xl p-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            Justificación detallada
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {finalData.justificacion_ia}
          </p>
        </div>
      )}

      {/* Aspectos que cumple / no cumple */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {finalData.aspectos_que_cumple?.length > 0 && (
          <div className="bg-green-50 dark:bg-green-500/5 rounded-xl p-3 border border-green-100 dark:border-green-800/30">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                Aspectos que cumple
              </p>
            </div>
            <ul className="space-y-1.5">
              {finalData.aspectos_que_cumple.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 dark:text-slate-300 flex gap-2"
                >
                  <span className="text-green-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {finalData.aspectos_que_faltan?.length > 0 && (
          <div className="bg-red-50 dark:bg-red-500/5 rounded-xl p-3 border border-red-100 dark:border-red-800/30">
            <div className="flex items-center gap-1.5 mb-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                Aspectos que faltan
              </p>
            </div>
            <ul className="space-y-1.5">
              {finalData.aspectos_que_faltan.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 dark:text-slate-300 flex gap-2"
                >
                  <span className="text-red-400">✗</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recomendaciones */}
      {finalData.recomendaciones?.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-500/5 rounded-xl p-3 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              Recomendaciones
            </p>
          </div>
          <ul className="space-y-2">
            {finalData.recomendaciones.map((rec, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-700 dark:text-slate-300 flex gap-2"
              >
                <span className="text-blue-500">→</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Análisis comparativo */}
      {finalData.analisis_comparativo?.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-500/5 rounded-xl p-3 border border-amber-100 dark:border-amber-800/30">
          <div className="flex items-center gap-1.5 mb-3">
            <Scale className="w-4 h-4 text-amber-600" />
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Análisis comparativo con la norma
            </p>
          </div>
          <div className="space-y-3">
            {finalData.analisis_comparativo.map((item, idx) => (
              <div
                key={idx}
                className="text-xs border-t border-amber-200/50 pt-2 first:border-t-0 first:pt-0"
              >
                <p className="font-medium text-amber-800 dark:text-amber-300">
                  {item.aspecto_evaluado}
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Norma exige:</strong> {item.lo_que_exige_la_norma}
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  <strong>Documento dice:</strong>{" "}
                  {item.lo_que_dice_el_documento}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Si no hay nada estructurado, mostrar el texto original */}
      {!finalData.resumen_ejecutivo &&
        !finalData.aspectos_que_cumple?.length &&
        !finalData.recomendaciones?.length &&
        (finalData.justificacion_ia || finalData.justificacion_ia_raw) && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              Análisis original
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {finalData.justificacion_ia || finalData.justificacion_ia_raw}
            </p>
          </div>
        )}

      {/* Pie de nota */}
      <p className="text-xs text-slate-400 text-center italic mt-2">
        Este análisis fue generado automáticamente por IA.
        <br />
        El usuario puede ajustar el estado manualmente.
      </p>
    </motion.div>
  );
};

export default AnalisisIAView;
