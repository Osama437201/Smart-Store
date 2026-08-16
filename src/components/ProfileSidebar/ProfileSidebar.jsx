import { useState } from "react";
import "./ProfileSidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Pencil,
  KeyRound,
  Package,
  Heart,
  MapPin,
  HelpCircle,
  HandCoins,
  LogOut,
  Menu,
  X,
} from "lucide-react";

function ProfileSidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    "sidebar-item" + (isActive ? " active" : "");

  return (
    <div className="profile-sidebar">

      {/* Only visible on small screens — toggles the menu below */}
      <div className="sidebar-mobile-header">
        <span className="sidebar-mobile-title">Account Menu</span>

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Closes the mobile menu whenever a link/button inside is clicked */}
      <div
        className={"sidebar-panel" + (mobileOpen ? " open" : "")}
        onClick={() => setMobileOpen(false)}
      >

        <div className="sidebar-top">

          <div className="sidebar-links">

            <NavLink to="/my-account" end className={navItemClass}>
              <User size={20} />
              <span>Profile</span>
            </NavLink>

            <NavLink to="/edit-profile" className={navItemClass}>
              <Pencil size={20} />
              <span>Edit Profile</span>
            </NavLink>

            <NavLink to="/change-password" className={navItemClass}>
              <KeyRound size={20} />
              <span>Change Password</span>
            </NavLink>

            <NavLink to="/orders" className={navItemClass}>
              <Package size={20} />
              <span>My Orders</span>
            </NavLink>

            <NavLink to="/wishlist" className={navItemClass}>
              <Heart size={20} />
              <span>Wishlist</span>
            </NavLink>

            <NavLink to="/saved-addresses" className={navItemClass}>
              <MapPin size={20} />
              <span>Saved Addresses</span>
            </NavLink>

            <NavLink to="/support" className={navItemClass}>
              <HelpCircle size={20} />
              <span>Help & Support</span>
            </NavLink>

          </div>

          <button className="seller-btn">
            <HandCoins size={20} />
            <span>Become a Seller</span>
          </button>

        </div>

        <button className="logout-item" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </div>
  );
}

export default ProfileSidebar;