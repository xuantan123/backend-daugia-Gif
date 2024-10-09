import auctionContract from "../../config/smartContract";
import AuctionItem from "../../models/author/ProductsAuthor";
import cloudinary from "cloudinary";
import path from 'path';
import fs from 'fs';

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm upload hình ảnh lên Cloudinary
const uploadImage = async (imageFile) => {
    if (!imageFile) {
        throw new Error('Photos are required');
    }
    
    const result = await cloudinary.v2.uploader.upload(imageFile.path);
    return result.secure_url;
};


export const createAuctionItem = async (req, res) => {
    try {
        const {
            email,
            productname,
            description,
            startingPrice,
            durationInMinutes,
            authorId,
            active = true,
        } = req.body;

        const imageFile = req.file;

        // Kiểm tra các trường không được để trống
        if (!productname || !authorId || !startingPrice || durationInMinutes === undefined || !description) {
            return res.status(400).json({
                message: 'Product name, Author ID, starting price, duration, and description cannot be null'
            });
        }

        // Kiểm tra giá khởi điểm
        if (isNaN(startingPrice) || startingPrice <= 0) {
            return res.status(400).json({
                message: 'Starting price must be a positive number'
            });
        }

        // Chuyển đổi durationInMinutes thành số nguyên
        const duration = parseInt(durationInMinutes, 10);
        
        // Kiểm tra thời gian đấu giá
        if (isNaN(duration) || duration <= 0) {
            return res.status(400).json({
                message: 'Duration must be a positive number'
            });
        }

        // Tính toán thời gian kết thúc (timestamp)
        const endTime = Math.floor(Date.now() / 1000) + duration * 60; // Thời gian kết thúc tính bằng giây

        // Upload hình ảnh
        let imageUrl;
        try {
            imageUrl = await uploadImage(imageFile);
        } catch (uploadError) {
            return res.status(500).json({
                errorCode: 4,
                message: 'Image upload failed',
                error: uploadError.message,
            });
        }

        // Tạo phiên đấu giá mới trong smart contract
        const tx = await auctionContract.createAuction(productname, description, startingPrice, endTime, authorId);
        const txHash = tx.hash; // Lưu txHash

        // Tạo phiên đấu giá mới trong cơ sở dữ liệu
        const newProduct = await AuctionItem.create({
            email,
            authorId,
            productName: productname,
            description,
            startingPrice,
            highestBid: 0,
            highestBidder: null,
            endTime: new Date(endTime * 1000), // Lưu dưới dạng đối tượng Date trong cơ sở dữ liệu
            active,
            imageUrl,
            txHash, // Lưu txHash vào cơ sở dữ liệu
        });

        res.status(200).json({
            errorCode: 0,
            message: 'Create successful auction item',
            product: newProduct,
            txHash, // Trả về txHash cho client
        });
    } catch (error) {
        console.error('Error when creating auction item:', error);
        res.status(500).json({
            errorCode: 3,
            message: 'Auction item creation failed',
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
            product.productName = productname || product.productName;
            product.description = description || product.description;
            product.price = price || product.price;
            product.status = status || product.status;

            if (imageFile) {
                const imageUrl = await uploadImage(imageFile);
                product.imageUrl = imageUrl;
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

export const bidAuction = async (req, res) => {
    try {
      const { auctionId, amount, bidder } = req.body; // Thêm 'bidder' là tài khoản người đặt giá
      console.log('Auction ID:', auctionId);
      console.log('Amount:', amount);
      console.log('Bidder:', bidder); // In ra người đấu giá
    
      // Gọi hàm đặt cược từ smart contract và ký giao dịch
      const tx = await auctionContract.bid(auctionId, amount);
      await tx.wait(); // Đợi giao dịch hoàn tất
    
      // Cập nhật giá đấu cao nhất và người đấu giá cao nhất trong cơ sở dữ liệu
      const auctionItem = await AuctionItem.findOne({ where: { id: auctionId } });
      if (auctionItem) {
        auctionItem.highestBid = amount; // Cập nhật giá đấu cao nhất
        auctionItem.highestBidder = bidder; // Cập nhật người đấu giá cao nhất
        await auctionItem.save(); // Lưu vào cơ sở dữ liệu
      }
    
      res.status(200).json({ message: 'Bid placed successfully', tx, auctionItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error placing bid', error });
    }
  };


// Kết thúc đấu giá
export const endAuction = async (req, res) => {
    try {
        const { auctionId } = req.body;

        // Gọi hàm kết thúc đấu giá từ smart contract và ký giao dịch
        const tx = await auctionContract.endAuction(auctionId);
        await tx.wait(); // Đợi giao dịch hoàn tất

        // Cập nhật trạng thái đấu giá trong cơ sở dữ liệu
        const auctionItem = await AuctionItem.findOne({ where: { id: auctionId } });
        if (auctionItem) {
            auctionItem.active = false; // Đánh dấu đấu giá đã kết thúc
            await auctionItem.save(); // Lưu vào cơ sở dữ liệu
        }

        res.status(200).json({ 
            message: 'Auction ended successfully', 
            tx, 
            auctionItem, 
            highestBidder: auctionItem.highestBidder 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error ending auction', error });
    }
};

// Lấy thông tin cuộc đấu giá
export const getAuctionDetails = async (req, res) => {
    try {
        const { auctionId } = req.params;

        const auctionItem = await AuctionItem.findOne({ where: { id: auctionId } });
        if (!auctionItem) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        res.status(200).json({ 
            message: 'Auction details fetched successfully', 
            auctionItem 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching auction details', error });
    }
};
