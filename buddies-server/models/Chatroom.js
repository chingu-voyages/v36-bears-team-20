const mongoose = require("mongoose");

const ChatroomMessageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => Date(),
  },
});

const ChatroomSchema = new mongoose.Schema(
  {
    chatroomType: {
      type: String,
      required: true,
      enum: ["event"],
    },
    relatedId: {
      type: String,
    },
    messages: [ChatroomMessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chatroom", ChatroomSchema);
