import { AnimatePresence } from "framer-motion";
import { Search, Shield, X } from "lucide-react";
import { MOCK_DOMAINS } from "../../../data/mock";
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
    filteredItems,
    stats,
    expandedId,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    domainFilter,
    setDomainFilter,
    priorityFilter,
    setPriorityFilter,
    hasFilters,
    clearFilters,
    handleStatusChange,
    toggleExpand,
  } = useChecklist();

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
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
        {STAT_CARDS.map(({ label, key, color, bg }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
            className={`${bg} rounded-xl p-4 text-left transition-all hover:scale-[1.02] border-2 ${
              statusFilter === key ? "border-current" : "border-transparent"
            } ${color}`}
          >
            <div className={`text-2xl font-bold ${color}`}>{stats[key]}</div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{label}</div>
          </button>
        ))}
      </div>

      {/* Filtros */}
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
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="all">Todos los dominios</option>
            {MOCK_DOMAINS.slice(0, 8).map((d) => (
              <option key={d} value={d}>
                {d.substring(0, 30)}...
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="all">Todas las prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-slate-500 dark:text-slate-400">
        Mostrando{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {filteredItems.length}
        </span>{" "}
        de {stats.total} controles
      </div>

      {/* Lista */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No se encontraron controles</p>
              <p className="text-sm mt-1">Intenta ajustar los filtros</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                isExpanded={expandedId === item.id}
                onToggle={() => toggleExpand(item.id)}
                onStatusChange={(s) => handleStatusChange(item.id, s)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
