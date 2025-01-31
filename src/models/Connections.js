const mongoose = require("mongoose");
const connectionRequestSchema = mongoose.Schema(
  {
    toConnectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fromConnectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    connectionStatus: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is incorrect status type",
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  if (this.toConnectionId.equals(this.fromConnectionId)) {
    throw new Error("Cannot send request from same user to same user!!");
  }
  next();
});

connectionRequestSchema.index({ fromConnectionId: 1, toConnectionId: 1 });
const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = { ConnectionRequest };
