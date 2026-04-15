import { motion } from "framer-motion";
import { Mail, Settings2, Trash2, Search, Users } from "lucide-react";
import { useState } from "react";

function getInitials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function getAvatarColor(name) {
  const colors = [
    "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
    "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
    "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
    "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  ];
  return colors[name?.charCodeAt(0) % colors.length] || colors[0];
}

function getRoleBadgeColor(roleName) {
  if (roleName === "Administrador" || roleName === "Admin") {
    return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30";
  } else if (roleName === "Auditor") {
    return "bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30";
  }
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
}

function getStatusBadgeColor(status) {
  if (status === "Activo" || status === "Active") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
  } else if (status === "Pendiente" || status === "Pending") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30";
  }
  return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
}

export default function UserTable({ users = [], onEdit, onDelete, loading }) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.nombre_usuario?.toLowerCase().includes(search.toLowerCase()) ||
      user.correo_electronico?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = ["Usuario", "Rol", "Fecha Registro", "Acciones"];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* HEADER */}
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
              {users.length} usuarios en total
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

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
              {columns.map((h) => (
                <th
                  key={h}
                  className={`py-3.5 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
                    h === "Acciones" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    Cargando usuarios...
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, i) => (
                <motion.tr
                  key={user.id_usuario || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors"
                >
                  {/* Usuario */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm ${getAvatarColor(
                          user.nombre_usuario,
                        )}`}
                      >
                        {getInitials(user.nombre_usuario)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white text-sm">
                          {user.nombre_usuario}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.correo_electronico}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rol */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                        user.roles_de_usuario?.nombre_del_rol,
                      )}`}
                    >
                      {user.roles_de_usuario?.nombre_del_rol || "Sin rol"}
                    </span>
                  </td>

                  {/* Estado */}
                  {/* <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                        "Activo",
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Activo
                    </span>
                  </td> */}

                  {/* Fecha */}
                  <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(user.fecha_registro).toLocaleDateString()}
                  </td>

                  {/* Acciones */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(user.id_usuario)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
