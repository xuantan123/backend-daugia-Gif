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
import { approveToken , checkAllowance } from "../controllers/smartcontract/approveController.js";
import { createAuctionItem , getProduct , deleteProduct , editProduct } from "../controllers/author/auctionProduct.js";

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
    router.post('/api/aprrove',approveToken);
    router.get('/api/allowance',checkAllowance);
    

    router.post('/api/create',upload.single('image'), createAuctionItem);
    router.get('/api/product/:email', getProduct);
    router.delete('/api/delete/:id', deleteProduct);
    router.put('/api/edit/:id', editProduct);


    router.get('/', (req, res) => {
        res.send('Welcome to the API');
    });

    app.use("/", router);
};

export default initWebRoutes;
