const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const examController = require("../controllers/examController");

router.get("/", authenticateToken, examController.getExams);
router.post("/", authenticateToken, examController.createExam);
router.put("/:id", authenticateToken, examController.updateExam);
router.delete("/:id", authenticateToken, examController.deleteExam);

module.exports = router;