// models/proposalVote.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { Proposal } from "./Proposals.js";

const ProposalVote = sequelize.define(
    "ProposalVote",
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false, // Foreign key to User
        },
        proposalId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false, // Foreign key to Proposal
        },
        week: {
            type: DataTypes.INTEGER,
            allowNull: false, // Represents the week of voting
        },
    },
    { timestamps: true }
);

// Define association
ProposalVote.belongsTo(Proposal, { foreignKey: "proposalId" });
Proposal.hasMany(ProposalVote, { foreignKey: "proposalId" });

export { ProposalVote };
