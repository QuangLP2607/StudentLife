const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/add", authenticateToken, postController.createPost);
router.get("/", authenticateToken, postController.getPosts); // GET /posts

router.get("/all", authenticateToken, postController.getAllPosts);

module.exports = router;
