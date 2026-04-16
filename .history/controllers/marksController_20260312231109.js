const pool = require("../config/db");

/* GET MARKS */
exports.getMarks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM marks ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ADD MARKS */
exports.addMarks = async (req, res) => {
  const { student_id, subject_id, exam_id, marks } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO marks (student_id, subject_id, exam_id, marks)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [student_id, subject_id, exam_id, marks]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE MARKS */
exports.updateMarks = async (req, res) => {
  const { id } = req.params;
  const { student_id, subject_id, exam_id, marks } = req.body;

  try {
    await pool.query(
      `UPDATE marks
       SET student_id=$1, subject_id=$2, exam_id=$3, marks=$4
       WHERE id=$5`,
      [student_id, subject_id, exam_id, marks, id]
    );

    res.json({ message: "Marks updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE MARKS */
exports.deleteMarks = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM marks WHERE id=$1",
      [id]
    );

    res.json({ message: "Marks deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};