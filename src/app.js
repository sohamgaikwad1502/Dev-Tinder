const express = require("express");
const { auth, userAuth } = require('./middlewares/auth.js')
const app = express();

app.listen(6969,()=>
{
    console.log("Server is Running");
});

// app.use("/",(req,resp)=>{
//     resp.send("Home page")
// });


app.get("/test/:userId",(req,res)=>
{
    console.log(req.params);
    res.send({firstName : "Soham", lastName : "Gaikwad"})});

app.get("/test",(req,res)=>
{
    console.log(req.query);
    res.send({firstName : "Soham", lastName : "Gaikwad"})});

app.post("/test",(req,res) =>
{
    console.log("Used Post Method");
    res.send("Data Sent Successfully to the server");
})


app.delete("/test",(req,res)=>
{
    console.log("Delete Executed");
    res.send("Data Deleted Successfully")
})

// Admin with Midlewares

app.use("/admin",auth);
app.get('/admin', (req,res) => 
{
    res.send("Authentication done and response send successfully!!!");
})

// Middlewares For user



app.get("/user", userAuth,(req, res) => 
{
    console.log("User Data Auth");
    res.send("User Verified and Authenticated !!")
})

app.get("/user",(req,res,next) => 
    {
        console.log("Sendind Response 1");
        next();
        res.send("Response one(1)");
        
    },
    (req,res) =>
    {
        console.log('Sending Response 2');
        res.send("Response Two(2)");

    }
)

app.get("/user/login" , (req, res) => 
{
    res.send("User Login Page !!!");
})