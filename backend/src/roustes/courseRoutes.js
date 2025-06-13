const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// Tạo mới course (có thể bao gồm schedules)
router.post("/", courseController.createCourse);

// Lấy tất cả courses
router.get("/", courseController.getAllCourses);

// Lấy 1 course theo ID
router.get("/:id", courseController.getCourseById);

// Cập nhật course
router.put("/:id", courseController.updateCourse);

// Xóa course
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
