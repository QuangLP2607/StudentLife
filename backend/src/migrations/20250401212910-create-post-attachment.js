"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PostAttachments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Posts", // Tên bảng tham chiếu
          key: "id", // Khóa chính của bảng tham chiếu
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      file_url: {
        type: Sequelize.STRING(255),
        allowNull: false, // Đường dẫn file bắt buộc phải có
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Tên bảng tham chiếu
          key: "id", // Khóa chính của bảng tham chiếu
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      uploaded_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PostAttachments");
  },
};
