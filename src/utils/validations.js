const validator = require("validator");

const ALLOWED_CHANGES = ["photoUrl","about","gender","age","skills"];
const isUpdateAllowed = (data) =>{ return Object.keys(data).every(k => ALLOWED_CHANGES.includes(k));
}
const emailCheck = (emailId)=> { return validator.isEmail(emailId)} 
module.exports = {isUpdateAllowed,emailCheck};

const isDataEditable  = (req,res)=>{
    const userInput = req.body;
    const editableFields = ["firstName","lastName","age","gender","about","skills","photoUrl"]
    const isAllowed = Object.keys(userInput).every(field => editableFields.includes(field))

    if(!isAllowed)
    {
        res.status(404).send("Cannot update certain fields!!!") ;
    }
    return isAllowed;
    
}

module.exports = {isDataEditable};