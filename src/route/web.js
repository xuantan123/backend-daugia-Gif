import express from 'express';
import multer from 'multer';

import { handleSignUpUser } from '../controllers/user/signupuserController.js';
import { handleLoginUser } from '../controllers/user/signinuserController.js';
import { handleProfileUser , handleEditProfileUser } from '../controllers/user/profileuserControllers.js';
import { handleSignUpAuthor } from '../controllers/author/signupauthorController.js';
import { handleLoginAuthor } from '../controllers/author/signinauthorController.js';
import { handleProfileAuthor , handleEditProfileAuthor } from '../controllers/author/profileauthorController.js';

import { handleEmailUser } from '../controllers/user/EmailUserControllers.js';
import { handlEmailAuthor } from '../controllers/author/EmailAuthorController.js';
import { deleteProduct } from '../controllers/author/productController.js';
import { editProduct } from '../controllers/author/productController.js';
import { processProduct , getProduct } from '../controllers/author/productController.js';

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

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
    router.post('/api/profileauthor/:email',handleProfileAuthor);
    router.get('/api/profileauthor/:email',handlEmailAuthor);
    router.post('/api/profileauthor', handleProfileAuthor);
    router.put('/api/profileauthor/:id', handleEditProfileAuthor);
    
    
    router.post('/api/addproduct', upload.single('image'), processProduct);
    router.get('/api/addproduct/:email', getProduct);
    router.delete('/api/product/:id', deleteProduct);
    router.put('/api/product/:id', upload.single('image'), editProduct);

    router.get('/', (req, res) => {
        res.send('Welcome to the API');
    });

    app.use("/", router);
};

export default initWebRoutes;
