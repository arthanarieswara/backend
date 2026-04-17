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
   MARK ATTENDANCE (NO DUPLICATE)
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
      [user_id]
    );

    if (!faculty.rows.length) {
      return res.status(400).json({ message: "Faculty not mapped" });
    }

    const faculty_id = faculty.rows[0].faculty_id;

    const periods = whole_day
      ? [1, 2, 3, 4, 5, 6, 7, 8]
      : [period];

    for (let p of periods) {
      for (let rec of attendance) {
        await db.query(
          `INSERT INTO attendance
          (student_id, faculty_id, date, period, status, section)
          VALUES ($1,$2,$3,$4,$5,$6)
          ON CONFLICT (student_id, date, period, section)
          DO UPDATE SET status = EXCLUDED.status`,
          [rec.student_id, faculty_id, date, p, rec.status, section]
        );
      }
    }

    res.json({ message: "Attendance saved successfully" });
  } catch (err) {
    console.error("Attendance Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   CLASS-WISE SUMMARY
================================ */
exports.getClassWiseSummary = async (req, res) => {
  const { date, department_id } = req.query;

  try {
    const result = await db.query(
      `
      SELECT 
        s.semester,
        s.section,
        COUNT(DISTINCT CASE WHEN a.status='Present' THEN a.student_id END) AS present,
        COUNT(DISTINCT CASE WHEN a.status='Absent' THEN a.student_id END) AS absent,
        COUNT(DISTINCT a.student_id) AS total
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.date = $1
      AND s.department_id = $2
      GROUP BY s.semester, s.section
      ORDER BY s.semester, s.section
      `,
      [date, department_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Class Summary Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   DEPARTMENT SUMMARY
================================ */
exports.getDepartmentSummary = async (req, res) => {
  const { date } = req.query;

  try {
    const result = await db.query(
      `
      SELECT 
        d.name AS department,
        COUNT(DISTINCT CASE WHEN a.status='Present' THEN a.student_id END) AS present,
        COUNT(DISTINCT CASE WHEN a.status='Absent' THEN a.student_id END) AS absent,
        COUNT(DISTINCT a.student_id) AS total
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN departments d ON s.department_id = d.id
      WHERE a.date = $1
      GROUP BY d.name
      ORDER BY d.name
      `,
      [date]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Department Summary Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


