const db = require("../config/db");

/* ===============================
   ADD / UPDATE MARKS (UPSERT)
================================ */

exports.addMarks = async (req, res) => {
  const marks = req.body;

  try {
    for (let m of marks) {
      const markValue = m.mark === "AB" ? "AB" : parseInt(m.mark);

      await db.query(
        `INSERT INTO marks
        (student_id, subject_id, semester, section, test_type, test_no, mark, department_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          m.student_id,
          parseInt(m.subject_id),
          parseInt(m.semester),
          m.section,
          m.test_type,
          parseInt(m.test_no),
          markValue,
          parseInt(m.department_id),
        ]
      );
    }

    res.json({ message: "Marks saved successfully ✅" });
  } catch (err) {
    console.error("Add Marks Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET MARKS REPORT
================================ */

exports.getMarksReport = async (req, res) => {
  const { semester, section, subject_id, department_id } = req.query;

  try {
    let query = `
      SELECT 
        COUNT(*) AS total,

        COUNT(CASE WHEN mark = 'AB' THEN 1 END) AS absent_count,

        COUNT(CASE WHEN mark != 'AB' AND mark::int >= 50 THEN 1 END) AS pass_count,

        COUNT(CASE WHEN mark != 'AB' AND mark::int < 50 THEN 1 END) AS fail_count,

        AVG(CASE WHEN mark != 'AB' THEN mark::int END)::numeric(10,2) AS average,

        MAX(CASE WHEN mark != 'AB' THEN mark::int END) AS highest,

        MIN(CASE WHEN mark != 'AB' THEN mark::int END) AS lowest

      FROM marks
      WHERE 1=1
    `;

    let params = [];

    if (semester) {
      params.push(parseInt(semester));
      query += ` AND semester = $${params.length}`;
    }

    if (section && section !== "None") {
      params.push(section);
      query += ` AND section = $${params.length}`;
    }

    if (subject_id) {
      params.push(parseInt(subject_id));
      query += ` AND subject_id = $${params.length}`;
    }

    if (department_id) {
      params.push(parseInt(department_id));
      query += ` AND department_id = $${params.length}`;
    }

    const result = await db.query(query, params);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Marks Report Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};