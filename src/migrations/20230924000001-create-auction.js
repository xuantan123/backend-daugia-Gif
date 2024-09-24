'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Auction', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'ProfileAuthor', // Tên bảng chính xác
              key: 'id', // Khóa chính của bảng ProfileAuthor
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
      gifUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startingPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      currentPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      auctionEndTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Auction');
  }
};
