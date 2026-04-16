const express = require("express");
const router = express.Router();

const {
  markFacultyAttendance,
  getFacultyAttendance,
} = require("../controllers/facultyAttendanceController");

router.post("/", markFacultyAttendance);
router.get("/", getFacultyAttendance);


module.exports = router;