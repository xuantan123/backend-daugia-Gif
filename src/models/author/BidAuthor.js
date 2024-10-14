import { Model, DataTypes } from 'sequelize';
import db from '../index';

class Bid extends Model {
  static associate(models) {
    // Liên kết với bảng Auction (mỗi giá thầu thuộc về một cuộc đấu giá)
    Bid.belongsTo(models.Auction, {
      foreignKey: 'auctionId',
      as: 'auction',
    });

    // Liên kết với bảng ProfileUser (mỗi giá thầu thuộc về một người dùng)
    Bid.belongsTo(models.ProfileUser, {
      foreignKey: 'bidderId',
      as: 'bidder',
    });
  }
}

Bid.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  auctionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Auctions', // Tên bảng
      key: 'id',
    },
  },
  bidderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ProfileUser', // Tên bảng
      key: 'id',
    },
  },
}, {
  sequelize: db.sequelize,
  modelName: 'Bid',
  tableName: 'Bids',
});

export default Bid;
