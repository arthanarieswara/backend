const pool = require("../config/db");

// GET ALL DEPARTMENTS
const getDepartments = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM departments ORDER BY id"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};

// ADD DEPARTMENT
const addDepartment = async (req, res) => {

  const { name } = req.body;

  try {

    const result = await pool.query(
      "INSERT INTO departments(name) VALUES($1) RETURNING *",
      [name]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};

// DELETE DEPARTMENT
const deleteDepartment = async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM departments WHERE id=$1",
      [id]
    );

    res.json({
      message: "Department deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};

// UPDATE DEPARTMENT
const updateDepartment = async (req, res) => {

  const { id } = req.params;
  const { name } = req.body;

  try {

    const result = await pool.query(
      "UPDATE departments SET name=$1 WHERE id=$2 RETURNING *",
      [name, id]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = {
  getDepartments,
  addDepartment,
  deleteDepartment,
  updateDepartment
};