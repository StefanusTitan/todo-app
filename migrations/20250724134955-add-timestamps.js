'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('todo_items', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('todo_items', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('todo_items', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('todo_items', 'createdAt');
    await queryInterface.removeColumn('todo_items', 'updatedAt');
    await queryInterface.removeColumn('todo_items', 'deletedAt');
  }
};
