// Checklist/Components/useChecklist/index.jsx
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
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    domain: "all",
    priority: "all",
  });
  const [expandedId, setExpandedId] = useState(null);
  const [loadingSeguimientos, setLoadingSeguimientos] = useState(false);
  const hasLoadedSeguimientos = useRef(false);

  const estadoNameToId = useMemo(() => {
    const map = {};
    if (estados) {
      estados.forEach((e) => {
        map[e.nombre_del_estado] = e.id_estado;
      });
    }
    return map;
  }, [estados]);

  const getHistorial = async (controlId) => {
    if (!empresaId) return;

    try {
      const historial = await fetchHistorial(controlId, empresaId);
      console.log("📜 Historial:", historial);
      return historial;
    } catch (err) {
      console.error("Error historial:", err);
    }
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

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
    setItems(mapped);
    console.log("✅ Controles cargados:", mapped.length);
  }, [data]);

  useEffect(() => {
    if (!empresaId || items.length === 0) return;
    if (hasLoadedSeguimientos.current) return;

    const loadSeguimientos = async () => {
      setLoadingSeguimientos(true);
      try {
        const seguimientos = await fetchSeguimientos(empresaId);
        const seguimientosMap = seguimientos.reduce((acc, seg) => {
          acc[seg.control_id] = {
            estado_id: seg.estado_id,
            justificacion: seg.descripcion_justificacion || "",
            usuario_nombre: seg.usuarios?.nombre_usuario || "Desconocido",
            fecha_modificacion: seg.fecha_de_modificacion,
          };
          return acc;
        }, {});

        setItems((prevItems) =>
          prevItems.map((item) => {
            const seg = seguimientosMap[item.id];
            if (!seg) return item;
            const estadoObj = estados?.find(
              (e) => e.id_estado === seg.estado_id,
            );
            const estadoNombre = estadoObj?.nombre_del_estado;
            const status = STATUS_MAP[estadoNombre] || "not_started";
            return {
              ...item,
              status,
              justificacion: seg.justificacion,
              ultimoResponsable: seg.usuario_nombre,
              ultimaModificacion: seg.fecha_modificacion,
            };
          }),
        );
        hasLoadedSeguimientos.current = true;
        console.log("✅ Seguimientos aplicados");
      } catch (err) {
        console.warn("⚠️ Error cargando seguimientos:", err);
        hasLoadedSeguimientos.current = true; // No reintentar
      } finally {
        setLoadingSeguimientos(false);
      }
    };
    loadSeguimientos();
  }, [empresaId, items.length, estados, fetchSeguimientos]);

  // Catálogo de estados
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
      // Revertir
      const original = items.find((i) => i.id === id);
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

  const isLoading =
    loading ||
    (items.length === 0 && data?.length === 0) ||
    loadingSeguimientos;

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
    loading: isLoading,
    error,
    toggleExpand: (id) => setExpandedId((prev) => (prev === id ? null : id)),
    changeStatus,
    getHistorial,
  };
}
