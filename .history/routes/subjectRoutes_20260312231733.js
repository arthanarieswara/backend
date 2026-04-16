const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const subjectController = require("../controllers/subjectController");

/* GET SUBJECTS */
router.get("/", authenticateToken, subjectController.getSubjects);

/* ADD SUBJECT */
router.post("/", authenticateToken, subjectController.addSubject);

/* UPDATE SUBJECT */
router.put("/:id", authenticateToken, subjectController.updateSubject);

/* DELETE SUBJECT */
router.delete("/:id", authenticateToken, subjectController.deleteSubject);

module.exports = router;