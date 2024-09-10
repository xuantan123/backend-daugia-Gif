import { Model, DataTypes } from 'sequelize';
import db from '../index.js'; 

class ProfileUser extends Model {
  static associate(models) {
    
  }
}

ProfileUser.init({
  nickname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,  
    allowNull: false
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
  tableName: 'ProfileUser'
});

export default ProfileUser;
