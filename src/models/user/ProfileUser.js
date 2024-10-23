// models/ProfileUser.js
import { Model, DataTypes } from 'sequelize';
import db from '../index.js';
import Registration from '../user/Registration.js';
import Auction from '../author/AuctionAuthor.js';

class ProfileUser extends Model {
  static associate(models) {
    ProfileUser.belongsToMany(models.Auction, { 
      through: models.Registration, // Sử dụng models để đảm bảo đúng
      foreignKey: 'userId', 
      as: 'registeredAuctions' 
    });
    ProfileUser.hasMany(models.Bid, {
      foreignKey: 'bidderId',
      as: 'bids',
      onDelete: 'CASCADE',
    });
    ProfileUser.hasMany(models.Auction, {
      foreignKey: 'authorId',
      as: 'auctions',
      onDelete: 'CASCADE',
    });
  }
}

ProfileUser.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nickname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: DataTypes.STRING,
  fullname: DataTypes.STRING,
  dateofbirth: DataTypes.DATE,
  gender: DataTypes.BOOLEAN,
  country: DataTypes.STRING,
  walletaddress: DataTypes.STRING,
}, {
  sequelize: db.sequelize,
  modelName: 'ProfileUser',
  tableName: 'ProfileUser',
});

export default ProfileUser;
