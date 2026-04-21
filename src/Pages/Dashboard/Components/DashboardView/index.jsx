import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Activity,
  Clock,
} from "lucide-react";
import { useDashboardService } from "../../service";
import StatCard from "../StatCard";
import DashboardCharts from "../DashboardCharts";

export default function DashboardView() {
  const navigate = useNavigate();
  const { loading, fetchMetricas, fetchPorDominio, fetchCumplidos } =
    useDashboardService();

  const [metricas, setMetricas] = useState(null);
  const [porDominio, setPorDominio] = useState(null);
  const [progresoData, setProgresoData] = useState([]);

  const authState = useSelector((state) => state.login);
  const empresaId = authState.user?.empresa_id;

  const fechaInicio =
    authState.user?.empresa?.fecha_inicio ||
    authState.user?.empresas?.fecha_inicio;

  const fechaFin =
    authState.user?.empresa?.fecha_fin || authState.user?.empresas?.fecha_fin;

  const procesarCumplidosParaLinea = (
    cumplidos,
    totalControles,
    inicio,
    fin,
  ) => {
    if (!inicio || !fin || !totalControles) return [];

    const fInicio = new Date(inicio);
    const fFin = new Date(fin);
    const hoy = new Date();

    if (isNaN(fInicio) || isNaN(fFin)) return [];

    const totalDias = (fFin - fInicio) / (1000 * 60 * 60 * 24);

    const grupos = new Map();

    cumplidos?.forEach((c) => {
      const key = new Date(c.fecha).toISOString().slice(0, 7);
      grupos.set(key, (grupos.get(key) || 0) + 1);
    });

    let acumulado = 0;
    const data = [];

    let current = new Date(fInicio);
    current.setDate(1);

    while (current <= fFin) {
      const key = current.toISOString().slice(0, 7);

      if (grupos.has(key)) {
        acumulado += grupos.get(key);
      }

      const diasDesdeInicio = (current - fInicio) / (1000 * 60 * 60 * 24);

      let meta = (diasDesdeInicio / totalDias) * 100;
      meta = Math.min(Math.max(meta, 0), 100);

      let cumplimiento = (acumulado / totalControles) * 100;

      if (current > hoy) {
        cumplimiento = cumplimiento;
      }

      data.push({
        date: current.toLocaleDateString("es-ES", {
          month: "short",
          year: "2-digit",
        }),
        meta: parseFloat(meta.toFixed(2)),
        cumplimiento: parseFloat(cumplimiento.toFixed(2)),
      });

      current.setMonth(current.getMonth() + 1);
    }

    return data;
  };

  useEffect(() => {
    if (!empresaId) return;

    const loadData = async () => {
      try {
        const [metricasData, dominioData, cumplidosData] = await Promise.all([
          fetchMetricas(empresaId),
          fetchPorDominio(empresaId),
          fetchCumplidos(empresaId),
        ]);

        setMetricas(metricasData);
        setPorDominio(dominioData);

        const total = metricasData?.total_controles || 0;

        if (fechaInicio && fechaFin) {
          const lineData = procesarCumplidosParaLinea(
            cumplidosData,
            total,
            fechaInicio,
            fechaFin,
          );
          setProgresoData(lineData);
        }
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    loadData();
  }, [
    empresaId,
    fetchMetricas,
    fetchPorDominio,
    fetchCumplidos,
    fechaInicio,
    fechaFin,
  ]);

  const barData = porDominio
    ? Object.entries(porDominio).map(([name, data]) => ({
        name,
        completed: data.porcentaje || 0,
        pending: 100 - (data.porcentaje || 0),
      }))
    : [];

  if (loading && !metricas) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const totalControles = metricas?.total_controles || 0;
  const completados = metricas?.por_estado?.Completado || 0;
  const pendientes = totalControles - completados;
  const evaluados = metricas?.evaluados || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Resumen Ejecutivo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Nivel de madurez y cumplimiento de la norma ISO 27001
          </p>
        </div>
        {/* <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-indigo-500" />
          Actualizado ahora
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Cumplimiento General"
          value={`${metricas?.porcentaje_cumplimiento || 0}%`}
          subtitle={`${evaluados} de ${totalControles} controles evaluados`}
          icon={Shield}
          trend={metricas?.porcentaje_cumplimiento || 0}
          colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
          bg="bg-indigo-500"
          onClick={() => navigate("/checklist")}
        />
        <StatCard
          title="Controles Completados"
          value={`${completados}/${totalControles}`}
          subtitle="implementados"
          icon={CheckCircle2}
          trend={completados}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
          bg="bg-emerald-500"
          onClick={() => navigate("/checklist")}
        />
        <StatCard
          title="Controles Pendientes"
          value={String(pendientes)}
          subtitle="requieren atención"
          icon={AlertCircle}
          trend={-pendientes}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
          bg="bg-amber-500"
          onClick={() => navigate("/checklist")}
        />
        <StatCard
          title="Avance del Proyecto"
          value={`${Math.round((completados / totalControles) * 100)}%`}
          subtitle="completado"
          icon={Activity}
          trend={Math.round((completados / totalControles) * 100)}
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
          bg="bg-blue-500"
          onClick={() => navigate("/checklist")}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Progreso hacia la certificación
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Controles completados vs totales
            </p>
          </div>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {Math.round((completados / totalControles) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(completados / totalControles) * 100}%`,
            }}
            transition={{ duration: 1.2 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts
          porDominioData={porDominio}
          progresoData={progresoData}
          avanceDepartamentoData={barData}
        />
      </div>
    </div>
  );
}
