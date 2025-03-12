const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();

const server = http.createServer(app);

// Used to store online users
const userSocketMap = {}; // {userId : socketId}

const io = new Server(server, {
  cors: {
    origin: "https://chattyio-utkarshxpals-projects.vercel.app", // Your frontend URL
    methods: ["GET", "POST"], // Allow necessary methods
    credentials: true, // Allow cookies (important for auth)
  },
  transports: ["websocket"], // Force WebSockets, avoid polling
});

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, server, app, getReceiverSocketId };
