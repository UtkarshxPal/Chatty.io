const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  profilePic: {
    type:String , 
    default:""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const User = mongoose.model("User" , UserSchema);


module.exports = User;