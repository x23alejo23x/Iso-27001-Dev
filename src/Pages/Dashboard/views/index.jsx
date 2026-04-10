import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Activity,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  MOCK_RADAR_DATA,
  MOCK_BAR_DATA,
  MOCK_LINE_DATA,
  RECENT_ACTIVITY,
} from "../../../data/mock";
import StatCard from "../StatCard";

export default function DashboardView() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Resumen Ejecutivo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Nivel de madurez y cumplimiento de la norma ISO 27001 · TechCorp
            Solutions
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-indigo-500" />
          Actualizado hace 1 hora
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Madurez General"
          value="68%"
          subtitle="vs. mes anterior"
          icon={Shield}
          trend={12}
          colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
          bg="bg-indigo-500"
          onClick={() => navigate("/checklist")}
        />
        <StatCard
          title="Controles Completados"
          value="10/18"
          subtitle="implementados"
          icon={CheckCircle2}
          trend={5}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
          bg="bg-emerald-500"
          onClick={() => navigate("/checklist")}
        />
        <StatCard
          title="Controles Pendientes"
          value="8"
          subtitle="requieren atención"
          icon={AlertCircle}
          trend={-3}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
          bg="bg-amber-500"
          onClick={() => navigate("/checklist")}
        />
        <StatCard
          title="Avance del Proyecto"
          value="Día 45"
          subtitle="de 180 días estimados"
          icon={Activity}
          trend={25}
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
          bg="bg-blue-500"
          onClick={() => navigate("/checklist")}
        />
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Progreso hacia la certificación
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Fase 2 de 4 · Implementación de controles
            </p>
          </div>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            25%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "25%" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-3 text-xs text-slate-400 dark:text-slate-500">
          <span>Planificación ✓</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            Implementación ◉
          </span>
          <span>Auditoría interna</span>
          <span>Certificación</span>
        </div>
      </motion.div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Cumplimiento por Dominio
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Nivel de madurez en cada área ISO 27001
          </p>
          <div className="h-72 w-full text-slate-600 dark:text-slate-400">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={MOCK_RADAR_DATA}
              >
                <PolarGrid stroke="currentColor" strokeOpacity={0.15} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "currentColor", fontSize: 12, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "currentColor", fontSize: 10 }}
                />
                <Radar
                  name="Madurez"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: 13,
                  }}
                  formatter={(v) => [`${v}%`, "Madurez"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Progreso de Cumplimiento
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Últimos 30 días vs. objetivo
          </p>
          <div className="h-72 w-full text-slate-600 dark:text-slate-400">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={MOCK_LINE_DATA}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[30, 80]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: 13,
                  }}
                  formatter={(v, name) => [
                    `${v}%`,
                    name === "compliance" ? "Cumplimiento" : "Objetivo",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="compliance"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, fill: "#4f46e5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm overflow-hidden"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Avance por Departamento
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Porcentaje de controles completados vs. pendientes
          </p>
          <div className="h-64 w-full text-slate-600 dark:text-slate-400">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_BAR_DATA}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                barSize={28}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: 13,
                  }}
                  formatter={(v, name) => [
                    `${v}%`,
                    name === "completed" ? "Completado" : "Pendiente",
                  ]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) =>
                    v === "completed" ? "Completado" : "Pendiente"
                  }
                />
                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill="#10b981"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill="#e2e8f0"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Actividad Reciente
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Últimas actualizaciones del equipo
          </p>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {item.action}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {item.item}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-slate-400">
                      {item.user}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/checklist")}
            className="mt-5 w-full text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center justify-center gap-1 transition-colors"
          >
            Ver todos los controles <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
