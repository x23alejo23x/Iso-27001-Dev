import {
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  MinusCircle,
} from "lucide-react";

export const statusStyles = {
  completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  in_progress:
    "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
  pending_update:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  not_started:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  Not_Applicable:
    "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export const statusIcons = {
  completed: CheckCircle2,
  in_progress: Clock,
  pending_update: AlertCircle,
  not_started: Circle,
  Not_Applicable: MinusCircle,
};

export const statusLabels = {
  completed: "Completado",
  in_progress: "En Progreso",
  pending_update: "Pendiente Novedad",
  not_started: "No Iniciado",
  Not_Applicable: "No Aplica",
};

export const priorityStyles = {
  Crítica:
    "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30",
  Alta: "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
  Media:
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
  Baja: "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

export const priorityLabels = {
  Crítica: "Crítica",
  Alta: "Alta",
  Media: "Media",
  Baja: "Baja",
};
