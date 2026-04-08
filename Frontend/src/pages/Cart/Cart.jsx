import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { StoreContext } from "../../Context/StoreContext"
import { assets } from "../../assets/assets"
import { useFeatureFlags } from "../../Context/FeatureFlagContext" 
import "./Cart.css"

const Cart = () => {
  const {
    api,
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    token,
    user
  } = useContext(StoreContext)

  const { isEnabled } = useFeatureFlags() 

  const navigate = useNavigate()
  const DELIVERY_FEE = 40

  const totalAmount = getTotalCartAmount()

  
  const isDiscountEnabled = isEnabled("summer_sale_banner")
  const discount = isDiscountEnabled ? Math.round(totalAmount * 0.1): 0
  const finalSubtotal = totalAmount - discount
  const finalTotal = finalSubtotal === 0 ? 0 : finalSubtotal + DELIVERY_FEE

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
      await api.post("/api/orders", {
        items,
        discount,
        finalAmount: finalTotal 
      })
      clearCart()
      navigate("/myorders")
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order")
    }
  }

  return (
    <div className="cart">
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
                  <p
                    className="cart-remove-btn"
                    onClick={() => {
                      for (let i = 0; i < cartItems[item._id]; i++) {
                        removeFromCart(item._id)
                      }
                    }}
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            )
          }
          return null
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          {/* Subtotal */}
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{totalAmount}</p>
          </div>

          {/* Discount */}
          {isDiscountEnabled && discount > 0 && (
            <>
              <hr />
              <div className="cart-total-details">
                <p style={{ color: "green" }}>Discount (10%)</p>
                <p style={{ color: "green" }}>-₹{discount}</p>
              </div>
            </>
          )}

          <hr />

          {/* Delivery */}
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{totalAmount === 0 ? 0 : DELIVERY_FEE}</p>
          </div>

          <hr />

          {/* Final Total */}
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{finalTotal}</b>
          </div>

          {/* Premium note */}
          {user?.isPremium && (
            <p className="premium-note">
              ⭐ Premium discount will be applied at checkout!
            </p>
          )}

          <button onClick={handlePlaceOrder}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart