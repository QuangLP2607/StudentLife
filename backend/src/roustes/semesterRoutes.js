const express = require("express");
const router = express.Router();
const semesterController = require("../controllers/semesterController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Tạo kỳ học mới
router.post("/add", authenticateToken, semesterController.createSemester);

// Lấy danh sách kỳ học theo user_id
router.get("/detail/:semester_id", semesterController.getSemesterDetail);

// Lấy danh sách kỳ tất cả học kỳ
router.get("/", authenticateToken, semesterController.getSemesters);

// Đổi tên kỳ học
router.post("/rename", authenticateToken, semesterController.renameSemester);

// Xóa kỳ học
router.post("/delete", authenticateToken, semesterController.deleteSemester);

module.exports = router;
