const express = require("express");
const router = express.Router();
const { updateDepartment } = require("../controllers/departmentController");

const {
    getDepartments,
    addDepartment,
    deleteDepartment
} = require("../controllers/departmentController");

router.get("/", getDepartments);
router.post("/", addDepartment);
router.delete("/:id", deleteDepartment);


router.put("/:id", updateDepartment);

module.exports = router;