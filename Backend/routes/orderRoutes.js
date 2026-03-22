const express = require("express")
const router = express.Router()
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} = require("../controllers/orderController")
const { authMiddleware } = require("../middleware/authMiddleware")

// Saare order routes protected hain — login hona chahiye
router.post("/", authMiddleware, placeOrder)                          // POST   /api/orders
router.get("/mine", authMiddleware, getMyOrders)                     // GET    /api/orders/mine
router.get("/:id", authMiddleware, getOrderById)                     // GET    /api/orders/:id
router.patch("/:id/status", authMiddleware, updateOrderStatus)       // PATCH  /api/orders/:id/status

module.exports = router
