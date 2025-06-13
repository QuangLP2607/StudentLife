"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // Một post có thể thuộc về một nhóm học tập (StudyGroup)
      Post.belongsTo(models.StudyGroup, {
        foreignKey: "group_id",
        as: "studyGroup",
      });

      // Một post có thể thuộc về một môn học (Course)
      Post.belongsTo(models.Course, {
        foreignKey: "course_id",
        as: "course",
      });

      // Một post thuộc về một user (Người đăng)
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
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  return Post;
};
