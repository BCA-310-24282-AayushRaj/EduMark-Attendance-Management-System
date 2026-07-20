// FILE: src/App.jsx
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import AttendancePage from "./pages/AttendancePage";
import SettingsPage from "./pages/SettingsPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./App.css";

export default function App() {
  const saved = localStorage.getItem("edumark_user");
  const [user, setUser] = useState(saved ? JSON.parse(saved) : null);
  const [page, setPage] = useState("dashboard");

  function handleLogin(u) { setUser(u); setPage("dashboard"); }
  function handleLogout() {
    localStorage.removeItem("edumark_token");
    localStorage.removeItem("edumark_user");
    setUser(null);
    setPage("dashboard");
  }

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar user={user} page={page} setPage={setPage} onLogout={handleLogout} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar page={page} user={user} />
        <main className="flex-1 p-6">
          {page === "dashboard"  && <Dashboard user={user} />}
          {page === "students"   && <StudentsPage user={user} />}
          {page === "attendance" && <AttendancePage user={user} />}
          {page === "settings"   && <SettingsPage user={user} onLogout={handleLogout} />}
        </main>
      </div>
    </div>
  );
}
