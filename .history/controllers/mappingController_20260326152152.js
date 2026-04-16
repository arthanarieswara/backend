const pool = require("../config/db");

/* ================= CREATE / UPSERT ================= */
exports.createMapping = async (req, res) => {
  const { user_id, faculty_id, student_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO user_mapping (user_id, faculty_id, student_id)
       VALUES ($1,$2,$3)
       ON CONFLICT (user_id)
       DO UPDATE SET
         faculty_id = EXCLUDED.faculty_id,
         student_id = EXCLUDED.student_id
       RETURNING *`,
      [user_id, faculty_id || null, student_id || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ================= */
exports.getMappings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        um.id,

        u.id AS user_id,
        u.name AS user_name,
        u.email,

        f.id AS faculty_id,
        f.name AS faculty_name,

        s.id AS student_id,
        s.name AS student_name

      FROM user_mapping um
      LEFT JOIN users u ON um.user_id = u.id
      LEFT JOIN faculty f ON um.faculty_id = f.id
      LEFT JOIN students s ON um.student_id = s.id

      ORDER BY um.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE ================= */
exports.deleteMapping = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM user_mapping WHERE id=$1", [id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};