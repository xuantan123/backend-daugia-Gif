// migrations/YYYYMMDDHHMMSS-create-registrations.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Registrations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProfileUser', // Kiểm tra tên bảng ProfileUsers
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      auctionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Auctions', // Kiểm tra tên bảng Auctions
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Registrations');
  }
};
