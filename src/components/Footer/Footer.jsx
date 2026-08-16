import './Footer.css'

// 👇 هنا مكان اللوجو - نفس اللي في الـ Navbar
import logo from "../../assets/logo.svg";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo-row">
            <img src={logo} alt="Smart Store logo" className="footer-logo" />
            <span className="footer-brand-name">Smart Store</span>
          </div>
          <p className="footer-description">
            Smart Store is your go-to place for easy, fast, and reliable
            online shopping. We bring you quality products, smooth browsing,
            and a shopping experience you can trust.
          </p>
        </div>

        {/* Customer Service */}
        <div className="footer-column">
          <h4 className="footer-column-title">Customer Service</h4>
          <a href="#" className="footer-link">Contact Us</a>
          <a href="#" className="footer-link">Helps &amp; Support</a>
          <a href="#" className="footer-link">Order Status</a>
        </div>

        {/* Shop with Us */}
        <div className="footer-column">
          <h4 className="footer-column-title">Shop with Us</h4>
          <a href="#" className="footer-link">Your Account</a>
          <a href="#" className="footer-link">Your Orders</a>
          <a href="#" className="footer-link">Your Addresses</a>
          <a href="#" className="footer-link">Your Lists</a>
        </div>

        {/* Sell With Us */}
        <div className="footer-column">
          <h4 className="footer-column-title">Sell With Us</h4>
          <a href="#" className="footer-link">Seller Dashboard</a>
          <a href="#" className="footer-link">Register Your Store</a>
        </div>

        {/* Download App */}
        <div className="footer-column">
          <h4 className="footer-column-title">Download Our App</h4>
          <button className="footer-app-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            App store
          </button>
          <button className="footer-app-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Google Play
          </button>
        </div>
      </div>

      <div className="footer-divider" />

      <p className="footer-copyright">© 2025 Smart Store. All rights reserved.</p>
    </footer>
  )
}

export default Footer