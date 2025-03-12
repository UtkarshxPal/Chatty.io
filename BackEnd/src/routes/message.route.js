const express = require("express");
const {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} = require("../controllers/message.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/user", protectedRoute, getUsersForSidebar);
router.get("/m/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);

module.exports = router;
