const pool = require("../config/db");

/* GET STUDENTS */

const getStudents = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT students.*, departments.name AS department_name
      FROM students
      LEFT JOIN departments
      ON students.department_id = departments.id
      ORDER BY students.id
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ADD STUDENT */

const addStudent = async (req, res) => {

  const { name, roll_number, department_id, semester, section, admission_year } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO students
      (name, roll_number, department_id, semester, section, admission_year)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [name, roll_number, department_id, semester, section, admission_year]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

};

/* UPDATE STUDENT */

const updateStudent = async (req, res) => {

  const { id } = req.params;

  const { name, roll_number, department_id, semester, section, admission_year } = req.body;

  try {

    const result = await pool.query(
      `UPDATE students
       SET name=$1,
           roll_number=$2,
           department_id=$3,
           semester=$4,
           section=$5,
           admission_year=$6
       WHERE id=$7
       RETURNING *`,
      [name, roll_number, department_id, semester, section, admission_year, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

};

/* DELETE STUDENT */

const deleteStudent = async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM students WHERE id=$1",
      [id]
    );

    res.json({ message: "Student deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
};