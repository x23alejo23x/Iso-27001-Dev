// src/pages/Dashboard/DashboardView.jsx
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
  ArrowRight,
} from "lucide-react";
import { useDashboardService } from "../../service";
import StatCard from "../StatCard";
import DashboardCharts from "../DashboardCharts";

export default function DashboardView() {
  const navigate = useNavigate();
  const { loading, fetchMetricas, fetchPorDominio } = useDashboardService();
  const [metricas, setMetricas] = useState(null);
  const [porDominio, setPorDominio] = useState(null);
  const authState = useSelector((state) => state.login);
  const empresaId = authState.user?.empresa_id;

  useEffect(() => {
    if (!empresaId) return;
    const loadData = async () => {
      try {
        const [metricasData, dominioData] = await Promise.all([
          fetchMetricas(empresaId),
          fetchPorDominio(empresaId),
        ]);
        setMetricas(metricasData);
        setPorDominio(dominioData);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };
    loadData();
  }, [empresaId, fetchMetricas, fetchPorDominio]);

  // Preparar datos para el bar chart (completado vs pendiente por dominio)
  const barData = porDominio
    ? Object.entries(porDominio).map(([name, data]) => ({
        name,
        completed: data.porcentaje || 0,
        pending: 100 - (data.porcentaje || 0),
      }))
    : [];

  // Datos de progreso (podrías obtener de otro endpoint o generar histórico)
  // Por ahora, simulamos algunos puntos basados en el porcentaje actual
  const progresoData = metricas
    ? [
        {
          date: "Semana 1",
          cumplimiento: Math.max(0, metricas.porcentaje_cumplimiento - 8),
        },
        {
          date: "Semana 2",
          cumplimiento: Math.max(0, metricas.porcentaje_cumplimiento - 5),
        },
        {
          date: "Semana 3",
          cumplimiento: Math.max(0, metricas.porcentaje_cumplimiento - 2),
        },
        { date: "Semana 4", cumplimiento: metricas.porcentaje_cumplimiento },
      ]
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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Resumen Ejecutivo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Nivel de madurez y cumplimiento de la norma ISO 27001
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-indigo-500" />
          Actualizado ahora
        </div>
      </div>

      {/* Stat Cards */}
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

      {/* Progress bar */}
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
            animate={{ width: `${(completados / totalControles) * 100}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
          />
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts
          porDominioData={porDominio}
          progresoData={progresoData}
          avanceDepartamentoData={barData}
        />
      </div>

      {/* Actividad Reciente - Podrías agregar un endpoint para actividad */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
      >
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          Resumen de Cumplimiento
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Última actualización de métricas
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Controles evaluados:</span>
            <span className="font-medium">{evaluados}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Porcentaje de cumplimiento:</span>
            <span className="font-medium">
              {metricas?.porcentaje_cumplimiento || 0}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Completados:</span>
            <span className="font-medium text-emerald-600">{completados}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>En Progreso:</span>
            <span className="font-medium text-blue-600">
              {metricas?.por_estado?.["En Progreso"] || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Pendientes (Novedad):</span>
            <span className="font-medium text-amber-600">
              {metricas?.por_estado?.["Pendiente Novedad"] || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>No Iniciados:</span>
            <span className="font-medium text-slate-500">
              {metricas?.por_estado?.["No Iniciado"] || 0}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate("/checklist")}
          className="mt-5 w-full text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center justify-center gap-1 transition-colors"
        >
          Ver todos los controles <ArrowRight className="w-3 h-3" />
        </button>
      </motion.div> */}
    </div>
  );
}
