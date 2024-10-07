import { Model, DataTypes } from 'sequelize';
import db from "../index";

class MintTransaction extends Model {
  static associate(models) {
    
  }
}

MintTransaction.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,  
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize: db.sequelize,
  modelName: 'MintTransaction',
  tableName: 'MintTransaction', 
  timestamps: true,  
});

export default MintTransaction;
