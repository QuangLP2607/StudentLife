//----------------------- Success ---------------------------------------
// Tạo mới thành công (201 Created) - trả về resource mới
exports.created = (res, message = "Tạo thành công", data = {}) => {
  return res.status(201).json({
    status: "success",
    message,
    data,
  });
};

// Thành công chung (200 OK) - trả về dữ liệu bình thường
exports.success = (res, message = "Thành công", data = {}) => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

// Cập nhật thành công (200 OK) - trả về dữ liệu đã cập nhật
exports.updated = (res, message = "Cập nhật thành công", data = {}) => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

// Xóa thành công (204 No Content) - KHÔNG có body trả về theo chuẩn HTTP
exports.deleted = (res) => {
  return res.status(204).send();
};

//----------------------- Error ---------------------------------------
// Lỗi chung (400, 401, 403, 404, 500, ...)
exports.error = (
  res,
  statusCode = 500,
  message = "Lỗi máy chủ",
  errors = null
) => {
  const payload = {
    status: "error",
    message,
  };
  if (errors) payload.errors = errors;

  return res.status(statusCode).json(payload);
};

// Lỗi xác thực đầu vào (400 Bad Request)
exports.validationError = (res, validationResult) => {
  const errors = validationResult.array().reduce((acc, err) => {
    acc[err.param] = err.msg;
    return acc;
  }, {});
  return exports.error(res, 400, "Dữ liệu không hợp lệ", errors);
};

// Tài nguyên không tồn tại (404 Not Found)
exports.notFound = (res, resource = "Tài nguyên") => {
  return exports.error(res, 404, `${resource} không tồn tại`);
};

// Chưa xác thực / Không có quyền truy cập (401 Unauthorized)
exports.unauthorized = (res, message = "Không có quyền truy cập") => {
  return exports.error(res, 401, message);
};

// Bị cấm truy cập (403 Forbidden)
exports.forbidden = (res, message = "Truy cập bị từ chối") => {
  return exports.error(res, 403, message);
};

// Yêu cầu không hợp lệ (400 Bad Request)
exports.badRequest = (res, message = "Yêu cầu không hợp lệ", errors = null) => {
  return exports.error(res, 400, message, errors);
};

// Xung đột dữ liệu (409 Conflict)
exports.conflict = (res, message = "Xung đột dữ liệu", errors = null) => {
  return exports.error(res, 409, message, errors);
};

// Dịch vụ tạm thời không khả dụng (503 Service Unavailable)
exports.serviceUnavailable = (
  res,
  message = "Dịch vụ tạm thời không khả dụng"
) => {
  return exports.error(res, 503, message);
};
