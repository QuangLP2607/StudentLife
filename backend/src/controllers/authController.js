const bcrypt = require("bcryptjs");
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
  if (!errors.isEmpty()) return response.validationError(res, errors);

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return response.conflict(res, "Email đã được sử dụng");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return response.created(res, "Đăng ký thành công");
  } catch (err) {
    return response.error(res);
  }
};

//----------------------- Đăng nhập ---------------------------------------
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return response.validationError(res, errors);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return response.unauthorized(res, "Email hoặc mật khẩu không đúng");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.unauthorized(res, "Email hoặc mật khẩu không đúng");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
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
    return response.error(res);
  }
};

//----------------------- Làm mới Access Token ---------------------------------------
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return response.badRequest(res, "Thiếu refresh token");
  }

  try {
    const newAccessToken = refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      return response.forbidden(
        res,
        "Refresh token không hợp lệ hoặc đã hết hạn"
      );
    }

    return response.success(res, "Làm mới token thành công", {
      accessToken: newAccessToken,
    });
  } catch (err) {
    return response.error(res);
  }
};
