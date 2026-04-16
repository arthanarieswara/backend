const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const studentController = require("../controllers/studentController"); // <-- ADD THIS

/* MARK ATTENDANCE */
router.post("/", attendanceController.markAttendance);

/* GET CLASS ATTENDANCE */
router.get("/class/:class_id", attendanceController.getClassAttendance);

/* GET STUDENT ATTENDANCE */
router.get("/student/:student_id", attendanceController.getStudentAttendance);

/* FILTER STUDENTS BY DEPARTMENT + SEMESTER */
router.get("/filter", studentController.getStudentsByDeptSemester);

module.exports = router;