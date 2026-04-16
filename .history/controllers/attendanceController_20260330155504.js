const db = require("../config/db");

/* ===============================
   MARK CLASS ATTENDANCE
================================ */

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

/* ===============================
   MARK CLASS ATTENDANCE
================================ */

exports.markAttendance = async (req, res) => {
  const { class_id, subject_id, date, period, attendance } = req.body;
  const user_id = req.user.id;

  try {
    if (!subject_id || !date || !period || !attendance?.length) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (period < 1 || period > 8) {
      return res.status(400).json({
        message: "Invalid period (1-8 only)",
      });
    }

    /* GET FACULTY */
    const facultyResult = await db.query(
      `SELECT faculty_id FROM user_mapping WHERE user_id=$1`,
      [user_id],
    );

    if (!facultyResult.rows.length) {
      return res.status(400).json({
        message: "Faculty not mapped",
      });
    }

    const faculty_id = facultyResult.rows[0].faculty_id;

    /* INSERT ATTENDANCE */
    for (let record of attendance) {
      if (!record.student_id || !record.status) continue;

      await db.query(
        `INSERT INTO attendance
  (student_id, class_id, subject_id, faculty_id, date, period, status)
  VALUES ($1,$2,$3,$4,$5,$6,$7)
  ON CONFLICT (student_id, subject_id, date, period)
  DO UPDATE SET status = EXCLUDED.status`,
        [
          record.student_id,
          class_id || null,
          subject_id,
          faculty_id,
          date,
          period,
          record.status,
        ],
      );
    }

    res.json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/* ===============================
   GET ATTENDANCE SUMMARY
================================ */

exports.getAttendanceSummary = async (req, res) => {
  const { subject_id, date, period, semester } = req.query;

  try {
    if (!date) {
      return res.status(400).json({
        message: "date is required",
      });
    }

    let params = [date];
    let condition = `WHERE a.date = $1`;

    /* SUBJECT FILTER (OPTIONAL) */
    if (subject_id) {
      params.push(subject_id);
      condition += ` AND a.subject_id = $${params.length}`;
    }

    /* SEMESTER FILTER */
    if (semester) {
      params.push(semester);
      condition += ` AND s.semester = $${params.length}`;
    }

    /* ================= SINGLE PERIOD ================= */
    if (period) {
      params.push(period);

      const query = `
        SELECT
          COUNT(*) FILTER (WHERE a.status = 'Present') AS present_count,
          COUNT(*) FILTER (WHERE a.status = 'Absent') AS absent_count,
          COUNT(*) AS total_students
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        ${condition}
        AND a.period = $${params.length}
      `;

      const result = await db.query(query, params);

      return res.json({
        type: "single",
        data: result.rows[0],
      });
    }

    /* ================= ALL PERIODS ================= */

    let periodQuery = "";
    let periods;

    if (!subject_id) {
      // 🔥 FIX: INCLUDE SUBJECT NAME
      periodQuery = `
        SELECT
          a.subject_id,
          sub.name AS subject_name,
          a.period,
          COUNT(*) FILTER (WHERE a.status = 'Present') AS present_count,
          COUNT(*) FILTER (WHERE a.status = 'Absent') AS absent_count,
          COUNT(*) AS total_students
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN subjects sub ON a.subject_id = sub.id
        ${condition}
        GROUP BY a.subject_id, sub.name, a.period
        ORDER BY sub.name, a.period
      `;

      periods = await db.query(periodQuery, params);
    } else {
      // ✅ NORMAL (SINGLE SUBJECT)
      periodQuery = `
        SELECT
          a.period,
          COUNT(*) FILTER (WHERE a.status = 'Present') AS present_count,
          COUNT(*) FILTER (WHERE a.status = 'Absent') AS absent_count,
          COUNT(*) AS total_students
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        ${condition}
        GROUP BY a.period
        ORDER BY a.period
      `;

      periods = await db.query(periodQuery, params);
    }

    /* ================= TOTAL ================= */

    const totalQuery = `
      SELECT
        COUNT(*) FILTER (WHERE a.status = 'Present') AS present_count,
        COUNT(*) FILTER (WHERE a.status = 'Absent') AS absent_count,
        COUNT(*) AS total_students
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      ${condition}
    `;

    const total = await db.query(totalQuery, params);

    res.json({
      type: "all",
      periods: periods.rows,
      total: total.rows[0],
    });
  } catch (error) {
    console.error("Summary Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
