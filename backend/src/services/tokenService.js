const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

function refreshAccessToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    return generateAccessToken(decoded.userId);
  } catch (error) {
    return null;
  }
}

function generateTokens(userId) {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
  generateTokens,
};
