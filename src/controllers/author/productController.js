import ProductAuthor from '../../models/author/ProductsAuthor';
import path from 'path';
import fs from 'fs';
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
      return res.status(400).json({ message: 'Photos are required' });
    }

    console.log('Filename:', imageFile);

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
      message: 'Create successful products',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error when creating product:', error);
    res.status(500).json({
      errorCode: 3,
      message: 'Product creation failed',
      error: error.message,
    });
  }
};
export const getImage = (req, res) => {
  try {
    const { filename } = req.params;

  
    const imagePath = path.join(__dirname, '../../uploads', filename);

    if (fs.existsSync(imagePath)) {
   
      const ext = path.extname(filename).toLowerCase();
      let mimeType;
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          mimeType = 'image/jpeg';
          break;
        case '.png':
          mimeType = 'image/png';
          break;
        case '.gif':
          mimeType = 'image/gif';
          break;
        default:
          mimeType = 'application/octet-stream';
      }

      res.setHeader('Content-Type', mimeType);
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving image',
      error: error.message,
    });
  }
};
export const getProduct = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email cannot be blank' });
    }

    const products = await ProductAuthor.findAll({ where: { email } });

    if (products.length > 0) {
      res.status(200).json({
        errorCode: 0,
        message: 'Get the product successfully',
        products,
      });
      console.log('Product Author: ', products);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({
      errorCode: 3,
      message: 'Error when retrieving product',
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID cannot be empty' });
    }

    const product = await ProductAuthor.findByPk(id);

    if (product) {
      await product.destroy();
      res.status(200).json({ message: 'Product deletion successful' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Product deletion failed',
      error: error.message,
    });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productname, description, price, status } = req.body;
    const imageFile = req.file;

    if (!id) {
      return res.status(400).json({ message: 'ID cannot be empty' });
    }

    const product = await ProductAuthor.findByPk(id);

    if (product) {
      product.productname = productname || product.productname;
      product.description = description || product.description;
      product.price = price || product.price;
      product.status = status || product.status;

      if (imageFile) {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;
        product.image = imageUrl;
      }

      await product.save();

      res.status(200).json({
        message: 'Product update successful',
        product,
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Product update failed',
      error: error.message,
    });
  }
};