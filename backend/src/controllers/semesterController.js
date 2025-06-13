const { Semester, Course, Schedule, sequelize } = require("../models");
const { validationResult } = require("express-validator");
const response = require("../utils/response");

//----------------------- Tạo kỳ học ---------------------------------------
exports.createSemester = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.validationError(res, errors);
  }

  const t = await sequelize.transaction();

  try {
    const user_id = req.userId;
    const { name, start_date, end_date, weeks, courses } = req.body;

    // Tạo semester
    const semester = await Semester.create(
      { user_id, name, start_date, end_date, weeks },
      { transaction: t }
    );

    // Duyệt từng course
    for (const courseData of courses) {
      const { name: courseName, schedules } = courseData;

      // Tạo course
      const course = await Course.create(
        { name: courseName, semester_id: semester.id },
        { transaction: t }
      );

      // Nếu có schedule thì thêm
      if (Array.isArray(schedules)) {
        const scheduleData = schedules.map((s) => ({
          ...s,
          course_id: course.id,
        }));
        await Schedule.bulkCreate(scheduleData, { transaction: t });
      }
    }

    await t.commit();
    return response.success(
      res,
      "Tạo kỳ học thành công",
      {
        semester_id: semester.id,
      },
      201
    );
  } catch (error) {
    await t.rollback();
    console.error("Create Semester Error:", error);
    return response.error(res, 500, "Lỗi khi tạo kỳ học", {
      message: error.message,
    });
  }
};

//----------------------- Lấy chi tiết kỳ học ---------------------------------------
exports.getSemesterDetail = async (req, res) => {
  const { semester_id } = req.params;

  try {
    const semester = await Semester.findByPk(semester_id, {
      include: [
        {
          model: Course,
          as: "courses", // Alias đã khai báo trong mối quan hệ model
          include: [
            {
              model: Schedule,
              as: "schedules", // Alias đúng theo mối quan hệ trong model
            },
          ],
        },
      ],
    });

    if (!semester) {
      return response.error(res, 404, "Không tìm thấy kỳ học");
    }

    return response.success(res, "Lấy chi tiết kỳ học thành công", {
      semester,
    });
  } catch (err) {
    console.error(err);
    return response.error(res, 500, "Lỗi khi lấy chi tiết kỳ học", {
      error: err.message,
    });
  }
};

//----------------------- Lấy tất cả kỳ học ---------------------------------------
exports.getSemesters = async (req, res) => {
  const user_id = req.userId;

  try {
    const semesters = await Semester.findAll({
      attributes: ["id", "name"],
      where: { user_id },
      order: [["createdAt", "DESC"]],
    });

    return response.success(res, "Lấy danh sách kỳ học thành công", {
      semesters,
    });
  } catch (err) {
    console.error(err);
    return response.error(res, 500, "Lỗi khi lấy danh sách kỳ học", {
      error: err.message,
    });
  }
};

//----------------------- Update tên kỳ ---------------------------------------
exports.renameSemester = async (req, res) => {
  const { semester_id, new_name } = req.body;

  if (!semester_id || !new_name) {
    return response.error(res, 400, "Thiếu semester_id hoặc new_name");
  }

  try {
    const semester = await Semester.findByPk(semester_id);

    if (!semester) {
      return response.error(res, 404, "Không tìm thấy kỳ học");
    }

    semester.name = new_name;
    await semester.save();

    return response.success(res, "Cập nhật tên kỳ học thành công");
  } catch (err) {
    console.error(err);
    return response.error(res, 500, "Lỗi khi cập nhật tên kỳ học", {
      error: err.message,
    });
  }
};

//----------------------- Xóa kỳ học ---------------------------------------
exports.deleteSemester = async (req, res) => {
  const { semester_id } = req.body;

  if (!semester_id) {
    return response.error(res, 400, "Thiếu semester_id");
  }

  try {
    const semester = await Semester.findByPk(semester_id);

    if (!semester) {
      return response.error(res, 404, "Không tìm thấy kỳ học");
    }

    // Xóa kỳ học (các course và schedule sẽ tự động bị xóa nhờ cascade)
    await semester.destroy();

    return response.success(res, "Xóa kỳ học thành công");
  } catch (err) {
    console.error(err);
    return response.error(res, 500, "Lỗi khi xóa kỳ học", {
      error: err.message,
    });
  }
};
