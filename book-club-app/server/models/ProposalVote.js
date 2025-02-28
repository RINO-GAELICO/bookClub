import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { Proposal } from "./Proposals.js";

const ProposalVote = sequelize.define(
    "ProposalVote",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // This will be the primary key
            autoIncrement: true, // Automatically increments with each new record
            allowNull: false, // Ensures that the ID is always provided
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false, // Foreign key to User
        },
        proposalId: {
            type: DataTypes.INTEGER,
            allowNull: false, // Foreign key to Proposal
        },
        week: {
            type: DataTypes.INTEGER,
            allowNull: false, // Represents the week of voting
        },
    },
    { timestamps: true }
);

// Define associations
ProposalVote.belongsTo(Proposal, { foreignKey: "proposalId" });
Proposal.hasMany(ProposalVote, { foreignKey: "proposalId" });

export { ProposalVote };
