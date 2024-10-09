import { ethers } from "ethers";
import contractABI from "../../config/contract.json";

const approveToken = async (req, res) => {
    const spender = "0x0a69ea50F1D0bCfb7f287Dbd1cB7e789df249674"; // Thay đổi địa chỉ này thành địa chỉ smart contract của bạn
    const amount  = "2000000"; 

    // Kiểm tra số lượng
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Số lượng phải là một số dương" });
    }

    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        const contractAddress = process.env.CONTRACT_ADDRESS; 
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        const parsedAmount = ethers.parseUnits(amount.toString(), 18);

        // Phê duyệt cho spender
        const tx = await contract.approve(spender, parsedAmount, {
            gasLimit: 100000,
            gasPrice: ethers.parseUnits('20', 'gwei')
        });

        await tx.wait();

        res.status(200).json({ message: "Phê duyệt thành công!", tx });
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
    }
};

export { approveToken };
