// models/proposal.js
import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../db.js";

const Proposal = sequelize.define("Proposal", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key reference
    timestamp: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    week: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imageUrl: { type: DataTypes.STRING, allowNull: true }, // Stores the original image URL
    thumbnailUrl: { type: DataTypes.STRING, allowNull: true } // Stores the thumbnail URL
});

export { Proposal };
