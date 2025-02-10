const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    senderId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const chatsSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [{ type: messageSchema }],
});

const Chat = new mongoose.model("chats", chatsSchema);
module.exports = { Chat };
