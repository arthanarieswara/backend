const db = require("../config/db");

/* ===============================
   ADD / UPDATE MARKS (UPSERT)
================================ */

exports.addMarks = async (req, res) => {
  const marks = req.body;

  try {
    for (let m of marks) {
      await db.query(
        `INSERT INTO marks
     (student_id, subject_id, semester, section, test_type, test_no, mark)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          m.student_id,
          parseInt(m.subject_id),
          parseInt(m.semester),
          m.section,
          m.test_type,
          parseInt(m.test_no),
          parseInt(m.mark),
        ],
      );
    }

    res.json({ message: "Marks saved/updated successfully ✅" });
  } catch (err) {
    console.error("Add Marks Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET MARKS REPORT
================================ */

exports.getMarksReport = async (req, res) => {
  const { semester, section, subject_id } = req.query;

  try {
    let query = `
      SELECT 
        m.id,
        s.roll_number,
        s.name,
        m.test_type,
        m.test_no,
        m.mark
      FROM marks m
      JOIN students s ON m.student_id = s.id
      WHERE 1=1
    `;

    let params = [];

    if (semester) {
      params.push(semester);
      query += ` AND m.semester = $${params.length}`;
    }

    if (section && section !== "None") {
      params.push(section);
      query += ` AND m.section = $${params.length}`;
    }

    if (subject_id) {
      params.push(subject_id);
      query += ` AND m.subject_id = $${params.length}`;
    }

    query += ` ORDER BY s.roll_number`;

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("Get Report Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE SINGLE MARK
================================ */

exports.updateMark = async (req, res) => {
  const { id } = req.params;
  const { mark } = req.body;

  try {
    const result = await db.query(
      `UPDATE marks
       SET mark=$1
       WHERE id=$2
       RETURNING *`,
      [mark, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mark not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update Mark Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   DELETE MARK
================================ */

exports.deleteMark = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`DELETE FROM marks WHERE id=$1 RETURNING *`, [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mark not found" });
    }

    res.json({ message: "Mark deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
