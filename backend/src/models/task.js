"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Mối quan hệ với bảng StudyGroups
      Task.belongsTo(models.StudyGroup, {
        foreignKey: "group_id",
        as: "group",
      });

      // Mối quan hệ với bảng Users
      Task.belongsTo(models.User, {
        foreignKey: "assigned_to",
        as: "assignedUser",
      });
    }
  }

  Task.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATE, // Đảm bảo rằng kiểu là DATE
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "in-progress", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );

  return Task;
};
