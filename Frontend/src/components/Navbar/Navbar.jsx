import { useContext, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { StoreContext } from "../../Context/StoreContext"
import { assets } from "../../assets/assets"
import "./Navbar.css"
import { useFeatureFlags } from "../../Context/FeatureFlagContext";



const Navbar = ({ setShowLogin }) => {
  const [activeSection, setActiveSection] = useState("home")
  const { isEnabled } = useFeatureFlags();
  const isRedNonVegEnabled = isEnabled("red_non_veg_toggle")
  const {
    getTotalCartCount,
    token,
    logout,
    vegFilter,
    setVegFilter
  } = useContext(StoreContext)
  const navigate = useNavigate()
  const location = useLocation()

  const navSection = useMemo(() => {
    if (location.pathname !== "/") return ""
    return activeSection
  }, [activeSection, location.pathname])

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("")
      return
    }

    const updateActiveSection = () => {
      const homeSection = document.getElementById("home-section")
      const menuSection = document.getElementById("menu-section")
      const contactSection = document.getElementById("footer")

      if (!homeSection || !menuSection || !contactSection) {
        return
      }

      const offset = 150
      const scrollPosition = window.scrollY + offset
      const menuTop = menuSection.offsetTop
      const contactTop = contactSection.offsetTop
      const pageBottomReached =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24

      if (pageBottomReached || scrollPosition >= contactTop) {
        setActiveSection("contact")
        return
      }

      if (scrollPosition >= menuTop) {
        setActiveSection("menu")
        return
      }

      setActiveSection("home")
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [location.pathname])

  const navigateWithScroll = (path, sectionId) => {
    const nextSection =
      sectionId === "home-section"
        ? "home"
        : sectionId === "menu-section"
          ? "menu"
          : sectionId === "footer"
            ? "contact"
            : ""

    if (path === "/") {
      setActiveSection(nextSection || "home")
    }

    navigate(path)

    requestAnimationFrame(() => {
      if (!sectionId) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        return
      }

      const scrollTarget = () => {
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }

      if (path === "/" && location.pathname !== "/") {
        setTimeout(scrollTarget, 60)
        return
      }

      scrollTarget()
    })
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <div className="navbar">
      <h1 className="navbar-logo" onClick={() => navigateWithScroll("/", "home-section")}>
        Zayka<span>.</span>
      </h1>

      <ul className="navbar-menu">
        <li
          className={navSection === "home" ? "active" : ""}
          onClick={() => navigateWithScroll("/", "home-section")}
        >
          home
        </li>
        <li
          className={navSection === "menu" ? "active" : ""}
          onClick={() => navigateWithScroll("/", "menu-section")}
        >
          menu
        </li>
        <li
          className={navSection === "contact" ? "active" : ""}
          onClick={() => navigateWithScroll("/", "footer")}
        >
          contact us
        </li>
      </ul>

      <div className="navbar-right">
        <div className="food-toggle-group" aria-label="food filter">
          <button
            type="button"
            className={vegFilter === "veg" ? "active" : ""}
            onClick={() => setVegFilter((prev) => (prev === "veg" ? "all" : "veg"))}
          >
            Veg
          </button>
          <button
            type="button"
            className={vegFilter === "non-veg" ? isRedNonVegEnabled ? "active-red" : "active": ""}
            onClick={() =>
              setVegFilter((prev) => (prev === "non-veg" ? "all" : "non-veg"))
            }
          >
            Non-Veg
          </button>
        </div>

        <div className="navbar-cart" onClick={() => navigateWithScroll("/cart")}>
          <img src={assets.basket_icon} alt="cart" />
          {getTotalCartCount() > 0 && (
            <div className="cart-count">{getTotalCartCount()}</div>
          )}
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/profile")}>
                <img src={assets.profile_icon} alt="profile" />
                <p>Profile</p>
              </li>
              <hr />
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="orders" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="logout" />
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
