const jwt = require("jsonwebtoken")
const User = require("../models/user")
const config = require("../config/config")

// Koi bhi logged-in user
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  let token = req.cookies.accessToken

  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)

    // DB se check karo — user exist karta hai aur active hai?
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" })
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated" })
    }

    req.user = user
    next()

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" })
    }
    return res.status(401).json({ message: "Invalid token." })
  }
}

// Sirf admin ke liye — authMiddleware ke baad use karo
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden. Admins only." })
  }
  next()
}

module.exports = { authMiddleware, adminOnly }
