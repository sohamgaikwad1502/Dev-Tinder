const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");

requestRouter.get("/sendConnectionRequest",userAuth,(req,res)=> 
{
    console.log("Connection Request Sent");
    res.send("Connection Request Sent");    
})
module.exports = requestRouter;

