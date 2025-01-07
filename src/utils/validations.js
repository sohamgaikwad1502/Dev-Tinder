const validator = require("validator");

const ALLOWED_CHANGES = ["photoUrl","about","gender","age","skills"];
const isUpdateAllowed = (data) =>{ return Object.keys(data).every(k => ALLOWED_CHANGES.includes(k));
}
const emailCheck = (emailId)=> { return validator.isEmail(emailId)} 
module.exports = {isUpdateAllowed,emailCheck};

