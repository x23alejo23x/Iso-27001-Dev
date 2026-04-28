import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, BrainCircuit, FileText, Loader2 } from "lucide-react";
import { useRef } from "react";

const EstadoBadge = ({ estado }) => {
  const s = {
    Cumple: "bg-green-100 text-green-900 border-green-300",
    "No Cumple": "bg-red-100 text-red-900 border-red-300",
    Parcial: "bg-amber-100 text-amber-900 border-amber-300",
  };
  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${s[estado] || s.Parcial}`}
    >
      {estado}
    </span>
  );
};
const RiesgoBadge = ({ riesgo }) => {
  const s = {
    Alto: "bg-red-100 text-red-900 border-red-300",
    Medio: "bg-amber-100 text-amber-900 border-amber-300",
    Bajo: "bg-green-100 text-green-900 border-green-300",
  };
  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${s[riesgo] || s.Medio}`}
    >
      Riesgo {riesgo}
    </span>
  );
};
const ConclusionTag = ({ tag }) => {
  const s = {
    Cumple: "bg-green-100 text-green-900",
    "No Cumple": "bg-red-100 text-red-900",
    Parcial: "bg-amber-100 text-amber-900",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-lg ${s[tag] || s.Parcial}`}
    >
      {tag}
    </span>
  );
};

const getPctColor = (p) =>
  p >= 80 ? "#639922" : p >= 40 ? "#BA7517" : "#E24B4A";

const Analisi_IA_Modal = ({
  isOpen,
  onClose,
  itemId,
  onGetAnalisi_IA,
  item,
}) => {
  const [file, setFile] = useState(null);
  const [loadingIA, setLoadingIA] = useState(false);
  const [responseIA, setResponseIA] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setResponseIA(null);
      setLoadingIA(false);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && item?.analisisIA) {
      setResponseIA(item.analisisIA);
    }
  }, [isOpen, item]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f?.type === "application/pdf") {
      setFile(f);
      setError(null);
    } else setError("Solo se permiten archivos PDF");
  };

  const handleSendToIA = async () => {
    if (!file) return setError("Debes cargar un PDF primero");
    setLoadingIA(true);
    setError(null);
    setResponseIA(null);
    try {
      const result = await onGetAnalisi_IA(file, itemId);
      if (!result?.control) throw new Error("Respuesta de la IA inválida");
      setResponseIA(result);
    } catch (err) {
      setError(err.message || "Error al procesar el documento");
    } finally {
      setLoadingIA(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Badge "Generado con IA" con punto animado */}
                <div className="flex items-center gap-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                  <span className="text-xs font-medium text-violet-700 dark:text-violet-400">
                    Generado con IA
                  </span>
                </div>
                <h2 className="text-sm font-medium text-slate-900 dark:text-white">
                  Análisis de documento — ISO 27001
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BODY — dos columnas, sin scroll global */}
            <div
              className="grid flex-1 overflow-hidden"
              style={{ gridTemplateColumns: "240px 1fr" }}
            >
              {/* COLUMNA IZQUIERDA — carga del documento */}
              <div className="border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3">
                {/* Upload zone (se oculta cuando hay resultado) */}
                {!responseIA && (
                  <div
                    className="border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() =>
                      document.getElementById(`fi-${itemId}`).click()
                    }
                  >
                    <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mb-3">
                      <Upload className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Cargar documento PDF
                    </p>
                    <p className="text-xs text-slate-400">
                      Haz clic para seleccionar
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Máx. 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id={`fi-${itemId}`}
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Preview del PDF */}
                {file && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {/* barra decorativa */}
                    <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-violet-500 rounded-full" />
                    </div>
                    {!responseIA && (
                      <button
                        onClick={() => {
                          setFile(null);
                          setError(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-xs text-slate-400 hover:text-red-500"
                      >
                        Quitar archivo
                      </button>
                    )}
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Botón analizar */}
                {!responseIA ? (
                  <button
                    onClick={handleSendToIA}
                    disabled={loadingIA || !file}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors mt-auto"
                  >
                    {loadingIA ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                        Analizando...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="w-3.5 h-3.5" /> Analizar con IA
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setResponseIA(null);
                      setFile(null);
                      setError(null);
                    }}
                    className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mt-auto"
                  >
                    Nuevo análisis
                  </button>
                )}
              </div>

              <div
                className="overflow-y-auto p-4 flex flex-col gap-3"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <style>
                  {`
      .overflow-y-auto::-webkit-scrollbar {
        display: none;
      }
    `}
                </style>
                {/* Estado vacío */}
                {!loadingIA && !responseIA && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-300 dark:text-slate-600">
                    <BrainCircuit className="w-10 h-10" />
                    <p className="text-xs text-slate-400">
                      Carga un PDF y presiona analizar
                    </p>
                  </div>
                )}

                {/* Loading */}
                {loadingIA && (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    <p className="text-xs text-slate-400">
                      La IA está analizando el documento...
                    </p>
                  </div>
                )}

                {/* Resultado */}
                {responseIA?.control && (
                  <>
                    {/* Header */}
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {responseIA.control.codigo} —{" "}
                          {responseIA.control.nombre}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {responseIA.control.area}
                        </p>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <EstadoBadge estado={responseIA.estado_sugerido_ia} />
                        <RiesgoBadge
                          riesgo={responseIA.riesgo_incumplimiento}
                        />
                      </div>
                    </div>

                    {/* Barra de cumplimiento */}
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-slate-400 w-28 flex-shrink-0">
                        Nivel de cumplimiento
                      </span>
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${responseIA.nivel_cumplimiento_porcentaje}%`,
                            background: getPctColor(
                              responseIA.nivel_cumplimiento_porcentaje,
                            ),
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-8 text-right">
                        {responseIA.nivel_cumplimiento_porcentaje}%
                      </span>
                    </div>

                    {/* Resumen */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800 border-l-2 border-violet-400 pl-3 py-2 pr-3 rounded-r-lg">
                      {responseIA.resumen_ejecutivo}
                    </p>

                    {/* Cumple / Falta */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-3">
                        <p className="text-xs font-medium text-green-800 dark:text-green-400 uppercase tracking-wide mb-2">
                          Lo que cumple
                        </p>
                        {(responseIA.aspectos_que_cumple || []).map((a, i) => (
                          <div
                            key={i}
                            className="flex gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                            {a}
                          </div>
                        ))}
                      </div>
                      <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-3">
                        <p className="text-xs font-medium text-red-800 dark:text-red-400 uppercase tracking-wide mb-2">
                          Lo que falta
                        </p>
                        {(responseIA.aspectos_que_faltan || []).map((a, i) => (
                          <div
                            key={i}
                            className="flex gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tabla comparativa */}
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                        Análisis comparativo
                      </p>
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <table
                          className="w-full text-xs border-collapse"
                          style={{ tableLayout: "fixed" }}
                        >
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800">
                              <th className="text-left p-2.5 font-medium text-slate-500 dark:text-slate-400 w-1/5">
                                Aspecto
                              </th>
                              <th className="text-left p-2.5 font-medium text-slate-500 dark:text-slate-400 w-2/5">
                                Exige la norma
                              </th>
                              <th className="text-left p-2.5 font-medium text-slate-500 dark:text-slate-400 w-1/4">
                                Dice el documento
                              </th>
                              <th className="text-left p-2.5 font-medium text-slate-500 dark:text-slate-400 w-1/6">
                                Conclusión
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(responseIA.analisis_comparativo || []).map(
                              (r, i) => (
                                <tr
                                  key={i}
                                  className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                >
                                  <td className="p-2.5 font-medium text-slate-700 dark:text-slate-300 align-top">
                                    {r.aspecto_evaluado}
                                  </td>
                                  <td className="p-2.5 text-slate-500 dark:text-slate-400 align-top leading-relaxed">
                                    {r.lo_que_exige_la_norma}
                                  </td>
                                  <td className="p-2.5 text-slate-500 dark:text-slate-400 align-top leading-relaxed">
                                    {r.lo_que_dice_el_documento}
                                  </td>
                                  <td className="p-2.5 align-top">
                                    <ConclusionTag tag={r.conclusion} />
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Recomendaciones */}
                    <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-400 uppercase tracking-wide mb-2">
                        Recomendaciones
                      </p>
                      {(responseIA.recomendaciones || []).map((r, i) => (
                        <div
                          key={i}
                          className="flex gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          {r}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Analisi_IA_Modal;
