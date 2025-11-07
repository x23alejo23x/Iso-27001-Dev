import { useEffect, useState } from "react";
import reactLogo from "@/assets/svg/react.svg";
import tailwindLogo from "@/assets/svg/tailwind.svg";

function home_component() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 100;
      const y = (e.clientY / innerHeight) * 100;
      setPos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-gray-800">
      <div className="flex items-center gap-16 mb-12">
        <img
          src={reactLogo}
          alt="React Logo"
          className="w-28 h-28 animate-[float_6s_ease-in-out_infinite] [transform-style:preserve-3d] hover:rotate-y-180 hover:rotate-x-6 transition-transform duration-700"
        />
        <img
          src={tailwindLogo}
          alt="Tailwind Logo"
          className="w-28 h-28 animate-[float_6s_ease-in-out_infinite] [transform-style:preserve-3d] hover:-rotate-y-180 hover:-rotate-x-6 transition-transform duration-700"
        />
      </div>
      <main className="[perspective:1000px]">
        <div className="relative w-80 h-52 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-2xl transform transition-transform duration-500 hover:rotate-y-12 hover:-rotate-x-6 hover:scale-105 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Plantilla de React
          </h2>
        </div>
      </main>

      <footer className="mt-16 text-gray-300 text-sm text-center">
        <span className="font-semibold text-cyan-400">React</span>,{" "}
        <span className="font-semibold text-blue-400">TailwindCSS</span> y{" "}
        <span className="font-semibold text-yellow-400">Vite</span>.
      </footer>
    </div>
  );
}

export default home_component;
