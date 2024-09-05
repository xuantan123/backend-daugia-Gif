import bcrypt from 'bcrypt';
import SignUpAuthor from '../models/author/SignUpAuthor'; ;

export const handleAuthorSignIn = async (email, password) => {
    try {
        const userData = {};

        const isExit = await checkEmail(email);
        console.log('Email tồn tại', isExit);
        const signIn = await SignUpAuthor.findOne({
            where: { email: email },
            attributes: ['email', 'password'],
            raw: true,
        });
        console.log('User đƯợc tìm thấY là', signIn);
        if (signIn) {
            const check = await bcrypt.compare(password, signIn.password);
            console.log("So sánh mật khẩu:", check);
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
            const user = await SignUpAuthor.findOne({
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
