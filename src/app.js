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

//middleware which converts json to js object so that js can understand it
app.use(express.json())

app.post("/signup",async (req,res) =>
{ 

    // new instace of new user model
    console.log(req.body);
    const user = new User(req.body);
    try{
        await user.save(); 
        res.send("Data Saved Successfully!!");
    }
    catch(err)
    {
        res.status(401).send("Error Saving the User data" + err.message )
    }
    
})