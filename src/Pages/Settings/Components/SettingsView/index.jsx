import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { User, Moon, Key, Sun, Monitor, ChevronRight, X } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import { settingsService } from "../../service";

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        </div>
      </div>
      <div className="p-6 space-y-5 bg-slate-50/30 dark:bg-slate-950/20">
        {children}
      </div>
    </motion.div>
  );
}

const inputClassReadOnly =
  "w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed shadow-sm";

const inputClass =
  "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all text-slate-900 dark:text-slate-100 shadow-sm";

export default function SettingsView() {
  const { theme, setTheme } = useTheme();
  const authState = useSelector((state) => state.login);
  const user = authState.user;

  // Datos del usuario desde Redux
  const nombre_usuario = user?.nombre_usuario || "";
  const correo = user?.correo_electronico || "";
  const rol = user?.roles_de_usuario?.nombre_del_rol || "";
  const departamento = user?.departamento?.nombre_departamento || "No asignado";
  const iniciales = nombre_usuario
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Estado para modal de cambio de contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      alert("La contraseña debe tener mínimo 8 caracteres y al menos 1 número");
      return;
    }
    setLoading(true);
    try {
      await settingsService.cambiarPassword(
        user.id_usuario,
        oldPassword,
        newPassword,
      );
      alert("Contraseña actualizada correctamente");
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Configuración
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gestiona tus preferencias personales
        </p>
      </div>

      {/* Información Personal (solo lectura desde Redux) */}
      <SettingsSection
        icon={User}
        title="Mi Información"
        description="Datos de tu cuenta (solo consulta)"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {iniciales || "U"}
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={nombre_usuario}
                  className={inputClassReadOnly}
                  readOnly
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={correo}
                  className={inputClassReadOnly}
                  readOnly
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Rol
                </label>
                <input
                  type="text"
                  value={rol}
                  className={inputClassReadOnly}
                  readOnly
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Departamento
                </label>
                <input
                  type="text"
                  value={departamento}
                  className={inputClassReadOnly}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Apariencia */}
      {/* <SettingsSection
        icon={Moon}
        title="Apariencia"
        description="Personaliza el aspecto de la plataforma"
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", icon: Sun, label: "Claro" },
            { value: "dark", icon: Moon, label: "Oscuro" },
            { value: "system", icon: Monitor, label: "Sistema" },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === value
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </SettingsSection> */}

      {/* Seguridad - Cambiar contraseña */}
      <SettingsSection
        icon={Key}
        title="Seguridad"
        description="Configuración de acceso"
      >
        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
          >
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Cambiar contraseña
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Actualiza tu contraseña de acceso
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </button>
        </div>
      </SettingsSection>

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Cambiar Contraseña
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Mínimo 8 caracteres y al menos 1 número
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Actualizando..." : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
