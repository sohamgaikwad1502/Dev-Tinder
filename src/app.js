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

const allowedOrigins = ["http://localhost:5124", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      }
    },
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

initSocket(server);

connectDb()
  .then(() => {
    console.log("Connected to database Successfully");
    server.listen(process.env.PORT_NUMBER, () => {
      console.log("Server is Running");
    });
  })
  .catch((err) => {
    console.log("Cannot Connect to Database", err);
  });
