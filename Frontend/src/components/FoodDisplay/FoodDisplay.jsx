import { useContext } from "react"
import { StoreContext } from "../../Context/StoreContext"
import FoodItem from "../FoodItem/FoodItem"
import "./FoodDisplay.css"

const FoodDisplay = ({ category }) => {
  const { food_list, vegFilter } = useContext(StoreContext)

  const filteredItems = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category
    const matchesFoodType = vegFilter === "all" || item.type === vegFilter

    return matchesCategory && matchesFoodType
  })

  return (
    <div className="food-display">
      <h2>Top dishes near you</h2>
      <p className="food-display-subtitle">
        Curated picks with better pricing, clearer veg labels and a smoother ordering flow.
      </p>

      <div className="food-display-list">
        {filteredItems.map((item) => (
          <FoodItem key={item._id} {...item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="food-display-empty">
          No dishes match this filter right now. Try switching veg/non-veg or another category.
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
