'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AuctionResults', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      highestBid: {
        type: Sequelize.DECIMAL(18, 2),
        defaultValue: 0,
        allowNull: false,
      },
      highestBidder: {
        type: Sequelize.STRING,
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
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable('AuctionResults');
  },
};
