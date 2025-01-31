const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { isDataEditable } = require("../utils/validations.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    const isUserEditable = isDataEditable(req, res);
    if (!isUserEditable) {
      throw new Error("Invalid Edit Field request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });
    await loggedInUser.save(loggedInUser);
    res.send(loggedInUser);
  } catch (error) {
    res.status(401).json({
      error,
      message: "error Updating some field",
    });
  }
});
module.exports = profileRouter;
