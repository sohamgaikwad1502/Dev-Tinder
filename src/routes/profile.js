const express = require("express")
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");


profileRouter.get("/profile",userAuth, async (req,res) =>   
{
    try {
        res.send(req.user);
    }
    catch(error)
    {
        res.send(error.message); 
    }

})
module.exports = profileRouter;