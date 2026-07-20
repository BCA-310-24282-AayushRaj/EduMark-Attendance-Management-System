const express = require("express");
const db = require("../config/db");
const { verifyToken, teacherOnly } = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const { date, grade } = req.query;
    const qDate = date || new Date().toISOString().split("T")[0];
    let q = `SELECT s.student_id,s.name,s.grade,s.roll_no,s.contact,
             COALESCE(a.status,'A') AS status
             FROM students s
             LEFT JOIN attendance a ON s.student_id=a.student_id AND a.date=?`;
    const p = [qDate];
    if (grade) { q += " WHERE s.grade=?"; p.push(grade); }
    q += " ORDER BY s.name ASC";
    const [rows] = await db.query(q, p);
    res.json({ success:true, date:qDate, attendance:rows });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});

router.post("/mark", verifyToken, teacherOnly, async (req, res) => {
  try {
    const { student_id, date, status } = req.body;
    if (!student_id || !date || !status) return res.status(400).json({ success:false, message:"student_id, date, status required." });
    if (!["P","A"].includes(status)) return res.status(400).json({ success:false, message:"Status must be P or A." });
    await db.query(
      `INSERT INTO attendance (student_id,date,status,marked_by) VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE status=VALUES(status),marked_by=VALUES(marked_by)`,
      [student_id, date, status, req.user.user_id]
    );
    res.json({ success:true, message:`Marked ${status==="P"?"Present":"Absent"}.` });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});

router.post("/mark-all", verifyToken, teacherOnly, async (req, res) => {
  try {
    const { date, grade } = req.body;
    const qDate = date || new Date().toISOString().split("T")[0];
    let q = "SELECT student_id FROM students", p = [];
    if (grade) { q += " WHERE grade=?"; p = [grade]; }
    const [students] = await db.query(q, p);
    for (const s of students) {
      await db.query(
        `INSERT INTO attendance (student_id,date,status,marked_by) VALUES (?,?,'P',?)
         ON DUPLICATE KEY UPDATE status='P',marked_by=VALUES(marked_by)`,
        [s.student_id, qDate, req.user.user_id]
      );
    }
    res.json({ success:true, message:`All ${students.length} marked Present.` });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});

router.get("/summary", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.student_id,s.name,s.grade,s.roll_no,
        COUNT(a.att_id) AS total_days,
        SUM(CASE WHEN a.status='P' THEN 1 ELSE 0 END) AS present_days,
        ROUND((SUM(CASE WHEN a.status='P' THEN 1 ELSE 0 END)/NULLIF(COUNT(a.att_id),0))*100,1) AS percentage
      FROM students s LEFT JOIN attendance a ON s.student_id=a.student_id
      GROUP BY s.student_id ORDER BY s.name ASC`);
    res.json({ success:true, summary:rows });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});

module.exports = router;
