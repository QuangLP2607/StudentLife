const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validationResult } = require("express-validator");
const response = require("../utils/response");
const {
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
} = require("../services/tokenService");

//----------------------- Đăng ký ---------------------------------------
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.validationError(res, errors);
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return response.error(res, 400, "Email đã được sử dụng", {
        email: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword });

    return response.success(res, "Đăng ký thành công", {}, 201);
  } catch (err) {
    return response.error(res);
  }
};

//----------------------- Đăng nhập ---------------------------------------
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.validationError(res, errors);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return response.error(res, 401, "Email hoặc mật khẩu không đúng");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.error(res, 401, "Email hoặc mật khẩu không đúng");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Lưu refreshToken vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.success(res, "Đăng nhập thành công", {
      accessToken,
      user: {
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    console.error(err);
    return response.error(res);
  }
};

//-----------------------  Làm mới refreshToken ---------------------------------------
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return response.error(res, 400, "Missing refresh token");
  }

  const newAccessToken = refreshAccessToken(refreshToken);

  if (!newAccessToken) {
    return response.error(res, 403, "Invalid or expired refresh token");
  }

  return response.success(res, "Token refreshed successfully", {
    accessToken: newAccessToken,
  });
};
