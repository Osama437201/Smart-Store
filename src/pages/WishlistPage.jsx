import { useEffect, useState } from "react";
import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import Toast from "../components/Toast/Toast";
import "./WishlistPage.css";
import emptyWishlist from "../assets/empty-wishlist.png";

function WishlistPage() {
  const { refreshWishlist } = useWishlist();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  const [itemToRemove, setItemToRemove] = useState(null); // wishlist item id pending confirmation
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    getWishlist();
  }, []);

  // =========================
  // GET WISHLIST
  // =========================
  const getWishlist = async () => {
    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/Wishlist/get/client/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Wishlist:", data);

      if (data.succeeded) {
        setWishlist(data.data);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REMOVE FROM WISHLIST
  // =========================
  const removeItem = async (wishlistItemId) => {
    try {
      const response = await fetch(
        `https://tryha.runasp.net/api/Wishlist/client/remove/item/${wishlistItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Remove wishlist:", data);

      if (data.succeeded) {
        // حذف العنصر من الصفحة فورًا
        setWishlist((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== wishlistItemId),
        }));

        // تحديث رقم الـ Wishlist في Navbar
        await refreshWishlist();

        setShowToast(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "150px",
        }}
      >
        Loading...
      </h2>
    );
  }

  return (
    <div className="wishlist-page">
      <ProfileSidebar />

      <div
        className={`wishlist-content ${
          !wishlist?.items || wishlist.items.length === 0
            ? "wishlist-content-empty"
            : ""
        }`}
      >
        <div className="wishlist-card">
          {/* =========================
              TITLE
          ========================= */}
          {wishlist?.items?.length > 0 && (
            <h1>Wishlist({wishlist.items.length})</h1>
          )}

          {/* EMPTY */}
          {!wishlist?.items || wishlist.items.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-wishlist-icon">
                <img src={emptyWishlist} alt="Empty wishlist" />
              </div>

              <h2>No Favorites yet</h2>

              <p>
                Save products you love by tapping the heart
                <br /> icon.
              </p>

              <button
                onClick={() => navigate("/products")}
                className="discover-products-btn"
              >
                Discover Products
              </button>
            </div>
          ) : (
            /* =========================
               PRODUCTS
            ========================= */
            <div className="wishlist-grid">
              {wishlist.items.map((item) => {
                const product = item.product;

                // متوسط التقييم
                const ratings = product.clientProductRatings || [];

                const averageRating =
                  ratings.length > 0
                    ? (
                        ratings.reduce(
                          (sum, rating) => sum + rating.rating,
                          0,
                        ) / ratings.length
                      ).toFixed(1)
                    : "0.0";

                return (
                  <div className="wishlist-item" key={item.id}>
                    {/* =========================
                        IMAGE
                    ========================= */}
                    <div className="wishlist-image-wrapper">
                      <img
                        src={product.productImages?.[0]?.images}
                        alt={product.name}
                        className="wishlist-image"
                      />

                      {/* Hover Actions */}
                      <div className="wishlist-hover-actions">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* =========================
                        PRODUCT INFO
                    ========================= */}
                    <div className="wishlist-info">
                      <div className="wishlist-title-row">
                        <h3>{product.name}</h3>

                        <button
                          className="wishlist-heart"
                          onClick={() => setItemToRemove(item.id)}
                          title="Remove from wishlist"
                        >
                          <FaHeart />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="wishlist-price-row">
                        <span className="wishlist-price">${product.price}</span>

                        {/* مفيش oldPrice في API */}
                        <span className="wishlist-old-price">$59.99</span>
                      </div>

                      {/* =========================
                          RATING
                      ========================= */}
                      <div className="wishlist-rating">
                        <div className="wishlist-stars">
                          {[1, 2, 3, 4, 5].map((star) =>
                            star <= Math.round(Number(averageRating)) ? (
                              <FaStar key={star} className="star filled" />
                            ) : (
                              <FaRegStar key={star} className="star" />
                            ),
                          )}
                        </div>

                        <span>({averageRating})</span>
                      </div>

                      {/* =========================
                          COLORS
                      ========================= */}
                      {product.colors?.length > 0 && (
                        <div className="wishlist-colors">
                          {product.colors.map((color, index) => (
                            <span
                              key={`${product.id}-color-${index}`}
                              className="wishlist-color"
                              style={{
                                backgroundColor: color,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        show={itemToRemove !== null}
        title="Remove from Wishlist"
        message="Are you sure you want to remove this product from your wishlist?"
        confirmLabel="Remove"
        onConfirm={() => {
          removeItem(itemToRemove);
          setItemToRemove(null);
        }}
        onCancel={() => setItemToRemove(null)}
      />

      <Toast
        show={showToast}
        message="Removed from wishlist"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default WishlistPage;