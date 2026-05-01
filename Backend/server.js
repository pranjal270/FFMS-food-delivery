const express = require("express")
const cors = require("cors")


const config = require("./config/config")
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const orderRoutes = require("./routes/orderRoutes")
const cookieParser = require("cookie-parser")

const app = express()

connectDB()

app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())



app.use("/api/auth/login")
app.use("/api/auth/signup")

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/orders", orderRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Restaurant API is running" })
})




app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
