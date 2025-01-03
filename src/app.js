const express = require("express");
const {connectDb} = require("./config/database.js");
const User = require("./models/user.js")
const app = express();

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

app.post("/signup",async (req,res) =>
{ 

    // new instace of new user model
    const user = new User({
        firstName : "Sachin",
        lastName : "Tendulkar",
        emailId : "sachin@tendulkar",
        password : "sachin@century",
        age:60,
    });
    await user.save(); 
    res.send("Data Saved Successfully!!");
})