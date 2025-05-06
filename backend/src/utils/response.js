// Thành công (trả về 200 hoặc 201)
exports.success = (
  res,
  message = "Thành công",
  data = {},
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

// Thất bại có lỗi chi tiết (400, 401, 403, 404, v.v.)
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

// Dành cho lỗi xác thực đầu vào
exports.validationError = (res, validationResult) => {
  const errors = validationResult.array().reduce((acc, err) => {
    acc[err.param] = err.msg;
    return acc;
  }, {});
  return exports.error(res, 400, "Dữ liệu không hợp lệ", errors);
};

// Trả về khi không tìm thấy tài nguyên
exports.notFound = (res, resource = "Tài nguyên") => {
  return exports.error(res, 404, `${resource} không tồn tại`);
};

// Trả về khi không có quyền
exports.unauthorized = (res, message = "Không có quyền truy cập") => {
  return exports.error(res, 401, message);
};

// Trả về khi bị cấm truy cập
exports.forbidden = (res, message = "Truy cập bị từ chối") => {
  return exports.error(res, 403, message);
};
