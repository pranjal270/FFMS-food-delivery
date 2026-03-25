import { assets } from "../../assets/assets"
import "./Footer.css"

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">

        <div className="footer-content-left">
          <h1 className="footer-logo">Zayka<span>.</span></h1>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="facebook" />
            <img src={assets.twitter_icon} alt="twitter" />
            <img src={assets.linkedin_icon} alt="linkedin" />
          </div>
        </div>

        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-212-4560-7890</li>
            <li>contact@zayka.com</li>
          </ul>
        </div>

      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © Zayka.com - All Rights Reserved.</p>
    </div>
  )
}

export default Footer
