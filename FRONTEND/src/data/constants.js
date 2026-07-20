// FILE: src/data/constants.js
// All API calls + helper functions in one place

import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:5000/api" });
API.interceptors.request.use(c => {
  const t = localStorage.getItem("edumark_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

// ── Helpers ───────────────────────────────────────────────
export function initials(name = "") {
  const p = name.trim().split(" ");
  return (p.length >= 2 ? p[0][0] + p[1][0] : p[0]?.[0] ?? "?").toUpperCase();
}
export function avatarBg(name = "") {
  const cols = ["bg-blue-500","bg-green-600","bg-amber-500","bg-rose-500","bg-violet-600","bg-teal-600"];
  return cols[name.split("").reduce((a,c)=>a+c.charCodeAt(0),0) % cols.length];
}
export function today() { return new Date().toISOString().split("T")[0]; }
export function isGmail(e) { return e.trim().endsWith("@gmail.com"); }

// ── Nav items for Sidebar ─────────────────────────────────
export const NAV_ITEMS = [
  { id:"dashboard",  icon:"📊", label:"Dashboard"  },
  { id:"students",   icon:"👥", label:"Students"   },
  { id:"attendance", icon:"✅", label:"Attendance" },
  { id:"settings",   icon:"⚙️", label:"Settings"  },
];

export const GRADES = ["9th","10th","11th","12th"];
