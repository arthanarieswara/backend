const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const studentController = require("../controllers/studentController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

/* MARK ATTENDANCE */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Faculty"),
  attendanceController.markAttendance,
);

/* GET STUDENTS */
router.get(
  "/filter",
  authenticateToken,
  studentController.getStudentsByDeptSemester,
);

/* GET STUDENT ATTENDANCE */
router.get(
  "/student/:student_id",
  authenticateToken,
  attendanceController.getStudentAttendance,
);

/* SUMMARY */
router.get(
  "/summary",
  authenticateToken,
  attendanceController.getAttendanceSummary,
);

/* EDIT ATTENDANCE */
router.get(
  "/edit",
  authenticateToken,
  attendanceController.getAttendanceForEdit,
);

module.exports = router;
