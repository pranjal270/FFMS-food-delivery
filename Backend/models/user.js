const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer"
  },

  isPremium: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  lastLogin: {
    type: Date
  },

  
  recoveryCode: {
    type: String
  },

  refreshToken: {
    type: String
  }

}, { timestamps: true })

const User = mongoose.model("User", userSchema)
module.exports = User
