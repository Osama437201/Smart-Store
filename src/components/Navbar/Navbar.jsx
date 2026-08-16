import "./Navbar.css";
import logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";

function Navbar() {
  const navigate = useNavigate();

  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();

  const [showMenu, setShowMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // اقفل الـ dropdown لو دوس بره القائمة أو عمل سكرول
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    const handleScroll = () => {
      setShowMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showMenu]);

  // اقفل الـ mobile search لو عمل سكرول
  useEffect(() => {
    if (!showMobileSearch) return;

    const handleScroll = () => setShowMobileSearch(false);

    window.addEventListener("scroll", handleScroll, true);

    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [showMobileSearch]);

  // اقفل منيو الهمبرجر لو دوس بره القائمة أو عمل سكرول
  useEffect(() => {
    if (!showMobileMenu) return;

    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setShowMobileMenu(false);
      }
    };

    const handleScroll = () => setShowMobileMenu(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showMobileMenu]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    setShowMenu(false);
    setShowMobileMenu(false);

    navigate("/profile");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-brand">
        <img src={logo} alt="Smart Store" className="navbar-logo" />

        <span className="navbar-title">Smart Store</span>
      </div>

      {/* Search */}
      <div className={`navbar-search ${showMobileSearch ? "mobile-open" : ""}`}>
        <div className="navbar-search-left">
          <svg
            className="icon-search"
            width="16.84"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
          >
            <path
              d="M16 16L11.6 11.6M13.3333 7.16667C13.3333 10.5804 10.5804 13.3333 7.16667 13.3333C3.75291 13.3333 1 10.5804 1 7.16667C1 3.75291 3.75291 1 7.16667 1C10.5804 1 13.3333 3.75291 13.3333 7.16667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="navbar-search-text">Search on Tryha...</span>
        </div>

        <svg
          className="icon-mic"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M19 11a7 7 0 0 1-14 0M12 18v3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Icons */}
      <div className="navbar-icons">
        {/* Mobile search toggle */}
        <button
          className="icon-btn mobile-search-btn"
          onClick={() => setShowMobileSearch((prev) => !prev)}
          aria-label="Toggle search"
        >
          <svg width="22" height="22" viewBox="0 0 17 17" fill="none">
            <path
              d="M16 16L11.6 11.6M13.3333 7.16667C13.3333 10.5804 10.5804 13.3333 7.16667 13.3333C3.75291 13.3333 1 10.5804 1 7.16667C1 3.75291 3.75291 1 7.16667 1C10.5804 1 13.3333 3.75291 13.3333 7.16667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Notification / Wishlist / Cart / User — shown inline on desktop */}
        <div className="navbar-actions">
          {/* Notification */}
          <button className="icon-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M13.73 21a2 2 0 0 1-3.46 0"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Wishlist */}
          <button
            className="icon-btn wishlist-icon-btn"
            onClick={() => navigate("/wishlist")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {wishlistItems > 0 && (
              <span className="wishlist-badge">{wishlistItems}</span>
            )}
          </button>

          {/* Cart */}
          <button
            className="icon-btn cart-icon-btn"
            onClick={() => navigate("/cart")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle cx="9" cy="21" r="1.3" fill="currentColor" />

              <circle cx="18" cy="21" r="1.3" fill="currentColor" />
            </svg>

            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {/* User */}
          {user ? (
            <div className="user-container" ref={userMenuRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setShowMenu(!showMenu)}
              >
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="navbar-user-image"
                  />
                ) : (
                  <div className="navbar-user-avatar">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {showMenu && (
                <div className="user-dropdown">
                  <Link to="/my-account" onClick={() => setShowMenu(false)}>
                    👤 My Account
                  </Link>

                  <Link to="/orders" onClick={() => setShowMenu(false)}>
                    📦 My Orders
                  </Link>

                  <Link to="/wishlist" onClick={() => setShowMenu(false)}>
                    ❤️ Wishlist
                  </Link>

                  <button onClick={logout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/profile" className="icon-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Hamburger — shown only on small screens, opens the actions below as a panel */}
        <div className="mobile-menu-container" ref={mobileMenuRef}>
          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setShowMobileMenu((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {showMobileMenu && (
            <div className="mobile-menu-panel">
              <button className="mobile-menu-item">
                🔔 Notifications
              </button>

              <Link
                to="/wishlist"
                className="mobile-menu-item"
                onClick={() => setShowMobileMenu(false)}
              >
                ❤️ Wishlist
                {wishlistItems > 0 && (
                  <span className="mobile-menu-badge">{wishlistItems}</span>
                )}
              </Link>

              <Link
                to="/cart"
                className="mobile-menu-item"
                onClick={() => setShowMobileMenu(false)}
              >
                🛒 Cart
                {totalItems > 0 && (
                  <span className="mobile-menu-badge">{totalItems}</span>
                )}
              </Link>

              <div className="mobile-menu-divider" />

              {user ? (
                <>
                  <Link
                    to="/my-account"
                    className="mobile-menu-item"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    👤 My Account
                  </Link>

                  <Link
                    to="/orders"
                    className="mobile-menu-item"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    📦 My Orders
                  </Link>

                  <button className="mobile-menu-item" onClick={logout}>
                    🚪 Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/profile"
                  className="mobile-menu-item"
                  onClick={() => setShowMobileMenu(false)}
                >
                  👤 Login / Register
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;