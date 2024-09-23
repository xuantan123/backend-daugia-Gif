import ProductAuthor from "../../models/author/ProductsAuthor";
import ProfileAuthor from "../../models/author/ProfileAuthor";
import ProfileUser from "../../models/user/ProfileUser";

export const getUserStats = async (req, res) => {
    try {
        const userCount = await ProfileUser.count();
        const authorCount = await ProfileAuthor.count();

        res.json({
            success: true,
            userCount,
            authorCount
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user stats' });
    }
};

export const getUserDetails = async (req, res) => {
    try {
        const users = await ProfileUser.findAll();
        const authors = await ProfileAuthor.findAll();

        res.json({
            success: true,
            users,
            authors
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user details' });
    }
};


export const getAuthorProduct = async (req, res) => {
    try {
        
        const products = await ProductAuthor.findAll({
            attributes: [
                'id',
                'productname',
                'description',
                'price',
                'status',
                'image' 
            ]
        });

       
        const productsWithImageStatus = products.map(product => ({
            ...product.toJSON(), 
            hasImage: !!product.image 
        }));

        res.json({
            success: true,
            products: productsWithImageStatus
        });
    } catch (error) {
        console.error('Error fetching author products:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch author products' });
    }
};