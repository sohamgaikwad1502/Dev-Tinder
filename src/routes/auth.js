const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js")

authRouter.post("/signup",async (req,res) =>
    { 
        // new instace of new user model
        console.log(req.body);
        const { firstName, lastName , emailId , password ,age , gender ,photoUrl , about, skills} = req.body;
        
        const passwordHash = await bcrypt.hash(password,10);
    
        const user = new User({
            firstName , lastName, emailId , password : passwordHash , age , gender ,photoUrl , about, skills 
        });
    
        try{
            await user.save(); 
            res.send("Data Saved Successfully!!");
        }
        catch(err)
        {
            res.send( err.message)
        }
        
    })

authRouter.post("/login", async(req, res)=>
{
    try{
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId})
        if(!user)
        {
            throw new Error("Invalid credentials")
        }
        const isPasswordvalid = await user.validatePassword(password) ;
        if(isPasswordvalid) 
        {
            const token = user.generateJwtToken();
            res.cookie("token",token)
            res.send("Login Successfull")
        }
        else {
            throw new Error("Invalid Credentials")
        }

    }
    catch(error)
    {
        res.send(error.message);
    }
})

module.exports = authRouter;

