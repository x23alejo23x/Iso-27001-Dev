// Admin/Components/DepartamentoModal/index.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building, Trash2, Plus } from "lucide-react";

export default function DepartamentoModal({
  isOpen,
  onClose,
  departamentos,
  onCreateDepartamento,
  onDeleteDepartamento,
  empresaId,
  loading,
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert("El nombre del departamento es requerido");
      return;
    }
    setIsCreating(true);
    try {
      await onCreateDepartamento({
        empresa_id: empresaId,
        nombre_departamento: nombre,
        descripcion: descripcion || null,
      });
      setNombre("");
      setDescripcion("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id, nombreDepto) => {
    if (
      window.confirm(
        `¿Eliminar el departamento "${nombreDepto}"? Los usuarios quedarán sin departamento asignado.`,
      )
    ) {
      try {
        await onDeleteDepartamento(id, empresaId);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Gestionar Departamentos
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-slate-900 dark:text-slate-100">
                {/* Formulario de creación */}
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nuevo Departamento
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Marketing"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Descripción (opcional)"
                      rows="2"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      disabled={isCreating}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreating || !nombre.trim()}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium disabled:opacity-50"
                  >
                    {isCreating ? (
                      "Creando..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Crear Departamento
                      </>
                    )}
                  </button>
                </form>

                {/* Lista de departamentos existentes */}
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                    Departamentos actuales
                  </h4>

                  {departamentos.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No hay departamentos creados.
                    </p>
                  ) : (
                    <ul className="space-y-2 max-h-60 overflow-y-auto border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {" "}
                      {departamentos.map((depto) => (
                        <li
                          key={depto.id_departamento}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {depto.nombre_departamento}
                            </p>
                            {depto.descripcion && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {depto.descripcion}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              handleDelete(
                                depto.id_departamento,
                                depto.nombre_departamento,
                              )
                            }
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                            title="Eliminar departamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
