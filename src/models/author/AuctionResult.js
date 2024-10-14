import { Model, DataTypes } from 'sequelize';
import db from '../index';

class AuctionResult extends Model {
  static associate(models) {
    // Một kết quả đấu giá thuộc về một cuộc đấu giá
    AuctionResult.belongsTo(models.Auction, {
      foreignKey: 'auctionId',
      as: 'auction',
      onDelete: 'CASCADE',
    });
  }
}

AuctionResult.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  highestBid: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0,
    allowNull: false,
  },
  highestBidder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ProfileUser', // Tên bảng
      key: 'id',
    },
  },
  auctionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Auctions', // Tên bảng
      key: 'id',
    },
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize: db.sequelize,
  modelName: 'AuctionResult',
  tableName: 'AuctionResults',
  timestamps: true,
});

export default AuctionResult;
