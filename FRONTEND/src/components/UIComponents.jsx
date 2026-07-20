// FILE: src/components/UIComponents.jsx
import { initials, avatarBg } from "../data/constants";

export function Avatar({ name, size="w-9 h-9", text="text-sm" }) {
  return <div className={`${size} ${avatarBg(name)} ${text} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}>{initials(name)}</div>;
}

export function Badge({ status }) {
  return status === "P"
    ? <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">✓ Present</span>
    : <span className="px-2.5 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-medium">✗ Absent</span>;
}

export function Spinner() {
  return <div className="flex justify-center py-12"><div className="w-9 h-9 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"/></div>;
}

export function ErrorBox({ msg }) {
  return msg ? <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-3">{msg}</div> : null;
}

export function SuccessBox({ msg }) {
  return msg ? <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-3">{msg}</div> : null;
}
