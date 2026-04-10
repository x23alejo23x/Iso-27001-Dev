export default function Input({
  label,
  icon: Icon,
  error,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        )}
        <input
          disabled={disabled}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-white dark:bg-slate-800 border ${
            error
              ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
              : "border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500"
          } rounded-xl text-sm focus:ring-2 focus:outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 ${
            disabled
              ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900"
              : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
