const db = require("../config/db");

/* ===============================
   MARK CLASS ATTENDANCE
================================ */

exports.markAttendance = async (req, res) => {
  const { class_id, subject_id, faculty_id, date, attendance } = req.body;

  try {
    console.log("Incoming Attendance:", req.body);

    /* ✅ VALIDATION */
    if (!class_id || !subject_id || !date || !attendance?.length) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    for (let record of attendance) {
      if (!record.student_id || !record.status) continue;

      await db.query(
        `INSERT INTO attendance
        (student_id, class_id, subject_id, faculty_id, date, status)
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (student_id, class_id, subject_id, date)
        DO UPDATE SET status = EXCLUDED.status`,
        [
          record.student_id,
          class_id,
          subject_id,
          faculty_id,
          date,
          record.status,
        ]
      );
    }

    res.json({ message: "Attendance saved successfully" });

  } catch (error) {
    console.error("Attendance Error:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
/* ===============================
   GET STUDENT ATTENDANCE
================================ */

exports.getStudentAttendance = async (req, res) => {
  const { student_id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        attendance.id,
        attendance.date,
        attendance.status,
        subjects.name AS subject
      FROM attendance
      JOIN subjects
      ON attendance.subject_id = subjects.id
      WHERE attendance.student_id = $1
      ORDER BY attendance.date DESC
    `,
      [student_id],
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET SUBJECT ATTENDANCE
================================ */

exports.getSubjectAttendance = async (req, res) => {
  const { subject_id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT
      attendance.id,
      attendance.date,
      attendance.status,
      students.name AS student
      FROM attendance
      JOIN students
      ON attendance.student_id = students.id
      WHERE attendance.subject_id = $1
      ORDER BY attendance.date DESC
    `,
      [subject_id],
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET STUDENTS BY CLASS
================================ */

exports.getClassStudents = async (req, res) => {
  const { class_id } = req.params;

  try {
    const result = await db.query(
      `SELECT id,name
       FROM students
       WHERE class_id=$1
       ORDER BY name`,
      [class_id],
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentsByDeptSemester = async (req, res) => {
  const { department_id, semester } = req.query;

  try {
    const result = await db.query(
      `SELECT * FROM students
       WHERE department_id=$1
       AND semester=$2`,
      [department_id, semester],
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
