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
});

const ChatroomSchema = new mongoose.Schema(
  {
    messages: [ChatroomMessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chatroom", ChatroomSchema);
