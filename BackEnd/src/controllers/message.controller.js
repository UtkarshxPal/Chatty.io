const Message = require("../models/message.model.js");
const User = require("../models/user.model.js");
const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/Socket.js");

async function getUsersForSidebar(req, res) {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    return res
      .status(200)
      .json({ message: "Users fetched successfully", users: filteredUsers });
  } catch (err) {
    console.log("Error in Get Users For Sidebar controller");
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { recieverId: myId, senderId: userToChatId },
      ],
    }).sort({ createdAt: 1 });

    return res
      .status(200)
      .json({ message: "Messages fetched successfully", messages });
  } catch (err) {
    console.log("Error in Get Messages controller", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function sendMessage(req, res) {
  try {
    const { id: recieverId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    const recieverSocketId = getReceiverSocketId(recieverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    return res
      .status(200)
      .json({ message: "Message sent successfully", messages: newMessage });

    // todo : realtime socket io
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getUsersForSidebar, getMessages, sendMessage };
