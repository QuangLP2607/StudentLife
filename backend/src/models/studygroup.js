"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudyGroup extends Model {
    static associate(models) {
      // Một study group thuộc về một course
      StudyGroup.belongsTo(models.Course, {
        foreignKey: "course_id",
        as: "course",
      });
    }
  }

  StudyGroup.init(
    {
      course_id: {
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
      modelName: "StudyGroup",
    }
  );

  return StudyGroup;
};
