import ProfileAuthor from "../../models/author/ProfileAuthor";

export const handleProfileAuthor = async(req,res) => { 
     try{
        const {fullname , gender , country , walletaddress } = req.body;
        const newAuthor = await ProfileAuthor.create({
            fullname,
            gender,
            country,
            walletaddress,
        });
        console.log('thong tin tac gia', newAuthor);
        res.status(200).json({
            message: 'Profile author created successfully',
            user: newAuthor,
        });
     }catch(error){
        console.error('Error during update profile:', error);
        res.status(500).json({
            message: 'Create profile author failed',
            error: error.message
        });
     }
}

export const handleEditProfileAuthor = async(req,res) => { 
    try{
        const { id } = req.params;
        const { fullname , gender , country , walletaddress } = req.body;

        const author = await ProfileAuthor.findByPk(id);

        if (!author) {
            return res.status(404).json({
                message: 'Author not found'
            });
        }
        const updateAuthor = await author.update({
            fullname,
            gender,
            country,
            walletaddress,
        });
        console.log('thong tin vua cap nhap xong: ' , updateAuthor);
        res.status(200).json({
            message: 'Profile updated Author successfully',
            user: updateAuthor,
        });
    } catch(error){
        console.error('Error during profile update:', error);
        res.status(500).json({
            message: 'Profile update failed',
            error: error.message,
        });
    }
}