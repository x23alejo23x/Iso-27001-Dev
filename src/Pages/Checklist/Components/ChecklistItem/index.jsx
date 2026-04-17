import { useState, forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronRight,
  Paperclip,
  User,
  Calendar,
  Save,
  CheckCircle2,
} from "lucide-react";
import HistorialModal from "../HistorialModal";
import StatusDropdown from "../StatusDropdown";
import { priorityStyles, priorityLabels, statusStyles } from "../../constants";

const ChecklistItem = forwardRef(
  ({ item, isExpanded, onToggle, onStatusChange, onGetHistorial }, ref) => {
    const [localStatus, setLocalStatus] = useState(item.status);
    const [localJustificacion, setLocalJustificacion] = useState(
      item.justificacion || "",
    );
    const [isSaving, setIsSaving] = useState(false);
    const [showHistorial, setShowHistorial] = useState(false);

    useEffect(() => {
      setLocalStatus(item.status);
      setLocalJustificacion(item.justificacion || "");
    }, [item.status, item.justificacion]);

    const handleSave = async () => {
      setIsSaving(true);
      try {
        await onStatusChange(item.id, localStatus, localJustificacion);
        toast.success("Guardado correctamente", {
          duration: 3000,
          position: "top-center",
          icon: "✅",
          style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: 500,
            borderRadius: "12px",
            padding: "10px 20px",
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("Error al guardar", {
          duration: 3000,
          position: "top-center",
          icon: "❌",
          style: {
            background: "#ef4444",
            color: "#fff",
            fontWeight: 500,
            borderRadius: "12px",
            padding: "10px 20px",
          },
        });
      } finally {
        setIsSaving(false);
      }
    };

    const handleStatusChange = (newStatus) => {
      setLocalStatus(newStatus);
    };

    return (
      <>
        <motion.div
          ref={ref}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`bg-white dark:bg-slate-900 border rounded-2xl shadow-sm overflow-visible transition-all ${
            isExpanded
              ? "border-indigo-300 dark:border-indigo-700"
              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          {/* Fila principal (colapsada) */}
          <div className="p-5 cursor-pointer" onClick={onToggle}>
            <div className="flex items-start gap-4">
              {/* Ícono de estado resumido */}
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className={`w-26 h-18 rounded-xl flex items-center justify-center text-xs font-bold border ${
                    statusStyles[item.status] || statusStyles.not_started
                  }`}
                >
                  {item.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    item.controlId?.split(".").pop() || "?"
                  )}
                </div>
              </div>

              {/* Contenido textual */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    {item.controlId}
                  </span>
                  <span className="hidden md:block text-slate-300 dark:text-slate-700">
                    ·
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {item.domain}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>
                <p
                  className={`text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed ${
                    isExpanded ? "" : "line-clamp-1"
                  }`}
                >
                  {item.description}
                </p>
              </div>

              {/* Acciones rápidas */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                    priorityStyles[item.priority] || priorityStyles["Media"]
                  }`}
                >
                  {priorityLabels[item.priority] || "Media"}
                </span>
                <StatusDropdown
                  status={localStatus}
                  onStatusChange={handleStatusChange}
                  onOpen={() => {
                    if (!isExpanded) onToggle();
                  }}
                />
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Panel expandido */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <div className="p-5 bg-slate-50/60 dark:bg-slate-950/40">
                  {/* Responsable y fecha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Última actualización por
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.ultimoResponsable ||
                            item.responsible ||
                            "No asignado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Fecha de modificación
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.ultimaModificacion
                            ? new Date(item.ultimaModificacion).toLocaleString()
                            : "Sin registrar"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Justificación */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Justificación / Comentarios
                    </label>
                    <textarea
                      value={localJustificacion}
                      onChange={(e) => setLocalJustificacion(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                      placeholder="Agrega una justificación o comentario sobre el estado del control..."
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-between items-center">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-sm font-medium w-40">
                      <Paperclip className="w-4 h-4" />
                      Evidencias
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowHistorial(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-sm font-medium w-40"
                      >
                        <Paperclip className="w-4 h-4" />
                        Historial
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium w-40"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Guardando..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <HistorialModal
          isOpen={showHistorial}
          onClose={() => setShowHistorial(false)}
          itemId={item.id}
          onGetHistorial={onGetHistorial}
        />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "12px",
            },
          }}
        />
      </>
    );
  },
);

ChecklistItem.displayName = "ChecklistItem";

export default ChecklistItem;
