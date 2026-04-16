const db = require("../config/db");

/* GET FACULTY */

exports.getFaculty = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT 
        faculty.id,
        faculty.employee_id,
        faculty.name,
        faculty.email,
        faculty.phone,
        faculty.designation,
        faculty.department_id,
        departments.name AS department_name
      FROM faculty
      LEFT JOIN departments
      ON faculty.department_id = departments.id
      ORDER BY faculty.id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Server error" });

  }

};


/* ADD FACULTY */

exports.addFaculty = async (req, res) => {

  const { employee_id, name, email, phone, department_id, designation } = req.body;

  try {

    await db.query(
      `INSERT INTO faculty 
      (employee_id, name, email, phone, department_id, designation)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [employee_id, name, email, phone, department_id, designation]
    );

    res.json({ message: "Faculty added" });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Server error" });

  }

};


/* UPDATE FACULTY */

exports.updateFaculty = async (req, res) => {

  const { id } = req.params;
  const { employee_id, name, email, phone, department_id, designation } = req.body;

  try {

    await db.query(
      `UPDATE faculty
       SET employee_id=$1,
           name=$2,
           email=$3,
           phone=$4,
           department_id=$5,
           designation=$6
       WHERE id=$7`,
      [employee_id, name, email, phone, department_id, designation, id]
    );

    res.json({ message: "Faculty updated" });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Server error" });

  }

};


/* DELETE FACULTY */

exports.deleteFaculty = async (req, res) => {

  const { id } = req.params;

  try {

    await db.query(
      "DELETE FROM faculty WHERE id=$1",
      [id]
    );

    res.json({ message: "Faculty deleted" });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Server error" });

  }

};