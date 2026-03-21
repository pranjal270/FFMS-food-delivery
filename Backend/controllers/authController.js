const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const config = require("../config/config")

// Sign up
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    // Email already exist karta hai?
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS)

    // Recovery code generate karo — plain text ek baar dikhayenge user ko
    // crypto.randomBytes — random secure string generate karta hai
    const plainRecoveryCode = crypto.randomBytes(6).toString("hex").toUpperCase()
    // Database mein hashed form mein save karenge
    const hashedRecoveryCode = await bcrypt.hash(plainRecoveryCode, config.SALT_ROUNDS)

    // User banao
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      recoveryCode: hashedRecoveryCode
    })

    // Recovery code sirf is ek response mein dikhega — dobara nahi milega
    res.status(201).json({
      message: "User signed up successfully",
      recoveryCode: plainRecoveryCode,   // user ko save karna hoga yeh
      note: "Save this recovery code safely. You will need it to reset your password. It will NOT be shown again.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium
      }
    })

  } catch (err) {
    console.error("Signup error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

//Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Last login update karo
    user.lastLogin = new Date()
    await user.save()

    const token = jwt.sign(
      { id: user._id, role: user.role, isPremium: user.isPremium },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
        lastLogin: user.lastLogin
      }
    })

  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email, recoveryCode, newPassword } = req.body

    if (!email || !recoveryCode || !newPassword) {
      return res.status(400).json({ message: "Email, recovery code and new password are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // User dhundo
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Recovery code verify karo
    const isCodeValid = await bcrypt.compare(recoveryCode, user.recoveryCode)
    if (!isCodeValid) {
      return res.status(400).json({ message: "Invalid recovery code" })
    }

    // Naya password hash karke save karo
    user.password = await bcrypt.hash(newPassword, config.SALT_ROUNDS)
    await user.save()

    res.json({ message: "Password reset successfully. Please login with your new password." })

  } catch (err) {
    console.error("ForgotPassword error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// Get me - isme user ki info fresh milegi db meh bhi update hojayegi
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ user })
  } catch (err) {
    console.error("GetMe error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// Profile update agar karni hogi name ya phone ki 
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ message: "Name is required" })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name},
      { new: true }
    )

    res.json({ message: "Profile updated successfully", user })

  } catch (err) {
    console.error("UpdateProfile error:", err)
    res.status(500).json({ message: "Server error" })
  }
}


exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new password are required" })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" })
    }

    const user = await User.findById(req.user.id)

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" })
    }

    user.password = await bcrypt.hash(newPassword, config.SALT_ROUNDS)
    await user.save()

    res.json({ message: "Password changed successfully" })

  } catch (err) {
    console.error("ChangePassword error:", err)
    res.status(500).json({ message: "Server error" })
  }
}
//Logout
exports.logout = async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" })
  } catch (err) {
    console.error("Logout error:", err)
    res.status(500).json({ message: "Server error" })
  }
}
