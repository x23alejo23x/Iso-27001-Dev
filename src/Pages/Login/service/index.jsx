import { iso } from "../../../Server";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${iso}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  registrarEmpresa: async (datosRegistro) => {
    try {
      const response = await fetch(`${iso}/api/auth/registrar-empresa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(datosRegistro),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrar empresa");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};
