import { iso } from "../../../Server";

export const settingsService = {
  cambiarPassword: async (userId, passwordActual, passwordNueva) => {
    const res = await fetch(`${iso}/api/auth/cambiar-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, passwordActual, passwordNueva }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al cambiar contraseña");
    }

    return res.json();
  },
};
