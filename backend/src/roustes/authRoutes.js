const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Đăng xuất thành công" });
});

module.exports = router;
