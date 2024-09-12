import ProductAuthor from '../../models/author/ProductsAuthor';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

const upload = multer({ storage: storage });

export const processProduct = async (req, res) => {
    try {
        const { email, productname, description, price, status } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ message: 'Ảnh là bắt buộc' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;

        const newProduct = await ProductAuthor.create({
            email,
            productname,
            description,
            price,
            status,
            image: imageUrl,
        });

        res.status(200).json({
            errorCode: 0,
            message: 'Tạo sản phẩm thành công',
            product: newProduct,
        });
    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error); 
        res.status(500).json({
            errorCode: 3,
            message: 'Tạo sản phẩm không thành công',
            error: error.message,
        });
    }
};

export const getProduct = async (req, res) => {
  try {
      const { email } = req.params;

      if (!email) {
          return res.status(400).json({ message: 'Email không được để trống' });
      }

      const products = await ProductAuthor.findAll({ where: { email } });

      if (products.length > 0) {
          res.status(200).json({
              errorCode: 0,
              message: 'Lấy sản phẩm thành công',
              products,
          });
          console.log('Product Author: ', products);
      } else {
          res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
      }
  } catch (error) {
      res.status(500).json({
          errorCode: 3,
          message: 'Lỗi khi lấy sản phẩm',
          error: error.message,
      });
  }
};
export const deleteProduct = async (req, res) => {
  try {
      const { id } = req.params; 

      if (!id) {
          return res.status(400).json({ message: 'ID không được để trống' });
      }

      const product = await ProductAuthor.findByPk(id); 

      if (product) {
          await product.destroy();
          res.status(200).json({ message: 'Xóa sản phẩm thành công' });
      } else {
          res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
      }
  } catch (error) {
      res.status(500).json({
          message: 'Xóa sản phẩm không thành công',
          error: error.message,
      });
  }
};
export const editProduct = async (req, res) => {
  try {
      const { id } = req.params; 
      const { productname, description, price, status, image } = req.body;

      if (!id) {
          return res.status(400).json({ message: 'ID không được để trống' });
      }

   
      const product = await ProductAuthor.findByPk(id);

      if (product) {
          
          product.productname = productname || product.productname;
          product.description = description || product.description;
          product.price = price || product.price;
          product.status = status || product.status;
          product.image = image || product.image;

        
          await product.save();

          res.status(200).json({
              message: 'Cập nhật sản phẩm thành công',
              product,
          });
      } else {
          res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
      }
  } catch (error) {
      res.status(500).json({
          message: 'Cập nhật sản phẩm không thành công',
          error: error.message,
      });
  }
};
