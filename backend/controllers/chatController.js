const Chat = require("../models/chatModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const { GoogleGenAI } = require("@google/genai");

// Initialize Google GenAI with Vercel/Environment API Key (guarded)
const geminiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-3.5-pro";
const geminiFallbackModel =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-1.5-pro";
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
  const aiReceiverId = receiverId || process.env.AI_RECEIVER_ID || req.user._id;

  if (!message) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter a message" });
  }

  // 1. User ka message database mein save karein
  const userChat = await Chat.create({
    users: [req.user._id, aiReceiverId],
    sender: req.user._id,
    message,
  });

  let aiReplyText = "I am having trouble connecting right now.";

  if (ai && ai.models && typeof ai.models.generateContent === "function") {
    try {
      // 2. Google Gemini AI se response generate karwayein
      async function generateGeminiResponse(modelName) {
        return await ai.models.generateContent({
          model: modelName,
          contents: message,
          config: {
            systemInstruction:
              "You are a helpful customer support assistant for MA-CART, an e-commerce website. Answer user queries about products, orders, and services politely and accurately.",
          },
        });
      }

      try {
        let response;
        try {
          response = await generateGeminiResponse(geminiModel);
        } catch (primaryError) {
          console.warn(`Primary Gemini model ${geminiModel} failed, trying fallback model ${geminiFallbackModel}:`, primaryError?.message || primaryError);
          response = await generateGeminiResponse(geminiFallbackModel);
        }

        aiReplyText = response?.text || response?.output || JSON.stringify(response);
      } catch (error) {
        console.error("Gemini AI Error:", error);
      }
    } else {
      console.warn("AI client unavailable; skipping Gemini request.");
    }

  // 3. AI ka jawab bhi database mein save karein (sender as AI receiver ID)
  const aiChat = await Chat.create({
    users: [req.user._id, aiReceiverId],
    sender: aiReceiverId,
    message: aiReplyText,
  });

  res.status(201).json({
    success: true,
    reply: aiReplyText,
    userChat,
    aiChat,
  });
});
