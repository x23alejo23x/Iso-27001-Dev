import { useState } from "react";
import { GateWay } from "../Server";

export const useApi = (baseUrl = GateWay) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (endpoint, { method = "GET", token, body } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {};
      let dataBody = body;

      if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        headers["x-api-key"] = "david";
        dataBody = body ? JSON.stringify(body) : undefined;
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers,
        body: dataBody,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return true;
    } catch (err) {
      console.error("Error en la API:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error };
};
