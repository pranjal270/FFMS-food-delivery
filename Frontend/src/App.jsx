import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import MyOrders from "./pages/MyOrder/MyOrder";
import Profile from "./pages/Profile/Profile";
import Footer from "./components/Footer/Footer";
import LoginPop from "./components/LoginPop/LoginPop";
import React from "react";
import { FeatureFlagProvider } from "./Context/FeatureFlagContext";
import { StoreContext } from "./Context/StoreContext";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const { user } = useContext(StoreContext);

  const clientKey = import.meta.env.VITE_CLIENT_KEY || "zayka-001";
  const currentUserId = user?._id;

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!location.hash || location.pathname !== "/") return;

    const targetId = location.hash.replace("#", "");
    const target = document.getElementById(targetId);

    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash, location.pathname]);

  return (
    <FeatureFlagProvider clientKey={clientKey} currentUserId={currentUserId}>
      {showLogin && <LoginPop setShowLogin={setShowLogin} />}

      <Navbar setShowLogin={setShowLogin} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route
          path="/profile"
          element={<Profile setShowLogin={setShowLogin} />}
        />
      </Routes>

      <Footer />
    </FeatureFlagProvider>
  );
}

export default App;
