const express = require("express");
const { getMessages, sendMessage } = require("../controllers/chatController");
const { isAuthenticatedUser } = require("../middlewares/auth"); // Aapke project ka authentication middleware

const router = express.Router();

router.route("/chats").get(isAuthenticatedUser, getMessages);
router.route("/chat/send").post(isAuthenticatedUser, sendMessage);

module.exports = router;