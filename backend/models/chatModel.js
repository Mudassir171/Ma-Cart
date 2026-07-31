const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.ObjectId, ref: "User", required: true }],
  sender: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);