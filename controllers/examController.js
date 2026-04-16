const pool = require("../config/db");

/* GET EXAMS */
exports.getExams = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM exams ORDER BY exam_date DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* CREATE EXAM */
exports.createExam = async (req, res) => {
  const { subject_id, exam_type, exam_date } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO exams (subject_id, exam_type, exam_date) VALUES ($1,$2,$3) RETURNING *",
      [subject_id, exam_type, exam_date]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE EXAM */
exports.updateExam = async (req, res) => {
  const { id } = req.params;
  const { subject_id, exam_type, exam_date } = req.body;

  try {
    await pool.query(
      "UPDATE exams SET subject_id=$1, exam_type=$2, exam_date=$3 WHERE id=$4",
      [subject_id, exam_type, exam_date, id]
    );

    res.json({ message: "Exam updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE EXAM */
exports.deleteExam = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM exams WHERE id=$1", [id]);
    res.json({ message: "Exam deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};