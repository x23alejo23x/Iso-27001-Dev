import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorClass,
  bg,
  onClick,
}) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all group ${onClick ? "cursor-pointer" : ""}`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 dark:opacity-20 -mr-8 -mt-8 ${bg}`}
      />
      <div className="flex justify-between items-start relative">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend >= 0
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400"
            }`}
          >
            <TrendingUp
              className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`}
            />
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </span>
        </div>
        {onClick && (
          <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </motion.div>
  );
}
