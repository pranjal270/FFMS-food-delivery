import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import MyOrder from "./pages/MyOrder/MyOrder"
import LoginPop from "./components/LoginPop/LoginPop"
import Footer from "./components/Footer/Footer"
import StoreContextProvider from "./context/StoreContext"
import "./index.css"

function App() {
  const [showLogin, setShowLogin] = useState(false)
  return (
    <StoreContextProvider>
      <BrowserRouter>
        {showLogin && <LoginPop setShowLogin={setShowLogin} />}
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/myorders" element={<MyOrder />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </StoreContextProvider>
  )
}
export default App
