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
        throw new Error("Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};
