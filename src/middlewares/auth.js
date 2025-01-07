const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req,res,next) =>{
    const {token }= req.cookies;
    try 
    {
        if(token)
        {
            const verify = jwt.verify(token, "DEV@Tinder$6969");
    
            if(verify._id)
            {
                const user = verify._id;
                const user_data = await User.findById(user);
                if(user_data)
                {
                    req.user = user_data;
                    next();
                }
                else 
                {
                    throw new Error("User Not Found");
                }
                
            }
        }
        else 
        {
            throw new Error("No Token Found");
        }  
    }
    catch(error)
    {
        res.send(error.message);
    }
}

module.exports = {userAuth};