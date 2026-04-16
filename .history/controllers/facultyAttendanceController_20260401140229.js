const db = require("../config/db");

/* ===============================
   MARK FACULTY ATTENDANCE
================================ */

exports.markFacultyAttendance = async (req, res) => {
  const { faculty_id, date, status, in_time, out_time, half_type } = req.body;

  try {
    if (!faculty_id || !date || !status) {
      return res.status(400).json({
        message: "faculty_id, date, status required",
      });
    }

    await db.query(
      `
      INSERT INTO faculty_attendance
      (faculty_id, date, status, in_time, out_time, half_type)
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [faculty_id, date, status, in_time || null, out_time || null, half_type || null]
    );

    res.json({ message: "Faculty attendance saved" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET FACULTY ATTENDANCE
================================ */

exports.getFacultyAttendance = async (req, res) => {
  const { date } = req.query;

  try {
    let query = `
      SELECT fa.*, f.name, f.employee_id
      FROM faculty_attendance fa
      JOIN faculty f ON fa.faculty_id = f.id
    `;

    let params = [];

    if (date) {
      query += " WHERE fa.date = $1";
      params.push(date);
    }

    query += " ORDER BY fa.date DESC";

    const result = await db.query(query, params);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};