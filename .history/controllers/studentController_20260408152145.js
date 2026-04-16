const pool = require("../config/db");

/* ===============================
   GET STUDENTS
================================ */

const getStudents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        students.*,
        departments.name AS department_name,
        (students.start_year || ' - ' || students.end_year) AS batch
      FROM students
      LEFT JOIN departments
      ON students.department_id = departments.id
      ORDER BY students.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ADD STUDENT
================================ */

const addStudent = async (req, res) => {
  const {
    name,
    roll_number,
    department_id,
    semester,
    section,
    start_year,
    end_year,
  } = req.body;

  try {
    if (
      !name ||
      !roll_number ||
      !department_id ||
      !semester ||
      !start_year ||
      !end_year
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const result = await pool.query(
      `INSERT INTO students
      (name, roll_number, department_id, semester, section, start_year, end_year)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        name,
        roll_number,
        department_id,
        semester,
        section,
        start_year,
        end_year,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE STUDENT
================================ */

const updateStudent = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    roll_number,
    department_id,
    semester,
    section,
    start_year,
    end_year,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE students
       SET name=$1,
           roll_number=$2,
           department_id=$3,
           semester=$4,
           section=$5,
           start_year=$6,
           end_year=$7
       WHERE id=$8
       RETURNING *`,
      [
        name,
        roll_number,
        department_id,
        semester,
        section,
        start_year,
        end_year,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Student Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   DELETE STUDENT
================================ */

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM students WHERE id=$1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   FILTER STUDENTS BY DEPARTMENT + SEMESTER
================================ */

const getStudentsByDeptSemester = async (req, res) => {
  const { department_id, semester } = req.query;

  try {
    const result = await pool.query(
      `SELECT 
         *,
         (start_year || ' - ' || end_year) AS batch
       FROM students
       WHERE department_id = $1
       AND semester = $2
       ORDER BY name`,
      [department_id, semester],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Filter Students Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   FILTER STUDENTS BY SEMESTER + SECTION
================================ */

const getStudentsBySemSection = async (req, res) => {
  const { semester, section } = req.query;

  try {
    let query = `
      SELECT *,
      (start_year || ' - ' || end_year) AS batch
      FROM students
      WHERE semester = $1
    `;

    let params = [semester];

    if (section && section !== "None") {
      query += ` AND section = $2`;
      params.push(section);
    }

    query += ` ORDER BY roll_number`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error("Sem + Section Filter Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentsByDeptSemester,
  getStudentsBySemSection   // ✅ ADD THIS
};
