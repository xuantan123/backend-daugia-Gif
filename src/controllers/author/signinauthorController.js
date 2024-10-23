import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ProfileAuthor from '../../models/author/ProfileAuthor'; // Giả sử bạn có model Author riêng

const SECRET_KEY = process.env.JWT_SECRET; // Lấy từ biến môi trường

export const handleLoginAuthor = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password) {
        return res.status(400).json({
            errorCode: 1,
            message: 'Missing inputs parameter!'
        });
    }

    try {
        // Tìm tác giả theo email
        const author = await ProfileAuthor.findOne({
            where: { email: email },
            attributes: ['id', 'email', 'password'], // Chỉ lấy các trường cần thiết
            raw: true,
        });

        if (!author) {
            return res.status(404).json({
                errorCode: 2,
                message: 'Author not found',
                author: {}
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, author.password);
        if (!isMatch) {
            return res.status(400).json({
                errorCode: 3,
                message: 'Wrong password',
                author: {}
            });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: author.id, email: author.email }, SECRET_KEY, { expiresIn: '2m' });

        // Trả về thông tin tác giả và token
        return res.status(200).json({
            errorCode: 0,
            message: 'Login successful',
            author: { id: author.id, email: author.email },
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
