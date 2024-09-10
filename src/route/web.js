import express from 'express';
import { handleSignUpUser } from '../controllers/user/signupuserController.js';
import { handleLoginUser } from '../controllers/user/signinuserController.js';
import { handleProfileUser , handleEditProfileUser } from '../controllers/user/profileuserControllers.js';
import { handleSignUpAuthor } from '../controllers/author/signupauthorController.js';
import { handleLoginAuthor } from '../controllers/author/signinauthorController.js';
import { handleProfileAuthor , handleEditProfileAuthor } from '../controllers/author/profileauthorController.js';
import { handleProduct } from '../controllers/author/productController.js';
import { handleEmailUser } from '../controllers/user/EmailUserControllers.js';
import { handlEmailAuthor } from '../controllers/author/EmailAuthorController.js';

const router = express.Router();

const initWebRoutes = (app) => {
    router.post('/api/signupuser', handleSignUpUser);
    router.post('/api/loginuser', handleLoginUser);
    router.route('/api/profileuser/:email')
        .post(handleProfileUser)
        .get(handleEmailUser);
    router.post('/api/profileuser',handleProfileUser);
    router.put('/api/profileuser/:id', handleEditProfileUser);


    router.post('/api/signupauthor', handleSignUpAuthor);
    router.post('/api/loginauthor', handleLoginAuthor);
    router.post('/api/profileauthor', handleProfileAuthor);
    router.put('/api/profileAuthor/:id', handleEditProfileAuthor);
    router.get('/api/signupauthor/:email', handlEmailAuthor);
    
    router.post('/api/product', handleProduct);

    router.get('/', (req, res) => {
        res.send('Welcome to the API');
    });

    app.use("/", router);
};

export default initWebRoutes;
