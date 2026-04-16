const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");


// AUTH
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// CRUD
router.get("/", userController.getUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;