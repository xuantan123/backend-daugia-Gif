// models/Registration.js
import { Model, DataTypes } from 'sequelize';
import db from '../index.js';
import ProfileUser from './ProfileUser.js';
import Auction from '../author/AuctionAuthor.js';

class Registration extends Model {
  static associate(models) {
    Registration.belongsTo(models.ProfileUser, {
      foreignKey: 'userId',
      as: 'user',
    });
    Registration.belongsTo(models.Auction, {
      foreignKey: 'auctionId',
      as: 'auction',
    });
  }
}

Registration.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  auctionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize: db.sequelize,
  modelName: 'Registration',
  tableName: 'Registrations',
  timestamps: true,
});

export default Registration;
