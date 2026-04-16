const express = require("express");
const router = express.Router();

const { getAdminDashboard } = require("../controllers/dashboardController");

router.get("/admin", getAdminDashboard);

module.exports = router;