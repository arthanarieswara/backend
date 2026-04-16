const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const { authenticateToken } = require("../middleware/authMiddleware");

/* MARK ATTENDANCE */

router.post("/", authenticateToken, attendanceController.markAttendance);

/* GET STUDENTS OF CLASS */

router.get(
  "/class/:class_id",
  authenticateToken,
  attendanceController.getClassStudents,
);

/* GET STUDENT ATTENDANCE */

router.get(
  "/student/:student_id",
  authenticateToken,
  attendanceController.getStudentAttendance,
);

/* GET SUBJECT ATTENDANCE */

router.get(
  "/subject/:subject_id",
  authenticateToken,
  attendanceController.getSubjectAttendance,
);



module.exports = router;
