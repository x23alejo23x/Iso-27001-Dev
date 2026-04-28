import { useState, useEffect } from "react";
import { Calendar, Save, X } from "lucide-react";
import { motion } from "framer-motion";

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "No definida";
  const fechaPart = fechaStr.split("T")[0];
  const [year, month, day] = fechaPart.split("-");
  return `${day}/${month}/${year}`;
};

const EmpresaFechasCard = ({ empresaId, empresaData, onUpdate }) => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (empresaData) {
      const inicio = empresaData.fecha_inicio
        ? empresaData.fecha_inicio.split("T")[0]
        : "";
      const fin = empresaData.fecha_fin
        ? empresaData.fecha_fin.split("T")[0]
        : "";
      setFechaInicio(inicio);
      setFechaFin(fin);
    }
  }, [empresaData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(empresaId, fechaInicio || null, fechaFin || null);
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (empresaData) {
      const inicio = empresaData.fecha_inicio
        ? empresaData.fecha_inicio.split("T")[0]
        : "";
      const fin = empresaData.fecha_fin
        ? empresaData.fecha_fin.split("T")[0]
        : "";
      setFechaInicio(inicio);
      setFechaFin(fin);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">
            Período de cumplimiento
          </h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Editar
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Fecha de inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Fecha de fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              <X className="w-3 h-3" /> Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              <Save className="w-3 h-3" />{" "}
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Inicio: </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {formatFecha(fechaInicio)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Fin: </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {formatFecha(fechaFin)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmpresaFechasCard;
