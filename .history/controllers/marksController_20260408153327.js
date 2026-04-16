const db = require("../config/db");

/* ================= ADD MARKS ================= */
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
          m.subject_id,
          m.semester,
          m.section,
          m.test_type,
          m.test_no,
          m.mark
        ]
      );
    }

    res.json({ message: "Marks saved successfully ✅" });
  } catch (err) {
    console.error("Marks Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET MARKS REPORT ================= */
exports.getMarksReport = async (req, res) => {
  const { semester, section, subject_id } = req.query;

  try {
    let query = `
      SELECT 
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

    query += ` ORDER BY s.name`;

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("Report Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};