const Chat = require("../models/chatModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const { GoogleGenAI } = require("@google/genai");

// Initialize Google GenAI with Vercel/Environment API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Get All Messages for a User
exports.getMessages = asyncErrorHandler(async (req, res, next) => {
  const messages = await Chat.find({ users: req.user._id }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

// Send a New Message & Get Auto AI Response
exports.sendMessage = asyncErrorHandler(async (req, res, next) => {
  const { message, receiverId } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Please enter a message" });
  }

  // 1. User ka message database mein save karein
  const userChat = await Chat.create({
    users: [req.user._id, receiverId], // Yahan receiverId AI ki ID ho sakti hai ya generic ID
    sender: req.user._id,
    message,
  });

  let aiReplyText = "I am having trouble connecting right now.";

  try {
    // 2. Google Gemini AI se response generate karwayein
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are a helpful customer support assistant for MA-CART, an e-commerce website. Answer user queries about products, orders, and services politely and accurately.",
      }
    });

    aiReplyText = response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error.message);
  }

  // 3. AI ka jawab bhi database mein save karein (sender as receiverId ya AI ki ID)
  const aiChat = await Chat.create({
    users: [req.user._id, receiverId],
    sender: receiverId, // AI ko sender dikhane ke liye
    message: aiReplyText,
  });

  res.status(201).json({
    success: true,
    userChat,
    aiChat,
  });
});