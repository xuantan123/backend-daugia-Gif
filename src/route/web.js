import express from 'express';
import { upload } from '../middleware/multerConfig.js';
import { register , login } from '../controllers/Login/LoginController.js';
import { createInfo , updateInfo , deleteInfo , getFullnameByLoginId } from '../controllers/Login/InfoCotroller.js';
import { mintToken  } from "../controllers/smartcontract/mintController.js";
import { transferToken } from "../controllers/smartcontract/transferController.js";
import { approveToken , allowanceToken  } from "../controllers/smartcontract/approveController.js";
import { createAuctionItem , getProductsByAuthorId , deleteProduct , editProduct , checkAuctionStatus  } from "../controllers/author/auctionProduct.js";
import { placeBid ,  getAuctionDetails , endAuction , getBids , getCurrentHighestBidder , getCurrentHighestBid  } from '../controllers/smartcontract/bidController.js';
import { registerUserForAuction , getRegisteredAuctions } from "../controllers/user/registrationController.js";

const router = express.Router();

const initWebRoutes = (app) => {
    
    router.post('/api/register', register);
    router.post('/api/login', login);
    router.post('/api/createInfo', createInfo);
    router.put('/api/updateInfo/:id', updateInfo);
    router.delete('/api/deleteInfo/:id', deleteInfo);
    router.get('/api/info/fullname/:id', getFullnameByLoginId);

    router.post('/api/mint', mintToken );
    router.post('/api/transfer', transferToken);
    router.post('/api/approve', approveToken);
    router.post('/api/allowance', allowanceToken);
    
    router.post('/api/create',upload.single('image'), createAuctionItem);
    router.get('/api/auction/status', checkAuctionStatus);
    router.get('/api/products/author/:authorId', getProductsByAuthorId);
    router.delete('/api/delete/:id', deleteProduct);
    router.put('/api/edit/:id', editProduct);

    router.post('/api/bid',placeBid);
    router.get('/api/auctions/:auctionId', getAuctionDetails);
    router.post('/api/auctions/:auctionId/end', endAuction);
    router.get('/api/auctions/:auctionId/bids', getBids);
    router.get('/api/auctions/:auctionId/current-highest-bidder', getCurrentHighestBidder);
    router.get('/api/auctions/:auctionId/current-highest-bid', getCurrentHighestBid);
<<<<<<< HEAD
=======

    router.post('/api/registerUser', registerUserForAuction);
    router.get('/api/:userId/auctions', getRegisteredAuctions);
>>>>>>> f3d78aed66da8e8a3a9a4fe4e6cac104c621b97a

    router.post('/api/register', registerForAuction);
    router.get('/api/:userId/auctions', getRegisteredAuctions);
    router.get('/', (req, res) => {
        res.send('Welcome to the API');
    });

    app.use("/", router);
};

export default initWebRoutes;
