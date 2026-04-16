const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const studentController = require("../controllers/studentController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth");

/* ✅ ONLY FACULTY + ADMIN CAN MARK ATTENDANCE */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Faculty"),
  attendanceController.markAttendance
);

/* GET STUDENTS */
router.get("/filter", studentController.getStudentsByDeptSemester);

/* GET STUDENT ATTENDANCE */
router.get("/student/:student_id", attendanceController.getStudentAttendance);

module.exports = router;