"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
      // Một group member thuộc về một study group
      GroupMember.belongsTo(models.StudyGroup, {
        foreignKey: "group_id",
        as: "studyGroup",
      });

      // Một group member thuộc về một user
      GroupMember.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  GroupMember.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("member", "admin", "owner"),
        allowNull: false,
        defaultValue: "member",
      },
    },
    {
      sequelize,
      modelName: "GroupMember",
    }
  );

  return GroupMember;
};
