import AuctionItem from '../../models/author/ProductsAuthor';
import cloudinary from 'cloudinary';
import path from 'path';
import fs from 'fs';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const processProduct = async (req, res) => {
  try {
    const { email, productname, description, price, status, authorId } = req.body; // Add authorId here
    const imageFile = req.file;

   
    if (!imageFile) {
      return res.status(400).json({ message: 'Photos are required' });
    }
    if (!productname || !authorId) { 
      return res.status(400).json({ message: 'Product name and Author ID cannot be null' });
    }

   
    const result = await cloudinary.v2.uploader.upload(imageFile.path);
    const imageUrl = result.secure_url;

   
    const newProduct = await AuctionItem.create({
      email,
      authorId, 
      productname, 
      description,
      price,
      status,
      image: imageUrl,
    });

    res.status(200).json({
      errorCode: 0,
      message: 'Create successful product',
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

// Lấy hình ảnh
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

// Lấy sản phẩm của người dùng theo email
export const getProduct = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email cannot be blank' });
    }

    const products = await AuctionItem.findAll({ where: { email } });

    if (products.length > 0) {
      res.status(200).json({
        errorCode: 0,
        message: 'Get the product successfully',
        products,
      });
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

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID cannot be empty' });
    }

    const product = await AuctionItem.findByPk(id);

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

// Chỉnh sửa sản phẩm
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productname, description, price, status } = req.body;
    const imageFile = req.file;

    if (!id) {
      return res.status(400).json({ message: 'ID cannot be empty' });
    }

    const product = await AuctionItem.findByPk(id);

    if (product) {
      product.productname = productname || product.productname;
      product.description = description || product.description;
      product.price = price || product.price;
      product.status = status || product.status;

      if (imageFile) {
        const result = await cloudinary.v2.uploader.upload(imageFile.path);
        product.image = result.secure_url;
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

