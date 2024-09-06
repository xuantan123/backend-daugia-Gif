import bcrypt from 'bcrypt';
import SignUpAuthor from '../../models/author/SignUpAuthor';

const saltRounds = 10;

export const handleSignUpAuthor = async (req, res) => {
    try {
        const { nickname, email, password } = req.body;

        if (!nickname || !email || !password) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Missing inputs parameter!'
            });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await SignUpAuthor.create({
            nickname,
            email,
            password: hashedPassword,
        });
        
        res.status(201).json({
            errorCode: 0,
            message: 'Sign up successful',
            user: newUser
        });
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({
            errorCode : 2 ,
            message: 'Sign Up failed',
            error: error.message
        });
    }
};