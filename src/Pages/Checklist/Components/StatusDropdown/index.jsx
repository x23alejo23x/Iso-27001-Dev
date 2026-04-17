import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { statusStyles, statusIcons, statusLabels } from "../../constants";

const StatusDropdown = ({ status, onStatusChange, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = statusIcons[status];

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();
        if (!isOpen && onOpen) onOpen();
        setIsOpen(!isOpen);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
      }}
      tabIndex={0}
    >
      <div className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1">
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}
        >
          <Icon className="w-3.5 h-3.5" />
          {statusLabels[status]}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.97 }}
            className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-1"
          >
            {Object.keys(statusLabels).map((s) => {
              const SIcon = statusIcons[s];
              return (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(s);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${status === s ? "bg-slate-50 dark:bg-slate-700/30" : ""}`}
                >
                  <span
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[s]}`}
                  >
                    <SIcon className="w-3.5 h-3.5" />
                    {statusLabels[s]}
                  </span>
                  {status === s && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusDropdown;
