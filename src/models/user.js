const mongoose = require('mongoose');

//Creating schema for DB
const userSchema = mongoose.Schema({
    firstName : {
        type:String
    },
    lastName : 
    {
        type:String
    },
    emailId :
    {
        type:String
    },
    password :
    {
        type:String
    },
    age: 
    {
        type:Number
    },
    gender : 
    {
        type:String
    }
})

//Creating user Collection model (Table in terms of SQL) to store user data
const User = mongoose.model("User", userSchema)
module.exports = User;