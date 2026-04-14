import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Lock, Shield, Building } from "lucide-react";
import { useSelector } from "react-redux";

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  userToEdit,
  roles,
  empresaId,
}) {
  // ✅ Redux correctamente usado
  const authState = useSelector((state) => state.login);

  const empresaNombre =
    authState?.user?.empresas?.nombre_comercial || "Sin empresa";

  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    contrasena_encriptada: "",
    rol_id: "",
    empresa_id: empresaId || "",
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        nombre_usuario: userToEdit.nombre_usuario || "",
        correo_electronico: userToEdit.correo_electronico || "",
        contrasena_encriptada: "",
        rol_id: userToEdit.rol_id || "",
        empresa_id: userToEdit.empresa_id || empresaId || "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        empresa_id: empresaId || "",
      }));
    }
  }, [userToEdit, empresaId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre_usuario) {
      alert("Por favor ingresa el nombre del usuario");
      return;
    }
    if (!formData.correo_electronico) {
      alert("Por favor ingresa el correo electrónico");
      return;
    }
    if (!userToEdit && !formData.contrasena_encriptada) {
      alert("Por favor ingresa una contraseña");
      return;
    }
    if (!formData.rol_id) {
      alert("Por favor selecciona un rol");
      return;
    }
    if (!formData.empresa_id) {
      alert("Error: No se encontró el ID de la empresa");
      return;
    }

    const payload = {
      nombre_usuario: formData.nombre_usuario,
      correo_electronico: formData.correo_electronico,
      rol_id: Number(formData.rol_id),
      empresa_id: formData.empresa_id,
    };

    if (!userToEdit) {
      payload.password = formData.contrasena_encriptada;
    }
    onSubmit(payload);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const rolesList = Array.isArray(roles) ? roles : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {userToEdit ? "Editar Usuario" : "Crear Usuario"}
                </h3>
                <button onClick={onClose}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 🔥 AQUÍ ESTÁ TU VISTA CON EMPRESA */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-xl">
                  <label className="block text-sm font-medium text-indigo-700 mb-1">
                    <Building className="w-4 h-4 inline mr-2" />
                    Empresa
                  </label>

                  <p className="text-sm font-medium">
                    {empresaNombre || "Cargando..."}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre_usuario"
                    value={formData.nombre_usuario}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    required
                    autoComplete="off"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="correo_electronico"
                    value={formData.correo_electronico}
                    onChange={handleChange}
                    placeholder="ejemplo@empresa.com"
                    required
                    autoComplete="off"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {!userToEdit && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Contraseña
                    </label>
                    <input
                      type="password"
                      name="contrasena_encriptada"
                      value={formData.contrasena_encriptada}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      required={!userToEdit}
                      autoComplete="new-password"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Rol
                  </label>
                  <select
                    name="rol_id"
                    value={formData.rol_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Seleccionar rol</option>
                    {rolesList.length > 0 ? (
                      rolesList.map((role) => (
                        <option key={role.id_rol} value={role.id_rol}>
                          {role.nombre_del_rol}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Cargando roles...
                      </option>
                    )}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={rolesList.length === 0 || !empresaId}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {userToEdit ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
