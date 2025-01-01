const express = require("express");
const app = express();

app.use("/help",(req,resp)=>
{
    resp.send("Help Section");
});

app.use('/',(req,resp)=>{
    resp.send("Home page")
});

app.listen(6969,()=>
{
    console.log("Server is Running");
});

