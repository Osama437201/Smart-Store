import "./ProfilePage.css";
import { Link } from "react-router-dom";

// 👇 هنا مكان اللوجو
import logo from "../assets/logo.png";

function ProfilePage() {
  return (
    <div className="get-started">
      <div className="get-started-card">
        <img src={logo} alt="Smart Store logo" className="get-started-logo" />

        <div className="get-started-text">
          <h1 className="get-started-title">welcome to smart Store</h1>
          <p className="get-started-subtitle">
            Your gateway to modern online Shopping
          </p>
        </div>

        <div className="get-started-buttons">
          <button className="get-started-btn">
            <span>Sign Up as Seller</span>
          </button>
          <Link to="/signup" className="get-started-btn">
            <span>Sign Up as Client</span>
          </Link>
          <Link to="/login" className="get-started-btn">
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;