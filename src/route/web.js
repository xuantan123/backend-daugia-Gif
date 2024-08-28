import express from 'express';
import { handleSignUp } from '../controllers/signupuserController.js';
import { handleLogin } from '../controllers/signinuserController.js';

const router = express.Router();

const initWebRoutes = (app) => {
    router.post('/api/signup', handleSignUp);
    router.post('/api/login', handleLogin);

    app.use("/", router);
};

export default initWebRoutes;
