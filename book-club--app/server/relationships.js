// relationships.js
import { User } from "./models/User.js";
import { Comment } from "./models/Comment.js";
import { Proposal } from "./models/Proposal.js";
import { ProposalVote } from "./models/ProposalVote.js";

// Relationships
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Proposal, { foreignKey: "userId" });
Proposal.belongsTo(User, { foreignKey: "userId" });

Proposal.hasMany(Comment, { foreignKey: "proposalId" });
Comment.belongsTo(Proposal, { foreignKey: "proposalId" });

// One user can vote on many proposals, and one proposal can have many votes
User.belongsToMany(Proposal, {
  through: ProposalVote,
  foreignKey: "userId",
});
Proposal.belongsToMany(User, {
  through: ProposalVote,
  foreignKey: "proposalId",
});

export { User, Comment, Proposal, ProposalVote };
