const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const classController = require("../controllers/classController");

router.get("/", authenticateToken, classController.getClasses);
router.post("/", authenticateToken, classController.createClass);
router.put("/:id", authenticateToken, classController.updateClass);
router.delete("/:id", authenticateToken, classController.deleteClass);

module.exports = router;