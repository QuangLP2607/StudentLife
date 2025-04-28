require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./config/database");
const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Kết nối DB thành công!");

    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Database đã được đồng bộ!");

    app.listen(PORT, () => {
      console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi trong quá trình khởi tạo:", err);
  });
