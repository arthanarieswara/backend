const pool = require("../config/db");


// GET ALL ALLOCATIONS
exports.getFacultySubjects = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT faculty_subjects.id,
             users.name AS faculty,
             subjects.name AS subject,
             classes.section,
             classes.academic_year
      FROM faculty_subjects
      JOIN faculty ON faculty_subjects.faculty_id = faculty.id
      JOIN users ON faculty.id = users.id
      JOIN subjects ON faculty_subjects.subject_id = subjects.id
      JOIN classes ON faculty_subjects.class_id = classes.id
      ORDER BY users.name
    `);

    res.json(result.rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// CREATE ALLOCATION
exports.createFacultySubject = async (req, res) => {

  const {
    faculty_id,
    subject_id,
    class_id
  } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO faculty_subjects
       (faculty_id, subject_id, class_id)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [faculty_id, subject_id, class_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// DELETE ALLOCATION
exports.deleteFacultySubject = async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM faculty_subjects WHERE id=$1",
      [id]
    );

    res.json({ message: "Allocation removed successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};