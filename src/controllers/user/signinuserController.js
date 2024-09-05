import {handleUserSignIn} from '../../services/SignInUserServices';

export const handleLoginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        });
    }

    try {
        const userData = await handleUserSignIn(email, password);
        return res.status(200).json({
            errorCode: userData.errorCode,
            message: userData.message,
            user: userData.SignIn || {}
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            errCode: 2,
            message: 'Error during sign in'
        });
    }
};
