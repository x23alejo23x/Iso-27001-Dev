import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import StatsCards from "../StatsCards";
import UserTable from "../UserTable";
import UserModal from "../UserModal";
import { useAdminService } from "../../service";

export default function AdminView() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const {
    loading,
    fetchRoles,
    fetchUsuarios,
    createUsuario,
    deleteUsuario,
    updateUsuario,
  } = useAdminService();

  const authState = useSelector((state) => state.login);

  const empresaNombre =
    authState?.user?.empresas?.nombre_comercial || "Sin empresa";

  const empresaId =
    authState?.user?.empresa_id || authState?.user?.empresas?.id_empresa;

  useEffect(() => {
    if (empresaId) {
      loadRoles();
      loadUsers();
    }
  }, [empresaId]);

  const loadRoles = async () => {
    try {
      const rolesData = await fetchRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await fetchUsuarios(empresaId);
      setUsers(usersData);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const handleCreateUser = async (payload) => {
    try {
      await createUsuario(payload);
      await loadUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert(error.message);
    }
  };

  const handleUpdateUser = async (payload) => {
    try {
      await updateUsuario(editingUser.id_usuario, payload);
      await loadUsers();
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await deleteUsuario(userId);
        await loadUsers();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert(error.message);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = (payload) => {
    if (editingUser) {
      handleUpdateUser(payload);
    } else {
      handleCreateUser(payload);
    }
  };

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
          <p className="text-xs text-blue-400 mt-2">Empresa: {empresaNombre}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm w-fit"
        >
          <UserPlus className="w-4 h-4" />
          Invitar Usuario
        </motion.button>
      </div>

      <StatsCards users={users} roles={roles} />

      <UserTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        loading={loading}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        userToEdit={editingUser}
        roles={roles}
        empresaId={empresaId}
        empresaNombre={empresaNombre}
      />
    </div>
  );
}
