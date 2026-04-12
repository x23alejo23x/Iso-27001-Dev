import { useState, useEffect } from "react";
import { iso } from "../../../Server";

export function useChecklistService() {
  const [data, setData] = useState([]); 
  const [estados, setEstados] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resControles, resEstados] = await Promise.all([
          fetch(`${iso}/api/controles`),
          fetch(`${iso}/api/catalog/estados`)
        ]);

        if (!resControles.ok || !resEstados.ok) throw new Error("Fallo en el servidor");

        const [controlesJson, estadosJson] = await Promise.all([
          resControles.json(),
          resEstados.json()
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
  }, []);

  return { data, estados, loading, error };
}