// Admin/Components/AdminView/index.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserPlus, Building2 } from "lucide-react"; // ícono adicional
import { motion } from "framer-motion";
import StatsCards from "../StatsCards";
import UserTable from "../UserTable";
import UserModal from "../UserModal";
import EmpresaFechasCard from "../EmpresaFechasCard";
import DepartamentoModal from "../DepartamentoModal";
import { usePermissions } from "../../../../hooks/usePermissions";
import { useAdminService } from "../../service";

export default function AdminView() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeptoModalOpen, setIsDeptoModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const permissions = usePermissions();
  const [empresa, setEmpresa] = useState(null);
  const {
    loading,
    fetchRoles,
    fetchUsuarios,
    fetchDepartamentos,
    createUsuario,
    deleteUsuario,
    updateUsuario,
    createDepartamento,
    deleteDepartamento,
    fetchEmpresa,
    updateEmpresaFechas,
  } = useAdminService();
  const authState = useSelector((state) => state.login);
  const empresaId = authState.user?.empresa_id;

  useEffect(() => {
    if (empresaId) {
      loadRoles();
      loadUsers();
      loadDepartamentos();
      loadEmpresa();
    }
  }, [empresaId]);

  const loadEmpresa = async () => {
    try {
      const data = await fetchEmpresa(empresaId);
      setEmpresa(data);
    } catch (error) {
      console.error("Error al cargar empresa:", error);
    }
  };

  const handleUpdateFechas = async (id, inicio, fin) => {
    const updated = await updateEmpresaFechas(id, inicio, fin);
    setEmpresa(updated);
  };
  const loadRoles = async () => {
    try {
      const rolesData = await fetchRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  const loadDepartamentos = async () => {
    try {
      const deptos = await fetchDepartamentos(empresaId);
      setDepartamentos(deptos);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
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

  // Manejadores de usuario (igual que antes)
  const handleCreateUser = async (userData) => {
    try {
      const newUser = {
        nombre_usuario: userData.nombre_usuario,
        correo_electronico: userData.correo_electronico,
        password: userData.password,
        empresa_id: empresaId,
        rol_id: parseInt(userData.rol_id),
        departamento_id: userData.departamento_id || null,
      };
      await createUsuario(newUser);
      await loadUsers();
      setIsModalOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const updatedUser = {
        nombre_usuario: userData.nombre_usuario,
        correo_electronico: userData.correo_electronico,
        rol_id: parseInt(userData.rol_id),
        departamento_id: userData.departamento_id || null,
        empresa_id: empresaId,
      };
      await updateUsuario(editingUser.id_usuario, updatedUser);
      await loadUsers();
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteUser = async (usuarioId) => {
    if (window.confirm("¿Eliminar este usuario?")) {
      try {
        await deleteUsuario(usuarioId, empresaId);
        await loadUsers();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (editingUser) {
      handleUpdateUser(formData);
    } else {
      handleCreateUser(formData);
    }
  };

  // Manejadores de departamentos
  const handleCreateDepartamento = async (data) => {
    await createDepartamento(data);
    await loadDepartamentos(); // refrescar lista
  };

  const handleDeleteDepartamento = async (id, empresaId) => {
    await deleteDepartamento(id, empresaId);
    await loadDepartamentos();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Administración
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gestiona usuarios, roles y departamentos
          </p>
        </div>
        <div className="flex gap-3">
          {permissions.canManageDepartments && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDeptoModalOpen(true)}
              className="flex items-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium"
            >
              <Building2 className="w-4 h-4" />
              Departamentos
            </motion.button>
          )}
          {permissions.canCreateUser && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenModal}
              className="flex items-center gap-2 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Invitar Usuario
            </motion.button>
          )}
        </div>
      </div>

      <StatsCards users={users} roles={roles} />
      <UserTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        loading={loading}
      />
      {/* Tarjeta de fechas */}
      {empresa && (
        <EmpresaFechasCard
          empresaId={empresaId}
          empresaData={empresa}
          onUpdate={handleUpdateFechas}
        />
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        userToEdit={editingUser}
        roles={roles}
        departamentos={departamentos}
        empresaId={empresaId}
      />

      <DepartamentoModal
        isOpen={isDeptoModalOpen}
        onClose={() => setIsDeptoModalOpen(false)}
        departamentos={departamentos}
        onCreateDepartamento={handleCreateDepartamento}
        onDeleteDepartamento={handleDeleteDepartamento}
        empresaId={empresaId}
        loading={loading}
      />
    </div>
  );
}
