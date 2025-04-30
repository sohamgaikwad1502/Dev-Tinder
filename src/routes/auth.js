const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { validatePassword } = require("../utils/validations.js");
const isHTTPS = process.env.IS_HTTPS === "true";
const isCrossOrigin = process.env.IS_CROSS_ORIGIN === "true";

authRouter.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    photoUrl,
    about,
    skills,
  } = req.body;

  try {
    const isUserExists = await User.findOne({ emailId });
    if (isUserExists) throw new Error("User Already Exists!!");
    validatePassword(password);
  } catch (err) {
    return res.status(401).send(err.message);
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
    age,
    gender,
    photoUrl,
    about,
    skills,
  });

  try {
    await user.save();
    const token = user.generateJwtToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: isHTTPS,
      sameSite: isCrossOrigin ? "None" : undefined,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.json({ message: "Data Saved Successfully!!", user });
  } catch (err) {
    res.status(401).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordvalid = await user.validatePassword(password);
    if (isPasswordvalid) {
      const token = user.generateJwtToken();
      res.cookie("token", token, {
        httpOnly: true,
        secure: isHTTPS,
        sameSite: isCrossOrigin ? "None" : undefined,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(401).send(error);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: isHTTPS,
    sameSite: isCrossOrigin ? "None" : undefined,
    expires: new Date(Date.now()),
  });
  res.send("logout Successfull !");
});

// created a router named authRouter and exported it
module.exports = authRouter;
