const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const {ConnectionRequest} = require("../models/Connections.js")
const User = require("../models/user.js");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=> 
{
    try
    {
        const fromConnectionId = req.user._id;
        const toConnectionId = req.params.toUserId;
        const connectionStatus = req.params.status;
        

        // Api level Validation for not allowing same user to send request to same user
        // if(fromConnectionId == toConnectionId)
        // {
        //     return res.send("Cannot send request from same user to same user!!");
        // }

        const toConnectionIdExist = await User.findOne({_id : toConnectionId});
        if(!toConnectionIdExist)
        {
            return res.status(404).send("The User you are trying to connect Doesnt Exists!!")
        }

        const validStatusTypes =  ["interested","ignored"]
        if(!validStatusTypes.includes(connectionStatus))
        {
            return res.status(404).send("Invalid status");     
        }
        const isUserExisting = await ConnectionRequest.findOne({
            $or:[
                {fromConnectionId,toConnectionId},
                {fromConnectionId:toConnectionId,toConnectionId:fromConnectionId},
            ]
        })

        if(isUserExisting)
        {
            return res.status(404).send("Connection already exists");
        }


        //creating a new Instance / Object{fromUserId:something,toUserId:"Something",status:"Something"} 
        const connectionRequest = new ConnectionRequest({fromConnectionId,toConnectionId,connectionStatus})
        // saving the new created object to db
        const data = await connectionRequest.save();
        res.json(
            {
                message : `${req.params.status} request is sent from ${req.user.firstName} to ${toConnectionIdExist.firstName}`,
                data
            })
    }

    catch(error) 
    {
        res.status(404).send(error.message);
    }
})

requestRouter.get("/request/getconnections",userAuth,async(req,res) =>
{
    try
    {
        const data = await ConnectionRequest.find({fromConnectionId : req.user._id})
        const toConnectedUsers = await Promise.all (
        data.map(async(user)=>
        {
            return await User.find({_id:user.toConnectionId})
        }))

        console.log(toConnectedUsers);
        res.send(data);
    }
    catch(err)
    {
        res.status(404).send("Connections not found!!");
    }  
})
module.exports = requestRouter;

