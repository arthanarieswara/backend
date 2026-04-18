const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const studentController = require("../controllers/studentController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

/* ================= STUDENTS ================= */
router.get(
  "/students",
  authenticateToken,
  studentController.getStudentsByDeptSemester,
);

/* ================= ATTENDANCE ================= */

/* MARK ATTENDANCE */
router.post(
  "/attendance",
  authenticateToken,
  authorizeRoles("Admin", "Faculty"),
  attendanceController.markAttendance,
);

/* SUMMARY */
router.get(
  "/attendance/summary",
  authenticateToken,
  attendanceController.getAttendanceSummary,
);

/* CLASS SUMMARY */
router.get(
  "/attendance/class-summary",
  authenticateToken,
  attendanceController.getClassWiseSummary,
);

/* DEPARTMENT SUMMARY */
router.get(
  "/attendance/department-summary",
  authenticateToken,
  attendanceController.getDepartmentSummary,
);

router.get(
  "/students/by-class",
  authenticateToken,
  studentController.getStudentsByClass
);

module.exports = router;
