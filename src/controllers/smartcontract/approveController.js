const { ethers } = require('ethers');
import abi from "../../config/contract.json";

// Cấu hình provider và contract
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Tạo một wallet bằng private key của bạn
const privateKey = process.env.PRIVATE_KEY; // Lưu private key trong biến môi trường
const wallet = new ethers.Wallet(privateKey, provider);
const tokenContract = new ethers.Contract(contractAddress, abi, wallet);

// Hàm phê duyệt token
const approveToken = async (req, res) => {
    const { spender, amount } = req.body;

    console.log('Tham số nhận được:', req.body);

    // Kiểm tra các tham số bắt buộc
    if (!spender || !amount) {
        return res.status(400).send('Thiếu tham số');
    }

    try {
        // Chuyển đổi số lượng sang đơn vị wei
        const amountInUnits = ethers.parseUnits(amount.toString(), 18);

        // Theo dõi sự kiện Approval trước khi gọi approve
        tokenContract.once("Approval", (owner, spender, value) => {
            console.log(`Sự kiện Approval: Owner: ${owner}, Spender: ${spender}, Amount: ${value.toString()}`);
        });

        // Gọi hàm approve
        const tx = await tokenContract.approve(spender, amountInUnits);
        console.log('Giao dịch phê duyệt:', tx);

        // Lấy txHash từ giao dịch
        const txHash = tx.hash;

        // Chờ cho giao dịch được xác nhận
        const receipt = await tx.wait();

        // Kiểm tra kết quả giao dịch
        if (receipt.status !== 1) {
            return res.status(500).send({
                message: 'Giao dịch thất bại',
                txHash: txHash
            });
        }

        // Gửi thông tin phê duyệt cùng với txHash
        return res.status(200).send({
            message: 'Phê duyệt thành công',
            txHash: txHash, // Trả về txHash
            owner: tx.from, // Địa chỉ owner
            spender: spender, // Địa chỉ spender
            value: amountInUnits.toString() // Số lượng đã phê duyệt
        });

    } catch (error) {
        console.error('Lỗi khi phê duyệt token:', error);

        // Xử lý các loại lỗi khác nhau
        if (error.code === ethers.errors.INSUFFICIENT_FUNDS) {
            return res.status(500).send('Không đủ số dư để thực hiện giao dịch.');
        } else if (error.code === ethers.errors.NETWORK_ERROR) {
            return res.status(500).send('Lỗi mạng, vui lòng kiểm tra lại kết nối.');
        } else if (error.code === ethers.errors.NONCE_EXPIRED) {
            return res.status(500).send('Nonce đã hết hạn, vui lòng thử lại.');
        } else if (error.code === ethers.errors.CALL_EXCEPTION) {
            return res.status(500).send('Lỗi liên quan đến giao dịch, vui lòng thử lại.');
        } else if (error.code === ethers.errors.FILTER_NOT_FOUND) {
            return res.status(500).send('Filter không tồn tại hoặc đã hết hạn.');
        } else {
            return res.status(500).send({
                message: 'Có lỗi xảy ra trong quá trình phê duyệt token',
                error: error.message
            });
        }
    }
};
// Hàm lấy thông tin allowance
const allowanceToken = async (req, res) => {
    const { owner, spender } = req.body;

    console.log('Tham số nhận được:', req.body);

    // Kiểm tra các tham số bắt buộc
    if (!owner || !spender) {
        return res.status(400).send('Thiếu tham số');
    }

    try {
        // Gọi hàm allowanceOf từ hợp đồng
        const allowanceAmount = await tokenContract.allowanceOf(owner, spender);
        
        // Chuyển đổi allowanceAmount về đơn vị hiển thị
        const allowanceInUnits = ethers.formatUnits(allowanceAmount, 18);

        return res.status(200).send({
            message: 'Lấy thông tin allowance thành công',
            owner: owner,
            spender: spender,
            allowance: allowanceInUnits // Số lượng allowance đã được lấy
        });

    } catch (error) {
        console.error('Lỗi khi lấy allowance token:', error);

        // Xử lý các loại lỗi khác nhau
        return res.status(500).send({
            message: 'Có lỗi xảy ra trong quá trình lấy allowance',
            error: error.message
        });
    }
};


module.exports = {
    approveToken,
    allowanceToken, // Xuất hàm allowanceToken
};

