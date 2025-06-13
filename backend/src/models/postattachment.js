"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PostAttachment extends Model {
    static associate(models) {
      // Mối quan hệ với bảng Post
      PostAttachment.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });

      // Mối quan hệ với bảng User
      PostAttachment.belongsTo(models.User, {
        foreignKey: "uploaded_by",
        as: "user",
      });
    }
  }

  PostAttachment.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      uploaded_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "PostAttachment",
    }
  );

  return PostAttachment;
};
