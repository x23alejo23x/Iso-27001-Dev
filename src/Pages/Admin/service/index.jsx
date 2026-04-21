// Admin/service/index.jsx
import { useCallback, useState } from "react";
import { iso } from "../../../Server";

export function useAdminService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${iso}/api/catalog/roles`);
      if (!res.ok) throw new Error("Error al obtener roles");
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsuarios = useCallback(async (empresaId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${iso}/api/admin/Lista-usuarios?empresa_id=${empresaId}`,
      );
      if (!res.ok) throw new Error("Error al obtener usuarios");
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDepartamentos = useCallback(async (empresaId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${iso}/api/admin/departamentos?empresa_id=${empresaId}`,
      );
      if (!res.ok) throw new Error("Error al obtener departamentos");
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUsuario = useCallback(async (body) => {
    try {
      setLoading(true);
      const res = await fetch(`${iso}/api/admin/Crear-usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear usuario");
      }
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUsuario = useCallback(async (usuarioId, empresaId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${iso}/api/admin/usuarios/${usuarioId}?empresa_id=${empresaId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Error al eliminar usuario");
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUsuario = useCallback(async (usuarioId, body) => {
    try {
      setLoading(true);
      const res = await fetch(`${iso}/api/admin/usuarios/${usuarioId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al actualizar usuario");
      }
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDepartamento = useCallback(async (body) => {
    try {
      setLoading(true);
      const res = await fetch(`${iso}/api/admin/departamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear departamento");
      }
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDepartamento = useCallback(async (departamentoId, empresaId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${iso}/api/admin/departamentos/${departamentoId}?empresa_id=${empresaId}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al eliminar departamento");
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
    fetchRoles,
    fetchUsuarios,
    createUsuario,
    deleteUsuario,
    updateUsuario,
    fetchDepartamentos,
    createDepartamento,
    deleteDepartamento,
  };
}
