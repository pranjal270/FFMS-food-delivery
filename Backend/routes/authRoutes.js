const express = require("express")
const router = express.Router()
const {
  signup,
  login,
  forgotPassword,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require("../controllers/authController")
const { authMiddleware } = require("../middleware/authMiddleware")

// Public
router.post("/signup", signup)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)

// Protected
router.get("/me", authMiddleware, getMe)
router.put("/update-profile", authMiddleware, updateProfile)
router.put("/change-password", authMiddleware, changePassword)
router.post("/logout", authMiddleware, logout)

module.exports = router
