require("dotenv").config()


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET missing")
}



const config = {

  // Server
  PORT: process.env.PORT || 5000,

  // Database
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantDB",

  //CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET ,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  RECOVERY_CODE_SECRET:
    process.env.RECOVERY_CODE_SECRET || "recoveryCodeSecret1234567890123456",

  // Bcrypt
  SALT_ROUNDS: 10,

  // Rate Limiting
  LOGIN_WINDOW_MS: 15 * 60 * 1000,   // 15 minutes
  LOGIN_MAX_ATTEMPTS: 10,

  SIGNUP_WINDOW_MS: 60 * 60 * 1000,  // 1 hour
  SIGNUP_MAX_ATTEMPTS: 5,

  // Premium Discount
  PREMIUM_DISCOUNT_PERCENT: 10,       // 10% discount for premium users

  // Order
  ESTIMATED_DELIVERY_MINUTES: 2,      // demo-friendly default delivery time

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
}

module.exports = config
