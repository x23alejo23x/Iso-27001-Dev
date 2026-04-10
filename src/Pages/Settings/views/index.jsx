import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building,
  Moon,
  Bell,
  Key,
  Sun,
  Monitor,
  Save,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import Toggle from "../../../components/ui/Toggle";

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

const inputClass =
  "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all text-slate-900 dark:text-slate-100 shadow-sm";

export default function SettingsView() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: true,
    alerts: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleNotif = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Configuración
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gestiona las preferencias de tu cuenta y la plataforma
        </p>
      </div>

      {/* Perfil */}
      <SettingsSection
        icon={User}
        title="Perfil Personal"
        description="Información básica de tu cuenta"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm group cursor-pointer overflow-hidden">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                AG
              </span>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <span className="text-xs font-medium text-white">Editar</span>
              </div>
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
                  defaultValue="Ana García"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  defaultValue="ana@empresa.com"
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-400 cursor-not-allowed shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Cargo
                </label>
                <input type="text" defaultValue="CISO" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Departamento
                </label>
                <input
                  type="text"
                  defaultValue="Dirección"
                  className={inputClass}
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              {saved ? "¡Guardado!" : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Workspace */}
      <SettingsSection
        icon={Building}
        title="Espacio de Trabajo"
        description="Configuración global para la empresa"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Nombre de la Empresa
            </label>
            <input
              type="text"
              defaultValue="TechCorp Solutions"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Sector Industrial
            </label>
            <select className={inputClass + " appearance-none"}>
              <option>Tecnología y Software</option>
              <option>Finanzas</option>
              <option>Salud</option>
              <option>Manufactura</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Fecha objetivo certificación
            </label>
            <input
              type="date"
              defaultValue="2025-06-30"
              className={inputClass}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Apariencia */}
      <SettingsSection
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
      </SettingsSection>

      {/* Notificaciones */}
      <SettingsSection
        icon={Bell}
        title="Notificaciones"
        description="Controla cuándo y cómo recibes alertas"
      >
        <div className="space-y-4">
          {[
            {
              key: "email",
              label: "Notificaciones por email",
              desc: "Actualizaciones diarias del estado de controles",
            },
            {
              key: "push",
              label: "Notificaciones push",
              desc: "Alertas instantáneas en el navegador",
            },
            {
              key: "weekly",
              label: "Reporte semanal",
              desc: "Resumen ejecutivo cada lunes",
            },
            {
              key: "alerts",
              label: "Alertas críticas",
              desc: "Solo cuando se detectan incidentes de seguridad",
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {desc}
                </p>
              </div>
              <Toggle
                checked={notifications[key]}
                onChange={() => toggleNotif(key)}
              />
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Seguridad */}
      <SettingsSection
        icon={Key}
        title="Seguridad"
        description="Configuración de acceso y autenticación"
      >
        <div className="space-y-3">
          {[
            {
              label: "Cambiar contraseña",
              desc: "Actualiza tu contraseña de acceso",
            },
            {
              label: "Autenticación de dos factores",
              desc: "MFA para mayor seguridad — No configurado",
            },
            { label: "Sesiones activas", desc: "1 sesión activa actualmente" },
          ].map(({ label, desc }) => (
            <button
              key={label}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {desc}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
