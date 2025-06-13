"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // Một course thuộc về một semester
      Course.belongsTo(models.Semester, {
        foreignKey: "semester_id",
        as: "semester",
        onDelete: "CASCADE",
      });

      // Mỗi Course có nhiều Schedule
      Course.hasMany(models.Schedule, {
        foreignKey: "course_id",
        as: "schedules",
      });
    }
  }

  Course.init(
    {
      semester_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Course",
    }
  );

  return Course;
};
