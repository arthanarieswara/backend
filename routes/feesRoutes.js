const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const feesController = require("../controllers/feesController");

/* GET FEES */
router.get("/", authenticateToken, feesController.getFees);

/* ADD FEES */
router.post("/", authenticateToken, feesController.addFees);

/* UPDATE FEES */
router.put("/:id", authenticateToken, feesController.updateFees);

/* DELETE FEES */
router.delete("/:id", authenticateToken, feesController.deleteFees);

module.exports = router;