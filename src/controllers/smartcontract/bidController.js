const { ethers } = require('ethers');
const { allowanceToken } = require('../../controllers/smartcontract/approveController'); // Nhập hàm allowanceToken
import abiBid from "../../config/contractBid.json"; // Thay thế bằng ABI của smart contract bạn
import abi from "../../config/contract.json";

// Cấu hình provider và contract
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractAddressBid = process.env.ContractAuction;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
const auctionContract = new ethers.Contract(contractAddressBid, abiBid, wallet); // Kết nối với contract bid
const tokenContract = new ethers.Contract(contractAddress, abi, wallet); // Kết nối với contract token

// Hàm thực hiện đặt giá thầu (bid)
const placeBid = async (req, res) => {
    const { auctionId, bidAmount } = req.body;

    if (!auctionId || !bidAmount) {
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

        const tx = await auctionContract.bid(auctionId, amountInUnits);
        const receipt = await tx.wait();

        if (receipt.status !== 1) {
            return res.status(500).send({
                message: 'Đặt giá thầu thất bại',
                txHash: tx.hash,
            });
        }

        return res.status(200).send({
            message: 'Đặt giá thầu thành công',
            txHash: tx.hash,
        });

    } catch (error) {
        console.error('Lỗi khi đặt giá thầu:', error);
        return res.status(500).send({
            message: 'Có lỗi xảy ra khi đặt giá thầu.',
            error: error.message
        });
    }
};

// Xuất module
module.exports = {
    placeBid,
};
