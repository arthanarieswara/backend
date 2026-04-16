const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subjectController");

/* GET ALL SUBJECTS */
router.get("/", subjectController.getSubjects);

/* ADD SUBJECT */
router.post("/", subjectController.addSubject);

/* UPDATE SUBJECT */
router.put("/:id", subjectController.updateSubject);

/* DELETE SUBJECT */
router.delete("/:id", subjectController.deleteSubject);

/* FILTER SUBJECTS BY SEMESTER */
router.get("/by-semester", subjectController.getSubjectsBySemester);
router.get("/by-semester", getSubjectsBySemAndDept);

module.exports = router;