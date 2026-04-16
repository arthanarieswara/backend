const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subjectController");
const { authenticateToken } = require("../middleware/authMiddleware");


router.get("/", authenticateToken, subjectController.getSubjects);

router.post("/", authenticateToken, subjectController.addSubject);

router.put("/:id", authenticateToken, subjectController.updateSubject);

router.delete("/:id", authenticateToken, subjectController.deleteSubject);
router.get("/filter-sem-section", getStudentsBySemSection);

module.exports = router;