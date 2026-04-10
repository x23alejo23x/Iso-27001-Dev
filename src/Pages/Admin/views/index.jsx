import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Settings2, Trash2, Mail, Search } from "lucide-react";

const USERS = [
  {
    id: 1,
    name: "Ana García",
    email: "ana@empresa.com",
    role: "Admin",
    status: "Active",
    department: "Dirección",
    lastActive: "Hace 2h",
  },
  {
    id: 2,
    name: "Carlos López",
    email: "carlos@empresa.com",
    role: "Usuario Estándar",
    status: "Active",
    department: "TI",
    lastActive: "Hace 1d",
  },
  {
    id: 3,
    name: "María Rodríguez",
    email: "maria@empresa.com",
    role: "Usuario Estándar",
    status: "Pending",
    department: "RRHH",
    lastActive: "Nunca",
  },
  {
    id: 4,
    name: "Jorge Martínez",
    email: "jorge@empresa.com",
    role: "Auditor",
    status: "Active",
    department: "Auditoría",
    lastActive: "Hace 3h",
  },
  {
    id: 5,
    name: "Sofía Torres",
    email: "sofia@empresa.com",
    role: "Usuario Estándar",
    status: "Inactive",
    department: "Finanzas",
    lastActive: "Hace 15d",
  },
];

const ROLES = [
  {
    name: "Admin",
    desc: "Acceso total a la plataforma",
    count: 1,
    color:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30",
  },
  {
    name: "Auditor",
    desc: "Solo lectura en todos los controles",
    count: 1,
    color:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30",
  },
  {
    name: "Usuario Estándar",
    desc: "Gestión de controles asignados",
    count: 3,
    color:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(name) {
  const colors = [
    "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
    "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
    "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
    "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function AdminView() {
  const [search, setSearch] = useState("");

  const filtered = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Administración
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gestiona usuarios, roles y permisos de la plataforma
          </p>
        </div>
        <button className="flex items-center gap-2 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm w-fit">
          <UserPlus className="w-4 h-4" />
          Invitar Usuario
        </button>
      </div>

      {/* Roles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ROLES.map((role) => (
          <div
            key={role.name}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm"
          >
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${role.color}`}
              >
                {role.name}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {role.desc}
              </p>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {role.count}
            </div>
          </div>
        ))}
      </div>

      {/* Tabla usuarios */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Directorio de Usuarios
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {USERS.length} usuarios en total
              </p>
            </div>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuarios..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
                {[
                  "Usuario",
                  "Departamento",
                  "Rol",
                  "Estado",
                  "Última actividad",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className={`py-3.5 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${h === "Acciones" ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm ${getAvatarColor(user.name)}`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white text-sm">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    {user.department}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.role === "Admin"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30"
                          : user.role === "Auditor"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                          : user.status === "Pending"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : user.status === "Pending" ? "bg-amber-500" : "bg-slate-400"}`}
                      />
                      {user.status === "Active"
                        ? "Activo"
                        : user.status === "Pending"
                          ? "Pendiente"
                          : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                    {user.lastActive}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Settings2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
