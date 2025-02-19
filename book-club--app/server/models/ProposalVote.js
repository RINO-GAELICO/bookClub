// models/proposalVote.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const ProposalVote = sequelize.define("ProposalVote", {
  userId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false }, // Foreign key to User
  proposalId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false }, // Foreign key to Proposal
});

export { ProposalVote };
