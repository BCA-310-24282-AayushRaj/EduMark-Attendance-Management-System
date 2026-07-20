const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin:"http://localhost:5173", credentials:true }));
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.get("/api", (req, res) => res.json({ success:true, message:"EduMark API running!" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend: http://localhost:${PORT}`);
  console.log(`📡 API:     http://localhost:${PORT}/api\n`);
});
