import { Model, DataTypes } from 'sequelize';
import db from '../index'; 

class ProductAuthor extends Model {
  static associate(models) {
    
  }
}

ProductAuthor.init({
  email: DataTypes.STRING,
  productname: DataTypes.STRING,
  description: DataTypes.STRING,
  price: DataTypes.STRING,
  status: DataTypes.STRING,
  image: DataTypes.STRING,
}, {
  sequelize: db.sequelize,
  modelName: 'ProductAuthor',
  tableName: 'ProductAuthor'
});

export default ProductAuthor;
