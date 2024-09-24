import { Model, DataTypes } from 'sequelize';
import db from '../index'; 

class Auction extends Model {
  static associate(models) {
    Auction.belongsTo(models.ProfileAuthor, {
      foreignKey: 'authorId', // Khóa ngoại liên kết với ProfileAuthor
      as: 'author', // Tên alias cho quan hệ
    });
  }
}

Auction.init({
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ProfileAuthor',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  gifUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currentPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  auctionEndTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active', 
  },
}, {
  sequelize: db.sequelize,
  modelName: 'Auction',
  tableName: 'Auction', 
});

export default Auction;
