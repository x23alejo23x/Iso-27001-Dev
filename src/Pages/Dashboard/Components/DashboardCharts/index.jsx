// src/components/Dashboard/DashboardCharts.jsx
import { motion } from "framer-motion";
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

const DashboardCharts = ({
  porDominioData,
  progresoData,
  avanceDepartamentoData,
}) => {
  // Transformar porDominioData para el radar chart (espera array con subject y A)
  const radarData = Object.entries(porDominioData || {}).map(
    ([domain, data]) => ({
      subject: domain,
      A: data.porcentaje || 0,
    }),
  );

  // Datos de progreso (últimos 30 días) - podrías obtenerlos de otro endpoint o generarlos
  // Por ahora, usamos datos mock pero puedes adaptar si tienes endpoint de histórico
  const lineData = progresoData || [];

  // Datos de avance por departamento (si no vienen del backend, podrías derivarlos de porDominio o mock)
  const barData = avanceDepartamentoData || [];

  return (
    <>
      {/* Radar Chart - Cumplimiento por Dominio */}
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
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
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

      {/* Line Chart - Progreso de Cumplimiento */}
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
          Evolución del porcentaje de cumplimiento
        </p>
        <div className="h-72 w-full text-slate-600 dark:text-slate-400">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
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
              />
              <YAxis
                tick={{ fill: "currentColor", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: 13,
                }}
                formatter={(v) => [`${v}%`, "Cumplimiento"]}
              />
              <Line
                type="monotone"
                dataKey="cumplimiento"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bar Chart - Avance por Departamento (o por dominio si no hay departamentos) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm overflow-hidden"
      >
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          Avance por Dominio
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Porcentaje de controles completados vs. pendientes por dominio
        </p>
        <div className="h-64 w-full text-slate-600 dark:text-slate-400">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
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
    </>
  );
};

export default DashboardCharts;
