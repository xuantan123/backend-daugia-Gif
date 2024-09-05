import { Model, DataTypes } from 'sequelize';
import db from '../index'; 

class ProfileAuthor extends Model {
  static associate(models) {
    
  }
}

ProfileAuthor.init({
  fullname: DataTypes.STRING,
  gender: DataTypes.BOOLEAN,
  country: DataTypes.STRING,
  walletaddress: DataTypes.STRING,
}, {
  sequelize: db.sequelize,
  modelName: 'ProfileAuthor',
  tableName: 'ProfileAuthor'
});

export default ProfileAuthor;
