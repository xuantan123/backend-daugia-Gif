import {handleAuthorSignIn} from '../../services/SignInAuthorServices';

export const handleLoginAuthor = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            errorCode: 1,
            message: 'Missing inputs parameter!'
        });
    }

    try {
        const userData = await handleAuthorSignIn(email, password);
        return res.status(200).json({
            errorCode: userData.errorCode,
            message: userData.message,
            user: userData.user || {}
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            errorCode: 2,
            message: 'Error during sign in'
        });
    }
};
