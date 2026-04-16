const express = require("express");
const router = express.Router();

const {
  addMarks,
  getMarksReport,
  updateMark,
  deleteMark
} = require("../controllers/marksController");

/* ===============================
   ADD / UPDATE MARKS
================================ */
router.post("/", addMarks);

/* ===============================
   GET REPORT
================================ */
router.get("/report", getMarksReport);

/* ===============================
   UPDATE MARK
================================ */
router.put("/:id", updateMark);

/* ===============================
   DELETE MARK
================================ */
router.delete("/:id", deleteMark);

module.exports = router;