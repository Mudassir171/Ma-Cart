const Chat = require("../models/chatModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler"); // Agar aapke project mein yeh middleware hai

// Get All Messages for a User
exports.getMessages = asyncErrorHandler(async (req, res, next) => {
  const messages = await Chat.find({ users: req.user._id }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

// Send a New Message
exports.sendMessage = asyncErrorHandler(async (req, res, next) => {
  const { message, receiverId } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Please enter a message" });
  }

  const chat = await Chat.create({
    users: [req.user._id, receiverId],
    sender: req.user._id,
    message,
  });

  res.status(201).json({
    success: true,
    chat,
  });
});