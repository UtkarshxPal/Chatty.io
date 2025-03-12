const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth.route.js");
const connectDB = require("./lib/db.js");
const messageRoute = require("./routes/message.route.js");

dotenv.config();
const { app, server, io } = require("./lib/Socket.js");
const port = process.env.PORT || 5001;

connectDB();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary HTTP methods
  })
);

app.use(express.json({ limit: "10mb" })); // Increase to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
