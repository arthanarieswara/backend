const db = require("../config/db");

/* ===============================
   GET STUDENTS BY DEPT + SEM + SECTION
================================ */
exports.getStudentsByDeptSemester = async (req, res) => {
  let department_id = parseInt(req.query.department_id);
  let semester = parseInt(req.query.semester);
  let section = req.query.section;

  try {
    if (!department_id || !semester) {
      return res.status(400).json({
        message: "Department and Semester required",
      });
    }

    let query = `
      SELECT * FROM students
      WHERE department_id = $1
      AND semester = $2
    `;

    let params = [department_id, semester];

    // ✅ FIX: FORCE UPPERCASE MATCH
    if (section && section.trim() !== "") {
      params.push(section.trim().toUpperCase());
      query += ` AND UPPER(section) = $${params.length}`;
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
      [user_id],
    );

    if (!faculty.rows.length) {
      return res.status(400).json({ message: "Faculty not mapped" });
    }

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
      [date, department_id],
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
      [date],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Department Summary Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAttendanceSummary = async (req, res) => {
  const { date, department_id, semester, section } = req.query;

  try {
    /* ================= CONDITIONS ================= */
    let conditions = [`a.date = $1`];
    let params = [date];

    if (department_id) {
      params.push(department_id);
      conditions.push(`s.department_id = $${params.length}`);
    }

    if (semester) {
      params.push(semester);
      conditions.push(`s.semester = $${params.length}`);
    }

    if (section) {
      params.push(section);
      conditions.push(`s.section = $${params.length}`);
    }

    const whereClause = conditions.join(" AND ");

    /* ================= OVERALL ================= */
    const overall = await db.query(
      `
      SELECT 
        COUNT(*) FILTER (WHERE sub.day_status = 1) AS present_count,
        COUNT(*) FILTER (WHERE sub.day_status = 0) AS absent_count,
        COUNT(*) AS total_students
      FROM (
        SELECT 
          a.student_id,
          MAX(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS day_status
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE ${whereClause}
        GROUP BY a.student_id
      ) sub
      `,
      params,
    );

    /* ================= CLASS-WISE ================= */
    const classWise = await db.query(
      `
      SELECT 
        s.semester,
        s.section,
        COUNT(*) FILTER (WHERE sub.day_status = 1) AS present_count,
        COUNT(*) FILTER (WHERE sub.day_status = 0) AS absent_count,
        COUNT(*) AS total
      FROM (
        SELECT 
          a.student_id,
          MAX(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS day_status
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE ${whereClause}
        GROUP BY a.student_id
      ) sub
      JOIN students s ON sub.student_id = s.id
      GROUP BY s.semester, s.section
      ORDER BY s.semester, s.section
      `,
      params,
    );

    /* ================= DEPARTMENT-WISE ================= */
    const deptWise = await db.query(
      `
      SELECT 
        d.name AS department_name,
        COUNT(*) FILTER (WHERE sub.day_status = 1) AS present_count,
        COUNT(*) FILTER (WHERE sub.day_status = 0) AS absent_count,
        COUNT(*) AS total
      FROM (
        SELECT 
          a.student_id,
          MAX(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS day_status
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE ${whereClause}
        GROUP BY a.student_id
      ) sub
      JOIN students s ON sub.student_id = s.id
      JOIN departments d ON s.department_id = d.id
      GROUP BY d.name
      ORDER BY d.name
      `,
      params,
    );

    /* ================= RESPONSE ================= */
    res.json({
      overall: overall.rows[0],
      classWise: classWise.rows,
      departmentWise: deptWise.rows,
    });
  } catch (err) {
    console.error("Attendance Summary Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
