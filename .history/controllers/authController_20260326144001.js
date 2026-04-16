const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER USER ================= */

exports.registerUser = async (req, res) => {
  const { name, email, password, role, department_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, department_id)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id,name,email,role,department_id`,
      [name, email, hashedPassword, role, department_id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    delete user.password;

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET USERS ================= */

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
    users.id,
    users.name,
    users.email,
    users.role,
    users.department_id,
    departments.name AS department_name,
    faculty.name AS faculty_name,
    faculty.designation
   FROM users
   LEFT JOIN departments 
     ON users.department_id = departments.id
   LEFT JOIN faculty 
     ON users.email = faculty.email
   ORDER BY users.id DESC`,
    );x

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE USER ================= */

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, department_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET name=$1,
           email=$2,
           role=$3,
           department_id=$4
       WHERE id=$5
       RETURNING id,name,email,role,department_id`,
      [name, email, role, department_id, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE USER ================= */

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id=$1", [id]);

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
