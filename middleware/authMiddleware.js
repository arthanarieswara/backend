const jwt = require("jsonwebtoken");

/* AUTHENTICATE TOKEN */

function authenticateToken(req, res, next) {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();

  });

}


/* AUTHORIZE ROLES */

function authorizeRoles(...allowedRoles) {

  return (req, res, next) => {

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();

  };

}


module.exports = {
  authenticateToken,
  authorizeRoles
};