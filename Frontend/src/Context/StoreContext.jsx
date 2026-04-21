import { createContext, useEffect, useState } from "react"
import { food_list } from "../assets/assets"
import api from "../lib/api"

export const StoreContext = createContext(null)

const readStoredJson = (key, fallback) => {
  const rawValue = localStorage.getItem(key)

  if (!rawValue || rawValue === "undefined" || rawValue === "null") {
    return fallback
  }

  try {
    return JSON.parse(rawValue)
  } catch (error) {
    localStorage.removeItem(key)
    return fallback
  }
}

const StoreContextProvider = ({ children }) => {
  const url = "http://localhost:5000"
  const [cartItems, setCartItems] = useState(readStoredJson("cart", {}))
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [user, setUser] = useState(readStoredJson("user", null))
  const [vegFilter, setVegFilter] = useState(
    localStorage.getItem("vegFilter") || "all"
  )
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token))

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem("vegFilter", vegFilter)
  }, [vegFilter])

  useEffect(() => {
    const syncUser = async () => {
      if (!token) {
        setIsBootstrapping(false)
        return
      }

      try {
        const res = await api.get("/api/auth/me")
        setUser(res.data.user)
        localStorage.setItem("user", JSON.stringify(res.data.user))
      } catch (error) {
        setToken("")
        setUser(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setIsBootstrapping(false)
      }
    }

    syncUser()
  }, [token])

  // ✅ UPDATED (refresh token removed)
  const persistAuth = (accessToken, userData) => {
    setToken(accessToken)
    setUser(userData)
    localStorage.setItem("token", accessToken)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  // ✅ UPDATED
  const login = (accessToken, userData) => {
    persistAuth(accessToken, userData)
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev, [itemId]: (prev[itemId] || 0) - 1 }

      if (updated[itemId] <= 0) {
        delete updated[itemId]
      }

      return updated
    })
  }

  const clearCart = () => {
    setCartItems({})
    localStorage.removeItem("cart")
  }

  const getTotalCartCount = () => {
    return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0)
  }

  const getTotalCartAmount = () =>
    Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const itemInfo = food_list.find((food) => food._id === itemId)
      if (!itemInfo) return total
      return total + itemInfo.price * quantity
    }, 0)

  // ✅ UPDATED (refresh token removed)
  const logout = async () => {
    try {
      if (token) {
        await api.post("/api/auth/logout")
      }
    } catch (error) {
      console.log(error)
    }

    setToken("")
    setUser(null)
    clearCart()
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const contextValue = {
    api,
    url,
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartCount,
    getTotalCartAmount,
    token,
    user,
    login,
    logout,
    updateUser,
    vegFilter,
    setVegFilter,
    isBootstrapping
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider