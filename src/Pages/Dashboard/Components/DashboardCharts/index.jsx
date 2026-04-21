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
  const radarData = Object.entries(porDominioData || {}).map(
    ([domain, data]) => ({
      subject: domain,
      A: data.porcentaje || 0,
    }),
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
      >
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          Madurez por Dominio
        </h3>
        <div className="h-72 w-full text-slate-600 dark:text-slate-400">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="currentColor" strokeOpacity={0.15} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "currentColor", fontSize: 10 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "currentColor", fontSize: 10 }}
              />
              <Radar
                name="Cumplimiento %"
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
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
      >
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          Evolución vs Meta
        </h3>
        <div className="h-72 w-full text-slate-600 dark:text-slate-400">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progresoData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                strokeOpacity={0.1}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "currentColor", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
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
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                name="Meta Ideal"
                type="monotone"
                dataKey="meta"
                stroke="#94a3b8"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                name="Real"
                type="monotone"
                dataKey="cumplimiento"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4, fill: "#4f46e5" }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
};

export default DashboardCharts;
