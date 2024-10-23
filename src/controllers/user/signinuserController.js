// authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ProfileUser from '../../models/user/ProfileUser';

const SECRET_KEY = process.env.JWT_SECRET; // Lấy từ biến môi trường

export const handleLoginUser = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password) {
        return res.status(400).json({
            errorCode: 1,
            message: 'Missing inputs parameter!'
        });
    }

    try {
        // Tìm người dùng theo email
        const user = await ProfileUser.findOne({
            where: { email: email },
            attributes: ['id', 'email', 'password'], // Chỉ lấy các trường cần thiết
            raw: true,
        });

        if (!user) {
            return res.status(404).json({
                errorCode: 2,
                message: 'User not found',
                user: {}
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                errorCode: 3,
                message: 'Wrong password',
                user: {}
            });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '2m' });

        // Trả về thông tin người dùng và token
        return res.status(200).json({
            errorCode: 0,
            message: 'Login successful',
            user: { id: user.id, email: user.email },
            token // Thêm token vào phản hồi
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            errorCode: 4,
            message: 'Error during sign in'
        });
    }
};
