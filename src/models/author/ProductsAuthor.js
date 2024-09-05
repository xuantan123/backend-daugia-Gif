import { Model, DataTypes } from 'sequelize';
import db from '../index'; 

class ProductAuthor extends Model {
  static associate(models) {
    
  }
}

ProductAuthor.init({
  productname: DataTypes.STRING,
  description: DataTypes.BOOLEAN,
  price: DataTypes.STRING,
  status: DataTypes.STRING,
  image: DataTypes.TEXT,
}, {
  sequelize: db.sequelize,
  modelName: 'ProductAuthor',
  tableName: 'ProductAuthor'
});

export default ProductAuthor;
