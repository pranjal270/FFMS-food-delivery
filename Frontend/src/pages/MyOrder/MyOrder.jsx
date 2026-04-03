import { useContext, useEffect, useMemo, useState } from "react"
import { StoreContext } from "../../Context/StoreContext"
import { assets } from "../../assets/assets"
import "./MyOrder.css"

const formatTime = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000))
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
  const seconds = String(totalSeconds % 60).padStart(2, "0")

  return `${minutes}:${seconds}`
}

const MyOrders = () => {
  const { api, token } = useContext(StoreContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(Date.now())

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/mine")
      setOrders(res.data.orders)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    fetchOrders()
  }, [token])

  useEffect(() => {
    if (!orders.length) return undefined

    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [orders.length])

  useEffect(() => {
    const hasExpiredActiveOrder = orders.some((order) => {
      if (order.status === "delivered" || order.status === "cancelled") {
        return false
      }

      const deliveredAt =
        new Date(order.createdAt).getTime() +
        order.estimatedDeliveryMinutes * 60 * 1000

      return now >= deliveredAt
    })

    if (!hasExpiredActiveOrder) return

    fetchOrders()
  }, [now, orders])

  const orderCards = useMemo(
    () =>
      orders.map((order) => {
        const deliveryTime =
          new Date(order.createdAt).getTime() +
          order.estimatedDeliveryMinutes * 60 * 1000
        const remainingTime = deliveryTime - now
        const isDelivered = order.status === "delivered"

        return {
          ...order,
          etaText: isDelivered ? "Delivered" : formatTime(remainingTime),
          isDelivered
        }
      }),
    [now, orders]
  )

  if (loading) return <div className="myorders-loading">Loading orders...</div>

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet. Place your first order and it will appear here.</p>
        </div>
      ) : (
        <div className="my-orders-container">
          {orderCards.map((order) => (
            <div key={order._id} className="my-orders-order">
              <img src={assets.parcel_icon} alt="order" />

              <p className="order-items">
                {order.items.map((item, index) => (
                  <span key={`${order._id}-${item.menuItemId}-${index}`}>
                    {item.name} x {item.quantity}
                    {index < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>

              <p className="order-price">₹{order.totalPrice.toFixed(0)}</p>
              <p className="order-count">Items: {order.items.length}</p>

              <p className={`order-status ${order.status}`}>
                ● {order.isDelivered ? "Delivered" : "On the way"}
              </p>

              <button
                type="button"
                disabled
                className={order.isDelivered ? "delivered-btn" : "track-btn"}
              >
                {order.isDelivered ? "Delivered ✓" : `Arriving in ${order.etaText}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders
