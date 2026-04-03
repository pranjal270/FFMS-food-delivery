import { useContext } from "react"
import { StoreContext } from "../../Context/StoreContext"
import { assets } from "../../assets/assets"
import "./FoodItem.css"

const FoodItem = ({ _id, name, image, price, description, type }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext)

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img src={image} alt={name} className="food-item-image" />
        <span className={`food-item-badge ${type}`}>{type === "veg" ? "Veg" : "Non-Veg"}</span>

        {!cartItems[_id] ? (
          <img
            className="add"
            src={assets.add_icon_white}
            alt="add"
            onClick={() => addToCart(_id)}
          />
        ) : (
          <div className="food-item-counter">
            <img src={assets.remove_icon_red} alt="remove" onClick={() => removeFromCart(_id)} />
            <p>{cartItems[_id]}</p>
            <img src={assets.add_icon_green} alt="add" onClick={() => addToCart(_id)} />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  )
}

export default FoodItem
