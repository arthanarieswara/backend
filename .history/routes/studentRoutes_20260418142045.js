const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");

/* ===============================
   GET ALL STUDENTS
================================ */
router.get("/", studentController.getStudents);

/* ===============================
   ADD STUDENT
================================ */
router.post("/", studentController.addStudent);

/* ===============================
   UPDATE STUDENT
================================ */
router.put("/:id", studentController.updateStudent);

/* ===============================
   DELETE STUDENT
================================ */
router.delete("/:id", studentController.deleteStudent);

/* ===============================
   FINAL FILTER (DEPT + SEM + SECTION)
================================ */
router.get("/by-class", studentController.getStudentsByClass);

module.exports = router;