const { Schedule } = require("../models");

// ✅ Tạo mới một Schedule cho một Course
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

    res
      .status(201)
      .json({ message: "Tạo lịch học thành công", schedule: newSchedule });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo lịch học", error });
  }
};

// ✅ Lấy tất cả schedules theo course_id
exports.getSchedulesByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const schedules = await Schedule.findAll({
      where: { course_id: courseId },
    });

    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy lịch học", error });
  }
};

// ✅ Cập nhật lịch học theo ID
exports.updateSchedule = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Schedule.update(req.body, { where: { id } });

    if (updated[0] === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch học để cập nhật" });
    }

    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật lịch học", error });
  }
};

// ✅ Xoá lịch học theo ID
exports.deleteSchedule = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Schedule.destroy({ where: { id } });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch học để xoá" });
    }

    res.status(200).json({ message: "Xoá lịch học thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá lịch học", error });
  }
};
