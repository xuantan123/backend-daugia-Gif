const { Model, DataTypes } = require('sequelize');
const db = require('../index');

class Registration extends Model {
  static associate(models) {
    // Mối quan hệ với bảng Info
    Registration.belongsTo(models.Login, {
      foreignKey: 'userId',
      as: 'user', // Alias để dễ dàng truy cập
    });
    // Mối quan hệ với bảng Auction
    Registration.belongsTo(models.Auction, {
      foreignKey: 'auctionId',
      as: 'auction', // Alias để dễ dàng truy cập
    });
  }
}

Registration.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Login', // Tên bảng liên kết
      key: 'id', // Khóa chính của bảng Info
    },
    onUpdate: 'CASCADE', // Cập nhật liên kết khi Info thay đổi
    onDelete: 'CASCADE', // Xóa liên kết khi Info bị xóa
  },
  auctionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Auctions', // Tên bảng liên kết
      key: 'id', // Khóa chính của bảng Auctions
    },
    onUpdate: 'CASCADE', // Cập nhật liên kết khi Auctions thay đổi
    onDelete: 'CASCADE', // Xóa liên kết khi Auctions bị xóa
  },
}, {
  sequelize: db.sequelize,
  modelName: 'Registration',
  tableName: 'Registrations',
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = Registration;
