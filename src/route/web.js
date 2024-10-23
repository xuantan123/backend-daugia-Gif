import express from 'express';
import { upload } from '../middleware/multerConfig.js';
import { handleSignUpUser } from '../controllers/user/signupuserController.js';
import { handleLoginUser } from '../controllers/user/signinuserController.js';
import { handleProfileUser, handleEditProfileUser } from '../controllers/user/profileuserControllers.js';
import { getTokenBalance } from "../controllers/user/wallet/TokenWallet.js";
import { handleSignUpAuthor } from '../controllers/author/signupauthorController.js';
import { handleLoginAuthor } from '../controllers/author/signinauthorController.js';
import { handleProfileAuthor, handleEditProfileAuthor } from '../controllers/author/profileauthorController.js';
import { handleEmailUser } from '../controllers/user/EmailUserControllers.js';
import { handlEmailAuthor } from '../controllers/author/EmailAuthorController.js';
import { mintToken  } from "../controllers/smartcontract/mintController.js";
import { transferToken } from "../controllers/smartcontract/transferController.js";
import { approveToken , allowanceToken  } from "../controllers/smartcontract/approveController.js";
import { createAuctionItem , getProductsByAuthorId , deleteProduct , editProduct , checkAuctionStatus  } from "../controllers/author/auctionProduct.js";
import { placeBid ,  getAuctionDetails , endAuction , getBids , getCurrentHighestBidder , getCurrentHighestBid } from '../controllers/smartcontract/bidController.js';
import { registerForAuction , getRegisteredAuctions } from "../controllers/user/registrationController.js";

const router = express.Router();

const initWebRoutes = (app) => {
    router.post('/api/signupuser', handleSignUpUser);
    router.post('/api/loginuser', handleLoginUser);
    router.route('/api/profileuser/:email')
        .post(handleProfileUser)
        .get(handleEmailUser);
    router.post('/api/profileuser', handleProfileUser);
    router.put('/api/profileuser/:id', handleEditProfileUser);
    router.get("/api/connect-wallet/:walletAddress", getTokenBalance);
    

    router.post('/api/signupauthor', handleSignUpAuthor);
    router.post('/api/loginauthor', handleLoginAuthor);
    router.post('/api/profileauthor/:email', handleProfileAuthor);
    router.get('/api/profileauthor/:email', handlEmailAuthor);
    router.post('/api/profileauthor', handleProfileAuthor);
    router.put('/api/profileauthor/:id', handleEditProfileAuthor);
    
    router.post('/api/mint', mintToken );
    router.post('/api/transfer', transferToken);
    router.post('/api/approve',approveToken);
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

    router.post('/api/register', registerForAuction);
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
