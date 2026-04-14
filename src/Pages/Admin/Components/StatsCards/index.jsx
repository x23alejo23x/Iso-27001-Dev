import { motion } from "framer-motion";
import { Users, Shield, Eye } from "lucide-react";

export default function StatsCards({ users = [], roles = [] }) {
  // Calcular estadísticas
  const totalUsers = users.length;

  const adminCount = users.filter(
    (user) =>
      user.roles_de_usuario?.nombre_del_rol === "Administrador" ||
      user.rol_nombre === "Administrador",
  ).length;

  const auditorCount = users.filter(
    (user) =>
      user.roles_de_usuario?.nombre_del_rol === "Auditor" ||
      user.rol_nombre === "Auditor",
  ).length;

  const stats = [
    {
      title: "Total Usuarios",
      value: totalUsers,
      icon: <Users className="w-6 h-6" />,
      color:
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
      textColor: "text-white",
      iconBg: "bg-white/20",
    },
    {
      title: "Administradores",
      value: adminCount,
      icon: <Shield className="w-6 h-6" />,
      color:
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
      textColor: "text-slate-900 dark:text-white",
      iconBg:
        "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Auditores",
      value: auditorCount,
      icon: <Eye className="w-6 h-6" />,
      color:
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
      textColor: "text-slate-900 dark:text-white",
      iconBg:
        "bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`rounded-2xl p-5 shadow-sm ${stat.color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${stat.title === "Total Usuarios" ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"}`}
              >
                {stat.title}
              </p>
              <p className={`text-3xl font-bold mt-1 ${stat.textColor}`}>
                {stat.value}
              </p>
              <p
                className={`text-xs mt-2 ${stat.title === "Total Usuarios" ? "text-indigo-200" : "text-slate-400"}`}
              >
                {stat.value === 1 ? "usuario" : "usuarios"}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${stat.iconBg}`}>{stat.icon}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
