import { useState } from "react"
import Header from "../../components/Header/Header"
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu"
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay"

const Home = () => {
  const [category, setCategory] = useState("All")

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

      <div id="menu-section">
        <ExploreMenu category={category} setCategory={setCategory} />
      </div>

      <FoodDisplay category={category} />
    </div>
  )
}

export default Home
