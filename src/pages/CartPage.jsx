import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useState, useEffect } from "react";
import { Minus, Plus, X, Heart, ShoppingBag } from "lucide-react";
import Toast from "../components/Toast/Toast";
import "./CartPage.css";

function CartPage() {
  const navigate = useNavigate();

  const { cart, setCart } = useCart();
  const { refreshWishlist } = useWishlist();

  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    actionLabel: null,
    onAction: null,
  });

  // ==========================================
  // Get Categories (for "Popular Categories" links)
  // ==========================================

  useEffect(() => {
    fetch("https://tryha.runasp.net/api/Categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.succeeded) setCategories(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const popularNames = ["Women", "Men", "Accessories"];
  const popularCategories =
    categories
      .filter((c) => popularNames.includes(c.name))
      .sort(
        (a, b) => popularNames.indexOf(a.name) - popularNames.indexOf(b.name)
      ).length > 0
      ? categories.filter((c) => popularNames.includes(c.name))
      : categories.slice(0, 3);

  const triggerToast = (message, actionLabel, onAction) => {
    setToast({ show: true, message, actionLabel, onAction });
  };

  // ==========================================
  // Merge a fresh cart response into the current cart,
  // keeping fields (like productImageUrl) that the
  // update/delete endpoints sometimes return empty.
  // ==========================================

  const mergeCart = (prevCart, newCart) => {
    if (!newCart?.items) return newCart;

    const prevItemsById = new Map(
      (prevCart?.items || []).map((item) => [item.id, item])
    );

    return {
      ...newCart,
      items: newCart.items.map((item) => {
        const prevItem = prevItemsById.get(item.id);

        return {
          ...item,
          productImageUrl:
            item.productImageUrl && item.productImageUrl.trim() !== ""
              ? item.productImageUrl
              : prevItem?.productImageUrl || "",
        };
      }),
    };
  };

  // ==========================================
  // Update Quantity
  // ==========================================

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/Cart/client/items",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cartItemId,
            quantity,
          }),
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        setCart((prev) => mergeCart(prev, data.data));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  // ==========================================
  // Delete Item (removes locally so the rest of
  // the cart never disappears, regardless of what
  // the delete endpoint returns)
  // ==========================================

  const removeItemLocally = (cartItemId) => {
    setCart((prev) => {
      if (!prev?.items) return prev;

      const items = prev.items.filter((i) => i.id !== cartItemId);

      const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = items.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0
      );

      return { ...prev, items, totalItems, totalPrice };
    });
  };

  const deleteItem = async (item, { silent = false } = {}) => {
    try {
      const response = await fetch(
        `https://tryha.runasp.net/api/Cart/delete/client/cart/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        removeItemLocally(item.id);

        if (!silent) {
          triggerToast(
            "Item successfully removed from cart",
            "Undo",
            () => undoRemove(item)
          );
        }

        return true;
      } else {
        alert(data.message);
        return false;
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
      return false;
    }
  };

  // ==========================================
  // Undo Remove (re-add the same item to the cart)
  // ==========================================

  const undoRemove = async (item) => {
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
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          }),
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        // العنصر الراجع من الـ API ليه id جديد تمامًا،
        // فبنستخدم المنتج المحفوظ (item) نفسه كمصدر احتياطي للصورة
        const patched = {
          ...data.data,
          items: data.data.items.map((newItem) =>
            (!newItem.productImageUrl ||
              newItem.productImageUrl.trim() === "") &&
            newItem.productId === item.productId &&
            newItem.size === item.size &&
            newItem.color === item.color
              ? { ...newItem, productImageUrl: item.productImageUrl }
              : newItem
          ),
        };

        setCart((prev) => mergeCart(prev, patched));
        setToast((t) => ({ ...t, show: false }));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  // ==========================================
  // Move to Wishlist (add to wishlist, then remove from cart)
  // ==========================================

  const moveToWishlist = async (item) => {
    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/Wishlist/client/add/to/wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: item.productId }),
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        await refreshWishlist();
        await deleteItem(item, { silent: true });
        triggerToast("Moved to wishlist");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const itemCount = cart?.items?.length || 0;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>My Cart</h1>
        <p>
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      {!cart || !cart.items || cart.items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={32} />
          </div>

          <h2>Your Cart is empty</h2>

          <p>
            Looks like you haven't added anything yet.
            <br />
            Start exploring products now!
          </p>

          <button onClick={() => navigate("/products")}>
            Start Shopping
          </button>

          {popularCategories.length > 0 && (
            <div className="empty-cart-categories">
              <span className="empty-cart-categories-label">
                Popular Categories
              </span>

              <div className="empty-cart-categories-links">
                {popularCategories.map((cat) => (
                  <Link key={cat.id} to={`/products?categoryId=${cat.id}`}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div className="cart-item" key={item.id}>
                <button
                  className="cart-item-remove"
                  onClick={() => deleteItem(item)}
                  aria-label="Remove item"
                >
                  <X size={16} />
                </button>

                <img
                  src={
                    item.productImageUrl &&
                    item.productImageUrl.trim() !== ""
                      ? item.productImageUrl
                      : "https://via.placeholder.com/90x90?text=No+Image"
                  }
                  alt={item.poductName}
                />

                <div className="cart-item-main">
                  <div className="cart-item-top">
                    <h3>{item.poductName}</h3>
                    <span className="cart-item-qty-label">
                      Quantity:{item.quantity}
                    </span>
                  </div>

                  <div className="cart-item-meta">
                    <span>Size: {item.size}</span>
                    <span className="cart-item-color">
                      Color:
                      <span
                        className="color-swatch"
                        style={{ background: item.color }}
                      />
                    </span>
                  </div>

                  <p className="cart-item-price">${item.unitPrice}</p>
                </div>

                <div className="cart-item-actions">
                  <button
                    className="move-to-wishlist-btn"
                    onClick={() => moveToWishlist(item)}
                  >
                    <Heart size={14} /> Move to Wishlist
                  </button>

                  <div className="quantity-box">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total-row">
            <span>Total</span>
            <span>${cart.totalPrice}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </>
      )}

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

export default CartPage;