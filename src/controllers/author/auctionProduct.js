import auctionContract from "../../config/smartContract";
import AuctionItem from "../../models/author/AuctionAuthor";
import cloudinary from "cloudinary";
import path from 'path';
import fs from 'fs';
import { ethers } from 'ethers';
import Info from "../../models/Login/Info";

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

// Tạo cuộc đấu giá
export const createAuctionItem = async (req, res) => {
    try {
        const {
            email,
            productname,
            description,
            startingPrice,
            durationInMinutes,
            authorId,
            startTime, // Thêm trường startTime
        } = req.body;

        const imageFile = req.file;

        // Kiểm tra các trường không được để trống
        if (!productname || !authorId || !startingPrice || durationInMinutes === undefined || !description || !startTime) {
            return res.status(400).json({
                message: 'Product name, Author ID, starting price, duration, description, and start time cannot be null'
            });
        }

        // Kiểm tra giá khởi điểm
        if (isNaN(startingPrice) || startingPrice <= 0) {
            return res.status(400).json({
                message: 'Starting price must be a positive number'
            });
        }

        // Chuyển đổi durationInMinutes thành số giây
        const durationInSeconds = parseInt(durationInMinutes, 10) * 60; // Chuyển đổi phút sang giây
        
        // Kiểm tra thời gian đấu giá
        if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
            return res.status(400).json({
                message: 'Duration must be a positive number'
            });
        }

        // Kiểm tra sự tồn tại của authorId
        const authorExists = await Info.findByPk(authorId);
        if (!authorExists) {
            return res.status(400).json({
                message: 'Author ID does not exist'
            });
        }

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

        // Chuyển đổi startTime từ chuỗi sang đối tượng Date
        const startDate = new Date(startTime); // Đảm bảo startTime được định dạng đúng (YYYY-MM-DDTHH:mm)

        // Tính thời gian kết thúc
        const endTimeInSeconds = Math.floor(startDate.getTime() / 1000) + durationInSeconds; // Lưu thời gian kết thúc dưới dạng số giây

        // Tạo cuộc đấu giá
        const tx = await auctionContract.createAuction(productname, description, imageUrl, startingPrice, durationInSeconds);
        const txHash = tx.hash; // Lưu txHash
        await tx.wait(); // Chờ cho giao dịch hoàn tất

        // Lưu thông tin vào cơ sở dữ liệu
        const newProduct = await AuctionItem.create({
            email,
            authorId,
            productName: productname,
            description,
            startingPrice,
            highestBid: 0,
            highestBidder: null,
            startTime: startDate, // Lưu thời gian bắt đầu
            endTime: endTimeInSeconds, // Lưu thời gian kết thúc
            active: true, // Khởi tạo trạng thái active là true
            imageUrl,
            txHash, 
        });

        res.status(200).json({
            errorCode: 0,
            message: 'Create successful auction item',
            product: newProduct,
            txHash, 
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


// Kiểm tra trạng thái cuộc đấu giá
export const checkAuctionStatus = async (req, res) => {
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        const auctionItems = await AuctionItem.findAll();

        // Tạo danh sách các cập nhật để kiểm tra trạng thái
        const updates = auctionItems.map(async (auction) => {
            const isActive = auction.endTime > currentTime; // Kiểm tra trạng thái active
            
            // Cập nhật vào cơ sở dữ liệu
            await AuctionItem.update(
                { active: isActive }, // Giá trị mới
                { where: { id: auction.id } } // Điều kiện để tìm bản ghi cần cập nhật
            );

            // Trả về bản ghi đã cập nhật
            return { ...auction.toJSON(), active: isActive }; // Chuyển đổi đối tượng thành JSON và thêm trạng thái active
        });

        // Đợi tất cả các cập nhật hoàn thành
        const updatedAuctionItems = await Promise.all(updates);

        // Gửi phản hồi với danh sách các đấu giá đã cập nhật
        res.status(200).json(updatedAuctionItems);
    } catch (error) {
        console.error('Error checking auction status:', error);
        res.status(500).json({
            errorCode: 3,
            message: 'Failed to check auction status',
            error: error.message,
        });
    }
};
export const getAuction = async(req,res) => {
   const {id} = req.params;

   try{
    const product = await AuctionItem.findOne({where:{id}});

    if(!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
   }catch(error){
    res.status(500).json({ message: 'Error fetching product details', error });
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

// Lấy thông tin sản phẩm theo authorId
export const getProductsByAuthorId = async (req, res) => {
    try {
        const { authorId } = req.params;

        if (!authorId) {
            return res.status(400).json({ message: 'Author ID cannot be blank' });
        }

        // Tìm tất cả sản phẩm theo authorId
        const products = await AuctionItem.findAll({
            where: { authorId }
        });

        if (products.length > 0) {
            res.status(200).json({
                errorCode: 0,
                message: 'Get products successfully',
                products,
            });
        } else {
            res.status(404).json({ message: 'No products found for this author ID' });
        }
    } catch (error) {
        res.status(500).json({
            errorCode: 3,
            message: 'Error when retrieving products',
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
        const { 
            productname, 
            description, 
            startingPrice, 
            durationInMinutes, 
            active,
            startTime // Thêm trường startTime để cập nhật
        } = req.body;
        const imageFile = req.file;

        if (!id) {
            return res.status(400).json({ message: 'ID cannot be empty' });
        }

        const product = await AuctionItem.findByPk(id);

        if (product) {
            // Cập nhật các trường sản phẩm
            product.productName = productname || product.productName;
            product.description = description || product.description;
            product.startingPrice = startingPrice || product.startingPrice;
            product.active = active !== undefined ? active : product.active;

            // Chuyển đổi và cập nhật startTime nếu được cung cấp
            if (startTime) {
                const startDate = new Date(startTime);
                if (isNaN(startDate.getTime())) {
                    return res.status(400).json({
                        message: 'Invalid start time format. Please use a valid date format (YYYY-MM-DDTHH:mm:ss).'
                    });
                }
                product.startTime = startDate;

                // Nếu có durationInMinutes mới, tính toán và cập nhật thời gian kết thúc
                if (durationInMinutes !== undefined) {
                    const durationInSeconds = parseInt(durationInMinutes, 10) * 60;
                    if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
                        return res.status(400).json({
                            message: 'Duration must be a positive number'
                        });
                    }
                    const newEndTime = Math.floor(startDate.getTime() / 1000) + durationInSeconds;
                    product.endTime = newEndTime;
                }
            } else if (durationInMinutes !== undefined) {
                // Nếu không thay đổi startTime, nhưng có durationInMinutes mới
                const durationInSeconds = parseInt(durationInMinutes, 10) * 60;
                if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
                    return res.status(400).json({
                        message: 'Duration must be a positive number'
                    });
                }
                const currentTime = Math.floor(Date.now() / 1000);
                const newEndTime = currentTime + durationInSeconds;
                product.endTime = newEndTime;
            }

            if (imageFile) {
                // Nếu có tệp hình ảnh mới, upload và cập nhật
                const imageUrl = await uploadImage(imageFile);
                product.imageUrl = imageUrl;
            }

            await product.save();

            res.status(200).json({
                errorCode: 0,
                message: 'Product update successful',
                product,
            });
        } else {
            res.status(404).json({ 
                errorCode: 1,
                message: 'Product not found' 
            });
        }
    } catch (error) {
        res.status(500).json({
            errorCode: 3,
            message: 'Product update failed',
            error: error.message,
        });
    }
};

