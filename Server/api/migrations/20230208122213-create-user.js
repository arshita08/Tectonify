'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0'
      },
      user_from: {
        type: Sequelize.STRING
      },
      verification_token: {
        type: Sequelize.TEXT
      },
      is_verified: {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0'
      },
      verified_at: {
        type: Sequelize.DATE
      },
      last_active: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};