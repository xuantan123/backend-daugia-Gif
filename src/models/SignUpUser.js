import { Model, DataTypes } from 'sequelize';
import db from './index.js'; // Đảm bảo đường dẫn đúng

class SignUpUser extends Model {
  static associate(models) {
    // Định nghĩa các liên kết ở đây nếu có
  }
}

SignUpUser.init({
  nickname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,  // Đảm bảo rằng email là duy nhất
    allowNull: false
  },
  password: DataTypes.STRING
}, {
  sequelize: db.sequelize,
  modelName: 'SignUpUser',
  tableName: 'SignUpUser'
});

export default SignUpUser;
