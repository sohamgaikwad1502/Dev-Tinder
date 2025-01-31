const express = require("express");
const app = express();
const { connectDb } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(cookieParser());

const auth = require("./routes/auth.js");
const profile = require("./routes/profile.js");
const request = require("./routes/request.js");
const user = require("./routes/user.js");

app.use("/", auth);
app.use("/", profile);
app.use("/", request);
app.use("/", user);

connectDb()
  .then(() => {
    console.log("Connected to database Successfully");
    app.listen(process.env.PORT_NUMBER, () => {
      console.log("Server is Running");
    });
  })
  .catch((err) => {
    console.log("Cannot Connect to Database", err);
  });
