'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AuctionItems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProfileAuthor', // Đảm bảo rằng tên bảng này đúng
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startingPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      highestBid: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      highestBidder: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      txHash: { // Thêm trường txHash
        type: Sequelize.STRING,
        allowNull: true, // Cho phép null nếu không có giao dịch
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AuctionItems');
  }
};
