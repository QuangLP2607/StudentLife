const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

// POST: Tạo mới lịch học
router.post("/add", scheduleController.createSchedule);

// GET: Lấy tất cả lịch học theo course_id
router.get("/course/:courseId", scheduleController.getSchedulesByCourse);

// PUT: Cập nhật lịch học
router.put("/:id", scheduleController.updateSchedule);

// DELETE: Xoá lịch học
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;
