const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const studentController = require("../controllers/studentController");

/* MARK ATTENDANCE */
router.post("/", attendanceController.markAttendance);

/* GET STUDENTS BY DEPARTMENT + SEMESTER */
router.get("/filter", studentController.getStudentsByDeptSemester);

/* GET STUDENT ATTENDANCE */
router.get("/student/:student_id", attendanceController.getStudentAttendance);

module.exports = router;