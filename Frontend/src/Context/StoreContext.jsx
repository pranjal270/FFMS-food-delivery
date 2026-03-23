import { createContext, useState, useEffect } from "react"
import { food_list } from "../assets/assets"
import axios from "axios"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
  const url = "http://localhost:5000"

  // Cart localStorage se load karo
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart") || "{}")
  )
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"))

  // Cart change hone pe localStorage update karo
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev, [itemId]: prev[itemId] - 1 }
      if (updated[itemId] <= 0) delete updated[itemId]
      return updated
    })
  }

  const clearCart = () => {
    setCartItems({})
    localStorage.removeItem("cart")
  }

  const getTotalCartCount = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0)
  }

  const getTotalCartAmount = () => {
    let total = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((food) => food._id === item)
        if (itemInfo) total += itemInfo.price * cartItems[item]
      }
    }
    return total
  }

  const login = (tokenValue, userData) => {
    setToken(tokenValue)
    setUser(userData)
    localStorage.setItem("token", tokenValue)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      await axios.post(url + "/api/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.log(err)
    }
    setToken("")
    setUser(null)
    clearCart()
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const contextValue = {
    url, food_list, cartItems,
    addToCart, removeFromCart, clearCart,
    getTotalCartCount, getTotalCartAmount,
    token, user, login, logout
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider