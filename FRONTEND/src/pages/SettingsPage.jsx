// FILE: src/pages/SettingsPage.jsx
export default function SettingsPage({ user, onLogout }) {
  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-sm font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-100">Gmail Account</p>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <svg viewBox="0 0 48 48" width="22" height="22">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
            <div><p className="text-sm font-semibold text-slate-800">{user.email}</p><p className="text-xs text-slate-400">Signed in as {user.role}</p></div>
          </div>
          <button onClick={onLogout} className="text-sm text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl cursor-pointer">Sign out</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-sm font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-100">About EduMark</p>
        {[["Name",user.name],["Role",user.role],["Frontend","React + useState + Tailwind"],["Backend","Node.js + Express"],["Database","MySQL via XAMPP"],["Features","Attendance · Courses · Competitions · Notices"]].map(([k,v]) => (
          <div key={k} className="flex justify-between py-2.5 border-b border-slate-50 last:border-0 text-sm"><span className="text-slate-400">{k}</span><span className="text-slate-700 font-medium">{v}</span></div>
        ))}
      </div>
    </div>
  );
}
