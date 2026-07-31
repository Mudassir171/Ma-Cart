const express = require("express");
const { getMessages, sendMessage } = require("../controllers/chatController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/chat")
  .get(isAuthenticatedUser, getMessages)
  .post(isAuthenticatedUser, sendMessage);

module.exports = router;