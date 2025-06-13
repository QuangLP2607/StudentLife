"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Semester extends Model {
    static associate(models) {
      // Một semester có nhiều courses
      Semester.hasMany(models.Course, {
        foreignKey: "semester_id",
        as: "courses",
      });

      // Một semester thuộc về một user
      Semester.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  Semester.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      weeks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Semester",
    }
  );

  return Semester;
};
