import React from "react";

export function Field({ label, children, className = "" }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-600 sm:text-[13px]">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ className = "", ...props }) {
  return <input {...props} className={`w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${className}`} />;
}

export function SelectInput({ children, className = "", ...props }) {
  return <select {...props} className={`w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${className}`}>{children}</select>;
}

export function SectionTitle({ children, hint }) {
  return <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-semibold text-slate-900">{children}</h3>{hint && <span className="text-xs text-slate-400">{hint}</span>}</div>;
}
