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
  "/students/by-class",
  authenticateToken,
  studentController.getStudentsByClass
);

/* ================= ATTENDANCE ================= */

/* MARK ATTENDANCE */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Faculty"),
  attendanceController.markAttendance
);

/* SUMMARY */
router.get(
  "/summary",
  authenticateToken,
  attendanceController.getAttendanceSummary
);

/* CLASS SUMMARY */
router.get(
  "/class-summary",
  authenticateToken,
  attendanceController.getClassWiseSummary
);

/* DEPARTMENT SUMMARY */
router.get(
  "/department-summary",
  authenticateToken,
  attendanceController.getDepartmentSummary
);

module.exports = router;