import { Model, DataTypes } from 'sequelize';
import db from '../index'; 

class ProfileAuthor extends Model {
  static associate(models) {
    
  }
}

ProfileAuthor.init({
  nickname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,  
    allowNull: false
  },
  password: DataTypes.STRING,
  fullname: DataTypes.STRING,
  dateofbirth : DataTypes.DATE,
  gender: DataTypes.BOOLEAN,
  country: DataTypes.STRING,
  walletaddress: DataTypes.STRING,
}, {
  sequelize: db.sequelize,
  modelName: 'ProfileAuthor',
  tableName: 'ProfileAuthor'
});

export default ProfileAuthor;
