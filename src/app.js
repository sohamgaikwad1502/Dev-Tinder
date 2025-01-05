const express = require("express");
const validation = require("validator");
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
    const emailId = req.body.emailId;
    try{
        // if (!validation.isEmail(emailId))
        // {
        //     throw new Error("Email is not valid");
        // }
        await user.save(); 
        res.send("Data Saved Successfully!!");
    }
    catch(err)
    {
        res.send( err.message)
    }
    
})

app.get("/user", async (req,res) =>
{
    const email =  req.body.emailId;
    try {
        const userfromdb = await User.find({emailId : email});
        (userfromdb.length === 0 ) ? res.status(404).send("User Not Found") : res.send(userfromdb) ;
    }
    catch(error) 
    {
        res.status(404).send("Record Not Found" + error)
    }
    
})

app.get("/feed",async(req,res) =>
{
    try
    {
        const alldata = await User.find({});
        res.send(alldata);
    }
    catch(err)
    {
        res.status(404).send("No data Found");
    }
})

app.get("/getone" , async (req, res) =>
{
    const emailtofind = req.body.emailId;
    try
    {
        const document = await User.findOne({emailId : emailtofind});
        (document) ? res.send(document) : res.send("No Data Found");
        
    }
    catch(error)
    {
        res.status(404).send("Error Occured" + error);
    }
})

//Delete api 

app.delete("/delete", async (req,res) =>
{
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.send("Data Deleted Successfully");
    }
    catch(err)
    {
        res.status(404).send("Error Deleting Data" + err);
    } 
})

//Update API
app.patch("/update", async (req,res) => 
{
    const emailId = req.body.emailId;
    const updateData = req.body;
    
    try 
    {
        if (!validation.isEmail(emailId))
        {
            throw new Error("Email is not valid");
        }
        await User.findOneAndUpdate({emailId},updateData,{runValidators: true});
        res.send("Data Updated Successfully");
    }
    catch(err)
    {
        res.status(404).send(err.message)
    }
})

app.patch("/updateBasedOnId/:userId" , async(req,res) =>
{
    const userId = req.params?.userId;
    const data = req.body;
    

    try 
    {
        //Api level Validations
        const ALLOWED_CHANGES = ["photoUrl","about","gender","age","skills"]
        const isUpdateAllowed =  Object.keys(data).every(k => ALLOWED_CHANGES.includes(k))

        if(!isUpdateAllowed)
        {
            throw new Error("Update Not Allowed");
        }
        await User.findByIdAndUpdate(userId,data,{runValidators : true});
        res.send("Data Updated Successfully")
    }
    catch(err)
    {
        res.status(404).send(err.message);
    }
})