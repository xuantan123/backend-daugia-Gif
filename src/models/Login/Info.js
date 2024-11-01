// models/Info.js
const { Model, DataTypes } = require('sequelize');
const db = require('../index');

class Info extends Model {
  static associate(models) {
    Info.belongsTo(models.Login, {
      foreignKey: 'loginId',
      as: 'login', // Đặt alias khác để tránh nhầm lẫn
    });
    Info.belongsToMany(models.Auction, {
      through: models.Registration,
      foreignKey: 'userId',
      as: 'registeredAuctions',
    });
    Info.hasMany(models.Bid, {
      foreignKey: 'bidderId',
      as: 'bids',
      onDelete: 'CASCADE',
    });
    Info.hasMany(models.Auction, {
      foreignKey: 'authorId',
      as: 'auctions',
      onDelete: 'CASCADE',
    });
  }
}

Info.init({
  fullname: DataTypes.STRING,
  dateOfBirth: DataTypes.DATE,
  gender: DataTypes.BOOLEAN,
  country: DataTypes.STRING,
  walletAddress: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  loginId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Login',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
}, {
  sequelize: db.sequelize,
  modelName: 'Info',
  tableName: 'Info',
});

module.exports = Info;
