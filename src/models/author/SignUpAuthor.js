import { Model, DataTypes } from 'sequelize';
import db from '../index.js'; 

class SignUpAuthor extends Model {
  static associate(models) {
    
  }
}

SignUpAuthor.init({
  nickname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,  
    allowNull: false
  },
  password: DataTypes.STRING
}, {
  sequelize: db.sequelize,
  modelName: 'SignUpAuthor',
  tableName: 'SignUpAuthor'
});

export default SignUpAuthor;
