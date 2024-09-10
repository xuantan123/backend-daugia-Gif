import ProfileUser from "../../models/user/ProfileUser";
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

const saltRounds = 10;


const convertDateToDatabaseFormat = (inputDate) => {
    return dayjs(inputDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
};


const convertGender = (gender) => {
    console.log('Converting gender:', gender);
    if (gender === 'Male') return true;
    if (gender === 'Female') return false;
    return null; 
};

export const handleProfileUser = async (req, res) => { 
    try {
        const { nickname, email, password, fullname, dateofbirth, gender, country, walletaddress } = req.body;

        if (!nickname || !email || !password || !fullname || !dateofbirth || !gender || !country || !walletaddress) {
            return res.status(400).json({
                errorCode: 2,
                message: 'Missing required fields'
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const dateOfBirth = convertDateToDatabaseFormat(dateofbirth); 
        const GenderEdit = convertGender(gender);

        const newUser = await ProfileUser.create({
            nickname,
            email,
            password: hashedPassword,
            fullname,
            dateofbirth: dateOfBirth,
            gender: GenderEdit,
            country,
            walletaddress,
        });

        res.status(201).json({
            errorCode: 0,
            message: 'Profile user created successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Error during profile creation:', error);
        res.status(500).json({
            errorCode: 3,
            message: 'Profile user creation failed',
            error: error.message
        });
    }
};


export const handleEditProfileUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nickname, email, password, fullname, dateofbirth, gender, country, walletaddress } = req.body;

        console.log('Received data:', req.body); 

        const dateOfBirth = convertDateToDatabaseFormat(dateofbirth); 
        const GenderEdit = convertGender(gender);
        console.log('Gender received:', gender);
        const user = await ProfileUser.findByPk(id);

        if (!user) {
            return res.status(404).json({
                errorCode: 1,
                message: 'User not found'
            });
        }

        const updatedFields = {
            nickname,
            email,
            fullname,
            dateofbirth: dateOfBirth,
            gender: GenderEdit,
            country,
            walletaddress
        };

        if (password) {
            updatedFields.password = await bcrypt.hash(password, saltRounds);
        }

        await user.update(updatedFields);

        const updatedUser = await ProfileUser.findByPk(id);

        res.status(200).json({
            errorCode: 0,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error during profile update:', error);
        res.status(500).json({
            errorCode: 3,
            message: 'Profile update failed',
            error: error.message
        });
    }
};
