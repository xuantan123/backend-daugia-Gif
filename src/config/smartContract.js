import {ethers} from "ethers";
import auctionABI from "../config/contractBid.json";

const provider = new ethers.JsonRpcProvider('https://holesky.infura.io/v3/8b9e0d5e94a24e7a9ae6be3f972dd9ef'); // URL của mạng blockchain

const privateKey = process.env.PRIVATE_KEY; // Private key của tài khoản
const wallet = new ethers.Wallet(privateKey, provider); // Kết nối ví với provider

const auctionContract = new ethers.Contract(process.env.ContractAuction, auctionABI, wallet);

module.exports = auctionContract;
