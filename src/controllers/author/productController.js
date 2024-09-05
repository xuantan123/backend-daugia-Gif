import ProductAuthor from '../../models/author/ProductsAuthor';

export const handleProduct = async(req,res) => { 
    try{
      const { productname , description , price , status , image } = req.body;
      const newProduct = await ProductAuthor.create({
        productname, 
        description,
        price,
        status,
        image,
      });
      console.log('thong tin tac gia', newProduct);
        res.status(200).json({
            message: 'Profile author created successfully',
            user: newProduct,
        });
    }catch(error){
        console.error('Error during update profile:', error);
        res.status(500).json({
            message: 'Create profile author failed',
            error: error.message
        });
    }
}