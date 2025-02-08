const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { ConnectionRequest } = require("../models/Connections.js");
const User = require("../models/user.js");
const USER_SAFE_DATA = "firstName lastName photoUrl about skills";

userRouter.get("/user/request/getconnections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const matchingProfiles = await ConnectionRequest.find({
      $or: [
        { fromConnectionId: loggedInUser._id, connectionStatus: "accepted" },
        { toConnectionId: loggedInUser._id, connectionStatus: "accepted" },
      ],
    })
      .populate("fromConnectionId", USER_SAFE_DATA)
      .populate("toConnectionId", USER_SAFE_DATA);

    if (!matchingProfiles || matchingProfiles.length === 0) {
      return res.status(404).send("There are no matches yet!!");
    }
    const sortedData = matchingProfiles.map((row) => {
      if (row.fromConnectionId._id.toString() === loggedInUser._id.toString()) {
        return row.toConnectionId;
      } else {
        return row.fromConnectionId;
      }
    });
    res.json({
      sortedData,
    });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestByUser = await ConnectionRequest.find({
      toConnectionId: loggedInUser._id,
      connectionStatus: "interested",
    })
      .select("fromConnectionId")
      .populate("fromConnectionId", USER_SAFE_DATA);

    if (!requestByUser) {
      return res.status.send("No Requests Found!!");
    }
    res.json({ message: "Received Data Successfully!!", requestByUser });
  } catch (error) {
    res.send(error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;
    const myConnections = await ConnectionRequest.find({
      $or: [
        { fromConnectionId: loggedInUser._id },
        { toConnectionId: loggedInUser._id },
      ],
    }).select("fromConnectionId toConnectionId connectionStatus");

    const idsNotToConsider = new Set();

    myConnections.forEach((element) => {
      idsNotToConsider.add(element.fromConnectionId.toString());
      idsNotToConsider.add(element.toConnectionId.toString());
    });

    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(idsNotToConsider) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: feed });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = userRouter;
