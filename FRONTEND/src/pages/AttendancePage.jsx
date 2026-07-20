// FILE: src/pages/AttendancePage.jsx
import { useState, useEffect } from "react";
import { API, today, GRADES } from "../data/constants";
import { Avatar, Badge, Spinner, ErrorBox, SuccessBox } from "../components/UIComponents";

export default function AttendancePage({ user }) {
  const isTeacher = user.role === "teacher";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(today());
  const [grade, setGrade] = useState("10th");
  const [filter, setFilter] = useState("all");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const [toggling, setToggling] = useState(null);

  useEffect(() => { load(); }, [date, grade]);

  async function load() {
    setLoading(true);
    try { const { data } = await API.get(`/attendance?date=${date}&grade=${grade}`); setList(data.attendance); }
    catch { setErr("Could not load. Is XAMPP running?"); }
    finally { setLoading(false); }
  }

  async function toggle(s) {
    if (!isTeacher) return;
    const newStatus = s.status === "P" ? "A" : "P";
    setToggling(s.student_id);
    setList(p => p.map(x => x.student_id === s.student_id ? { ...x, status:newStatus } : x));
    try { await API.post("/attendance/mark", { student_id:s.student_id, date, status:newStatus }); }
    catch { setList(p => p.map(x => x.student_id === s.student_id ? { ...x, status:s.status } : x)); setErr("Could not save."); }
    finally { setToggling(null); }
  }

  async function markAll() {
    try { await API.post("/attendance/mark-all", { date, grade }); setList(p => p.map(s => ({ ...s, status:"P" }))); setOk("✅ All marked Present!"); setTimeout(()=>setOk(""),3000); }
    catch { setErr("Could not mark all."); }
  }

  const visible = list.filter(s => filter==="present" ? s.status==="P" : filter==="absent" ? s.status==="A" : true);
  const present = list.filter(s => s.status === "P").length;

  return (
    <div className="flex flex-col gap-4">
      <SuccessBox msg={ok}/><ErrorBox msg={err}/>

      <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Date:</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400"/>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Grade:</label>
          <select value={grade} onChange={e=>setGrade(e.target.value)} className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400">{GRADES.map(g=><option key={g}>{g}</option>)}</select>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {[["all","All"],["present","Present"],["absent","Absent"]].map(([v,l]) => (
            <button key={v} onClick={()=>setFilter(v)} className={`px-4 py-1.5 text-xs font-medium rounded-lg cursor-pointer border-0 transition-all ${filter===v ? "bg-white text-blue-800 shadow-sm" : "text-slate-500 bg-transparent"}`}>{l}</button>
          ))}
        </div>
        {isTeacher && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500">{present}/{list.length} present</span>
            <button onClick={markAll} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-xl cursor-pointer">✓ Mark All Present</button>
          </div>
        )}
        {!isTeacher && <span className="ml-auto text-xs text-slate-400">Attendance marked by your teacher</span>}
      </div>

      {loading ? <Spinner/> : (
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="px-5 py-3 border-b border-slate-100 flex gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-700 inline-block"/> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-slate-300 inline-block"/> Absent</span>
            {isTeacher && <span>Click dot to toggle — saves to MySQL instantly</span>}
          </div>
          {visible.length === 0 ? <p className="text-center py-10 text-slate-400 text-sm">No students match this filter.</p> : (
            <div className="p-4 flex flex-col gap-2">
              {visible.map(s => (
                <div key={s.student_id} className="flex items-center gap-3 px-3 py-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <Avatar name={s.name}/>
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800 truncate">{s.name}</p><p className="text-xs text-slate-400">Roll {s.roll_no} · {s.grade}</p></div>
                  <Badge status={s.status}/>
                  <button onClick={()=>toggle(s)} disabled={toggling===s.student_id||!isTeacher}
                    title={isTeacher ? (s.status==="P" ? "Click to mark Absent" : "Click to mark Present") : ""}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border-2
                      ${isTeacher && toggling!==s.student_id ? "cursor-pointer" : "cursor-default"}
                      ${s.status==="P" ? "bg-blue-700 border-blue-700 text-white" : "bg-white border-slate-300"}`}>
                    {toggling===s.student_id ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : s.status==="P" && <span className="text-xs text-white">✓</span>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
