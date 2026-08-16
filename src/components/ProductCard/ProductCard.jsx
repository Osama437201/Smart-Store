import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext.jsx";
import Toast from "../Toast/Toast";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { refreshWishlist } = useWishlist();
  const token = localStorage.getItem("token");
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  const [showToast, setShowToast] = useState(false);

  const ratings = product.clientProductRatings || [];

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : "0.0";

  const addToWishlist = async (e) => {
    e.preventDefault(); // يمنع فتح صفحة المنتج

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/Wishlist/client/add/to/wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
          }),
        },
      );

      const data = await response.json();

      if (data.succeeded) {
        setIsFavorite(true);
        await refreshWishlist();
        setShowToast(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="product-card">
          <div className="product-image">
            <img src={product.productImages[0]?.images} alt={product.name} />
          </div>

          <div className="product-info">
            <div className="product-title-row">
              <h3>{product.name}</h3>

              <button
                className="card-favorite-btn"
                onClick={addToWishlist}
                aria-label="Add to wishlist"
              >
                <FaHeart
                  size={18}
                  color={isFavorite ? "#e74c3c" : "#c9c9c9"}
                />
              </button>
            </div>

            <div className="price-row">
              <span className="new-price">${product.price}</span>

              {product.oldPrice && (
                <span className="old-price">${product.oldPrice}</span>
              )}
            </div>

            <div className="rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= Math.round(Number(averageRating)) ? (
                    <FaStar key={star} className="star filled" />
                  ) : (
                    <FaRegStar key={star} className="star" />
                  )
                )}
              </div>

              <span className="rating-count">({averageRating})</span>
            </div>

            {product.colors?.length > 0 && (
              <div className="colors">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="color"
                    style={{ background: color }}
                  ></span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      <Toast
        show={showToast}
        message="Added to wishlist"
        actionLabel="View Wishlist"
        onAction={() => navigate("/wishlist")}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

export default ProductCard;