import SignUpAuhtor from '../../models/author/SignUpAuthor';

export const handlEmailAuthor = async (req, res) => {
    const email = req.params.email;
    console.log("Email requested:", email); 

    try {
        
        const user = await SignUpAuhtor.findOne({ where: { email } });
        
        if (user) {
            
            res.status(200).json({
                errorCode: 0,
                message: 'Get user information',
                data: user
            });
        } else {
           
            res.status(404).json({
                errorCode: 1,
                message: 'User not found'
            });
        }
    } catch (error) {
        
        console.error("Server error:", error);
        res.status(500).json({
            errorCode: 2,
            message: 'Server error',
            error: error.message
        });
    }
};

