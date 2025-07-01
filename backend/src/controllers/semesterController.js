const { Semester, Course, Schedule, sequelize } = require("../models");
const { validationResult } = require("express-validator");
const response = require("../utils/response");

//----------------------- Tạo kỳ học ---------------------------------------
exports.createSemester = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.validationError(res, errors);
  }

  const transaction = await sequelize.transaction();

  try {
    const user_id = req.userId;
    const { name, start_date, end_date, weeks, courses = [] } = req.body;

    const semester = await Semester.create(
      { user_id, name, start_date, end_date, weeks },
      { transaction }
    );

    for (const course of courses) {
      const { name: courseName, schedules = [] } = course;

      const createdCourse = await Course.create(
        { name: courseName, semester_id: semester.id },
        { transaction }
      );

      if (Array.isArray(schedules) && schedules.length > 0) {
        const scheduleData = schedules.map((s) => ({
          ...s,
          course_id: createdCourse.id,
        }));

        await Schedule.bulkCreate(scheduleData, { transaction });
      }
    }

    await transaction.commit();

    return response.created(res, "Tạo kỳ học thành công", {
      semester_id: semester.id,
    });
  } catch (error) {
    await transaction.rollback();
    return response.error(res);
  }
};

//----------------------- Cập nhật học kỳ ---------------------------------------
exports.updateSemester = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.validationError(res, errors);
  }

  const transaction = await sequelize.transaction();

  try {
    const user_id = req.userId;
    const semesterId = req.params.id;
    const { name, start_date, end_date, weeks, courses = [] } = req.body;

    // Kiểm tra học kỳ có tồn tại và thuộc về người dùng không
    const semester = await Semester.findOne({
      where: { id: semesterId, user_id },
    });

    if (!semester) {
      await transaction.rollback();
      return response.notFound(res, "Không tìm thấy học kỳ!");
    }

    // Cập nhật thông tin học kỳ
    await semester.update(
      { name, start_date, end_date, weeks },
      { transaction }
    );

    // Lấy danh sách course hiện có
    const existingCourses = await Course.findAll({
      where: { semester_id: semesterId },
      transaction,
    });

    const existingCourseIds = existingCourses.map((c) => c.id);
    const incomingCourseIds = courses.filter((c) => c.id).map((c) => c.id);

    // Xoá các course và schedule không còn nữa
    const coursesToDelete = existingCourseIds.filter(
      (id) => !incomingCourseIds.includes(id)
    );

    for (const id of coursesToDelete) {
      await Schedule.destroy({ where: { course_id: id }, transaction });
      await Course.destroy({ where: { id }, transaction });
    }

    // Xử lý từng course trong danh sách mới
    for (const course of courses) {
      const { id, name: courseName, schedules = [] } = course;

      let courseId = null;

      // Kiểm tra xem id có nằm trong danh sách courses hiện tại không
      const isExisting = id && existingCourseIds.includes(id);

      if (isExisting) {
        // Cập nhật course cũ
        await Course.update(
          { name: courseName },
          { where: { id }, transaction }
        );
        courseId = id;

        // Xoá lịch học cũ
        await Schedule.destroy({ where: { course_id: courseId }, transaction });
      } else {
        // Bỏ qua id không hợp lệ hoặc không tồn tại trong DB → tạo mới
        const newCourse = await Course.create(
          { name: courseName, semester_id: semesterId },
          { transaction }
        );
        courseId = newCourse.id;
      }

      // Tạo lại schedule
      if (Array.isArray(schedules) && schedules.length > 0) {
        const scheduleData = schedules.map((s) => ({
          ...s,
          course_id: courseId,
        }));
        await Schedule.bulkCreate(scheduleData, { transaction });
      }
    }

    await transaction.commit();
    return response.success(res, "Cập nhật học kỳ thành công!");
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return response.error(res);
  }
};

//----------------------- Lấy chi tiết kỳ học ---------------------------------------
exports.getSemesterDetail = async (req, res) => {
  try {
    const { semester_id } = req.params;

    if (!semester_id) {
      return response.badRequest(res, "Thiếu semester_id");
    }

    const semester = await Semester.findByPk(semester_id, {
      include: [
        {
          model: Course,
          as: "courses",
          include: [
            {
              model: Schedule,
              as: "schedules",
            },
          ],
        },
      ],
    });

    if (!semester) {
      return response.notFound(res, "Kỳ học");
    }

    return response.success(res, "Lấy chi tiết kỳ học thành công", {
      semester,
    });
  } catch (err) {
    return response.error(res);
  }
};

//----------------------- Lấy tất cả kỳ học ---------------------------------------
exports.getSemesters = async (req, res) => {
  try {
    const user_id = req.userId;

    const semesters = await Semester.findAll({
      where: { user_id },
      attributes: ["id", "name", "start_date", "weeks"],
      order: [["createdAt", "DESC"]],
    });

    return response.success(res, "Lấy danh sách kỳ học thành công", {
      semesters,
    });
  } catch (err) {
    return response.error(res);
  }
};

//----------------------- Đổi tên kỳ học ---------------------------------------
exports.renameSemester = async (req, res) => {
  try {
    const { semester_id, new_name } = req.body;

    if (!semester_id || !new_name) {
      return response.badRequest(res, "Thiếu semester_id hoặc new_name");
    }

    const semester = await Semester.findByPk(semester_id);
    if (!semester) {
      return response.notFound(res, "Kỳ học");
    }

    semester.name = new_name;
    await semester.save();

    return response.success(res, "Cập nhật tên kỳ học thành công");
  } catch (err) {
    return response.error(res);
  }
};

//----------------------- Xóa kỳ học ---------------------------------------
exports.deleteSemester = async (req, res) => {
  try {
    const { semester_id } = req.body;

    if (!semester_id) {
      return response.badRequest(res, "Thiếu semester_id");
    }

    const semester = await Semester.findByPk(semester_id);
    if (!semester) {
      return response.notFound(res, "Kỳ học");
    }

    await semester.destroy();

    return response.success(res, "Xóa kỳ học thành công");
  } catch (err) {
    return response.error(res);
  }
};
