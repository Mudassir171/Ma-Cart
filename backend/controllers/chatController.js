const Chat = require("../models/chatModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const { GoogleGenAI } = require("@google/genai");

// Initialize Google GenAI with Vercel/Environment API Key (guarded)
const geminiKey = process.env.GEMINI_API_KEY;
let ai = null;
if (!geminiKey) {
  console.warn("GEMINI_API_KEY is not set. AI responses will be disabled.");
} else {
  try {
    ai = new GoogleGenAI({ apiKey: geminiKey });
  } catch (initErr) {
    console.error("Failed to initialize GoogleGenAI:", initErr);
    ai = null;
  }
}

// Get All Messages for a User
exports.getMessages = asyncErrorHandler(async (req, res, next) => {
  const messages = await Chat.find({ users: req.user._id }).sort({
    createdAt: 1,
  });

  res.status(200).json({
    success: true,
    messages,
  });
});

// Send a New Message & Get Auto AI Response
exports.sendMessage = asyncErrorHandler(async (req, res, next) => {
  const { message, receiverId } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter a message" });
  }

  // 1. User ka message database mein save karein
  const userChat = await Chat.create({
    users: [req.user._id, receiverId], // Yahan receiverId AI ki ID ho sakti hai ya generic ID
    sender: req.user._id,
    message,
  });

  let aiReplyText = "I am having trouble connecting right now.";

  if (ai && ai.models && typeof ai.models.generateContent === "function") {
    try {
      // 2. Google Gemini AI se response generate karwayein
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction:
            "You are a helpful customer support assistant for MA-CART, an e-commerce website. Answer user queries about products, orders, and services politely and accurately.",
        },
      });

      aiReplyText =
        response?.text || response?.output || JSON.stringify(response);
    } catch (error) {
      console.error("Gemini AI Error:", error);
    }
  } else {
    console.warn("AI client unavailable; skipping Gemini request.");
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
