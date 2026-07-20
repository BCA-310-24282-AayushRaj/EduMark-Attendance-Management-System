// FILE: src/components/Sidebar.jsx
import { NAV_ITEMS } from "../data/constants";

export default function Sidebar({ user, page, setPage, onLogout }) {
  return (
    <aside className="w-52 bg-blue-900 flex flex-col min-h-screen flex-shrink-0">
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
        <span className="text-2xl">🎓</span>
        <div><p className="text-white font-bold text-sm">EduMark</p><p className="text-blue-300 text-xs">Attendance System</p></div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all cursor-pointer border-0 border-l-2
              ${page===item.id ? "bg-white/15 text-white font-medium border-blue-300" : "text-blue-200 hover:bg-white/10 hover:text-white border-transparent"}`}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-white/10">
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-2 font-medium ${user.role==="teacher" ? "bg-blue-500/30 text-blue-200" : "bg-green-500/30 text-green-200"}`}>{user.role}</span>
        <p className="text-white text-xs font-medium truncate mb-0.5">{user.name}</p>
        <p className="text-blue-300 text-xs truncate mb-3">{user.email}</p>
        <button onClick={onLogout} className="w-full text-xs text-blue-200 hover:text-white border border-white/20 hover:border-white/40 rounded-lg py-1.5 transition-colors cursor-pointer bg-transparent">Logout</button>
      </div>
    </aside>
  );
}
