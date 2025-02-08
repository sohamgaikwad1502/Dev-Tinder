const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { ConnectionRequest } = require("../models/Connections.js");
const User = require("../models/user.js");
const sendEmail = require("../utils/sendEmail.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromConnectionId = req.user._id;
      const toConnectionId = req.params.toUserId;
      const connectionStatus = req.params.status;

      const toConnectionIdExist = await User.findOne({ _id: toConnectionId });
      if (!toConnectionIdExist) {
        return res
          .status(404)
          .send("The User you are trying to connect Doesnt Exists!!");
      }

      const validStatusTypes = ["interested", "ignored"];
      if (!validStatusTypes.includes(connectionStatus)) {
        return res.status(404).send("Invalid status");
      }
      const isUserExisting = await ConnectionRequest.findOne({
        $or: [
          { fromConnectionId, toConnectionId },
          {
            fromConnectionId: toConnectionId,
            toConnectionId: fromConnectionId,
          },
        ],
      });

      if (isUserExisting) {
        return res.status(404).send("Connection already exists");
      }

      //creating a new Instance / Object{fromUserId:something,toUserId:"Something",status:"Something"}
      const connectionRequest = new ConnectionRequest({
        fromConnectionId,
        toConnectionId,
        connectionStatus,
      });
      // saving the new created object to db
      const data = await connectionRequest.save();

      const subject = "Request Received From : " + req.user.emailId;
      const body = req.user.firstName + " Wants to connect with You !!";

      const emailResponse = await sendEmail.run(subject, body);
      console.log(emailResponse);
      console.log("Reached here");

      res.json({
        message: `${req.params.status} request is sent from ${req.user.firstName} to ${toConnectionIdExist.firstName}`,
        data,
      });
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatuses = ["accepted", "rejected"];

      if (!allowedStatuses.includes(status)) {
        return res.status(404).send("Status Not Allowed !!");
      }

      const record = await ConnectionRequest.findOne({
        _id: requestId,
        toConnectionId: loggedInUser._id,
        connectionStatus: "interested",
      });

      if (!record) {
        return res.status(404).send("Request Not Found");
      }
      record.connectionStatus = status;
      const data = await record.save();
      res.send({ message: "Request Send ", data });
    } catch (error) {
      res.status(404).send("ERROR: " + error.message);
    }
  }
);
module.exports = requestRouter;
