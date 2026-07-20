// FILE: src/pages/LoginPage.jsx
import { useState } from "react";
import { API, isGmail } from "../data/constants";
import { ErrorBox, SuccessBox } from "../components/UIComponents";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [role, setRole] = useState("teacher");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  function switchMode(m) {
    setMode(m); setErr(""); setOk(""); setName(""); setEmail(""); setPass("");
  }

  async function doLogin() {
    if (!email || !pass) { setErr("Fill all fields."); return; }
    if (!isGmail(email)) { setErr("Enter a valid Gmail address."); return; }
    if (pass.length < 4) { setErr("Password min 4 characters."); return; }
    setBusy(true); setErr("");
    try {
      const { data } = await API.post("/auth/login", { email, password: pass });
      localStorage.setItem("edumark_token", data.token);
      localStorage.setItem("edumark_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (e) { setErr(e.response?.data?.message || "Login failed."); }
    finally { setBusy(false); }
  }

  async function doRegister() {
    if (!name.trim() || !email || !pass) { setErr("Fill all fields."); return; }
    if (!isGmail(email)) { setErr("Enter a valid Gmail address."); return; }
    if (pass.length < 4) { setErr("Password min 4 characters."); return; }
    setBusy(true); setErr(""); setOk("");
    try {
      await API.post("/auth/register", { name: name.trim(), email, password: pass, role });
      setOk("✅ Account created! You can now sign in.");
      setTimeout(() => { switchMode("login"); setEmail(email); }, 1200);
    } catch (e) { setErr(e.response?.data?.message || "Registration failed."); }
    finally { setBusy(false); }
  }

  function handleSubmit() { mode === "login" ? doLogin() : doRegister(); }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden flex">
        <div className="hidden md:flex w-2/5 bg-blue-900 flex-col justify-between p-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🎓</div>
              <div><p className="text-white font-bold text-lg">EduMark</p><p className="text-blue-300 text-xs">Attendance System</p></div>
            </div>
            <h1 className="text-white text-2xl font-bold leading-snug mb-3">Track students,<br/><span className="text-amber-300">every day.</span></h1>
            <p className="text-blue-200 text-sm">Connected to MySQL via XAMPP.</p>
          </div>
          <ul className="flex flex-col gap-3">
            {["Real MySQL database","Courses & Competitions","Role-based access"].map(f => (
              <li key={f} className="flex items-center gap-2 text-blue-100 text-sm">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>{f}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">

          {/* Login / Register tab switch */}
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1 mb-6">
            <button onClick={() => switchMode("login")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer border-0 ${mode==="login" ? "bg-white text-blue-800 shadow-sm" : "text-slate-500 bg-transparent"}`}>
              Sign In
            </button>
            <button onClick={() => switchMode("register")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer border-0 ${mode==="register" ? "bg-white text-blue-800 shadow-sm" : "text-slate-500 bg-transparent"}`}>
              Create Account
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            {mode === "login" ? "Welcome back 👋" : "Join EduMark 🎓"}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {mode === "login" ? "Sign in to continue" : "Create your account to get started"}
          </p>

          {/* Role tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1 mb-5">
            {["teacher","student"].map(r => (
              <button key={r} onClick={() => { setRole(r); setErr(""); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer border-0 ${role===r ? "bg-white text-blue-800 shadow-sm" : "text-slate-500 bg-transparent"}`}>
                {r === "teacher" ? "👨‍🏫 Teacher" : "👨‍🎓 Student"}
              </button>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-xl px-3 py-2.5 mb-5">
            {role === "teacher" ? "✏️ Teachers can add/remove students and mark attendance." : "👁️ Students can view attendance, courses and competitions."}
          </div>

          {/* Name field — only for register */}
          {mode === "register" && (
            <>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Full Name</label>
              <input value={name} onChange={e => { setName(e.target.value); setErr(""); }} placeholder="e.g. Aayush Raj"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 mb-4"/>
            </>
          )}

          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Gmail Address</label>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} placeholder="yourname@gmail.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 mb-4"/>

          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Password</label>
          <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} onKeyDown={e => e.key==="Enter" && handleSubmit()} placeholder="Min 4 characters"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 mb-1"/>
          <p className="text-xs text-slate-400 mb-5">✉️ Only @gmail.com accepted · Password can be any 4+ characters (letters and/or numbers)</p>

          <ErrorBox msg={err}/>
          <SuccessBox msg={ok}/>

          <button onClick={handleSubmit} disabled={busy}
            className="w-full bg-blue-800 hover:bg-blue-900 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl cursor-pointer border-0 text-sm">
            {busy
              ? (mode === "login" ? "Signing in..." : "Creating account...")
              : (mode === "login" ? "Sign In →" : "Create Account →")}
          </button>

          {mode === "login" && (
            <p className="text-xs text-slate-400 text-center mt-4">Demo: teacher@gmail.com / password</p>
          )}
          {mode === "register" && (
            <p className="text-xs text-slate-400 text-center mt-4">
              Already have an account?{" "}
              <button onClick={() => switchMode("login")} className="text-blue-700 font-medium cursor-pointer border-0 bg-transparent underline">Sign in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
