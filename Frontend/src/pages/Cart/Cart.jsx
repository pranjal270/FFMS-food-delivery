import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { StoreContext } from "../../context/StoreContext"
import { assets } from "../../assets/assets"
import "./Cart.css"

const Cart = () => {
  const {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    url,
    token,
    user
  } = useContext(StoreContext)

  const navigate = useNavigate()
  const DELIVERY_FEE = 40
  const totalAmount = getTotalCartAmount()

  const handlePlaceOrder = async () => {
    if (!token) {
      alert("Please login to place an order")
      return
    }

    const items = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id]
      }))

    if (items.length === 0) {
      alert("Your cart is empty")
      return
    }

    try {
      await axios.post(
        url + "/api/orders",
        { items },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      clearCart()
      navigate("/myorders")
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order")
    }
  }

  return (
    <div className="cart">
      {/* Cart items table */}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <div className="cart-quantity-controls">
                    <img src={assets.remove_icon_red} onClick={() => removeFromCart(item._id)} alt="remove" />
                    <p>{cartItems[item._id]}</p>
                    <img src={assets.add_icon_green} onClick={() => addToCart(item._id)} alt="add" />
                  </div>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p className="cart-remove-btn" onClick={() => {
                    for (let i = 0; i < cartItems[item._id]; i++) {
                      removeFromCart(item._id)
                    }
                  }}>x</p>
                </div>
                <hr />
              </div>
            )
          }
          return null
        })}
      </div>

      {/* Bottom section */}
      <div className="cart-bottom">

        {/* Cart totals */}
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{totalAmount}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{totalAmount === 0 ? 0 : DELIVERY_FEE}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{totalAmount === 0 ? 0 : totalAmount + DELIVERY_FEE}</b>
          </div>

          {user?.isPremium && (
            <p className="premium-note">⭐ Premium discount will be applied at checkout!</p>
          )}

          <button onClick={handlePlaceOrder}>PROCEED TO CHECKOUT</button>
        </div>

        {/* Promo code */}
        <div className="cart-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart