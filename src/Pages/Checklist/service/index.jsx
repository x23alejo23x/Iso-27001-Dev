import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Importante para leer de Redux
import { iso } from "../../../Server";

export function useChecklistService() {
  const [data, setData] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accedemos a la pieza 'login' del store de Redux
  const authState = useSelector((state) => state.login);

  useEffect(() => {
    // Aquí es donde lo pintamos en consola para verificar
    console.log("--- DATOS DESDE REDUX ---");
    console.log("Estado completo:", authState);
    console.log("Usuario logueado:", authState.user);
    console.log("ID Empresa:", authState.user?.empresa_id);
    console.log("-------------------------");

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
  }, [authState]); // Se dispara el log si el estado de Redux cambia

  return { data, estados, loading, error };
}
