const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");

/* GET ALL STUDENTS */
router.get("/", studentController.getStudents);

/* ADD STUDENT */
router.post("/", studentController.addStudent);

/* UPDATE STUDENT */
router.put("/:id", studentController.updateStudent);

/* DELETE STUDENT */
router.delete("/:id", studentController.deleteStudent);

/* FILTER STUDENTS BY DEPARTMENT + SEMESTER */
router.get("/filter", studentController.getStudentsByDeptSemester);

router.get("/filter-sem-section", getStudentsBySemSection);

module.exports = router;