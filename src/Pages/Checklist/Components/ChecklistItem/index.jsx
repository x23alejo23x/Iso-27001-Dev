import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Paperclip,
  User,
  Calendar,
} from "lucide-react";

const statusStyles = {
  completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  in_progress:
    "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
  pending_update:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  not_started:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

const statusIcons = {
  completed: CheckCircle2,
  in_progress: Clock,
  pending_update: AlertCircle,
  not_started: Circle,
};

const statusLabels = {
  completed: "Completado",
  in_progress: "En Progreso",
  pending_update: "Pendiente Novedad",
  not_started: "No Iniciado",
};

const priorityStyles = {
  high: "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30",
  medium:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
  low: "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

const priorityLabels = { high: "Alta", medium: "Media", low: "Baja" };

// Sub-componente para el selector de estado
function StatusDropdown({ status, onStatusChange, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = statusIcons[status];

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();

        if (!isOpen && onOpen) {
          onOpen();
        }

        setIsOpen(!isOpen);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
      }}
      tabIndex={0}
    >
      <div className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1">
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}
        >
          <Icon className="w-3.5 h-3.5" />
          {statusLabels[status]}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.97 }}
            className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-1"
          >
            {Object.keys(statusLabels).map((s) => {
              const SIcon = statusIcons[s];
              return (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(s);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${status === s ? "bg-slate-50 dark:bg-slate-700/30" : ""}`}
                >
                  <span
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[s]}`}
                  >
                    <SIcon className="w-3.5 h-3.5" />
                    {statusLabels[s]}
                  </span>
                  {status === s && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente Principal envuelto en forwardRef
const ChecklistItem = forwardRef(
  ({ item, isExpanded, onToggle, onStatusChange }, ref) => {
    return (
      <motion.div
        ref={ref} // Reenvío de la ref para Framer Motion
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
        {/* Row principal */}
        <div className="p-5 cursor-pointer" onClick={onToggle}>
          <div className="flex items-start gap-4">
            {/* Ícono control */}
            <div className="flex-shrink-0 mt-0.5">
              <div
                className={`w-26 h-18 rounded-xl flex items-center justify-center text-xs font-bold border ${
                  item.status === "completed"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400"
                    : item.status === "in_progress"
                      ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400"
                      : item.status === "pending_update"
                        ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-400"
                        : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                }`}
              >
                {item.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  item.controlId?.split(".").pop() || "?"
                )}
              </div>
            </div>

            {/* Contenido */}
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
                className={`text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed transition-all ${
                  isExpanded ? "" : "line-clamp-1"
                }`}
              >
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                  priorityStyles[item.priority || "medium"]
                }`}
              >
                {priorityLabels[item.priority || "medium"]}
              </span>

              <StatusDropdown
                status={item.status || "not_started"}
                onStatusChange={onStatusChange}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Responsable
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.responsible || "No asignado"}
                      </p>
                    </div>
                  </div>
                  {item.completedBy && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Completado por
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.completedBy}
                        </p>
                      </div>
                    </div>
                  )}
                  {item.completedAt && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Fecha
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.completedAt}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {item.evidence && item.evidence.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                      Evidencias adjuntas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.evidence.map((ev, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-colors"
                        >
                          <Paperclip className="w-3 h-3 text-indigo-500" />
                          {ev}
                        </div>
                      ))}
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-dashed border-indigo-300 dark:border-indigo-500/40 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
                        + Agregar evidencia
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    <Paperclip className="w-3 h-3" />
                    Adjuntar evidencia
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);

// Definir nombre del componente para debugging en React DevTools
ChecklistItem.displayName = "ChecklistItem";

export default ChecklistItem;
