// controllers/authController.js
import Login from '../../models/Login/Login.js'; // Đảm bảo đường dẫn đúng
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

const SECRET_KEY = process.env.JWT_SECRET; // Đảm bảo bạn đã thiết lập biến môi trường này

// Đăng ký
export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await Login.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await Login.create({
      email,
      password: hashedPassword,
      role, // "user" hoặc "author"
    });

    return res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Đã xảy ra lỗi!', error });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra email
    const user = await Login.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    // Kiểm tra mật khẩu
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }

    // Tạo token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '15m' });

    return res.status(200).json({
      errorCode : 0 ,
      message: 'Đăng nhập thành công!',
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Đã xảy ra lỗi!', error });
  }
};
