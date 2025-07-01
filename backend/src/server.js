require("dotenv").config();
const http = require("http");
const app = require("./app");
const { sequelize } = require("./models");
const initSocket = require("./socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Kết nối DB thành công!");

    // return sequelize.sync({ alter: true });
    return sequelize.sync(); // sync bình thường, không chỉnh sửa bảng tự động
  })
  .then(() => {
    console.log("✅ Database đã được đồng bộ!");

    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi trong quá trình khởi tạo:", err);
  });
