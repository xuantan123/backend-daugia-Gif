import { ethers } from 'ethers';
import AuctionContract from '../../config/contractBid.json'; 
import Auction from '../../models/author/AuctionAuthor'; 
import User from "../../models/user/ProfileUser";
import Bid from "../../models/author/BidAuthor";

const tokenAddress = "0x4205851C3Dc765e79D82133B0718a22919B21a97"; 
const auctionAddress = "0xDa800Dca7859aA51A9FC6B4150A8b7Bc5B977994"; 

// Kết nối với provider
const provider = new ethers.JsonRpcProvider('https://holesky.infura.io/v3/8b9e0d5e94a24e7a9ae6be3f972dd9ef');

// Tạo wallet từ private key
const privateKey = process.env.PRIVATE_KEY; // Thay thế bằng private key của bạn
const wallet = new ethers.Wallet(privateKey, provider);

// Tạo một hợp đồng Auction
const auctionContract = new ethers.Contract(auctionAddress, AuctionContract, wallet); // Đảm bảo sử dụng AuctionContract.abi

// Đặt giá
export const placeBid = async (req, res) => {
    try {
        const { auctionId, amount, bidderId } = req.body;

        // Kiểm tra xem auction có tồn tại không
        const auction = await Auction.findOne({ where: { id: auctionId } });
        if (!auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }

        // Kiểm tra xem bidder có tồn tại không
        const bidder = await User.findOne({ where: { id: bidderId } });
        if (!bidder) {
            return res.status(404).json({ error: 'Bidder not found' });
        }

        // Kiểm tra xem giá thầu có hợp lệ không
        if (amount <= auction.currentBid) {
            return res.status(400).json({ error: 'Bid amount must be greater than the current bid.' });
        }

        // Chuyển đổi giá thầu sang wei
        const parsedAmount = ethers.parseEther(amount.toString());

        // Gửi giao dịch đến hợp đồng để đặt giá thầu
        const txResponse = await auctionContract.bid(auctionId, parsedAmount, {
            gasLimit: 300000 // Điều chỉnh gasLimit nếu cần
        });

        // Chờ cho giao dịch được xác nhận
        const txReceipt = await txResponse.wait();

        // Thêm bid vào cơ sở dữ liệu
        const newBid = await Bid.create({
            auctionId: auctionId,
            amount: amount,
            bidderId: bidderId,
            txHash: txReceipt.transactionHash // Lưu txHash vào cơ sở dữ liệu
        });

        // Cập nhật auction với bid mới
        await auction.update({ currentBid: amount });

        // Phản hồi thành công
        return res.status(201).json({ 
            message: 'Bid placed successfully', 
            bid: newBid, 
            txHash: txReceipt.transactionHash // Trả về txHash trong phản hồi
        });
    } catch (error) {
        console.error(error); // In ra lỗi trong console để dễ theo dõi
        return res.status(500).json({ error: 'An error occurred while placing the bid.' });
    }
};
