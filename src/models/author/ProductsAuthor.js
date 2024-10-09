import { Model, DataTypes } from 'sequelize';
import db from '../index'; 

class AuctionItem extends Model {
  static associate(models) {
    AuctionItem.belongsTo(models.ProfileAuthor, {
      foreignKey: 'authorId', 
      as: 'author', 
    });
  }
}

AuctionItem.init({
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
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  highestBid: {
    type: DataTypes.FLOAT,
    defaultValue: 0, // Giá cao nhất khởi đầu là 0
  },
  highestBidder: {
    type: DataTypes.STRING, // Địa chỉ của người đấu giá cao nhất
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE, // Thời gian kết thúc cuộc đấu giá
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Mặc định là còn hoạt động
  },
}, {
  sequelize: db.sequelize,
  modelName: 'AuctionItem',
  tableName: 'AuctionItems', // Tên bảng trong cơ sở dữ liệu
});

export default AuctionItem;
