// src/services/Dashboard/service/index.jsx
import { useCallback, useState } from "react";
import { iso } from "../../../Server";

export function useDashboardService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener métricas generales de cumplimiento
   * @param {string} empresaId - UUID de la empresa
   * @returns {Promise<Object>} Metricas
   */
  const fetchMetricas = useCallback(async (empresaId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${iso}/api/dashboard/metricas?empresa_id=${empresaId}`,
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al obtener métricas");
      }
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener análisis de brechas (controles no cumplidos y sin iniciar)
   * @param {string} empresaId - UUID de la empresa
   * @returns {Promise<Object>} Gap analysis
   */
  const fetchGapAnalysis = useCallback(async (empresaId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${iso}/api/dashboard/gap-analysis?empresa_id=${empresaId}`,
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al obtener brechas");
      }
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener cumplimiento agregado por dominio
   * @param {string} empresaId - UUID de la empresa
   * @returns {Promise<Object>} Datos por dominio
   */
  const fetchPorDominio = useCallback(async (empresaId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${iso}/api/dashboard/por-dominio?empresa_id=${empresaId}`,
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          errData.message || "Error al obtener datos por dominio",
        );
      }
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchMetricas,
    fetchGapAnalysis,
    fetchPorDominio,
  };
}
