// FILE: src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { API, today } from "../data/constants";
import { Avatar, Badge, Spinner, ErrorBox, SuccessBox } from "../components/UIComponents";

export default function Dashboard({ user }) {
  const isTeacher = user.role === "teacher";
  const [students, setStudents] = useState([]);
  const [todayAtt, setTodayAtt] = useState([]);
  const [summary, setSummary] = useState([]);
  const [notices, setNotices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [comps, setComps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [nTitle, setNTitle] = useState(""); const [nMsg, setNMsg] = useState(""); const [nType, setNType] = useState("info"); const [showNForm, setShowNForm] = useState(false);
  const [cTitle, setCTitle] = useState(""); const [cInst, setCInst] = useState(""); const [cCat, setCCat] = useState("language"); const [cSDate, setCSDate] = useState(""); const [cEDate, setCEDate] = useState(""); const [showCForm, setShowCForm] = useState(false);
  const [compTitle, setCompTitle] = useState(""); const [compDesc, setCompDesc] = useState(""); const [compCat, setCompCat] = useState("technical"); const [compDate, setCompDate] = useState(""); const [compLast, setCompLast] = useState(""); const [compVenue, setCompVenue] = useState(""); const [compPrize, setCompPrize] = useState(""); const [showCompForm, setShowCompForm] = useState(false);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [s, t, su, n, c, co] = await Promise.all([// three differnent api calls student today summary
        API.get("/students"), API.get(`/attendance?date=${today()}`), API.get("/attendance/summary"),
        API.get("/dashboard/notices"), API.get("/dashboard/courses"), API.get("/dashboard/competitions"),
      ]);
      setStudents(s.data.students); setTodayAtt(t.data.attendance); setSummary(su.data.summary);
      setNotices(n.data.notices); setCourses(c.data.courses); setComps(co.data.competitions);
    } catch { setErr("Could not load data. Is XAMPP MySQL running?"); }
    finally { setLoading(false); }
  }

  function flash(msg) { setOk(msg); setTimeout(() => setOk(""), 3000); }

  async function addNotice() { if (!nTitle.trim()) return; try { await API.post("/dashboard/notices", { title:nTitle, message:nMsg, type:nType }); flash("✅ Notice added!"); setNTitle(""); setNMsg(""); setShowNForm(false); loadAll(); } catch {} }
  async function delNotice(id) { try { await API.delete(`/dashboard/notices/${id}`); flash("Notice deleted."); loadAll(); } catch {} }
  async function addCourse() { if (!cTitle.trim()) return; try { await API.post("/dashboard/courses", { title:cTitle, instructor:cInst, category:cCat, start_date:cSDate, end_date:cEDate, status:"active" }); flash("✅ Course added!"); setCTitle(""); setCInst(""); setShowCForm(false); loadAll(); } catch {} }
  async function delCourse(id) { try { await API.delete(`/dashboard/courses/${id}`); flash("Course deleted."); loadAll(); } catch {} }
  async function addComp() { if (!compTitle.trim()) return; try { await API.post("/dashboard/competitions", { title:compTitle, description:compDesc, category:compCat, comp_date:compDate, last_date:compLast, venue:compVenue, prize:compPrize, status:"open" }); flash("✅ Competition added!"); setCompTitle(""); setCompDesc(""); setShowCompForm(false); loadAll(); } catch {} }
  async function delComp(id) { try { await API.delete(`/dashboard/competitions/${id}`); flash("Competition deleted."); loadAll(); } catch {} }

  const total = todayAtt.length;
  const present = todayAtt.filter(s => s.status === "P").length;
  const rate = total > 0 ? Math.round((present/total)*100) : 0;
  const dateStr = new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

  const catColor = { language:"bg-blue-100 text-blue-800", technical:"bg-violet-100 text-violet-800", "soft-skills":"bg-green-100 text-green-800", competition:"bg-amber-100 text-amber-800", cultural:"bg-pink-100 text-pink-800", sports:"bg-orange-100 text-orange-800", other:"bg-slate-100 text-slate-700" };
  const noticeColor = { info:"border-blue-300 bg-blue-50", warning:"border-amber-300 bg-amber-50", success:"border-green-300 bg-green-50", important:"border-red-300 bg-red-50" };
  const noticeIcon = { info:"ℹ️", warning:"⚠️", success:"✅", important:"🔴" };
  const statusColor = { open:"bg-green-100 text-green-700", upcoming:"bg-amber-100 text-amber-700", closed:"bg-red-100 text-red-700", completed:"bg-slate-100 text-slate-600", active:"bg-green-100 text-green-700" };

  if (loading) return <Spinner/>;

  return (
    <div className="flex flex-col gap-5">
      <div><h1 className="text-xl font-bold text-slate-800">Dashboard</h1><p className="text-sm text-slate-400 mt-1">📅 {dateStr}</p></div>
      <ErrorBox msg={err}/><SuccessBox msg={ok}/>

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon:"👥", label:"Total Students", value:students.length, color:"bg-slate-100" },
          { icon:"✅", label:"Present Today",  value:present,         color:"bg-green-50"  },
          { icon:"❌", label:"Absent Today",   value:total-present,   color:"bg-red-50"    },
          { icon:"📈", label:"Today's Rate",   value:`${rate}%`,      color:"bg-blue-50"   },
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-2xl p-5 flex flex-col gap-1 border border-slate-200`}>
            <span className="text-2xl">{c.icon}</span>
            <span className="text-3xl font-bold text-slate-800">{c.value}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-slate-700">Class Attendance Today</span>
          <span className="text-sm font-bold text-blue-700">{rate}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-700 rounded-full transition-all duration-700" style={{ width:`${rate}%` }}/>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2"><span>{present} present</span><span>{total-present} absent</span></div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200">
          <p className="px-5 py-4 text-sm font-semibold text-slate-700 border-b border-slate-100">📋 Today's Attendance</p>
          <div className="p-4 flex flex-col gap-2 max-h-52 overflow-y-auto">
            {todayAtt.length === 0 ? <p className="text-sm text-slate-400 text-center py-4">No attendance yet today.</p> :
              todayAtt.slice(0,8).map(s => (
                <div key={s.student_id} className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-50">
                  <Avatar name={s.name} size="w-8 h-8" text="text-xs"/>
                  <span className="flex-1 text-sm text-slate-700">{s.name}</span>
                  <Badge status={s.status}/>
                </div>
              ))
            }
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200">
          <p className="px-5 py-4 text-sm font-semibold text-slate-700 border-b border-slate-100">📊 Overall Attendance %</p>
          <div className="p-4 flex flex-col gap-2 max-h-52 overflow-y-auto">
            {summary.length === 0 ? <p className="text-sm text-slate-400 text-center py-4">No records yet.</p> :
              summary.map(s => {
                const pct = s.percentage || 0;
                return (
                  <div key={s.student_id} className="flex items-center gap-3 px-2 py-1.5 hover:bg-slate-50 rounded-xl">
                    <Avatar name={s.name} size="w-7 h-7" text="text-xs"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct>=75 ? "bg-green-500" : "bg-red-400"}`} style={{ width:`${pct}%` }}/>
                        </div>
                        <span className="text-xs text-slate-500 w-8">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {/* Notices */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">📢 Notice Board</p>
          {isTeacher && <button onClick={() => setShowNForm(v=>!v)} className="text-xs bg-blue-800 hover:bg-blue-900 text-white px-3 py-1.5 rounded-lg cursor-pointer border-0">+ Add Notice</button>}
        </div>
        {isTeacher && showNForm && (
          <div className="mx-4 my-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input value={nTitle} onChange={e=>setNTitle(e.target.value)} placeholder="Notice title *" className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"/>
              <select value={nType} onChange={e=>setNType(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none bg-white">{["info","warning","success","important"].map(t=><option key={t}>{t}</option>)}</select>
            </div>
            <textarea value={nMsg} onChange={e=>setNMsg(e.target.value)} placeholder="Message (optional)" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 resize-none mb-3"/>
            <div className="flex gap-2"><button onClick={addNotice} className="bg-blue-800 text-white text-xs px-4 py-2 rounded-lg cursor-pointer border-0">Save</button><button onClick={()=>setShowNForm(false)} className="text-xs text-slate-500 px-4 py-2 rounded-lg border border-slate-200 bg-white cursor-pointer">Cancel</button></div>
          </div>
        )}
        <div className="p-4 flex flex-col gap-2">
          {notices.length===0 ? <p className="text-sm text-slate-400 text-center py-4">No notices.</p> :
            notices.map(n => (
              <div key={n.notice_id} className={`flex items-start gap-3 p-3 rounded-xl border ${noticeColor[n.type]||"border-slate-200 bg-slate-50"}`}>
                <span className="text-lg flex-shrink-0">{noticeIcon[n.type]||"📌"}</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800">{n.title}</p>{n.message && <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>}</div>
                {isTeacher && <button onClick={()=>delNotice(n.notice_id)} className="text-slate-400 hover:text-red-500 text-xs cursor-pointer border-0 bg-transparent">✕</button>}
              </div>
            ))
          }
        </div>
      </div>

      {/* Courses */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">📚 Courses Available</p>
          {isTeacher && <button onClick={()=>setShowCForm(v=>!v)} className="text-xs bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg cursor-pointer border-0">+ Add Course</button>}
        </div>
        {isTeacher && showCForm && (
          <div className="mx-4 my-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input value={cTitle} onChange={e=>setCTitle(e.target.value)} placeholder="Course title *" className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-green-400"/>
              <input value={cInst} onChange={e=>setCInst(e.target.value)} placeholder="Instructor name" className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-green-400"/>
              <select value={cCat} onChange={e=>setCCat(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none bg-white">{["language","technical","soft-skills","competition","other"].map(c=><option key={c}>{c}</option>)}</select>
              <div className="flex gap-2"><input type="date" value={cSDate} onChange={e=>setCSDate(e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none"/><input type="date" value={cEDate} onChange={e=>setCEDate(e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none"/></div>
            </div>
            <div className="flex gap-2"><button onClick={addCourse} className="bg-green-700 text-white text-xs px-4 py-2 rounded-lg cursor-pointer border-0">Save</button><button onClick={()=>setShowCForm(false)} className="text-xs text-slate-500 px-4 py-2 rounded-lg border border-slate-200 bg-white cursor-pointer">Cancel</button></div>
          </div>
        )}
        <div className="p-4 grid grid-cols-2 gap-3">
          {courses.length===0 ? <p className="text-sm text-slate-400 col-span-2 text-center py-4">No courses added yet.</p> :
            courses.map(c => (
              <div key={c.course_id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{c.title}</p>
                  {isTeacher && <button onClick={()=>delCourse(c.course_id)} className="text-slate-300 hover:text-red-500 text-sm cursor-pointer border-0 bg-transparent flex-shrink-0">🗑</button>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor[c.category]||"bg-slate-100 text-slate-600"}`}>{c.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status]||"bg-slate-100"}`}>{c.status}</span>
                </div>
                {c.instructor && <p className="text-xs text-slate-500 mt-1.5">👤 {c.instructor}</p>}
                {c.start_date && <p className="text-xs text-slate-400 mt-0.5">📅 {c.start_date} → {c.end_date||"?"}</p>}
                <p className="text-xs text-blue-600 mt-1.5">{c.enrolled} enrolled</p>
              </div>
            ))
          }
        </div>
      </div>

      {/* Competitions */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">🏆 Upcoming Competitions</p>
          {isTeacher && <button onClick={()=>setShowCompForm(v=>!v)} className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg cursor-pointer border-0">+ Add Competition</button>}
        </div>
        {isTeacher && showCompForm && (
          <div className="mx-4 my-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input value={compTitle} onChange={e=>setCompTitle(e.target.value)} placeholder="Competition title *" className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400"/>
              <select value={compCat} onChange={e=>setCompCat(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none bg-white">{["technical","language","sports","cultural","other"].map(c=><option key={c}>{c}</option>)}</select>
              <input value={compVenue} onChange={e=>setCompVenue(e.target.value)} placeholder="Venue" className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400"/>
              <input value={compPrize} onChange={e=>setCompPrize(e.target.value)} placeholder="Prize e.g. ₹5,000" className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400"/>
              <div className="flex gap-2 col-span-2">
                <div className="flex-1"><p className="text-xs text-slate-500 mb-1">Competition Date</p><input type="date" value={compDate} onChange={e=>setCompDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none"/></div>
                <div className="flex-1"><p className="text-xs text-slate-500 mb-1">Last Date to Register</p><input type="date" value={compLast} onChange={e=>setCompLast(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none"/></div>
              </div>
              <textarea value={compDesc} onChange={e=>setCompDesc(e.target.value)} placeholder="Description" rows={2} className="col-span-2 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400 resize-none"/>
            </div>
            <div className="flex gap-2"><button onClick={addComp} className="bg-amber-600 text-white text-xs px-4 py-2 rounded-lg cursor-pointer border-0">Save</button><button onClick={()=>setShowCompForm(false)} className="text-xs text-slate-500 px-4 py-2 rounded-lg border border-slate-200 bg-white cursor-pointer">Cancel</button></div>
          </div>
        )}
        <div className="p-4 grid grid-cols-2 gap-3">
          {comps.length===0 ? <p className="text-sm text-slate-400 col-span-2 text-center py-4">No competitions added yet.</p> :
            comps.map(c => (
              <div key={c.comp_id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{c.title}</p>
                  {isTeacher && <button onClick={()=>delComp(c.comp_id)} className="text-slate-300 hover:text-red-500 text-sm cursor-pointer border-0 bg-transparent flex-shrink-0">🗑</button>}
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor[c.category]||"bg-slate-100"}`}>{c.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status]||"bg-slate-100"}`}>{c.status}</span>
                </div>
                {c.venue && <p className="text-xs text-slate-500">📍 {c.venue}</p>}
                {c.prize && <p className="text-xs text-amber-700 font-medium mt-0.5">🏆 {c.prize}</p>}
                {c.comp_date && <p className="text-xs text-slate-400 mt-0.5">📅 {c.comp_date}</p>}
                {c.last_date && <p className="text-xs text-red-500 mt-0.5">⏰ Last date: {c.last_date}</p>}
                <p className="text-xs text-blue-600 mt-1.5">{c.registered} registered</p>
              </div>
            ))
          }
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 flex items-center gap-3">
        <span className="text-lg">🗄</span>
        <div><p className="text-sm font-semibold text-green-800">XAMPP MySQL Connected</p><p className="text-xs text-green-600">{students.length} students · {courses.length} courses · {comps.length} competitions · {notices.length} notices</p></div>
      </div>
    </div>
  );
}
