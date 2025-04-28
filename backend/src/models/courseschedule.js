"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CourseSchedule extends Model {
    static associate(models) {
      // Một course schedule thuộc về một course
      CourseSchedule.belongsTo(models.Course, {
        foreignKey: "course_id",
        as: "course",
      });
    }
  }

  CourseSchedule.init(
    {
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      weeks: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CourseSchedule",
    }
  );

  return CourseSchedule;
};
