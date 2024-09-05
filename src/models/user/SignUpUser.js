import { Model, DataTypes } from 'sequelize';
import db from '../index.js'; 

class SignUpUser extends Model {
  static associate(models) {
    
  }
}

SignUpUser.init({
  nickname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,  
    allowNull: false
  },
  password: DataTypes.STRING
}, {
  sequelize: db.sequelize,
  modelName: 'SignUpUser',
  tableName: 'SignUpUser'
});

export default SignUpUser;
