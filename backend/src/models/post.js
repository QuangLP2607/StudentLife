"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.StudyGroup, {
        foreignKey: "group_id",
        as: "studyGroup",
      });

      Post.belongsTo(models.Course, {
        foreignKey: "course_id",
        as: "course",
      });

      Post.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  Post.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      week: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      posted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // mặc định thời gian hiện tại khi tạo bài
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Post",
      timestamps: false, // tắt timestamps mặc định nếu bạn muốn tự quản lý
    }
  );

  return Post;
};
