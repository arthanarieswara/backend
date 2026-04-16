const express = require("express");
const router = express.Router();
const controller = require("../controllers/mappingController");

router.post("/", controller.createMapping);
router.get("/", controller.getMappings);
router.delete("/:id", controller.deleteMapping);

module.exports = router;