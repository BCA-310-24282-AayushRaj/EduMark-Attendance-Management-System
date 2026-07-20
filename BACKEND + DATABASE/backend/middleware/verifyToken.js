const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Please log in first." });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(403).json({ success: false, message: "Invalid token. Please log in again." }); }
}

function teacherOnly(req, res, next) {
  if (req.user.role !== "teacher")
    return res.status(403).json({ success: false, message: "Only teachers can do this." });
  next();
}

module.exports = { verifyToken, teacherOnly };
