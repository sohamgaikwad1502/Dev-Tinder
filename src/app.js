const express = require("express");
const {connectDb} = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const auth = require("./routes/auth.js")
const profile = require("./routes/profile.js")
const request = require("./routes/request.js")

app.use("/",auth);
app.use("/",profile);
app.use("/",request);

connectDb().then(()=>{
    console.log("Connected to database Successfully")
    app.listen(6969,()=>
    {
        console.log("Server is Running");
    });
}
).catch(err => {
    console.log("Cannot Connect to Database",err);
})
