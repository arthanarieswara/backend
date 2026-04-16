const express = require("express");
const router = express.Router();

const facultyController = require("../controllers/facultyController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, facultyController.getFaculty);
router.post("/", authenticateToken, facultyController.addFaculty);
router.put("/:id", authenticateToken, facultyController.updateFaculty);
router.delete("/:id", authenticateToken, facultyController.deleteFaculty);

module.exports = router;