const express = require("express");
const router = express.Router();

const {
  addMarks,
  getMarksReport,
  updateMark,
  deleteMark,
  getClassMarks,
  getMarksList, 
  getSubjectMarks, 
} = require("../controllers/marksController");

/* ===============================
   ADD MARKS
================================ */
router.post("/", addMarks);

/* ===============================
   GET REPORT
================================ */
router.get("/report", getMarksReport);

/* ===============================
   GET MARKS LIST
================================ */
router.get("/list", getMarksList);

/* ===============================
   GET CLASS MARKS   
================================ */
router.put("/:id", updateMark);

/* ===============================
   DELETE MARK
================================ */
router.delete("/:id", deleteMark);

router.get("/subject", getSubjectMarks);
router.get("/class", getClassMarks);

module.exports = router;
