import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { StoreContext } from "../../context/StoreContext"
import { assets } from "../../assets/assets"
import "./MyOrder.css"

const MyOrders = () => {
  const { url, token } = useContext(StoreContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch my orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get(url + "/api/orders/mine", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data.orders)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchOrders()
  }, [token])

  // Update order status to delivered after timer
  const markDelivered = async (orderId) => {
    try {
      await axios.patch(
        url + `/api/orders/${orderId}/status`,
        { status: "delivered" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchOrders()  // refresh list
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <div className="myorders-loading">Loading orders...</div>

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet. Go order some delicious food! 🍽️</p>
        </div>
      ) : (
        <div className="my-orders-container">
          {orders.map((order) => (
            <div key={order._id} className="my-orders-order">

              {/* Parcel icon */}
              <img src={assets.parcel_icon} alt="order" />

              {/* Items list */}
              <p className="order-items">
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.name} x {item.quantity}
                    {i < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>

              {/* Price */}
              <p className="order-price">${order.totalPrice.toFixed(2)}</p>

              {/* Item count */}
              <p className="order-count">Items: {order.items.length}</p>

              {/* Status */}
              <p className={`order-status ${order.status}`}>
                ● {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>

              {/* Track Order button */}
              <button
                onClick={() => {
                  if (order.status !== "delivered") {
                    markDelivered(order._id)
                  }
                }}
                className={order.status === "delivered" ? "delivered-btn" : "track-btn"}
              >
                {order.status === "delivered" ? "Delivered ✓" : "Track Order"}
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders
