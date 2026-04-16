const pool = require("../config/db");

/* GET FEES */

exports.getFees = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM fees ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ADD FEES */

exports.addFees = async (req, res) => {

  const { student_id, amount, status } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO fees (student_id, amount, status)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [student_id, amount, status]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

/* UPDATE FEES */

exports.updateFees = async (req, res) => {

  const { id } = req.params;
  const { student_id, amount, status } = req.body;

  try {

    await pool.query(
      `UPDATE fees
       SET student_id=$1, amount=$2, status=$3
       WHERE id=$4`,
      [student_id, amount, status, id]
    );

    res.json({ message: "Fees updated" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

/* DELETE FEES */

exports.deleteFees = async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM fees WHERE id=$1",
      [id]
    );

    res.json({ message: "Fees deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};