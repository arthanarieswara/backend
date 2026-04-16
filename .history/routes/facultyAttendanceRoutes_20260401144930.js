const express = require("express");
const router = express.Router();

const {
  markFacultyAttendance,
  getFacultyAttendance,
} = require("../controllers/facultyAttendanceController");

router.post("/", markFacultyAttendance);
router.get("/", getFacultyAttendance);
router.get("/summary", getFacultyAttendanceSummary);

module.exports = router;