import { ethers } from "ethers";
import contractABI from "../../config/contract.json";

const approveToken = async (req, res) => {
    const spender = "0xA9aEd670736770a77d1857f42dC354fE3bD78A87";
    const amount = "20000"; 

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Số lượng phải là một số dương" });
    }

    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        const contractAddress = process.env.CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        const parsedAmount = ethers.parseUnits(amount.toString(), 18);

        const tx = await contract.approve(spender, parsedAmount, {
            gasLimit: 100000,
            gasPrice: ethers.parseUnits('20', 'gwei')
        });

        const receipt = await tx.wait();
        const approvalEvent = receipt.events?.filter((x) => x.event === "Approval");

        if (approvalEvent && approvalEvent.length > 0) {
            res.status(200).json({ message: "Phê duyệt thành công!", approvalEvent });
        } else {
            res.status(500).json({ message: "Không tìm thấy sự kiện Approval" });
        }
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
    }
};

const checkAllowance = async (req, res) => {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        const contractAddress = process.env.CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        const spender = "0xA9aEd670736770a77d1857f42dC354fE3bD78A87";

        const allowance = await contract.allowance(wallet.address, spender);

        res.status(200).json({ allowance: ethers.formatUnits(allowance, 18) });
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
    }
};

export { approveToken, checkAllowance };
