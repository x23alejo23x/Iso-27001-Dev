import { motion } from "framer-motion";
import {
  Building,
  Globe,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { useRegistroForm } from "../useRegistroForm";

export default function RegistroView({ onSuccess, onLoginClick }) {
  const {
    formData,
    isLoading,
    error,
    success,
    handleEmpresaChange,
    handleAdminChange,
    handleSubmit,
    resetForm,
  } = useRegistroForm();

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-colors">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-50 dark:opacity-20 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 dark:opacity-20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              ¡Registro Exitoso!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              La empresa y los administradores han sido creados correctamente.
            </p>
            <button
              onClick={() => {
                resetForm();
                onLoginClick();
              }}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Ir al Inicio de Sesión
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-colors">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-50 dark:opacity-20 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 dark:opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
              <Building className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Crear Nueva Empresa
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
              Registra tu empresa y crea los 2 administradores
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos Empresa */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Datos de la Empresa
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  name="nombre_comercial"
                  value={formData.nombre_comercial}
                  onChange={handleEmpresaChange}
                  placeholder="Nombre Comercial"
                  required
                  className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl placeholder-slate-400 focus:bg-white focus:text-black focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
                />

                <input
                  type="text"
                  name="codigo_unico_url"
                  value={formData.codigo_unico_url}
                  onChange={handleEmpresaChange}
                  placeholder="Código URL"
                  required
                  className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl placeholder-slate-400 focus:bg-white focus:text-black focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Administradores */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Administradores
              </h3>

              <div className="space-y-6">
                {[0, 1].map((index) => (
                  <div key={index} className="p-4 bg-slate-800/30 rounded-xl">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={formData.administradores[index].nombre_usuario}
                      onChange={(e) =>
                        handleAdminChange(
                          index,
                          "nombre_usuario",
                          e.target.value,
                        )
                      }
                      className="w-full mb-3 px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl placeholder-slate-400 focus:bg-white focus:text-black transition"
                    />

                    <input
                      type="email"
                      placeholder="Correo"
                      value={formData.administradores[index].correo_electronico}
                      onChange={(e) =>
                        handleAdminChange(
                          index,
                          "correo_electronico",
                          e.target.value,
                        )
                      }
                      className="w-full mb-3 px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl placeholder-slate-400 focus:bg-white focus:text-black transition"
                    />

                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={formData.administradores[index].password}
                      onChange={(e) =>
                        handleAdminChange(index, "password", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl placeholder-slate-400 focus:bg-white focus:text-black transition"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onLoginClick}
                className="flex-1 px-4 py-2 border border-slate-700 rounded-xl text-white hover:bg-slate-800 transition"
              >
                Volver
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
              >
                {isLoading ? "Cargando..." : "Registrar"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
