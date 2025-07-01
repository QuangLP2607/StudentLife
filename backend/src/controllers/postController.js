const { Post } = require("../models");
const response = require("../utils/response");

//----------------------- Tạo bài đăng ---------------------------------------
exports.createPost = async (req, res) => {
  try {
    const { course_id, group_id, title, content, week } = req.body;
    const user_id = req.userId;

    if (!title || !content) {
      return response.validationError(res, "Thiếu tiêu đề hoặc nội dung");
    }

    const newPost = await Post.create({
      course_id: course_id || null,
      group_id: group_id || null,
      user_id,
      title,
      content,
      week: week || null,
      posted_at: new Date(),
      updated_at: null,
    });

    return response.created(res, "Tạo bài đăng thành công", { post: newPost });
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Lấy danh sách bài đăng ---------------------------------------
exports.getPosts = async (req, res) => {
  try {
    const { courseId, studyGroupId } = req.query;

    if (!courseId && !studyGroupId) {
      return response.badRequest(res, errors);
    }

    const whereCondition = {};
    if (courseId) whereCondition.course_id = courseId;
    if (studyGroupId) whereCondition.group_id = studyGroupId;

    const posts = await Post.findAll({
      where: whereCondition,
      attributes: ["id", "title", "content", "week", "posted_at"],
      order: [["posted_at", "DESC"]],
    });

    return response.success(res, "Lấy danh sách bài đăng thành công", {
      posts,
    });
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Lấy tất cả bài đăng ---------------------------------------
exports.getAllPosts = async (req, res) => {
  try {
    const user_id = req.userId;
    const posts = await Post.findAll({
      where: { user_id },
      attributes: [
        "id",
        "title",
        "content",
        "week",
        "posted_at",
        "course_id",
        "group_id",
        "user_id",
      ],
      order: [["posted_at", "DESC"]],
    });

    return response.success(res, "Lấy toàn bộ bài đăng thành công", { posts });
  } catch (error) {
    return response.error(res);
  }
};
