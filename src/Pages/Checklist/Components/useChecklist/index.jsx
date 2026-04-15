import { useState, useMemo, useEffect } from "react";
import { useChecklistService } from "../../service";

const STATUS_MAP = {
  Completado: "completed",
  "En Progreso": "in_progress",
  "Pendiente Novedad": "pending_update",
  "No Iniciado": "not_started",
};

const STATUS_TO_BACKEND = {
  completed: "Completado",
  in_progress: "En Progreso",
  pending_update: "Pendiente Novedad",
  not_started: "No Iniciado",
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
      const estadoPorControl = {};
      if (data.seguimientos) {
        data.seguimientos.forEach((seg) => {
          estadoPorControl[seg.control_id] = seg.estado_nombre || "No Iniciado";
        });
      }
      const controles = data.controles || data;
      const mapped = controles.map((control) => {
        const estadoBackend =
          estadoPorControl[control.id_control_maestro] || "No Iniciado";
        return {
          id: control.id_control_maestro,
          controlId: control.codigo_norma,
          title: control.nombre_del_control,
          description: control.explicacion_del_control,
          domain: control.area_o_dominio,
          priority: control.prioridad || "Media",
          status: STATUS_MAP[estadoBackend] || "not_started",
          responsible: control.responsable || "No asignado",
        };
      });
      setItems(mapped);
    }
  }, [data]);

  const catalogStates = useMemo(() => {
    const uniqueStates = [...new Set(items.map((i) => i.status))];
    return uniqueStates.map((s) => ({
      key: s,
      label: Object.keys(STATUS_MAP).find((key) => STATUS_MAP[key] === s) || s,
    }));
  }, [items]);

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
          f?.toLowerCase().includes(search.toLowerCase()),
        );
      const matchStatus =
        filters.status === "all" || i.status === filters.status;
      const matchDomain =
        filters.domain === "all" || i.domain === filters.domain;
      const matchPriority =
        filters.priority === "all" || i.priority === filters.priority;
      return matchSearch && matchStatus && matchDomain && matchPriority;
    });
  }, [items, search, filters]);

  const changeStatus = async (id, newStatus) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
    );
    try {
      const payload = {
        control_id: id,
        estado: STATUS_TO_BACKEND[newStatus],
      };
      await fetch(`/api/seguimientos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Error al actualizar estado", err);
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status:
                  newStatus === "not_started" ? "completed" : "not_started",
              }
            : i,
        ),
      );
    }
  };

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
    changeStatus,
  };
}
