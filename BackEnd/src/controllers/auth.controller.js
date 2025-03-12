const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../lib/utils");
const cloudinary = require("../lib/cloudinary");
async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all field" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user, res);
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.log("Error in Login controller");
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function signup(req, res) {
  const { fullName, email, password } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "Please fill al feilds" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed Password: ", hashedPassword);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser, res);
      return res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      return res.status(500).json({ message: "User creation failed" });
    }
  } catch (err) {
    console.log("Error in SignUp controller");
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

function logout(req, res) {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log("Error in Logout controller");
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateProfile(req, res) {
  try {
    const { profilePic } = req.body;

    const userID = req.user._id;

    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Please provide profile picture" });
    }

    const uploadResult = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { profilePic: uploadResult.secure_url },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.log("Error in Update Profile controller", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

function checkAuth(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res
      .status(200)
      .json({ message: "User authenticated successfully", user });
  } catch (err) {
    console.log("Error in Check Auth controller");
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { login, signup, logout, updateProfile, checkAuth };
