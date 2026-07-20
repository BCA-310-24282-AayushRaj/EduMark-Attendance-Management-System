// FILE: src/components/Topbar.jsx
export default function Topbar({ page, user }) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
      <h1 className="text-base font-semibold text-slate-800 capitalize">{page}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">🗄 MySQL Connected</span>
        {user.role === "student" && (
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">View only</span>
        )}
        <span className="text-xs text-slate-400">
          📅 {new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
        </span>
      </div>
    </header>
  );
}
