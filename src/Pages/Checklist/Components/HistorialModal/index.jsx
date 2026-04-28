// components/HistorialModal.jsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Search,
  Calendar,
  FilterX,
  Loader2,
  User,
  X,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";
import AnalisisIAView from "./AnalisisIAView";

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

const HistorialModal = ({ isOpen, onClose, itemId, onGetHistorial }) => {
  const [historialData, setHistorialData] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedIA, setSelectedIA] = useState(null);

  // Cargar historial
  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      setLoadingHistorial(true);
      try {
        const data = await onGetHistorial(itemId);
        setHistorialData(data || []);
      } catch (err) {
        console.error(err);
        setHistorialData([]);
      } finally {
        setLoadingHistorial(false);
      }
    };
    load();
  }, [isOpen, itemId, onGetHistorial]);

  // Limpiar al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFilterText("");
      setStartDate("");
      setEndDate("");
      setSelectedIA(null);
    }
  }, [isOpen]);

  // Filtros
  const filteredHistorial = useMemo(() => {
    return historialData.filter((h) => {
      const textMatch =
        !filterText.trim() ||
        h.estados_de_control?.nombre_del_estado
          ?.toLowerCase()
          .includes(filterText.toLowerCase()) ||
        h.descripcion_justificacion
          ?.toLowerCase()
          .includes(filterText.toLowerCase()) ||
        h.usuarios?.nombre_usuario
          ?.toLowerCase()
          .includes(filterText.toLowerCase());

      let dateMatch = true;
      if (startDate || endDate) {
        const recordDate = new Date(h.fecha_de_modificacion);
        if (startDate) {
          const s = new Date(startDate);
          s.setHours(0, 0, 0, 0);
          if (recordDate < s) dateMatch = false;
        }
        if (endDate && dateMatch) {
          const e = new Date(endDate);
          e.setHours(23, 59, 59, 999);
          if (recordDate > e) dateMatch = false;
        }
      }
      return textMatch && dateMatch;
    });
  }, [historialData, filterText, startDate, endDate]);

  const clearFilters = () => {
    setFilterText("");
    setStartDate("");
    setEndDate("");
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
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex flex-col w-full"
            style={{
              maxWidth: selectedIA ? "1100px" : "640px",
              maxHeight: "88vh",
              transition: "max-width 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-1 overflow-hidden">
              {/* COLUMNA IZQUIERDA - Lista de historial */}
              <div
                className="flex flex-col overflow-hidden flex-shrink-0"
                style={{ width: selectedIA ? "380px" : "100%" }}
              >
                {/* Header con título y botón cerrar */}
                <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      Historial de cambios
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Filtros */}
                <div className="flex-shrink-0 px-5 pt-3 pb-2 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar por estado, justificación o usuario..."
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-2 items-end flex-wrap">
                    <div className="flex-1 min-w-[110px]">
                      <label className="block text-xs text-slate-400 mb-1">
                        Desde
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-[110px]">
                      <label className="block text-xs text-slate-400 mb-1">
                        Hasta
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs text-slate-500 flex items-center gap-1 transition-colors"
                    >
                      <FilterX className="w-3.5 h-3.5" /> Limpiar
                    </button>
                  </div>
                </div>

                {/* Lista de registros */}
                <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {loadingHistorial ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
                      <span className="text-sm text-slate-400">
                        Cargando historial...
                      </span>
                    </div>
                  ) : filteredHistorial.length === 0 ? (
                    <div className="text-center py-12 text-sm text-slate-400">
                      {historialData.length === 0
                        ? "No hay historial registrado"
                        : "Sin resultados con estos filtros"}
                    </div>
                  ) : (
                    filteredHistorial.map((h) => {
                      const tieneIA = !!h.estado_sugerido_ia;
                      const isSelected =
                        selectedIA?.id_seguimiento === h.id_seguimiento;
                      return (
                        <div
                          key={h.id_seguimiento}
                          className={`border rounded-xl p-3 transition-all cursor-pointer ${
                            isSelected
                              ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/5"
                              : "border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-700"
                          }`}
                          onClick={() => setSelectedIA(isSelected ? null : h)}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                              {h.estados_de_control?.nombre_del_estado ||
                                "Sin estado"}
                            </span>
                            <span className="text-xs text-slate-400 flex-shrink-0">
                              {new Date(
                                h.fecha_de_modificacion,
                              ).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                            {h.descripcion_justificacion || "Sin justificación"}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <User className="w-3 h-3" />
                              {h.nombre_del_responsable ||
                                h.usuarios?.nombre_usuario ||
                                "Desconocido"}
                            </div>
                            {tieneIA && (
                              <div className="flex items-center gap-1 text-xs text-violet-500">
                                <BrainCircuit className="w-3 h-3" />
                                <span>IA</span>
                                <ChevronRight
                                  className={`w-3 h-3 transition-transform ${isSelected ? "rotate-90" : ""}`}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* COLUMNA DERECHA - Detalle análisis IA */}
              <AnimatePresence>
                {selectedIA && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-l border-slate-200 dark:border-slate-700 overflow-y-auto p-5"
                  >
                    <AnalisisIAView
                      data={selectedIA}
                      onClose={() => setSelectedIA(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistorialModal;
