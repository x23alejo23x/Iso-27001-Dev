import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Shield, X, Loader2 } from "lucide-react";
import { useChecklist } from "../useChecklist";
import ChecklistItem from "../ChecklistItem";

const STAT_CARDS = [
  {
    label: "Completados",
    key: "completed",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    label: "En Progreso",
    key: "in_progress",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    label: "Pendiente Novedad",
    key: "pending_update",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    label: "No Iniciados",
    key: "not_started",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
];

export default function ChecklistView() {
  const {
    items,
    filteredItems,
    stats,
    expandedId,
    search,
    setSearch,
    filters,
    setFilters,
    loading,
    error,
    toggleExpand,
    changeStatus,
  } = useChecklist();

  // Dominios dinámicos desde la data real
  const dynamicDomains = useMemo(() => {
    if (!items) return [];
    const domains = items.map((i) => i.domain).filter(Boolean);
    return [...new Set(domains)].sort();
  }, [items]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Shield className="w-12 h-12 text-red-500 mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Error de conexión
        </h3>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Checklist ISO 27001
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gestión y seguimiento de los controles de seguridad
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CARDS.map(({ label, key, color, bg }) => {
          const isActive = filters.status === key;
          return (
            <button
              key={key}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: isActive ? "all" : key,
                }))
              }
              className={`${bg} rounded-xl p-4 text-left transition-all hover:scale-[1.02] border-2 ${
                isActive ? "border-current" : "border-transparent"
              } ${color}`}
            >
              <div className="text-2xl font-bold">
                {loading ? "..." : stats[key] || 0}
              </div>
              <div className="text-xs font-medium mt-0.5 opacity-80">
                {label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtros con el estilo original */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por control, ID o descripción..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={filters.domain}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, domain: e.target.value }))
            }
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="all">Todos los dominios</option>
            {dynamicDomains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {(filters.status !== "all" || filters.domain !== "all" || search) && (
            <button
              onClick={() => {
                setSearch("");
                setFilters({ status: "all", domain: "all", priority: "all" });
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tight">
          Listado de Controles
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-bold">
          {filteredItems.length} Encontrados
        </div>
      </div>

      {/* Lista de Controles - Recuperando el fondo y bordes */}
      <div className="space-y-3 relative min-h-[300px]">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300 opacity-50" />
                <p className="font-medium text-slate-500">
                  No se encontraron controles
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  <ChecklistItem
                    item={item}
                    isExpanded={expandedId === item.id}
                    onToggle={() => toggleExpand(item.id)}
                    onStatusChange={(s) => changeStatus(item.id, s)}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
