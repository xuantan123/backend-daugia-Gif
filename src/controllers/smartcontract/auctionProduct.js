import auctionContract from "../../config/smartContract";
import AuctionItem from "../../models/author/ProductsAuthor";
import cloudinary from "cloudinary";

// Hàm upload hình ảnh lên Cloudinary
const uploadImage = async (imageFile) => {
    if (!imageFile) {
      throw new Error('Photos are required');
    }
    
    const result = await cloudinary.v2.uploader.upload(imageFile.path);
    return result.secure_url;
  };
  
export const createAuction = async (req, res) => {
    try {
      const { authorId, productName, description, imageUrl, startingPrice, duration } = req.body;
  
      const tx = await auctionContract.createAuction(productName, description, imageUrl, startingPrice, duration);
      await tx.wait(); 
  
      // Tính toán thời gian kết thúc đấu giá
      const endTime = new Date(Date.now() + duration * 1000); // Thời gian kết thúc (tính bằng giây)
  
      // Lưu thông tin đấu giá vào cơ sở dữ liệu
      const auctionItem = await AuctionItem.create({
        authorId, // ID của tác giả
        productName,
        description,
        imageUrl,
        startingPrice,
        endTime,
        highestBid: 0, // Bắt đầu với giá đấu cao nhất là 0
        active: true,  // Đấu giá vẫn đang hoạt động
      });
  
      // Trả về phản hồi khi đấu giá được tạo thành công
      res.status(200).json({ 
        message: 'Auction created successfully', 
        tx, 
        auctionItem // Trả về cả thông tin đấu giá đã lưu vào cơ sở dữ liệu
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Error creating auction', 
        error: error.message 
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
        highestBidder: auctionItem.highestBidder // Trả về thông tin người đấu giá cao nhất
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
  
      // Lấy thông tin từ cơ sở dữ liệu
      const auctionItem = await AuctionItem.findOne({ where: { id: auctionId } });
  
      if (!auctionItem) {
        return res.status(404).json({ message: 'Auction not found' });
      }
  
      // Trả về thông tin đấu giá
      res.status(200).json(auctionItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching auction details', error });
    }
  };
  
