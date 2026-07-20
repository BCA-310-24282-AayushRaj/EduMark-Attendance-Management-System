const express = require("express");
const db = require("../config/db");
const { verifyToken, teacherOnly } = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const { grade } = req.query;
    let q = "SELECT * FROM students", p = [];
    if (grade) { q += " WHERE grade=?"; p = [grade]; }
    q += " ORDER BY name ASC";
    const [students] = await db.query(q, p);
    res.json({ success:true, count:students.length, students });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});

router.post("/", verifyToken, teacherOnly, async (req, res) => {
  try {
    const { name, grade, roll_no, contact } = req.body;
    if (!name || !grade || !roll_no) return res.status(400).json({ success:false, message:"Name, grade and roll number required." });
    const [r] = await db.query("INSERT INTO students (name,grade,roll_no,contact) VALUES (?,?,?,?)",
      [name.trim(), grade, roll_no.trim(), contact || ""]);
    const [ns] = await db.query("SELECT * FROM students WHERE student_id=?", [r.insertId]);
    res.status(201).json({ success:true, message:`"${name}" added!`, student:ns[0] });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});

router.delete("/:id", verifyToken, teacherOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT name FROM students WHERE student_id=?", [id]);
    if (!rows.length) return res.status(404).json({ success:false, message:"Student not found." });
    await db.query("DELETE FROM students WHERE student_id=?", [id]);
    res.json({ success:true, message:`"${rows[0].name}" deleted.` });
  } catch { res.status(500).json({ success:false, message:"Server error." }); }
});

module.exports = router;
