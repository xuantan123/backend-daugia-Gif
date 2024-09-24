'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AuthorProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      authorId: { // ID của tác giả
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProfileAuthor', // Liên kết với bảng Authors
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      email: { // Email của tác giả
        type: Sequelize.STRING,
        allowNull: false,
      },
      productname: { // Tên sản phẩm GIF
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: { // Mô tả sản phẩm
        type: Sequelize.STRING,
      },
      price: { // Giá của sản phẩm
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: { // Trạng thái của sản phẩm
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: { // Đường dẫn hình ảnh hoặc GIF
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AuthorProducts');
  }
};
