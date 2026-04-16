const pool = require("../config/db");

const getAdminDashboard = async (req, res) => {
  try {

    const students = await pool.query("SELECT COUNT(*) FROM students");
    const faculty = await pool.query("SELECT COUNT(*) FROM faculty");
    const departments = await pool.query("SELECT COUNT(*) FROM departments");
    const fees = await pool.query("SELECT COALESCE(SUM(amount),0) FROM fees");

    res.json({
      students: students.rows[0].count,
      faculty: faculty.rows[0].count,
      departments: departments.rows[0].count,
      fees: fees.rows[0].coalesce
    });

  } catch (error) {

    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = { getAdminDashboard };