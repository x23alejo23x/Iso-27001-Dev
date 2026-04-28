// Checklist/service/index.jsx
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { iso } from "../../../Server";

export function useChecklistService() {
  const [data, setData] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authState = useSelector((state) => state.login);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resControles, resEstados] = await Promise.all([
          fetch(`${iso}/api/controles`),
          fetch(`${iso}/api/catalog/estados`),
        ]);
        if (!resControles.ok || !resEstados.ok)
          throw new Error("Fallo en el servidor");
        const [controlesJson, estadosJson] = await Promise.all([
          resControles.json(),
          resEstados.json(),
        ]);
        setData(controlesJson);
        setEstados(estadosJson);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authState]);

  const fetchSeguimientos = useCallback(async (empresaId) => {
    const res = await fetch(`${iso}/api/seguimiento?empresa_id=${empresaId}`);
    if (!res.ok) throw new Error("Error al obtener seguimientos");
    return res.json();
  }, []);
  const fetchHistorial = useCallback(
    async (controlId) => {
      const empresaId = authState.user?.empresa_id;

      if (!empresaId) {
        throw new Error("No se pudo obtener el empresa_id");
      }

      const res = await fetch(
        `${iso}/api/seguimiento/historial/${controlId}?empresa_id=${empresaId}`,
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al obtener historial");
      }

      return res.json();
    },
    [authState],
  );
  const analizarDocumentoIA = useCallback(
    async (file, controlId) => {
      const empresaId = authState.user?.empresa_id;

      if (!empresaId) {
        throw new Error("No se pudo obtener el empresa_id");
      }

      const formData = new FormData();
      formData.append("empresa_id", empresaId);
      formData.append("control_id", controlId);
      formData.append("archivo", file);

      const response = await fetch(`${iso}/api/ia/analizar`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al analizar documento");
      }

      return response.json();
    },
    [authState],
  );

  const upsertSeguimiento = useCallback(
    async (controlId, estadoId, justificacion, url_evidencia) => {
      const empresaId = authState.user?.empresa_id;
      const quienActualizoId = authState.user?.id_usuario;
      const nombreResponsable = authState.user?.nombre_usuario;

      if (!empresaId || !quienActualizoId) {
        throw new Error(
          "No se pudo obtener información de la empresa o usuario",
        );
      }

      const payload = {
        empresa_id: empresaId,
        quien_actualizo_id: quienActualizoId,
        estado_id: estadoId,
        nombre_del_responsable: nombreResponsable,
        descripcion_justificacion: justificacion || "",
        url_evidencia: url_evidencia || "",
      };

      const response = await fetch(
        `${iso}/api/seguimiento/control/${controlId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el seguimiento");
      }
      return response.json();
    },
    [authState],
  );

  return {
    data,
    estados,
    loading,
    error,
    fetchSeguimientos,
    upsertSeguimiento,
    analizarDocumentoIA,
    fetchHistorial,
  };
}
