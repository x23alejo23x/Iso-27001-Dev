// useChecklist/index.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useChecklistService } from "../../service";

const STATUS_MAP = {
  Completado: "completed",
  "En Progreso": "in_progress",
  "Pendiente Novedad": "pending_update",
  "No Iniciado": "not_started",
  "No Aplica": "Not_Applicable",
};

const STATUS_TO_BACKEND = {
  completed: "Completado",
  in_progress: "En Progreso",
  pending_update: "Pendiente Novedad",
  not_started: "No Iniciado",
  Not_Applicable: "No Aplica",
};

export function useChecklist() {
  const {
    data,
    estados,
    loading,
    error,
    fetchSeguimientos,
    upsertSeguimiento,
    fetchHistorial,
  } = useChecklistService();
  const authState = useSelector((state) => state.login);
  const empresaId = authState.user?.empresa_id;

  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    domain: "all",
    priority: "all",
  });
  const [expandedId, setExpandedId] = useState(null);
  const hasFetched = useRef(false);

  const estadoNameToId = useMemo(() => {
    const map = {};
    estados?.forEach((e) => {
      map[e.nombre_del_estado] = e.id_estado;
    });
    return map;
  }, [estados]);

  useEffect(() => {
    if (loading || !data?.length || !estados?.length || !empresaId) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const init = async () => {
      try {
        const controles = Array.isArray(data) ? data : data.controles || [];
        const mapped = controles.map((control) => ({
          id: control.id_control_maestro,
          controlId: control.codigo_norma,
          title: control.nombre_del_control,
          description: control.explicacion_del_control,
          domain: control.area_o_dominio,
          priority: control.prioridad || "Media",
          status: "not_started",
          justificacion: "",
          responsible: control.responsable || "No asignado",
        }));

        const seguimientos = await fetchSeguimientos(empresaId);
        const seguimientosMap = seguimientos.reduce((acc, seg) => {
          if (
            !acc[seg.control_id] ||
            new Date(seg.fecha_de_modificacion) >
              new Date(acc[seg.control_id].fecha_de_modificacion)
          ) {
            acc[seg.control_id] = seg;
          }
          return acc;
        }, {});

        const merged = mapped.map((item) => {
          const seg = seguimientosMap[item.id];
          if (!seg) return item;
          const estadoObj = estados.find((e) => e.id_estado === seg.estado_id);
          const status =
            STATUS_MAP[estadoObj?.nombre_del_estado] || "not_started";
          return {
            ...item,
            status,
            justificacion: seg.descripcion_justificacion || "",
            ultimoResponsable: seg.usuarios?.nombre_usuario || "Desconocido",
            ultimaModificacion: seg.fecha_de_modificacion,
          };
        });

        setItems(merged);
      } catch (err) {
        console.warn("Error cargando datos:", err);
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, [loading, data, estados, empresaId, fetchSeguimientos]);

  const getHistorial = async (controlId) => {
    if (!empresaId) return;
    try {
      return await fetchHistorial(controlId, empresaId);
    } catch (err) {
      console.error("Error historial:", err);
    }
  };

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

  const changeStatus = async (id, newStatus, justificacion) => {
    const estadoBackend = STATUS_TO_BACKEND[newStatus];
    const estadoId = estadoNameToId[estadoBackend];
    if (!estadoId) {
      alert(`Estado "${newStatus}" no es válido`);
      return;
    }

    const original = items.find((i) => i.id === id);
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: newStatus, justificacion } : i,
      ),
    );

    try {
      await upsertSeguimiento(id, estadoId, justificacion);
    } catch (err) {
      console.error("Error al guardar seguimiento:", err);
      alert(err.message);
      if (original) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: original.status,
                  justificacion: original.justificacion,
                }
              : i,
          ),
        );
      }
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
    loading: !isReady,
    error,
    toggleExpand: (id) => setExpandedId((prev) => (prev === id ? null : id)),
    changeStatus,
    getHistorial,
  };
}
