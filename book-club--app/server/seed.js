import { User } from './models/Users.js';
import { Proposal } from './models/Proposals.js';
import { Comment } from './models/Comments.js';
import { ProposalVote } from './models/ProposalVote.js';


// Seed function
async function seedDatabase() {
    // Create users
    const user1 = await User.create({
        email: 'user1@email.com',
        username: 'user1',
        password: 'pass',
    });

    const user2 = await User.create({
        email: 'user2@email.com',
        username: 'user2',
        password: 'pass',
    });

    const user3 = await User.create({
        email: 'user3@email.com',
        username: 'user3',
        password: 'pass',
    });

    console.log('Users created');

    // Create proposals
    const proposal1 = await Proposal.create({
        title: 'Proposal 1',
        description: 'Description of proposal 1',
        userId: user1.userId,
        week: 1,
    });

    const proposal2 = await Proposal.create({
        title: 'Proposal 2',
        description: 'Description of proposal 2',
        userId: user2.userId,
        week: 2,
    });

    const proposal3 = await Proposal.create({
        title: 'Proposal 3',
        description: 'Description of proposal 3',
        userId: user3.userId,
        week: 1,
    });

    console.log('Proposals created');

    // Create comments for proposal1
    const comment1 = await Comment.create({
        content: 'Great idea, I support it!',
        userId: user2.userId,
        proposalId: proposal1.id,
    });

    const comment2 = await Comment.create({
        content: 'I have some concerns. Please clarify.',
        userId: user3.userId,
        proposalId: proposal1.id,
    });

    // Create comments for proposal2
    const comment3 = await Comment.create({
        content: 'This seems like a good proposal.',
        userId: user1.userId,
        proposalId: proposal2.id,
        replyTo: comment1.id,
    });

    console.log('Comments created');

    // Create votes for proposals
    const vote1 = await ProposalVote.create({
        userId: user1.userId,
        proposalId: proposal1.id,
        week: 1,
    });

    const vote2 = await ProposalVote.create({
        userId: user2.userId,
        proposalId: proposal2.id,
        week: 2,
    });

    const vote3 = await ProposalVote.create({
        userId: user3.userId,
        proposalId: proposal1.id,
        week: 1,
    });

    console.log('Votes created');

    console.log('Database populated successfully!');
}

// Call seed function
seedDatabase().catch(err => {
    console.error('Error populating the database:', err);
});
