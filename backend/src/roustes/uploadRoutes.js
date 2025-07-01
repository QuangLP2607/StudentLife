const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const uploadController = require("../controllers/uploadController");
const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const user_id = req.userId;
    const course_id = req.query.course_id || "no-course";

    const nameWithoutExt = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const uniqueName = `${nameWithoutExt}-${Date.now()}${ext}`;

    return {
      folder: `web_student-life/${user_id}/${course_id}`,
      public_id: uniqueName,
      resource_type: "raw",
    };
  },
});

const upload = multer({ storage });

router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  uploadController.uploadFile
);
router.get("/list", authenticateToken, uploadController.listFiles);

module.exports = router;
