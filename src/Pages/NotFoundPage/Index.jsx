import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 text-gray-700">
      <AlertTriangle className="text-orange-500 w-24 h-24 mb-6" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">La página que buscas no existe.</p>

      <button
        onClick={() => navigate("/")}
        className="px-3 py-2 bg-orange-500 text-white shadow-md hover:bg-orange-600 transition mt-6"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFoundPage;
