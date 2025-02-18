// models/comment.js
import { DataTypes,Sequelize } from "sequelize";
import { sequelize } from "../db.js";

const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.STRING, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key reference
  proposalId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key reference
  replyTo: { type: DataTypes.INTEGER, allowNull: true }, // Optionally reply to another comment
});

export { Comment };
