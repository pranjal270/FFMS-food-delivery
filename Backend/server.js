const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

const config = require("./config/config")
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const orderRoutes = require("./routes/orderRoutes")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: config.LOGIN_WINDOW_MS,
  max: config.LOGIN_MAX_ATTEMPTS,
  message: { message: "Too many login attempts. Please try after 15 minutes." }
})
const signupLimiter = rateLimit({
  windowMs: config.SIGNUP_WINDOW_MS,
  max: config.SIGNUP_MAX_ATTEMPTS,
  message: { message: "Too many accounts created. Please try after 1 hour." }
})

app.use("/api/auth/login", loginLimiter)
app.use("/api/auth/signup", signupLimiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/orders", orderRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Restaurant API is running" })
})



app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
