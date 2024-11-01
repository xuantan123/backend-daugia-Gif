const { ethers } = require('ethers');
const { allowanceToken } = require('../../controllers/smartcontract/approveController'); // Nhập hàm allowanceToken
import abiBid from "../../config/contractBid.json"; // Thay thế bằng ABI của smart contract bạn
import abi from "../../config/contract.json";
import Bid from "../../models/author/BidAuthor";
import AuctionResult from "../../models/author/AuctionResult";
import Info from '../../models/Login/Info';
import Login from "../../models/Login/Login";
import Auction from "../../models/author/AuctionAuthor";
import nodemailer from 'nodemailer';
import { where } from "sequelize";


// Cấu hình provider và contract
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractAddressBid = process.env.ContractAuction;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
const auctionContract = new ethers.Contract(contractAddressBid, abiBid, wallet); // Kết nối với contract bid
const tokenContract = new ethers.Contract(contractAddress, abi, wallet); // Kết nối với contract token

// Hàm thực hiện đặt giá thầu (bid)
export const placeBid = async (req, res) => {
    const { auctionId, bidAmount, bidderId } = req.body;
   

    if (!auctionId || !bidAmount || !bidderId) {
        return res.status(400).send('Thiếu thông tin auctionId hoặc bidAmount');
    }

    try {
        const amountInUnits = ethers.parseUnits(bidAmount.toString(), 18); // chuyển đổi sang wei (18 decimals)
        const allowanceAmount = await tokenContract.allowance(wallet.address, contractAddressBid);
        
        const allowanceAmountBigInt = BigInt(allowanceAmount.toString());
        const amountInUnitsBigInt = BigInt(amountInUnits.toString());

        console.log('Allowance:', allowanceAmountBigInt.toString());
        console.log('Bid Amount in Units (wei):', amountInUnitsBigInt.toString());

        if (allowanceAmountBigInt < amountInUnitsBigInt) {
            return res.status(400).send('Allowance không đủ để thực hiện bid.');
        }

        // Thực hiện giao dịch bid
        const tx = await auctionContract.bid(auctionId, amountInUnits);
        const receipt = await tx.wait();

        if (receipt.status !== 1) {
            return res.status(500).send({
                message: 'Đặt giá thầu thất bại',
                txHash: tx.hash,
            });
        }

        // Lưu thông tin vào MySQL
        const newBid = await Bid.create({
            amount: bidAmount, // Số lượng giá thầu
            auctionId: auctionId, // ID của cuộc đấu giá
            bidderId: bidderId, // ID của người đặt giá thầu
            txHash: tx.hash, // Hash giao dịch
        });

        return res.status(200).send({
            message: 'Đặt giá thầu thành công',
            txHash: tx.hash,
            bidId: newBid.id // Trả về ID của bid mới tạo
        });

    } catch (error) {
        console.error('Lỗi khi đặt giá thầu:', error);
        return res.status(500).send({
            message: 'Có lỗi xảy ra khi đặt giá thầu.',
            error: error.message
        });
    }
};
export const getAuctionDetails = async (req, res) => {
    const { auctionId } = req.params;

    if (!auctionId) {
        return res.status(400).send('Thiếu auctionId.');
    }

    try {
        const auctionDetails = await auctionContract.getAuctionDetails(auctionId);

        return res.status(200).send({
            auctionId: auctionDetails.id.toString(), // Chuyển đổi BigInt thành chuỗi
            productName: auctionDetails.productName,
            description: auctionDetails.description,
            imageUrl: auctionDetails.imageUrl,
            startingPrice: auctionDetails.startingPrice.toString(), // Chuyển đổi BigInt thành chuỗi
            endTime: auctionDetails.endTime.toString(), // Chuyển đổi BigInt thành chuỗi
            active: auctionDetails.active,
            author: auctionDetails.author,
        });
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết cuộc đấu giá:', error);
        return res.status(500).send({
            message: 'Có lỗi xảy ra khi lấy chi tiết cuộc đấu giá.',
            error: error.message
        });
    }
};

// Hàm kết thúc cuộc đấu giá
export const endAuction = async (req, res) => {
    const { auctionId } = req.params;

    if (!auctionId) {
        return res.status(400).send('Thiếu auctionId.');
    }

    try {
        const tx = await auctionContract.endAuction(auctionId);
        const receipt = await tx.wait();

        if (receipt.status !== 1) {
            return res.status(500).send('Kết thúc cuộc đấu giá thất bại.');
        }

        return res.status(200).send({
            message: 'Kết thúc cuộc đấu giá thành công',
            txHash: tx.hash
        });
    } catch (error) {
        console.error('Lỗi khi kết thúc cuộc đấu giá:', error);
        return res.status(500).send({
            message: 'Có lỗi xảy ra khi kết thúc cuộc đấu giá.',
            error: error.message
        });
    }
};

// Hàm lấy danh sách các đặt giá cho một cuộc đấu giá
export const getBids = async (req, res) => {
    const { auctionId } = req.params;

    if (!auctionId) {
        return res.status(400).send('Thiếu auctionId.');
    }

    try {
        const bids = await auctionContract.getBids(auctionId);

        // Giả sử bids là một mảng chứa các đối tượng có cấu trúc như { amount, bidder }
        const formattedBids = bids.map(bid => ({
            amount: bid.amount.toString(), // Chuyển đổi BigInt thành chuỗi
            bidder: bid.bidder,
            // Thêm các thuộc tính khác nếu có
        }));

        return res.status(200).send(formattedBids);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách giá thầu:', error);
        return res.status(500).send({
            message: 'Có lỗi xảy ra khi lấy danh sách giá thầu.',
            error: error.message
        });
    }
};

// Hàm lấy người đặt giá cao nhất
export const getCurrentHighestBidder = async (req, res) => {
    const { auctionId } = req.params;

    if (!auctionId) {
        return res.status(400).send('Thiếu auctionId.');
    }

    try {
        const highestBidderAddress = await auctionContract.getCurrentHighestBidder(auctionId);
        return res.status(200).send({
            auctionId: auctionId,
            highestBidder: highestBidderAddress
        });
    } catch (error) {
        console.error('Lỗi khi lấy địa chỉ ví của người đặt giá cao nhất:', error);
        return res.status(500).send({
            message: 'Có lỗi xảy ra khi lấy địa chỉ ví của người đặt giá cao nhất.',
            error: error.message
        });
    }
};

// Hàm lấy giá cao nhất hiện tại
export const getCurrentHighestBid = async (req, res) => {
    const { auctionId } = req.params;

    if (!auctionId) {
        return res.status(400).send('Thiếu auctionId.');
    }

    try {
        const highestBidAmount = await auctionContract.getCurrentHighestBid(auctionId);
        return res.status(200).send({
            auctionId: auctionId,
            highestBid: ethers.formatUnits(highestBidAmount, 18) // Chuyển đổi từ wei về đơn vị token
        });
    } catch (error) {
        console.error('Lỗi khi lấy giá cao nhất hiện tại:', error);
        return res.status(500).send({
            message: 'Có lỗi xảy ra khi lấy giá cao nhất hiện tại.',
            error: error.message
        });
    }
};

export const getAuctionResult = async (req, res) => {
    const { auctionId } = req.params;

    if (!auctionId) {
        return res.status(400).send('Thiếu auctionId.');
    }

    try {
        // Lấy kết quả từ smart contract
        const result = await auctionContract.auctionResult(auctionId);

        // Lưu thông tin vào cơ sở dữ liệu
        const auctionResult = await AuctionResult.create({
            auctionId: result.auctionId.toString(),
            winnerAddress: result.winner, // Địa chỉ người thắng
            highestBid: result.highestBid.toString() // Chuyển đổi BigInt thành chuỗi
        });

        return res.status(200).send({
            auctionId: auctionResult.auctionId,
            winner: auctionResult.winnerAddress,
            highestBid: auctionResult.highestBid.toString() // Chuyển đổi BigInt thành chuỗi
        });
    } catch (error) {
        console.error('Lỗi khi lấy kết quả đấu giá:', error);
        return res.status(500).send({
            message: 'Có lỗi xảy ra khi lấy kết quả đấu giá.',
            error: error.message
        });
    }
};

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Địa chỉ email của bạn
            pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng đã tạo
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email đã được gửi thành công!');
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
    }
};


export const getWinnerEmail = async (req, res) => {
    const { auctionId } = req.params;

    if (!auctionId) {
        return res.status(400).send('Thiếu auctionId.');
    }

    try {
        // Lấy kết quả từ smart contract
        const result = await auctionContract.auctionResult(auctionId);
        const winnerAddress = result.winner;

        // Tìm kiếm trong bảng Info để lấy loginId dựa trên walletAddress
        const winnerInfo = await Info.findOne({ where: { walletAddress: winnerAddress } });

        if (!winnerInfo) {
            return res.status(404).send({ message: 'Không tìm thấy thông tin người thắng.' });
        }

        // Tìm kiếm email của người thắng trong bảng Login dựa trên loginId
        const winnerLogin = await Login.findOne({ where: { id: winnerInfo.loginId } });

        if (!winnerLogin) {
            return res.status(404).send({ message: 'Không tìm thấy thông tin đăng nhập của người thắng.' });
        }

        // Lấy thông tin đấu giá từ bảng Auction
        const auctionInfo = await Auction.findOne({ where: { id: auctionId } }); // Giả sử bạn có bảng Auction

        if (!auctionInfo) {
            return res.status(404).send({ message: 'Không tìm thấy thông tin đấu giá cho auctionId.' });
        }
        const auctionResult = await AuctionResult.findOne({ where: { auctionId: auctionId } });

        if (!auctionResult) {
            return res.status(404).send({ message: 'Không tìm thấy thông tin kết quả đấu giá cho auctionId.' });
        }

        // Gửi email thông báo cho người thắng
        const subject = 'Chúc mừng bạn đã thắng cuộc đấu giá!';
        const text = `
            Bạn đã thắng cuộc đấu giá cho auctionId: ${auctionId}.
            Thông tin đấu giá:
            - Tiêu đề: ${auctionInfo.title}
            - Mô tả: ${auctionInfo.description}
            - Giá khởi điểm: ${auctionInfo.startingPrice}
            - Số tiền trúng đấu giá cao nhất: ${auctionResult.highestBid}
            - Thời gian kết thúc: ${auctionInfo.endTime}
        `;
        await sendEmail(winnerLogin.email, subject, text); // Gửi email cho người thắng

        return res.status(200).send({
            auctionId: auctionId,
            winnerEmail: winnerLogin.email,
            message: 'Email thông báo đã được gửi đến người thắng.',
        });
    } catch (error) {
        console.error('Lỗi khi lấy email của người thắng:', error);
        return res.status(500).send({
            message: 'Có lỗi xảy ra khi lấy email của người thắng.',
            error: error.message,
        });
    }
};