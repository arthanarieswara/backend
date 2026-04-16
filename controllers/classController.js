const pool = require("../config/db");


// GET ALL CLASSES
exports.getClasses = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT classes.*, 
             departments.name AS department,
             semesters.semester_number,
             courses.name AS course
      FROM classes
      JOIN departments ON classes.department_id = departments.id
      JOIN semesters ON classes.semester_id = semesters.id
      JOIN courses ON classes.course_id = courses.id
      ORDER BY classes.id
    `);

    res.json(result.rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// CREATE CLASS
exports.createClass = async (req, res) => {

  const {
    department_id,
    course_id,
    semester_id,
    section,
    academic_year
  } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO classes
       (department_id, course_id, semester_id, section, academic_year)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [department_id, course_id, semester_id, section, academic_year]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// UPDATE CLASS
exports.updateClass = async (req, res) => {

  const { id } = req.params;

  const {
    department_id,
    course_id,
    semester_id,
    section,
    academic_year
  } = req.body;

  try {

    const result = await pool.query(
      `UPDATE classes
       SET department_id=$1,
           course_id=$2,
           semester_id=$3,
           section=$4,
           academic_year=$5
       WHERE id=$6
       RETURNING *`,
      [
        department_id,
        course_id,
        semester_id,
        section,
        academic_year,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// DELETE CLASS
exports.deleteClass = async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM classes WHERE id=$1",
      [id]
    );

    res.json({ message: "Class deleted successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};