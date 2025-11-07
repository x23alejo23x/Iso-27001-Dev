import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton({ label = "Volver" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 🔙 Regresa a la vista anterior
  };

  return (
    <button
      onClick={handleBack}
      className="fixed bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-full shadow-lg hover:bg-gray-200 active:scale-95 transition-all"
      title="Regresar"
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  );
}

export default BackButton;
