const express = require("express");
const {connectDb} = require("./config/database.js");
const User = require("./models/user.js")
const app = express();
const {isUpdateAllowed} = require("./utils/validations.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

//middleware which converts json to js object so that js can understand it
app.use(express.json());
//middleware to parse the cookie
app.use(cookieParser());


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
    console.log(req.body);
    const { firstName, lastName , emailId , password ,age , gender ,photoUrl , about, skills} = req.body;
    
    const passwordHash = await bcrypt.hash(password,10);

    const user = new User({
        firstName , lastName, emailId , password : passwordHash , age , gender ,photoUrl , about, skills 
    });

    try{
        
        await user.save(); 
        res.send("Data Saved Successfully!!");
    }
    catch(err)
    {
        res.send( err.message)
    }
    
})

//login API 


app.post("/login", async(req, res,next)=>
{
    try{
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId})
        if(user)
        {
            const valid = await bcrypt.compare(password,user.password)  
            if(valid) 
            {
                const token = jwt.sign({_id:user._id},"DEV@Tinder$6969");
                console.log(token);
                res.cookie("token",token)
                res.send("Login Successfull")
            }
            else {
                throw new Error("Invalid Credentials")
            }

        }
        else {throw new Error("Invalid credentials")}
    }
    catch(error)
    {
        res.send(error.message);
    }
})

app.get("/profile",userAuth, async (req,res) =>   
{
    try {
        res.send(req.user);
    }
    catch(error)
    {
        res.send(error.message); 
    }

})

//Delete api 
