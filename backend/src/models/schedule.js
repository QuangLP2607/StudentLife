"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      // Một course schedule thuộc về một course
      Schedule.belongsTo(models.Course, {
        foreignKey: "course_id",
        as: "course",
        onDelete: "CASCADE",
      });
    }
  }

  Schedule.init(
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
      day: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      week_type: {
        type: DataTypes.ENUM("weekly", "odd", "even", "custom"),
        allowNull: false,
      },
      custom_weeks: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );

  return Schedule;
};
