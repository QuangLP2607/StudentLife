const { Course, Schedule } = require("../models");

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

    res.status(201).json({
      message: "Tạo môn học thành công",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo môn học",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: ["semester"], // alias defined in model
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách môn học",
      error: error.message,
    });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: ["semester"],
    });

    if (!course)
      return res.status(404).json({ message: "Không tìm thấy môn học" });

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy môn học",
      error: error.message,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const [updated] = await Course.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy môn học" });

    const updatedCourse = await Course.findByPk(req.params.id);
    res.status(200).json({
      message: "Đã cập nhật môn học",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật môn học",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.destroy({ where: { id: req.params.id } });

    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy môn học" });

    res.status(200).json({ message: "Đã xóa môn học" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa môn học",
      error: error.message,
    });
  }
};
