import { ethers } from "ethers";
import contractABI from "../../config/contract.json";
import MintTransaction  from "../../models/smartcontract/mintTransaction";

const mintToken = async (req, res) => {
  const { receiver, amount } = req.body;

  // Kiểm tra địa chỉ người nhận và số lượng
  if (!ethers.isAddress(receiver)) {
      return res.status(400).json({ message: "Địa chỉ người nhận không hợp lệ" });
  }
  if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Số lượng phải là một số dương" });
  }

  try {
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

      const contractAddress = process.env.CONTRACT_ADDRESS; 

      const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
      const parsedAmount = ethers.parseUnits(amount.toString(), 18);
    
      const tx = await contract.mint(receiver, parsedAmount, {
          gasLimit: 100000,
          gasPrice: ethers.parseUnits('20', 'gwei')
      });
  
      await tx.wait();

      console.log('MintTransaction:', MintTransaction); 

      await MintTransaction.create({
          receiver: receiver,
          amount: amount.toString(),
          txHash: tx.hash, 
      });

      res.status(200).json({ message: "Mint thành công!", tx });
  } catch (error) {
      console.error("Lỗi:", error);
      res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};

export { mintToken };