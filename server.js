const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* DATABASE */
require("./config/db");

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROOT */
app.get("/", (req, res) => {
  res.send("College ERP Backend Running");
});

/* ROUTES */

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const classRoutes = require("./routes/classRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const examRoutes = require("./routes/examRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const facultySubjectRoutes = require("./routes/facultySubjectRoutes");
const feesRoutes = require("./routes/feesRoutes");
const marksRoutes = require("./routes/marksRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const mappingRoutes = require("./routes/mappingRoutes");
const facultyAttendanceRoutes = require("./routes/facultyAttendanceRoutes");



/* API ENDPOINTS */

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/faculty-subjects", facultySubjectRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/mapping", mappingRoutes);
app.use("/api/faculty-attendance", facultyAttendanceRoutes);




/* SERVER */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});