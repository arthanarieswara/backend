const pool = require("../config/db");

/* GET SUBJECTS */
exports.getSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subjects ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ADD SUBJECT */
exports.addSubject = async (req, res) => {

  const { name, department_id, semester } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO subjects (name, department_id, semester)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [name, department_id, semester]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

/* UPDATE SUBJECT */
exports.updateSubject = async (req, res) => {

  const { id } = req.params;
  const { name, department_id, semester } = req.body;

  try {

    await pool.query(
      `UPDATE subjects
       SET name=$1, department_id=$2, semester=$3
       WHERE id=$4`,
      [name, department_id, semester, id]
    );

    res.json({ message: "Subject updated" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

/* DELETE SUBJECT */
exports.deleteSubject = async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM subjects WHERE id=$1",
      [id]
    );

    res.json({ message: "Subject deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};