const express = require("express");
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

