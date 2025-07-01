const cloudinary = require("../config/cloudinaryConfig");
const { success, created, error, badRequest } = require("../utils/response");

const uploadFile = (req, res) => {
  const file = req.file;
  if (!file) {
    return badRequest(res, "Không có file được tải lên.");
  }

  return created(res, "Tải file thành công", {
    fileUrl: file.path,
    originalName: file.originalname,
  });
};

const listFiles = async (req, res) => {
  let { course_id } = req.query;
  const user_id = req.userId;

  course_id = course_id || "no-course";
  const folderPath = `web_student-life/${user_id}/${course_id}`;

  try {
    const result = await cloudinary.search
      .expression(`folder:${folderPath}`)
      .sort_by("created_at", "desc")
      .max_results(50)
      .execute();

    const files = result.resources.map((file) => ({
      url: file.secure_url,
      filename: file.filename,
      originalFilename: file.original_filename,
      format: file.format,
      createdAt: file.created_at,
    }));

    return success(res, "Lấy danh sách file thành công", { files });
  } catch (err) {
    console.error("Lỗi lấy file từ Cloudinary:", err);
    return error(res, 500, "Lỗi khi lấy danh sách file");
  }
};

module.exports = {
  uploadFile,
  listFiles,
};
