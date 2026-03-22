const Order = require("../models/order")
const config = require("../config/config")

//Place order
exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body

    // Validation — items hone chahiye
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" })
    }

    // Har item validate karo
    for (const item of items) {
      if (!item.menuItemId || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({ message: "Each item must have menuItemId, name, price and quantity" })
      }
      if (item.quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" })
      }
    }

    // Original total calculate karo
    const originalPrice = items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)

    // Premium discount check 
    let discountAmount = 0
    let discountApplied = false

    if (req.user.isPremium) {
      discountAmount = Math.round((originalPrice * config.PREMIUM_DISCOUNT_PERCENT) / 100)
      discountApplied = true
    }

    const totalPrice = originalPrice - discountAmount

    // Order create karo
    const order = await Order.create({
      userId: req.user.id,
      items,
      originalPrice,
      discountAmount,
      totalPrice,
      discountApplied,
      paymentStatus: "paid",      
      status: "confirmed",           
      estimatedDeliveryMinutes: config.ESTIMATED_DELIVERY_MINUTES
    })

    res.status(201).json({
      message: "Order placed successfully",
      order: {
        id: order._id,
        items: order.items,
        originalPrice: order.originalPrice,
        discountAmount: order.discountAmount,
        totalPrice: order.totalPrice,
        discountApplied: order.discountApplied,
        status: order.status,
        paymentStatus: order.paymentStatus,
        estimatedDeliveryMinutes: order.estimatedDeliveryMinutes,
        createdAt: order.createdAt
      }
    })

  } catch (err) {
    console.error("PlaceOrder error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

//Order History
exports.getMyOrders = async (req, res) => {
  try {
    // Is user ke saare orders — latest pehle
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 })

    res.json({
      count: orders.length,
      orders
    })

  } catch (err) {
    console.error("GetMyOrders error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

//Specific order detail
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Sirf apna order dekh sakta hai
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" })
    }

    res.json({ order })

  } catch (err) {
    console.error("GetOrderById error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

//Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    const validStatuses = ["pending", "confirmed", "preparing", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Sirf apna order update kar sakta hai
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    order.status = status
    await order.save()

    res.json({
      message: "Order status updated",
      order: {
        id: order._id,
        status: order.status
      }
    })

  } catch (err) {
    console.error("UpdateOrderStatus error:", err)
    res.status(500).json({ message: "Server error" })
  }
}
