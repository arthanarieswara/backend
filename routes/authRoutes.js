const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

/* AUTH */
router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);

/* USER MANAGEMENT */
router.get("/users", authController.getUsers);
router.put("/users/:id", authController.updateUser);
router.delete("/users/:id", authController.deleteUser);

module.exports = router;