import { useState } from "react";
import { authService } from "../../service";

export function useRegistroForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nombre_comercial: "",
    codigo_unico_url: "",
    administradores: [
      { nombre_usuario: "", correo_electronico: "", password: "" },
      { nombre_usuario: "", correo_electronico: "", password: "" },
    ],
  });

  const handleEmpresaChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdminChange = (index, field, value) => {
    const nuevosAdmins = [...formData.administradores];
    nuevosAdmins[index][field] = value;
    setFormData({
      ...formData,
      administradores: nuevosAdmins,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validar contraseñas
    for (let i = 0; i < formData.administradores.length; i++) {
      const admin = formData.administradores[i];
      if (admin.password.length < 8 || !/\d/.test(admin.password)) {
        setError(
          `La contraseña del administrador ${i + 1} debe tener mínimo 8 caracteres y al menos 1 número`,
        );
        setIsLoading(false);
        return;
      }
    }

    try {
      const result = await authService.registrarEmpresa(formData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_comercial: "",
      codigo_unico_url: "",
      administradores: [
        { nombre_usuario: "", correo_electronico: "", password: "" },
        { nombre_usuario: "", correo_electronico: "", password: "" },
      ],
    });
    setError(null);
    setSuccess(false);
  };

  return {
    formData,
    isLoading,
    error,
    success,
    handleEmpresaChange,
    handleAdminChange,
    handleSubmit,
    resetForm,
  };
}
