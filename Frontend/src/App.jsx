import { useEffect, useLayoutEffect, useState } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import MyOrders from "./pages/MyOrder/MyOrder"
import Profile from "./pages/Profile/Profile"
import Footer from "./components/Footer/Footer"
import LoginPop from "./components/LoginPop/LoginPop"

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const location = useLocation()

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    })
  }, [location.pathname])

  useEffect(() => {
    if (!location.hash || location.pathname !== "/") return

    const targetId = location.hash.replace("#", "")
    const target = document.getElementById(targetId)

    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }, [location.hash, location.pathname])

  return (
    <>
      {showLogin && <LoginPop setShowLogin={setShowLogin} />}

      <Navbar setShowLogin={setShowLogin} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile setShowLogin={setShowLogin} />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
