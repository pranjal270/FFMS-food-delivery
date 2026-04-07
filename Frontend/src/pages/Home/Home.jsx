import { useState } from "react"
import Header from "../../components/Header/Header"
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu"
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay"
import { useFeatureFlags } from "../../Context/FeatureFlagContext" 

const Home = () => {
  const [category, setCategory] = useState("All")

  const { loading, error, isEnabled } = useFeatureFlags() 

  const scrollToMenu = () => {
    const section = document.getElementById("menu-section")
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div>
      <section id="home-section">
        <Header onViewMenu={scrollToMenu} />
      </section>

      {/* ☀️ Summer Sale Banner */}
      {!loading && !error && isEnabled("summer_sale_banner") && (
        <div
          style={{
            background: "linear-gradient(to right, #ff7e5f, #feb47b)",
            padding: "12px",
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
            margin: "10px 0",
            borderRadius: "8px",
          }}
        >
          ☀️ Summer Sale is LIVE! Get up to 10% OFF 🍔🔥
        </div>
      )}

      <div id="menu-section">
        <ExploreMenu category={category} setCategory={setCategory} />
      </div>

      <FoodDisplay category={category} />
    </div>
  )
}

export default Home