const { Course, Schedule } = require("../models");
const response = require("../utils/response");

//----------------------- Tạo học phần ---------------------------------------
exports.createCourse = async (req, res) => {
  try {
    const { name, semester_id, schedules } = req.body;

    // Tạo course
    const course = await Course.create({ name, semester_id });

    // Nếu có schedule kèm theo, tạo luôn
    if (Array.isArray(schedules) && schedules.length > 0) {
      const scheduleData = schedules.map((schedule) => ({
        ...schedule,
        course_id: course.id,
      }));
      await Schedule.bulkCreate(scheduleData);
    }

    return response.created(res, "Tạo môn học thành công", course);
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Lấy danh sách học phần ---------------------------------------
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: ["semester"],
    });
    return response.success(res, "Lấy danh sách môn học thành công", courses);
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Lấy thông tin học phần ---------------------------------------
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: ["semester"],
    });

    if (!course) {
      return response.notFound(res, "Môn học");
    }

    return response.success(res, "Lấy môn học thành công", course);
  } catch (error) {
    return response.error(res, 500, "Lỗi khi lấy môn học", error.message);
  }
};

//----------------------- Update học phần ---------------------------------------
exports.updateCourse = async (req, res) => {
  try {
    const [updated] = await Course.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return response.notFound(res, "Môn học");
    }

    const updatedCourse = await Course.findByPk(req.params.id);
    return response.success(res, "Đã cập nhật môn học", updatedCourse);
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Xóa học phần ---------------------------------------
exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return response.notFound(res, "Môn học");
    }

    return response.deleted(res);
  } catch (error) {
    return response.error(res);
  }
};
