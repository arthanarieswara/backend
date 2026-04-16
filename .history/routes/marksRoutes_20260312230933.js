const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const marksController = require("../controllers/marksController");

/* GET MARKS */
router.get("/", authenticateToken, marksController.getMarks);

/* ADD MARKS */
router.post("/", authenticateToken, marksController.addMarks);

/* UPDATE MARKS */
router.put("/:id", authenticateToken, marksController.updateMarks);

/* DELETE MARKS */
router.delete("/:id", authenticateToken, marksController.deleteMarks);

module.exports = router;