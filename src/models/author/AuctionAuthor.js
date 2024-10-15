import { Model, DataTypes } from 'sequelize';
import db from '../index';

class Auction extends Model {
  static associate(models) {
    // Một cuộc đấu giá có một kết quả đấu giá
    Auction.hasOne(models.AuctionResult, {
      foreignKey: 'auctionId',
      as: 'result',
      onDelete: 'CASCADE',
    });

    // Một cuộc đấu giá có nhiều giá thầu
    Auction.hasMany(models.Bid, {
      foreignKey: 'auctionId',
      as: 'bids',
      onDelete: 'CASCADE',
    });
  }
}

Auction.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  startingPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  endTime: {
    type: DataTypes.BIGINT, // Kiểu dữ liệu phù hợp với smart contract
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ProfileAuthor', // Tên bảng
      key: 'id',
    },
  },
  txHash: {
    type: DataTypes.STRING,
  },
}, {
  sequelize: db.sequelize,
  modelName: 'Auction',
  tableName: 'Auctions',
  timestamps: true,
});

export default Auction;
