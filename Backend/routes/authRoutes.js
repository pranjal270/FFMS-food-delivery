const express = require("express")
const router = express.Router()

const {
  signup,
  login,
  forgotPassword,
  getMe,
  updateProfile,
  changePassword,
  logout,
  refreshToken
} = require("../controllers/authController")

const { authMiddleware } = require("../middleware/authMiddleware")

router.post("/signup", signup)
router.post("/login",login)
router.post("/forgot-password", forgotPassword)
router.post("/refresh", refreshToken)

router.get("/me", authMiddleware, getMe)
router.put("/update-profile", authMiddleware, updateProfile)
router.put("/change-password", authMiddleware, changePassword)
router.post("/logout", authMiddleware, logout)
router.post("/signup", (req, res) => {
  console.log("🔥 SIGNUP ROUTE HIT");
  res.send("SIGNUP WORKING");
});

module.exports = router