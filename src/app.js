require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { connectDb } = require("./config/database.js");
const { initSocket } = require("./utils/socket.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./utils/cronJobs");

app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options(
  "*",
  cors({
    origin: process.env.CLIENT,
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
const chat = require("./routes/chat.js");

app.use("/", auth);
app.use("/", profile);
app.use("/", request);
app.use("/", user);
app.use("/", chat);

const isCrossOrigin = process.env.IS_CROSS_ORIGIN;

const reRun = () => {
  setInterval(async () => {
    try {
      const response = await fetch(process.env.RENDER_URL);
      console.log("Refresh Request send ", response.status);
    } catch (error) {
      console.log(error.message);
    }
  }, 840000);
};

initSocket(server);

connectDb()
  .then(() => {
    console.log("Connected to database Successfully");
    server.listen(process.env.PORT_NUMBER, () => {
      console.log("Server is Running");
    });
    if (isCrossOrigin === "true") reRun();
  })
  .catch((err) => {
    console.log("Cannot Connect to Database", err);
  });
