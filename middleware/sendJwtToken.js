const jwt = require ('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' });

 
//GENERAT JWT TOKEN FOR AUTH
  
const createSendToken = (user,res) => {
   
   //Create a secrure Token your API
        const signToken = (id) => {
            return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE_IN,
            });
        };

        const token = signToken(user._id);
    
    //Create cookie
  
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000
      ),
      //secure: true, //Active this option when we are in production it's very important to do that!!!!!!
      httpOnly: true,
    };
  
    res.cookie('MySuperCookie', token, cookieOptions);
  
    
  };


module.exports = createSendToken