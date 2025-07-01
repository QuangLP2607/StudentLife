const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Tạo mới course (có thể bao gồm schedules)
router.post("/", authenticateToken, courseController.createCourse);

// Lấy 1 course theo ID
router.get("/detail/:id", authenticateToken, courseController.getCourseById);

// Lấy tất cả courses
router.get("/", authenticateToken, courseController.getAllCourses);

// Cập nhật course
router.put("/:id", authenticateToken, courseController.updateCourse);

// Xóa course
router.delete("/:id", authenticateToken, courseController.deleteCourse);

module.exports = router;
