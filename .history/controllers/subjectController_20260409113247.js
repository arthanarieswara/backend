const db = require("../config/db");

/* GET SUBJECTS */

exports.getSubjects = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        subjects.id,
        subjects.code,
        subjects.name,
        subjects.department_id,
        subjects.semester_id,
        departments.name AS department_name
      FROM subjects
      LEFT JOIN departments
      ON subjects.department_id = departments.id
      ORDER BY subjects.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ADD SUBJECT */

exports.addSubject = async (req, res) => {
  const { code, name, department_id, semester_id } = req.body;

  try {
    await db.query(
      `INSERT INTO subjects (code, name, department_id, semester_id)
       VALUES ($1,$2,$3,$4)`,
      [code, name, department_id, semester_id],
    );

    res.json({ message: "Subject added" });
  } catch (err) {
    console.log(err);

    if (err.code === "23505") {
      return res.status(400).json({
        message: "Subject already exists for this department",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/* UPDATE SUBJECT */

exports.updateSubject = async (req, res) => {
  const { id } = req.params;
  const { code, name, department_id, semester_id } = req.body;

  try {
    await db.query(
      `UPDATE subjects
       SET code=$1, name=$2, department_id=$3, semester_id=$4
       WHERE id=$5`,
      [code, name, department_id, semester_id, id],
    );

    res.json({ message: "Subject updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* DELETE SUBJECT */

exports.deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM subjects WHERE id=$1`, [id]);

    res.json({ message: "Subject deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET SUBJECTS BY SEMESTER
================================ */

exports.getSubjectsBySemester = async (req, res) => {
  const { semester } = req.query;

  try {
    const result = await db.query(
      `SELECT * FROM subjects WHERE semester_id = $1`,
      [semester],
    );

    res.json(result.rows);
  } catch (err) {
    console.log("Subject Filter Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET SUBJECTS BY SEMESTER + DEPARTMENT
================================ */

exports.getSubjectsBySemester = async (req, res) => {
  const { semester, department_id } = req.query;

  try {
    let query = `
      SELECT id, code, name, department_id, semester_id
      FROM subjects
      WHERE 1=1
    `;

    let params = [];

    if (semester) {
      params.push(parseInt(semester));
      query += ` AND semester_id = $${params.length}`;
    }

    if (department_id) {
      params.push(parseInt(department_id));
      query += ` AND department_id = $${params.length}`;
    }

    query += ` ORDER BY name ASC`;

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.log("Subject Filter Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
