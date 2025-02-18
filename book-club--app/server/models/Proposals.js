// models/proposal.js
import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../db.js";

const Proposal = sequelize.define("Proposal", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key reference
  timestamp: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

export { Proposal };
