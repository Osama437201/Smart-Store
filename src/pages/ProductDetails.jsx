import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { ChevronLeft, Minus, Plus, Ruler, Scan } from "lucide-react";
import ProductCard from "../components/ProductCard/ProductCard";
import Toast from "../components/Toast/Toast";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { refreshCart } = useCart();
  const { refreshWishlist } = useWishlist();

  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [isFavorite, setIsFavorite] = useState(false);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    actionLabel: null,
    onAction: null,
  });

  const triggerToast = (message, actionLabel, onAction) => {
    setToast({ show: true, message, actionLabel, onAction });
  };

  const [recommended, setRecommended] = useState([]);

  // Reviews
  const [myRating, setMyRating] = useState(null); // existing rating object from API, or null
  const [reviewStars, setReviewStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // ==========================================
  // Get Product
  // ==========================================

  useEffect(() => {
    setLoading(true);

    getProduct();
  }, [id]);

  const getProduct = () => {
    return fetch(`https://tryha.runasp.net/api/Products/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.succeeded) {
          const p = data.data;
          setProduct(p);
          setIsFavorite(p.isFavorite);
          setActiveImage(
            p.productImages.find((img) => img.isPrimary) ||
              p.productImages[0]
          );
          setSelectedColor(p.colors?.[0] || null);

          const firstAvailableSize = p.productSizes?.find(
            (s) => s.quantity > 0
          );
          setSelectedSize(firstAvailableSize || p.productSizes?.[0] || null);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  // ==========================================
  // Get My Rating (if logged in)
  // ==========================================

  useEffect(() => {
    if (!token) return;

    fetch(`https://tryha.runasp.net/api/Rating/client/get/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const existing =
          data.succeeded && data.data && typeof data.data === "object"
            ? data.data
            : null;

        if (existing) {
          setMyRating(existing);
          setReviewStars(existing.rating || 0);
          setReviewComment(existing.comment || "");
        }
      })
      .catch((err) => console.log(err));
  }, [id, token]);

  // ==========================================
  // Get Recommended Products (same category)
  // ==========================================

  useEffect(() => {
    if (!product?.categoryId) return;

    fetch(
      `https://tryha.runasp.net/api/Products?CategoryId=${product.categoryId}&PageNumber=1&PageSize=4`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.succeeded) {
          setRecommended(
            data.data.items.filter((p) => p.id !== product.id).slice(0, 3)
          );
        }
      })
      .catch((err) => console.log(err));
  }, [product?.categoryId, product?.id]);

  // ==========================================
  // Rating
  // ==========================================

  const ratings = product?.clientProductRatings || [];
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  // ==========================================
  // Stock for the selected size
  // ==========================================

  const availableStock = selectedSize
    ? selectedSize.quantity
    : product?.stockQuantity ?? 0;

  // ==========================================
  // Wishlist
  // ==========================================

  const toggleWishlist = async () => {
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
          body: JSON.stringify({ productId: product.id }),
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        const nowFavorite = !isFavorite;
        setIsFavorite(nowFavorite);
        await refreshWishlist();

        triggerToast(
          nowFavorite ? "Added to wishlist" : "Removed from wishlist",
          "View Wishlist",
          () => navigate("/wishlist")
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // Add To Cart
  // ==========================================

  const addToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setAdding(true);

    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/Cart/client/add/to/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            color: selectedColor || "",
            size: selectedSize?.sizeName || "",
          }),
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        await refreshCart();
        triggerToast("Added to cart", "View Cart", () => navigate("/cart"));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  // ==========================================
  // Submit / Update Review
  // ==========================================

  const submitReview = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (reviewStars === 0) {
      setReviewError("Please select a star rating.");
      return;
    }

    setReviewError("");
    setSubmittingReview(true);

    const isEditing = Boolean(myRating);

    try {
      const response = await fetch(
        `https://tryha.runasp.net/api/Rating/client/${
          isEditing ? "edit" : "add"
        }`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            rating: reviewStars,
            comment: reviewComment,
          }),
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        setMyRating(data.data);
        await getProduct(); // refresh average rating + review count
      } else {
        setReviewError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log(err);
      setReviewError("Something went wrong.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const deleteReview = async () => {
    if (!token || !myRating) return;

    setSubmittingReview(true);

    try {
      const response = await fetch(
        `https://tryha.runasp.net/api/Rating/client/delete/${product.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        setMyRating(null);
        setReviewStars(0);
        setReviewComment("");
        await getProduct();
      } else {
        setReviewError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading || !product) {
    return <h2 style={{ marginTop: "180px", textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <div className="details-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{" "}
        <Link to={`/products?categoryId=${product.categoryId}`}>
          {product.categoryName}
        </Link>{" "}
        / <span>{product.name}</span>
      </div>

      <button className="back-to-products" onClick={() => navigate(-1)}>
        <ChevronLeft size={16} /> Back to Products
      </button>

      <div className="details-page">
        {/* ================= Images ================= */}
        <div className="details-image">
          <img src={activeImage?.images} alt={product.name} />

          {product.productImages.length > 1 && (
            <div className="details-thumbnails">
              {product.productImages.map((img) => (
                <button
                  key={img.id}
                  className={`thumb-btn ${
                    activeImage?.id === img.id ? "active" : ""
                  }`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img.images} alt={img.altText || product.name} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= Info ================= */}
        <div className="details-info">
          <h1>{product.name}</h1>

          <div className="details-rating">
            <div className="details-stars">
              {[1, 2, 3, 4, 5].map((star) =>
                star <= Math.round(averageRating) ? (
                  <FaStar key={star} className="star filled" />
                ) : (
                  <FaRegStar key={star} className="star" />
                )
              )}
            </div>
            <span>
              {averageRating.toFixed(1)} ({ratings.length} Review
              {ratings.length !== 1 ? "s" : ""})
            </span>
          </div>

          <div className="details-price-row">
            <h2>${product.price}</h2>
            {product.oldPrice && (
              <span className="details-old-price">${product.oldPrice}</span>
            )}
          </div>

          {product.colors?.length > 0 && (
            <div className="details-section">
              <span className="details-label">Color</span>
              <div className="details-colors">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`details-color-swatch ${
                      selectedColor === color ? "active" : ""
                    }`}
                    style={{ background: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {product.productSizes?.length > 0 && (
            <div className="details-section">
              <span className="details-label">Select Size</span>
              <div className="details-sizes">
                {product.productSizes.map((size) => (
                  <button
                    key={size.sizeId}
                    className={`details-size-btn ${
                      selectedSize?.sizeId === size.sizeId ? "active" : ""
                    }`}
                    disabled={size.quantity === 0}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size.sizeName}
                  </button>
                ))}
              </div>

              <div className="details-size-links">
                <button type="button" className="size-link">
                  <Ruler size={14} /> Size guide
                </button>
                <button type="button" className="size-link">
                  <Scan size={14} /> Find Your Size
                </button>
              </div>
            </div>
          )}

          <div className="details-section">
            <span className="details-label">Quantity</span>
            <div className="details-quantity-row">
              <div className="quantity-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(availableStock || 1, q + 1))
                  }
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <span className="stock-indicator">
                <span className="stock-dot" />
                {availableStock} in stock
              </span>
            </div>
          </div>

          <div className="details-actions">
            <button
              className="add-to-cart-btn"
              onClick={addToCart}
              disabled={adding || availableStock === 0}
            >
              {availableStock === 0
                ? "Out of Stock"
                : adding
                ? "Adding..."
                : "Add to Cart"}
            </button>

            <button
              className="wishlist-toggle-btn"
              onClick={toggleWishlist}
              aria-label="Add to wishlist"
            >
              <FaHeart color={isFavorite ? "#e74c3c" : "#c9c9c9"} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= Description ================= */}
      <div className="details-description">
        <h3>Product Description</h3>
        <p>{product.description}</p>
      </div>

      {/* ================= Write a Review ================= */}
      <div className="details-review-box">
        <h3>{myRating ? "Update Your Review" : "Write a Review"}</h3>

        <div className="review-star-picker">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="review-star-btn"
              onMouseEnter={() => setHoverStars(star)}
              onMouseLeave={() => setHoverStars(0)}
              onClick={() => setReviewStars(star)}
              aria-label={`Rate ${star} stars`}
            >
              {star <= (hoverStars || reviewStars) ? (
                <FaStar className="review-star filled" />
              ) : (
                <FaRegStar className="review-star" />
              )}
            </button>
          ))}
        </div>

        <textarea
          className="review-textarea"
          placeholder="Share your thoughts about this product..."
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          rows={3}
        />

        {reviewError && <p className="review-error">{reviewError}</p>}

        <div className="review-actions">
          <button
            className="review-submit-btn"
            onClick={submitReview}
            disabled={submittingReview}
          >
            {submittingReview
              ? "Saving..."
              : myRating
              ? "Update Review"
              : "Submit Review"}
          </button>

          {myRating && (
            <button
              className="review-delete-btn"
              onClick={deleteReview}
              disabled={submittingReview}
            >
              Remove Review
            </button>
          )}
        </div>
      </div>

      {/* ================= Recommended ================= */}
      {recommended.length > 0 && (
        <div className="details-recommended">
          <h3>Recommended For You</h3>
          <div className="recommended-grid">
            {recommended.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
      {/* ================= Toast ================= */}
      <Toast
        show={toast.show}
        message={toast.message}
        actionLabel={toast.actionLabel}
        onAction={toast.onAction}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}

export default ProductDetails;