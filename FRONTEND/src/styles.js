// FILE: src/styles.js
// Shared Tailwind class strings reused across pages/components.
// Import these instead of repeating long class strings everywhere.

export const card = "bg-white rounded-2xl border border-slate-200";
export const cardHeader = "px-5 py-4 border-b border-slate-100 flex items-center justify-between";
export const inputBase = "px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400";
export const btnPrimary = "bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-xl cursor-pointer border-0";
export const btnSecondary = "text-sm text-slate-500 px-4 py-2 rounded-xl cursor-pointer border border-slate-200 bg-white hover:bg-slate-50";
export const btnDanger = "text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg cursor-pointer";

export const statColors = {
  total:   "bg-slate-100",
  present: "bg-green-50",
  absent:  "bg-red-50",
  rate:    "bg-blue-50",
};

export const categoryColors = {
  language:     "bg-blue-100 text-blue-800",
  technical:    "bg-violet-100 text-violet-800",
  "soft-skills":"bg-green-100 text-green-800",
  competition:  "bg-amber-100 text-amber-800",
  cultural:     "bg-pink-100 text-pink-800",
  sports:       "bg-orange-100 text-orange-800",
  other:        "bg-slate-100 text-slate-700",
};
