const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const attendanceController = require("../controllers/attendanceController");

router.post("/", authenticateToken, attendanceController.markAttendance);

router.get("/class/:class_id", authenticateToken, attendanceController.getClassAttendance);

router.get("/student/:student_id", authenticateToken, attendanceController.getStudentAttendance);

module.exports = router;