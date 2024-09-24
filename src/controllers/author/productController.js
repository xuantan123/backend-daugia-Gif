import Auction from '../../models/author/Auction';
import AuthorProducts from '../../models/author/ProductsAuthor';
import ProfileAuthor from '../../models/author/ProfileAuthor'; // Import ProfileAuthor
import cloudinary from 'cloudinary';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Xử lý tạo sản phẩm
export const processProduct = async (req, res) => {
  try {
    const { email, productname, description, price, status, auctionId } = req.body;
    const imageFile = req.file;

    // Kiểm tra dữ liệu đầu vào
    if (!imageFile) {
      return res.status(400).json({ message: 'Photos are required' });
    }
    if (!auctionId || !productname) {
      return res.status(400).json({ message: 'Auction ID and Product name cannot be null' });
    }

    // Tải hình ảnh lên Cloudinary
    const result = await cloudinary.v2.uploader.upload(imageFile.path);
    const imageUrl = result.secure_url;

    // Tạo sản phẩm mới
    const newProduct = await AuthorProducts.create({
      email,
      auctionId,
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

    const products = await AuthorProducts.findAll({ where: { email } });

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

    const product = await AuthorProducts.findByPk(id);

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

    const product = await AuthorProducts.findByPk(id);

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

// Tạo phiên đấu giá
export const createAuction = async (req, res) => {
  try {
    const { authorId, gifUrl, startingPrice, auctionEndTime } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!gifUrl || !startingPrice || !auctionEndTime) {
      return res.status(400).json({
        message: 'gifUrl, startingPrice, and auctionEndTime are required'
      });
    }

    const newAuction = await Auction.create({
      authorId,
      gifUrl,
      startingPrice: parseFloat(startingPrice),
      currentPrice: parseFloat(startingPrice),
      auctionEndTime,
      status: 'active',
    });

    res.status(201).json({
      message: 'Auction created successfully',
      auction: newAuction,
    });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({
      message: 'Error creating auction',
      error: error.message,
    });
  }
};

// Lấy danh sách phiên đấu giá
export const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.findAll();

    res.status(200).json({
      message: 'Retrieved auctions successfully',
      auctions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving auctions',
      error: error.message,
    });
  }
};

// Thêm sản phẩm vào phiên đấu giá
export const createAuctionProduct = async (req, res) => {
  try {
    const { auctionId, userId, productname, description, gifUrl } = req.body;

    if (!auctionId || !userId || !productname) {
      return res.status(400).json({ message: 'Auction ID, User ID, and Product name cannot be null' });
    }

    const newProduct = await AuthorProducts.create({
      auctionId,
      userId,
      productname,
      description,
      image: gifUrl, // Sử dụng GIF URL làm hình ảnh
    });

    res.status(201).json({
      message: 'Auction product created successfully',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating auction product',
      error: error.message,
    });
  }
};

// Lấy thông tin chi tiết một phiên đấu giá
export const getAuctionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findByPk(id, {
      include: [{ model: AuthorProducts }], // Lấy sản phẩm liên quan đến phiên đấu giá
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.status(200).json({
      message: 'Retrieved auction details successfully',
      auction,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving auction details',
      error: error.message,
    });
  }
};
