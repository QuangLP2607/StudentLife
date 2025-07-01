const { Schedule } = require("../models");
const response = require("../utils/response");

//----------------------- Tạo lịch học ---------------------------------------
exports.createSchedule = async (req, res) => {
  try {
    const {
      course_id,
      start_time,
      end_time,
      day,
      week_type,
      custom_weeks,
      location,
    } = req.body;

    const newSchedule = await Schedule.create({
      course_id,
      start_time,
      end_time,
      day,
      week_type,
      custom_weeks,
      location,
    });

    return response.created(res, "Tạo lịch học thành công", {
      schedule: newSchedule,
    });
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Lấy tất cả lịch học theo course_id ---------------------------------------
exports.getSchedulesByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const schedules = await Schedule.findAll({
      where: { course_id: courseId },
    });

    return response.success(res, "Lấy lịch học thành công", { schedules });
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Cập nhật lịch học theo ID ---------------------------------------
exports.updateSchedule = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Schedule.update(req.body, { where: { id } });

    if (updated === 0) {
      return response.notFound(res, "Không tìm thấy lịch học để cập nhật");
    }

    return response.success(res, "Cập nhật lịch học thành công");
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Xoá lịch học theo ID ---------------------------------------
exports.deleteSchedule = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Schedule.destroy({ where: { id } });

    if (!deleted) {
      return response.notFound(res, "Không tìm thấy lịch học để xoá");
    }

    return response.success(res, "Xoá lịch học thành công");
  } catch (error) {
    return response.error(res);
  }
};
