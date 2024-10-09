import {ethers} from "ethers";
import auctionABI from "../config/contractBid.json";

// Kết nối với mạng blockchain (có thể là mạng test như Goerli hoặc Holesky, hoặc mainnet)
const provider = new ethers.JsonRpcProvider('https://holesky.infura.io/v3/8b9e0d5e94a24e7a9ae6be3f972dd9ef'); // URL của mạng blockchain

// Sử dụng private key để tạo signer
const privateKey = '691f5a293f856afea2985edae6eef8193e35cdcb87dd3eaa2cb0b61e6a3e9ace'; // Private key của tài khoản
const wallet = new ethers.Wallet(privateKey, provider); // Kết nối ví với provider

// Khởi tạo contract với signer để ký giao dịch
const auctionContract = new ethers.Contract('0xe5FeA5112950D8512a8078c2dBC8F10ffA53995e', auctionABI, wallet);

module.exports = auctionContract;
