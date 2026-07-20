// FILE: src/pages/StudentsPage.jsx
import { useState, useEffect } from "react";
import { API, GRADES } from "../data/constants";
import { Avatar, Spinner, ErrorBox, SuccessBox } from "../components/UIComponents";

export default function StudentsPage({ user }) {
  const isTeacher = user.role === "teacher";
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [nName, setNName] = useState("");
  const [nGrade, setNGrade] = useState("10th");
  const [nRoll, setNRoll] = useState("");
  const [nPhone, setNPhone] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { const { data } = await API.get("/students"); setStudents(data.students); }
    catch { setErr("Could not load students. Is XAMPP running?"); }
    finally { setLoading(false); }
  }

  function flash(msg) { setOk(msg); setTimeout(() => setOk(""), 3000); }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(search.toLowerCase()) ||
    String(s.student_id).includes(search)
  );

  async function handleAdd() {
    if (!nName.trim() || !nRoll.trim()) { setErr("Name and Roll Number required."); return; }
    setSaving(true); setErr("");
    try {
      const { data } = await API.post("/students", { name:nName.trim(), grade:nGrade, roll_no:nRoll.trim(), contact:nPhone.trim() });
      setStudents(p => [...p, data.student]);
      flash(`✅ ${data.student.name} added to database!`);
      setNName(""); setNGrade("10th"); setNRoll(""); setNPhone(""); setShowForm(false);
    } catch (e) { setErr(e.response?.data?.message || "Could not add student."); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const name = students.find(s => s.student_id === deleteId)?.name;
      await API.delete(`/students/${deleteId}`);
      setStudents(p => p.filter(s => s.student_id !== deleteId));
      flash(`✅ ${name} removed from database.`);
      setDeleteId(null);
    } catch (e) { setErr(e.response?.data?.message || "Could not delete."); }
    finally { setDeleting(false); }
  }

  if (loading) return <Spinner/>;

  return (
    <div className="flex flex-col gap-4">
      <SuccessBox msg={ok}/>
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">All Students</p>
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} records in MySQL</p>
          </div>
          <div className="flex items-center gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 w-48"/>
            {isTeacher && <button onClick={() => { setShowForm(true); setErr(""); }} className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-xl cursor-pointer border-0">+ Add Student</button>}
          </div>
        </div>

        {isTeacher && showForm && (
          <div className="mx-5 my-4 bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-blue-800 mb-3">➕ Add Student to MySQL</p>
            <ErrorBox msg={err}/>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div><label className="text-xs text-slate-600 block mb-1">Full Name *</label><input value={nName} onChange={e=>{setNName(e.target.value);setErr("");}} placeholder="e.g. Rohan Gupta" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"/></div>
              <div><label className="text-xs text-slate-600 block mb-1">Roll Number *</label><input value={nRoll} onChange={e=>{setNRoll(e.target.value);setErr("");}} placeholder="e.g. A09" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"/></div>
              <div><label className="text-xs text-slate-600 block mb-1">Grade</label><select value={nGrade} onChange={e=>setNGrade(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none bg-white">{GRADES.map(g=><option key={g}>{g}</option>)}</select></div>
              <div><label className="text-xs text-slate-600 block mb-1">Contact</label><input value={nPhone} onChange={e=>setNPhone(e.target.value)} placeholder="e.g. 9876543210" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"/></div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={saving} className="bg-blue-800 hover:bg-blue-900 disabled:bg-blue-400 text-white text-sm px-4 py-2 rounded-xl cursor-pointer border-0">{saving ? "Saving..." : "💾 Save to Database"}</button>
              <button onClick={()=>{setShowForm(false);setErr("");}} className="text-sm text-slate-500 px-4 py-2 rounded-xl cursor-pointer border border-slate-200 bg-white">Cancel</button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? <p className="text-center py-10 text-slate-400 text-sm">No students found.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                {["DB ID","Name","Grade","Roll No","Contact",...(isTeacher?["Action"]:[])].map(h=><th key={h} className="text-left px-5 py-3">{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.student_id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 text-xs text-blue-600 font-mono font-semibold">#{s.student_id}</td>
                    <td className="px-5 py-3"><div className="flex items-center gap-2.5"><Avatar name={s.name}/><span className="text-sm font-semibold text-slate-800">{s.name}</span></div></td>
                    <td className="px-5 py-3"><span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full">{s.grade}</span></td>
                    <td className="px-5 py-3 text-sm text-slate-600 font-mono">{s.roll_no}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{s.contact || "—"}</td>
                    {isTeacher && <td className="px-5 py-3"><button onClick={()=>setDeleteId(s.student_id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg cursor-pointer">🗑 Delete</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isTeacher && <p className="text-xs text-slate-400 px-5 py-3 border-t border-slate-100">Viewing in read-only mode.</p>}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <p className="text-base font-semibold text-slate-800 mb-2">Delete from MySQL?</p>
            <p className="text-sm text-slate-500 mb-5">This will permanently remove <strong>{students.find(s=>s.student_id===deleteId)?.name}</strong> and all their records.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={()=>setDeleteId(null)} disabled={deleting} className="text-sm px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer bg-white">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="text-sm px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer border-0">{deleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
