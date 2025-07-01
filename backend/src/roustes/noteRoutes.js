const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Tạo ghi chú
router.post("/add", authenticateToken, noteController.createNote);

// Lấy tất cả ghi chú theo user
router.get("/", authenticateToken, noteController.getAllNotes);

// Cập nhật ghi chú
router.put("/:id", authenticateToken, noteController.updateNote);

// Xóa ghi chú
router.delete("/:id", authenticateToken, noteController.deleteNote);

module.exports = router;
