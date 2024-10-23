// models/Auction.js
import { Model, DataTypes } from 'sequelize';
import db from '../index.js';
import Registration from '../user/Registration.js';
import ProfileUser from '../user/ProfileUser.js';

class Auction extends Model {
  static associate(models) {
    Auction.belongsToMany(models.ProfileUser, { 
      through: models.Registration, // Sử dụng models để đảm bảo đúng
      foreignKey: 'auctionId', 
      as: 'registeredUsers' 
    });
    Auction.hasOne(models.AuctionResult, {
      foreignKey: 'auctionId',
      as: 'result',
      onDelete: 'CASCADE',
    });
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
    type: DataTypes.BIGINT, // Phù hợp với smart contract
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
      model: 'ProfileUser',
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
