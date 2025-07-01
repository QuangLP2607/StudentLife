const { Note } = require("../models");
const { validationResult } = require("express-validator");
const response = require("../utils/response");

//----------------------- Tạo ghi chú ---------------------------------------
exports.createNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return response.validationError(res, errors);

  try {
    const user_id = req.userId;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return response.badRequest(res, "Nội dung ghi chú không được để trống");
    }

    const note = await Note.create({ user_id, content });

    return response.created(res, "Tạo ghi chú thành công", { note });
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Lấy tất cả ghi chú theo user_id ---------------------------------------
exports.getAllNotes = async (req, res) => {
  try {
    const user_id = req.userId;

    const notes = await Note.findAll({
      where: { user_id },
      order: [["posted_at", "DESC"]],
    });

    return response.success(res, "Lấy danh sách ghi chú thành công", { notes });
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Lấy ghi chú theo id ---------------------------------------
exports.getNoteById = async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Note.findByPk(id);

    if (!note) {
      return response.notFound(res, "Ghi chú");
    }

    return response.success(res, "Lấy ghi chú thành công", { note });
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Cập nhật ghi chú ---------------------------------------
exports.updateNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return response.validationError(res, errors);

  try {
    const id = req.params.id;
    const { content } = req.body;

    const note = await Note.findByPk(id);
    if (!note) {
      return response.notFound(res, "Ghi chú");
    }

    note.content = content || note.content;
    note.updated_at = new Date();

    await note.save();

    return response.success(res, "Cập nhật ghi chú thành công", { note });
  } catch (error) {
    return response.error(res);
  }
};

//----------------------- Xóa ghi chú ---------------------------------------
exports.deleteNote = async (req, res) => {
  try {
    const id = req.params.id;

    const note = await Note.findByPk(id);
    if (!note) {
      return response.notFound(res, "Ghi chú");
    }

    await note.destroy();

    return response.deleted(res);
  } catch (error) {
    return response.error(res);
  }
};
