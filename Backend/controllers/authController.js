const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const config = require("../config/config")

// 🔐 Hash token (for refresh token)
const hashToken = (value) =>
  crypto.createHash("sha256").update(value).digest("hex")

// 🔐 Access token
const signAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, isPremium: user.isPremium },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  )

// 🔁 Refresh token
const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES_IN
  })

// 👤 Send safe user data
const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isPremium: user.isPremium,
  lastLogin: user.lastLogin
})

// 🔥 Issue tokens
const issueAuthTokens = async (user) => {
  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)

  user.refreshToken = hashToken(refreshToken)
  await user.save()

  return { accessToken, refreshToken }
}

// =========================
// ✅ SIGNUP
// =========================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS)


   


    // 🔥 Recovery code generate (ONE TIME)
    const plainRecoveryCode = crypto.randomBytes(6).toString("hex").toUpperCase()
    const hashedRecoveryCode = await bcrypt.hash(plainRecoveryCode, config.SALT_ROUNDS)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      recoveryCode: hashedRecoveryCode
    })

    res.status(201).json({
      message: "User signed up successfully",
      recoveryCode: plainRecoveryCode, // ⚠️ show once only
      user: serializeUser(user)
    })

  } catch (err) {
    console.error("Signup error:", err)
    res.status(500).json({ message: "Server error" })
  }
}
// =========================
// ✏️ UPDATE PROFILE
// =========================
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ message: "Name is required" })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    )

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium
      }
    })

  } catch (err) {
    console.error("UpdateProfile error:", err)
    res.status(500).json({ message: "Server error" })
  }
}
// =========================
// 🔐 CHANGE PASSWORD
// =========================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user.id)

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" })
    }

    user.password = await bcrypt.hash(newPassword, config.SALT_ROUNDS)
    await user.save()

    res.json({ message: "Password changed" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// =========================
// 🔐 LOGIN
// =========================
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
      return res.status(403).json({ message: "Account deactivated" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    user.lastLogin = new Date()
    await user.save()

    const { accessToken, refreshToken } = await issueAuthTokens(user)

    res
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // production me true
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  .json({
    message: "Login successful",
    accessToken,
    user
  })

  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// =========================
// 🔁 FORGOT PASSWORD
// =========================
exports.forgotPassword = async (req, res) => {
  try {
    const { email, recoveryCode, newPassword } = req.body

    if (!email || !recoveryCode || !newPassword) {
      return res.status(400).json({ message: "All fields required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isCodeValid = await bcrypt.compare(recoveryCode, user.recoveryCode)
    if (!isCodeValid) {
      return res.status(400).json({ message: "Invalid recovery code" })
    }

    user.password = await bcrypt.hash(newPassword, config.SALT_ROUNDS)
    await user.save()

    res.json({ message: "Password reset successful" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// =========================
// 👤 GET ME
// =========================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json({ user: serializeUser(user) })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// =========================
// 🔄 REGENERATE RECOVERY CODE
// =========================
exports.regenerateRecoveryCode = async (req, res) => {
  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ message: "Password required" })
    }

    const user = await User.findById(req.user.id)

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" })
    }

    const newCode = crypto.randomBytes(6).toString("hex").toUpperCase()
    user.recoveryCode = await bcrypt.hash(newCode, config.SALT_ROUNDS)

    await user.save()

    res.json({
      message: "New recovery code generated",
      recoveryCode: newCode // ⚠️ show once
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// =========================
// 🚪 LOGOUT
// =========================
exports.logout = async (req, res) => {
  const user = await User.findById(req.user.id)
  user.refreshToken = ""
  await user.save()
  res.clearCookie("refreshToken")

  res.json({ message: "Logged out" })
}

// =========================
// 🔁 REFRESH TOKEN
// =========================
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decoded.id)

    if (!user || user.refreshToken !== hashToken(refreshToken)) {
      return res.status(401).json({ message: "Invalid token" })
    }

    const tokens = await issueAuthTokens(user)

res
  .cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  .json({
    accessToken: tokens.accessToken
  })

  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}