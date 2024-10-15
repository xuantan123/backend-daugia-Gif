'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bids', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      auctionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Auctions', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      bidderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProfileUser', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Bids');
  },
};
