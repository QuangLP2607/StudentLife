const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Tạo mới lịch học
router.post("/add", authenticateToken, scheduleController.createSchedule);

// Lấy tất cả lịch học theo course_id
router.get(
  "/course/:courseId",
  authenticateToken,
  scheduleController.getSchedulesByCourse
);

// Cập nhật lịch học
router.put("/:id", authenticateToken, scheduleController.updateSchedule);

// Xoá lịch học
router.delete("/:id", authenticateToken, scheduleController.deleteSchedule);

module.exports = router;
