// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { ProfileUser } from '../models';

export const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access forbidden' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await ProfileUser.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Lưu thông tin người dùng vào request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
