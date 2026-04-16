const express = require("express");
const router = express.Router();

const facultyController = require("../controllers/facultyController");

router.get("/", facultyController.getFaculty);
router.post("/", facultyController.addFaculty);
router.put("/:id", facultyController.updateFaculty);
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;