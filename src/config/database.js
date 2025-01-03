const mongoose = require("mongoose")


const connectDb = async()=> 
{
    await mongoose.connect("mongodb+srv://sohamkgaikwad:bMLsPm9QclQ6GTWo@first.gjolh.mongodb.net/DevTinder");

    return 'Done'
}

module.exports = {connectDb}