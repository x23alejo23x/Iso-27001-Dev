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
} from "lucide-react";

const HistorialModal = ({ isOpen, onClose, itemId, onGetHistorial }) => {
  const [historialData, setHistorialData] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const loadHistorial = async () => {
      setLoadingHistorial(true);
      try {
        const data = await onGetHistorial(itemId);
        setHistorialData(data || []);
      } catch (err) {
        console.error("Error cargando historial:", err);
        setHistorialData([]);
      } finally {
        setLoadingHistorial(false);
      }
    };

    loadHistorial();
  }, [isOpen, itemId, onGetHistorial]);

  useEffect(() => {
    if (!isOpen) {
      setFilterText("");
      setStartDate("");
      setEndDate("");
    }
  }, [isOpen]);

  const filteredHistorial = useMemo(() => {
    if (!historialData.length) return [];
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
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (recordDate < start) dateMatch = false;
        }
        if (endDate && dateMatch) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (recordDate > end) dateMatch = false;
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl h-[600px] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header fijo */}
            <div className="flex-shrink-0 p-6 pb-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-500" />
                  Historial del Control
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filtros */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por estado, justificación o usuario..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3 items-end mb-6">
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Desde
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Hasta
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors"
                  >
                    <FilterX className="w-4 h-4" />
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto px-6 pb-6"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>
                {`
                  .flex-1::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>

              {loadingHistorial ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Cargando historial...
                  </span>
                </div>
              ) : filteredHistorial.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  {historialData.length === 0
                    ? "No hay historial registrado"
                    : "No hay resultados con los filtros actuales"}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistorial.map((h) => (
                    <div
                      key={h.id_seguimiento}
                      className="border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-800/50"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {h.estados_de_control?.nombre_del_estado}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {new Date(h.fecha_de_modificacion).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {h.descripcion_justificacion || "Sin justificación"}
                      </p>
                      <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {h.usuarios?.nombre_usuario || "Desconocido"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistorialModal;
