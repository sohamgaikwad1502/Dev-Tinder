const validator = require("validator");

const ALLOWED_CHANGES = ["photoUrl", "about", "gender", "age", "skills"];
const isUpdateAllowed = (data) => {
  return Object.keys(data).every((k) => ALLOWED_CHANGES.includes(k));
};
const emailCheck = (emailId) => {
  return validator.isEmail(emailId);
};
module.exports = { isUpdateAllowed, emailCheck };

const isDataEditable = (req, res) => {
  const userInput = req.body;
  const editableFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];
  const isAllowed = Object.keys(userInput).every((field) =>
    editableFields.includes(field)
  );

  if (!isAllowed) {
    res.status(404).send("Cannot update certain fields!!!");
  }
  return isAllowed;
};

const validateGender = (req, res) => {
  const validGender = ["male", "female", "other"];
  try {
    const gender = req.data.gender;

    if (gender) {
      const valid = validGender.includes(gender);
      if (!valid) {
        throw new Error("Gender is not Valid");
      }
    }
  } catch (error) {
    res.send(error.message);
  }
};

const validatePassword = (password) => {
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain 1 uppercase, 1 lowercase, 1 special character, 1 number and minimum 8 characters"
    );
  }
};

module.exports = { isDataEditable, validateGender, validatePassword };
