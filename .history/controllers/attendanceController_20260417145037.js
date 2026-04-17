const db = require("../config/db");

/* ===============================
   GET STUDENTS BY DEPT + SEM + SECTION
================================ */

exports.getStudentsByDeptSemester = async (req, res) => {
  const { department_id, semester, section } = req.query;

  try {
    let query = `
      SELECT * FROM students
      WHERE department_id=$1
      AND semester=$2
    `;

    let params = [department_id, semester];

    if (section) {
      params.push(section);
      query += ` AND section=$${params.length}`;
    }

    query += ` ORDER BY roll_number ASC`;

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("Student Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   MARK / UPDATE ATTENDANCE
================================ */

exports.markAttendance = async (req, res) => {
  const { date, period, section, attendance, whole_day } = req.body;
  const user_id = req.user.id;

  try {
    if (!date || !section || !attendance?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const faculty = await db.query(
      `SELECT faculty_id FROM user_mapping WHERE user_id=$1`,
      [user_id],
    );

    const faculty_id = faculty.rows[0].faculty_id;

    const periods = whole_day ? [1, 2, 3, 4, 5, 6, 7, 8] : [period];

    for (let p of periods) {
      for (let rec of attendance) {
        await db.query(
          `INSERT INTO attendance
          (student_id, faculty_id, date, period, status, section)
          VALUES ($1,$2,$3,$4,$5,$6)
          ON CONFLICT (student_id, date, period, section)
          DO UPDATE SET status = EXCLUDED.status`,
          [rec.student_id, faculty_id, date, p, rec.status, section],
        );
      }
    }

    res.json({ message: "Attendance saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
        a.id,
        a.date,
        a.period,
        a.status,
        a.section,
        sub.name AS subject_name
      FROM attendance a
      JOIN subjects sub ON a.subject_id = sub.id
      WHERE a.student_id = $1
      ORDER BY a.date DESC
      `,
      [student_id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Student Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET ATTENDANCE FOR EDIT
================================ */

exports.getAttendanceForEdit = async (req, res) => {
  const { subject_id, date, period, section } = req.query;

  try {
    const result = await db.query(
      `
      SELECT 
        student_id,
        status
      FROM attendance
      WHERE subject_id=$1
      AND date=$2
      AND period=$3
      AND section=$4
      `,
      [subject_id, date, period, section],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Edit Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ATTENDANCE SUMMARY
================================ */

exports.getAttendanceSummary = async (req, res) => {
  const { subject_id, date, period, semester, section } = req.query;

  try {
    if (!date) {
      return res.status(400).json({
        message: "date is required",
      });
    }

    let params = [date];
    let condition = `WHERE a.date = $1`;

    if (subject_id) {
      params.push(subject_id);
      condition += ` AND a.subject_id = $${params.length}`;
    }

    if (semester) {
      params.push(semester);
      condition += ` AND s.semester = $${params.length}`;
    }

    if (section) {
      params.push(section);
      condition += ` AND s.section = $${params.length}`;
    }

    if (period) {
      params.push(period);

      const result = await db.query(
        `
        SELECT
          COUNT(*) FILTER (WHERE a.status = 'Present') AS present_count,
          COUNT(*) FILTER (WHERE a.status = 'Absent') AS absent_count,
          COUNT(*) AS total_students
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        ${condition}
        AND a.period = $${params.length}
        `,
        params,
      );

      return res.json(result.rows[0]);
    }

    res.json({ message: "Summary fetched" });
  } catch (error) {
    console.error("Summary Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
