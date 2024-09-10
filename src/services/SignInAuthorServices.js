import bcrypt from 'bcrypt';
import ProfileAuthor from '../models/author/ProfileAuthor'; ;

export const handleAuthorSignIn = async (email, password) => {
    try {
        const userData = {};

        const isExit = await checkEmail(email);
        console.log('Email exists:', isExit);
        const signIn = await ProfileAuthor.findOne({
            where: { email: email },
            attributes: ['email', 'password'],
            raw: true,
        });
        console.log('User đƯợc tìm thấY là', signIn);
        if (signIn) {
            const check = await bcrypt.compare(password, signIn.password);
            console.log("Compare passwords:", check);
            if (check) {
                return {
                    errorCode: 0,
                    message: 'Login successful',
                    user: {
                        email: signIn.email,
                    }
                };
            } else {
                return {
                    errorCode: 3,
                    message: 'Wrong password',
                    user: {}
                };
            }
        } else {
            return {
                errorCode: 2,
                message: 'User not found',
                user: {}
            };
        }
    } catch (e) {
        console.error('Error during login:', e);
        throw e;
    }
};

export const checkEmail = (userEmail) =>{
    return new Promise(async(resole , reject) => {
        try{
            const user = await ProfileAuthor.findOne({
                where: {email : userEmail}
            })
          if(user){
            resole(true)
          }else{
            resole(false)
          }
        }catch(e){
            reject(e);
        }
    })
}
