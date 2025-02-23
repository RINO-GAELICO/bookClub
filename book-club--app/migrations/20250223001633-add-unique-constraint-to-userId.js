'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add unique constraint to userId in Users table
    await queryInterface.addConstraint('Users', {
      fields: ['userId'],
      type: 'unique',
      name: 'unique_userId_constraint', // You can choose a custom name for the constraint
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove unique constraint from userId in Users table
    await queryInterface.removeConstraint('Users', 'unique_userId_constraint');
  }
};
