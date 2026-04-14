import { useCallback, useState } from "react";
import { iso } from "../../../Server";

export function useAdminService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 GET roles
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${iso}/api/catalog/roles`);

      if (!res.ok) throw new Error("Error al obtener roles");

      const data = await res.json();

      return data;
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

      const data = await res.json();
      return data; // Retornar los datos tal como vienen de la API
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 POST crear usuario
  const createUsuario = useCallback(async (body) => {
    try {
      setLoading(true);
      const res = await fetch(`${iso}/api/admin/Crear-usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  // 🔹 DELETE usuario (si lo necesitas)
  const deleteUsuario = useCallback(async (usuarioId) => {
    try {
      setLoading(true);
      const res = await fetch(`${iso}/api/admin/usuarios/${usuarioId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar usuario");

      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 PUT actualizar usuario
  const updateUsuario = useCallback(async (usuarioId, body) => {
    try {
      setLoading(true);
      const res = await fetch(`${iso}/api/admin/usuarios/${usuarioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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

  return {
    loading,
    error,
    fetchRoles,
    fetchUsuarios,
    createUsuario,
    deleteUsuario,
    updateUsuario,
  };
}
