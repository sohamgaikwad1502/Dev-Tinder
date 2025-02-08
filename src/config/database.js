const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  return "Done";
};

module.exports = { connectDb };
