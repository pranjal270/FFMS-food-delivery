const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

  // Kisne order kiya
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Items jo order kiye — cart ka data yahan aayega
  items: [
    {
      menuItemId: {
        type: String,   
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],

  // Pricing
  originalPrice: {
    type: Number,
    required: true
  },

  discountAmount: {
    type: Number,
    default: 0
  },

  totalPrice: {
    type: Number,
    required: true
  },

  // Premium user tha toh discount mila?
  discountApplied: {
    type: Boolean,
    default: false
  },

  // Payment
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  },

  // Order Status — frontend pe dikhega
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
    default: "pending"
  },

  // Estimated delivery time in minutes
  estimatedDeliveryMinutes: {
    type: Number,
    default: 30
  }

}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)
module.exports = Order
