const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();
require("dotenv").config();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success:false, message:"All fields required." });
    if (!email.endsWith("@gmail.com")) return res.status(400).json({ success:false, message:"Only Gmail accepted." });
    if (password.length < 4) return res.status(400).json({ success:false, message:"Password min 4 chars." });

    const [ex] = await db.query("SELECT user_id FROM users WHERE email=?", [email]);
    if (ex.length) return res.status(409).json({ success:false, message:"Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const [r] = await db.query("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hashed, role || "student"]);
    res.status(201).json({ success:true, message:"Account created!", user_id:r.insertId });
  } catch (err) { res.status(500).json({ success:false, message:"Server error." }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message:"Email and password required." });

    const [users] = await db.query("SELECT * FROM users WHERE email=?", [email]);
    if (!users.length) return res.status(401).json({ success:false, message:"No account found with this email." });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success:false, message:"Incorrect password." });

    const token = jwt.sign(
      { user_id:user.user_id, name:user.name, email:user.email, role:user.role },
      process.env.JWT_SECRET, { expiresIn:"7d" }
    );
    res.json({ success:true, token, user:{ user_id:user.user_id, name:user.name, email:user.email, role:user.role } });
  } catch (err) { res.status(500).json({ success:false, message:"Server error." }); }
});

module.exports = router;
