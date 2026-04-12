import { useState, useMemo, useEffect } from "react";
import { useChecklistService } from "../../service";

const STATUS_MAP = {
  NO_INICIADO: "not_started",
  EN_PROCESO: "in_progress",
  CUMPLE: "completed",
  NO_CUMPLE: "pending_update",
  NO_APLICA: "not_applicable",
};

export function useChecklist() {
  const { data, estados, loading, error } = useChecklistService();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    domain: "all",
    priority: "all",
  });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (data) {
      setItems(
        data.map((c) => ({
          id: c.id_control_maestro,
          controlId: c.codigo_norma,
          title: c.nombre_del_control,
          description: c.explicacion_del_control,
          domain: c.area_o_dominio,
          status: "not_started",
          priority: "medium",
        })),
      );
    }
  }, [data]);

  const catalogStates = useMemo(
    () =>
      (estados || []).map((e) => ({
        key: STATUS_MAP[e.nombre_del_estado] || "not_started",
        label: e.nombre_del_estado.replace(/_/g, " "),
      })),
    [estados],
  );

  const stats = useMemo(() => {
    const s = { total: items.length };
    catalogStates.forEach((st) => {
      s[st.key] = items.filter((i) => i.status === st.key).length;
    });
    return s;
  }, [items, catalogStates]);

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const matchSearch =
        !search ||
        [i.title, i.controlId, i.description].some((f) =>
          f.toLowerCase().includes(search.toLowerCase()),
        );
      return (
        matchSearch &&
        (filters.status === "all" || i.status === filters.status) &&
        (filters.domain === "all" || i.domain === filters.domain)
      );
    });
  }, [items, search, filters]);

  return {
    items,
    filteredItems,
    stats,
    catalogStates,
    expandedId,
    search,
    setSearch,
    filters,
    setFilters,
    loading,
    error,
    toggleExpand: (id) => setExpandedId((prev) => (prev === id ? null : id)),
    changeStatus: (id, status) =>
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i))),
  };
}
