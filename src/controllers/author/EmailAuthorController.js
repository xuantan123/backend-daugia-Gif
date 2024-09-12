import ProfileAuthor from '../../models/author/ProfileAuthor';

export const handlEmailAuthor = async (req, res) => {
    const email = req.params.email;
    console.log("Email requested:", email); 

    try {
        
        const author = await ProfileAuthor.findOne({ where: { email } });
        
        if (author) {
            
            res.status(200).json({
                errorCode: 0,
                message: 'Get Author information',
                data: author
            });
        } else {
           
            res.status(404).json({
                errorCode: 1,
                message: 'Author not found'
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

