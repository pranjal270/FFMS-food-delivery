import { useContext, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { StoreContext } from "../../context/StoreContext"
import { assets } from "../../assets/assets"
import "./Navbar.css"

const Navbar = ({ setShowLogin }) => {
  const [active, setActive] = useState("home")
  const { getTotalCartCount, token, logout } = useContext(StoreContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const handleMenuClick = () => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        document.getElementById("explore-menu")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      document.getElementById("explore-menu")?.scrollIntoView({ behavior: "smooth" })
    }
    setActive("menu")
  }

  const handleHomeClick = () => {
    navigate("/")
    window.scrollTo({ top: 0, behavior: "smooth" })
    setActive("home")
  }

  const handleContactClick = () => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })
    }
    setActive("contact")
  }

  return (
    <div className="navbar">
      {/* Logo */}
      <h1 className="navbar-logo" onClick={handleHomeClick}>
        Zayka<span>.</span>
      </h1>

      {/* Nav links */}
      <ul className="navbar-menu">
        <li
          className={active === "home" ? "active" : ""}
          onClick={handleHomeClick}
        >
          home
        </li>
        <li
          className={active === "menu" ? "active" : ""}
          onClick={handleMenuClick}
        >
          menu
        </li>
        <li
          className={active === "contact" ? "active" : ""}
          onClick={handleContactClick}
        >
          contact us
        </li>
      </ul>

      {/* Right side */}
      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />

        {/* Cart */}
        <div className="navbar-cart" onClick={() => navigate("/cart")}>
          <img src={assets.basket_icon} alt="cart" />
          {getTotalCartCount() > 0 && (
            <div className="cart-count">{getTotalCartCount()}</div>
          )}
        </div>

        {/* Auth */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar