const db = require("../config/db");

exports.markAttendance = async (req, res) => {
  const { class_id, subject_id, faculty_id, date, attendance } = req.body;

  try {
    for (let record of attendance) {
      await db.query(
        `INSERT INTO attendance
(student_id,class_id,subject_id,faculty_id,date,status)
VALUES ($1,$2,$3,$4,$5,$6)
ON CONFLICT (student_id,class_id,subject_id,date)
DO UPDATE SET status = EXCLUDED.status`,

        [
          record.student_id,
          class_id,
          subject_id,
          faculty_id,
          date,
          record.status,
        ],
      );
    }

    res.json({ message: "Class attendance saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }

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
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};
