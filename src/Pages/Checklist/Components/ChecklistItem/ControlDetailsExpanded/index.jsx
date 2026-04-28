// ControlDetailsExpanded/index.jsx
import {
  Target,
  FileText,
  AlertTriangle,
  FolderOpen,
  ClipboardList,
  CheckSquare,
  Tag,
} from "lucide-react";

const sectionConfig = [
  { key: "objetivo", label: "Objetivo", icon: Target },
  { key: "descripcion", label: "Descripción", icon: FileText },
  { key: "riesgo", label: "Riesgo Asociado", icon: AlertTriangle },
  { key: "documentos", label: "Documentos Obligatorios", icon: FolderOpen },
  { key: "evidencia", label: "Evidencia Esperada", icon: ClipboardList },
  { key: "checklist", label: "Checklist de Cumplimiento", icon: CheckSquare },
  { key: "tag", label: "Responsabilidades por Área", icon: Tag },
];

const ControlDetailsExpanded = ({ details }) => {
  if (!details) return null;

  // Filtrar solo las secciones que existen en details
  const activeSections = sectionConfig.filter(({ key }) => details[key]);

  return (
    <div className="mb-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Ficha del control
        </h4>
      </div>
      <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800">
        {activeSections.map(({ key, label, icon: Icon }) => {
          const value = details[key];
          return (
            <div key={key} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    {label}
                  </h5>
                  {Array.isArray(value) ? (
                    <ul className="space-y-1 list-disc list-inside text-sm text-slate-700 dark:text-slate-300">
                      {value.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ControlDetailsExpanded;
