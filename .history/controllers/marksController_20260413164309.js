const db = require("../config/db");
const { get } = require("../routes/marksRoutes");

/* ===============================
   ADD MARKS (WITH DATE)
================================ */
const addMarks = async (req, res) => {
  const marks = req.body;

  try {
    for (let m of marks) {
      const markValue = m.mark === "AB" ? "AB" : parseInt(m.mark);

      await db.query(
        `INSERT INTO marks
        (student_id, subject_id, semester, section, test_type, test_no, mark, department_id, exam_date)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          m.student_id,
          parseInt(m.subject_id),
          parseInt(m.semester),
          m.section,
          m.test_type,
          parseInt(m.test_no),
          markValue,
          parseInt(m.department_id),
          m.exam_date || new Date(), // ✅ default today
        ],
      );
    }

    res.json({ message: "Marks saved successfully ✅" });
  } catch (err) {
    console.error("Add Marks Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET MARKS REPORT (WITH DATE)
================================ */
const getMarksReport = async (req, res) => {
  const { semester, section, subject_id, department_id, exam_date } = req.query;

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

    /* 🔥 DATE FILTER */
    if (exam_date) {
      params.push(exam_date);
      query += ` AND exam_date = $${params.length}`;
    } else {
      // ✅ default → today
      query += ` AND exam_date = CURRENT_DATE`;
    }

    const result = await db.query(query, params);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Marks Report Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE MARK
================================ */
const updateMark = async (req, res) => {
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
const deleteMark = async (req, res) => {
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

/* ===============================
   GET MARKS LIST (FULL FILTER)
================================ */
const getMarksList = async (req, res) => {
  const {
    semester,
    section,
    subject_id,
    department_id,
    exam_date,
    test_type,
    test_no,
  } = req.query;

  try {
    let query = `
      SELECT 
        m.id,
        m.student_id,
        s.roll_number,
        s.name,
        m.subject_id,
        sub.name AS subject_name,
        m.mark,
        m.test_type,
        m.test_no,
        m.exam_date,
        m.section,
        m.semester,
        m.department_id

      FROM marks m
      JOIN students s ON m.student_id = s.id
      JOIN subjects sub ON m.subject_id = sub.id

      WHERE 1=1
    `;

    let params = [];

    /* ================= FILTERS ================= */

    if (semester) {
      params.push(parseInt(semester));
      query += ` AND m.semester = $${params.length}`;
    }

    if (section && section !== "None") {
      params.push(section);
      query += ` AND m.section = $${params.length}`;
    }

    if (subject_id) {
      params.push(parseInt(subject_id));
      query += ` AND m.subject_id = $${params.length}`;
    }

    if (department_id) {
      params.push(parseInt(department_id));
      query += ` AND m.department_id = $${params.length}`;
    }

    if (test_type) {
      params.push(test_type);
      query += ` AND m.test_type = $${params.length}`;
    }

    if (test_no) {
      params.push(parseInt(test_no));
      query += ` AND m.test_no = $${params.length}`;
    }

    if (exam_date) {
      params.push(exam_date);
      query += ` AND m.exam_date = $${params.length}`;
    }
    // ❌ NO DEFAULT DATE HERE (because everything optional)

    query += ` ORDER BY s.roll_number ASC`;

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("Get Marks List Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET CLASS MARKS (ALL SUBJECTS)
================================ */
const getClassMarks = async (req, res) => {
  const { semester, department_id, test_type, test_no, section } = req.query;

  try {
    if (!semester || !department_id || !test_type) {
      return res.status(400).json({
        message: "semester, department_id and test_type are required",
      });
    }

    let query = `
      SELECT 
        s.id AS student_id,
        s.roll_number,
        s.name,

        sub.id AS subject_id,
        sub.name AS subject_name,
        sub.code,

        m.mark,
        m.test_type,
        m.test_no,
        m.exam_date

      FROM students s

      JOIN subjects sub 
        ON sub.semester_id = $1 
        AND sub.department_id = $2

      LEFT JOIN marks m 
        ON m.student_id = s.id
        AND m.subject_id = sub.id
        AND m.test_type = $3
    `;

    let params = [parseInt(semester), parseInt(department_id), test_type];

    /* 🔥 ADD TEST NUMBER FILTER */
    if (test_no) {
      params.push(parseInt(test_no));
      query += ` AND m.test_no = $${params.length}`;
    }

    query += `
      WHERE s.semester = $1
      AND s.department_id = $2
    `;

    /* OPTIONAL SECTION */
    if (section && section !== "None") {
      params.push(section);
      query += ` AND s.section = $${params.length}`;
    }

    query += ` ORDER BY s.roll_number ASC, sub.name ASC`;

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("Get Class Marks Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET SUBJECT MARKS (SINGLE SUBJECT)
================================ */
const getSubjectMarks = async (req, res) => {
  const { semester, department_id, subject_id, test_type, test_no, section } =
    req.query;

  try {
    const result = await db.query(
      `
      SELECT 
        s.id AS student_id,
        s.roll_number,
        s.name,
        m.mark

      FROM students s

      LEFT JOIN marks m 
        ON m.student_id = s.id
        AND m.subject_id = $1
        AND m.test_type = $2
        AND ($3::int IS NULL OR m.test_no = $3)

      WHERE 
        s.department_id = $4
        AND s.semester_id = $5
        AND ($6::text IS NULL OR s.section = $6)

      ORDER BY s.roll_number ASC
      `,
      [
        subject_id,
        test_type,
        test_no || null,
        department_id,
        semester,
        section || null,
      ],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Subject Marks Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addMarks,
  getMarksReport,
  getMarksList, // ✅ ADD THIS
  getSubjectMarks,
  updateMark,
  deleteMark,
  getClassMarks,
};
