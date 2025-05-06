const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Middleware để xác thực token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    req.userId = decoded.userId;
    console.log("check", req.userId);
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = { authenticateToken };
