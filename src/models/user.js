const mongoose = require('mongoose');
const validation = require("validator");
//Creating schema for DB
const userSchema = mongoose.Schema({
    firstName : {
        type:String,
        required:true,
        minlength:2 
    },
    lastName : 
    {
        type:String,
        required : true
    },
    emailId :
    {
        type:String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate : function validate(value)
        {
            if(!validation.isEmail(value))
            {
                throw new Error("Email is not valid")
            }
        }
    },
    password :
    {
        type:String,
        required: true,
        minlength: 8,
        maxLength: 64,
        validate(value)
        {
            if (!validation.isStrongPassword(value))
            {
                throw new Error("Password is must contain 1 uppercase, 1 lowercase, 1 special character, 1 number and minimum 8 characters");
            }
        }

    },
    age: 
    {
        type:Number,
        min: 18,
    },
    gender : 
    {
        type:String,
        lowercase : true,
        validate(value)
        {
            if(!["male","female","others"].includes(value))
            {
                throw new Error("Gender data is Not valid")
            }
        }
        
    },
    photoUrl:  
    {
        type : String,
        default : "https://tinyurl.com/mu7aeawn",
        validate(value)
        {
            if(!validation.isURL(value))
            {
                throw new Error("Photo URL is not valid")
            }
        }
    },
    about : 
    {
        type : String,
        default : "This is the default about of the User"
    },
    skills : 
    {
        type: [String],
        validate(value)
        {
            if(value.length > 10)
            {
                throw new Error("Skills should be at max 10")
            }
        }
    }
} , {timestamps : true})

//Creating user Collection model (Table in terms of SQL) to store user data
const User = mongoose.model("User", userSchema)
module.exports = User;