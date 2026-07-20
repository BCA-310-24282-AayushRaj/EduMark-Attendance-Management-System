const express = require("express");
const db = require("../config/db");
const { verifyToken, teacherOnly } = require("../middleware/verifyToken");
const router = express.Router();

// Notices
router.get("/notices", verifyToken, async (req, res) => {
  try { const [rows] = await db.query("SELECT * FROM notices ORDER BY created_at DESC LIMIT 5"); res.json({ success:true, notices:rows }); }
  catch { res.status(500).json({ success:false, message:"Server error." }); }
});
router.post("/notices", verifyToken, teacherOnly, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title) return res.status(400).json({ success:false, message:"Title required." });
    await db.query("INSERT INTO notices (title,message,type) VALUES (?,?,?)", [title, message||"", type||"info"]);
    res.json({ success:true, message:"Notice added!" });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});
router.delete("/notices/:id", verifyToken, teacherOnly, async (req, res) => {
  try { await db.query("DELETE FROM notices WHERE notice_id=?", [req.params.id]); res.json({ success:true, message:"Deleted." }); }
  catch { res.status(500).json({ success:false, message:"Server error." }); }
});

// Courses
router.get("/courses", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT c.*,(SELECT COUNT(*) FROM course_enrollments e WHERE e.course_id=c.course_id) AS enrolled
      FROM courses c ORDER BY created_at DESC`);
    res.json({ success:true, courses:rows });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});
router.post("/courses", verifyToken, teacherOnly, async (req, res) => {
  try {
    const { title, description, instructor, category, status, start_date, end_date } = req.body;
    if (!title) return res.status(400).json({ success:false, message:"Title required." });
    await db.query("INSERT INTO courses (title,description,instructor,category,status,start_date,end_date) VALUES (?,?,?,?,?,?,?)",
      [title, description||"", instructor||"", category||"other", status||"active", start_date||null, end_date||null]);
    res.json({ success:true, message:"Course added!" });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});
router.delete("/courses/:id", verifyToken, teacherOnly, async (req, res) => {
  try { await db.query("DELETE FROM courses WHERE course_id=?", [req.params.id]); res.json({ success:true, message:"Deleted." }); }
  catch { res.status(500).json({ success:false, message:"Server error." }); }
});

// Competitions
router.get("/competitions", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT c.*,(SELECT COUNT(*) FROM competition_registrations r WHERE r.comp_id=c.comp_id) AS registered
      FROM competitions c ORDER BY comp_date ASC`);
    res.json({ success:true, competitions:rows });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});
router.post("/competitions", verifyToken, teacherOnly, async (req, res) => {
  try {
    const { title, description, category, comp_date, last_date, venue, prize, status } = req.body;
    if (!title) return res.status(400).json({ success:false, message:"Title required." });
    await db.query("INSERT INTO competitions (title,description,category,comp_date,last_date,venue,prize,status) VALUES (?,?,?,?,?,?,?,?)",
      [title, description||"", category||"other", comp_date||null, last_date||null, venue||"", prize||"", status||"open"]);
    res.json({ success:true, message:"Competition added!" });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});
router.delete("/competitions/:id", verifyToken, teacherOnly, async (req, res) => {
  try { await db.query("DELETE FROM competitions WHERE comp_id=?", [req.params.id]); res.json({ success:true, message:"Deleted." }); }
  catch { res.status(500).json({ success:false, message:"Server error." }); }
});

module.exports = router;
