const express = require("express");
const router = express.Router();
const semesterController = require("../controllers/semesterController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Tạo kỳ học mới
router.post("/add", authenticateToken, semesterController.createSemester);

// Cập nhật học kỳ
router.put("/:id", authenticateToken, semesterController.updateSemester);

// Lấy thông tin chi tiết kỳ học
router.get(
  "/detail/:semester_id",
  authenticateToken,
  semesterController.getSemesterDetail
);

// Lấy danh sách kỳ tất cả học kỳ
router.get("/", authenticateToken, semesterController.getSemesters);

// Đổi tên kỳ học
router.post("/rename", authenticateToken, semesterController.renameSemester);

// Xóa kỳ học
router.post("/delete", authenticateToken, semesterController.deleteSemester);

module.exports = router;
