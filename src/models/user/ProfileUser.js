import { Model, DataTypes } from 'sequelize';
import db from '../index.js'; 

class ProfileUser extends Model {
  static associate(models) {
    
  }
}

ProfileUser.init({
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
