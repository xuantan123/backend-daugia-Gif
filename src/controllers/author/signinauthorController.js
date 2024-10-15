import {handleAuthorSignIn} from '../../services/SignInAuthorServices';

export const handleLoginAuthor = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            errorCode: 1,
            message: 'Thiếu thông tin đầu vào!'
        });
    }

    try {
        const userData = await handleAuthorSignIn(email, password);
        return res.status(200).json({
            errorCode: userData.errorCode,
            message: userData.message,
            user: {
                id: userData.user?.id || null,  // Trả về id nếu có
                ...userData.user                 // Trả về toàn bộ thông tin user
            }
        });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        return res.status(500).json({
            errorCode: 2,
            message: 'Lỗi trong quá trình đăng nhập'
        });
    }
};
