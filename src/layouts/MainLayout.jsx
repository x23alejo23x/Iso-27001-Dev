import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  Users,
  LogOut,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../Hooks/useUserPermissions.jsx";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: CheckSquare, label: "Checklist", href: "/checklist" },
  {
    icon: Users,
    label: "Administración",
    href: "/admin",
    permission: "viewAdmin",
  },
  { icon: Settings, label: "Configuración", href: "/settings" },
];

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return permissions[item.permission];
  });

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl flex flex-col transition-colors z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            SecurePath
          </span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 flex flex-col gap-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />
                )}
                <item.icon
                  className={`w-5 h-5 ${isActive ? "" : "opacity-70"}`}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 opacity-70" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

function Header() {
  const user = useSelector((state) => state.login.user);
  const { theme, toggleTheme } = useTheme();
  const usuario = user?.nombre_usuario;

  const getInitials = (nombre) => {
    if (!nombre) return "AG";
    return nombre
      .split(" ")
      .filter((p) => p.length > 0)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  };

  const initials = getInitials(usuario);

  return (
    <header className="h-16 sticky top-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 w-full transition-colors">
      <div className="flex-1 max-w-xl">
        {/* Espacio para búsqueda si quieres agregarla después */}
      </div>

      <div className="flex items-center gap-4">
        {/* Botón de tema */}
        <button
          onClick={toggleTheme}
          className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm text-slate-900 dark:text-white font-medium">
              {usuario}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {user?.roles_de_usuario?.nombre_del_rol || "Usuario"}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
              {initials}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 w-full">
        <Header />
        <main className="flex-1 p-5 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
