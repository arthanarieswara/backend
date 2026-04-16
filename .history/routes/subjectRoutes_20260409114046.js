const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subjectController");

/* GET ALL SUBJECTS */
router.get("/", subjectController.getSubjects);

/* FILTER SUBJECTS */
router.get("/by-semester", subjectController.getSubjectsBySemester);

/* ADD */
router.post("/", subjectController.addSubject);

/* UPDATE */
router.put("/:id", subjectController.updateSubject);

/* DELETE */
router.delete("/:id", subjectController.deleteSubject);

module.exports = router;