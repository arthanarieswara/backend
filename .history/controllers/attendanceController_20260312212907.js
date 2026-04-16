const pool = require("../config/db");


/* MARK ATTENDANCE */

exports.markAttendance = async (req, res) => {

  const { student_id, class_id, advisor_id, date, status } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO attendance
       (student_id, class_id, advisor_id, date, status)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [student_id, class_id, advisor_id, date, status]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

};


/* GET ATTENDANCE BY CLASS */

exports.getClassAttendance = async (req, res) => {

  const { class_id } = req.params;

  try {

    const result = await pool.query(`
      SELECT 
        attendance.*,
        students.name AS student_name
      FROM attendance
      JOIN students 
        ON attendance.student_id = students.id
      WHERE attendance.class_id = $1
      ORDER BY attendance.date DESC
    `, [class_id]);

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

};


/* GET ATTENDANCE BY STUDENT */

exports.getStudentAttendance = async (req, res) => {

  const { student_id } = req.params;

  try {

    const result = await pool.query(
      `SELECT *
       FROM attendance
       WHERE student_id = $1
       ORDER BY date DESC`,
      [student_id]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

};