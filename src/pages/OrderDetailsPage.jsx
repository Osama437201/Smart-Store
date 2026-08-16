import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiTag,
  FiInfo,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import Toast from "../components/Toast/Toast";
import "./OrderDetailsPage.css";

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "" });
  const triggerToast = (message) => setToast({ show: true, message });

  useEffect(() => {
    getOrder();
  }, [id]);

  // =========================
  // GET ORDER DETAILS
  // =========================
  const getOrder = async () => {
    try {
      console.log("Order ID:", id);

      const response = await fetch(
        `https://tryha.runasp.net/api/Order/details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Response status:", response.status);

      const data = await response.json();

      console.log("FULL ORDER DATA:", JSON.stringify(data.data, null, 2));

      if (data.succeeded) {
        setOrder(data.data);
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
  // CANCEL ORDER
  // =========================
  const cancelOrder = async () => {
    try {
      setCancelling(true);

      const response = await fetch(
        `https://tryha.runasp.net/api/Order/cancel/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Cancel Order Response:", data);

      if (data.succeeded) {
        // تحديث الحالة على الصفحة فورًا
        setOrder((prev) => ({
          ...prev,
          status: "Cancelled",
        }));

        triggerToast("Order cancelled successfully");
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.log("Cancel Order Error:", err);
      alert("Something went wrong");
    } finally {
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  // =========================
  // ORDER NOT FOUND
  // =========================
  if (!order) {
    return <h2 style={{ textAlign: "center" }}>Order not found</h2>;
  }

  return (
    <div className="order-details-page">
      <ProfileSidebar />

      <div className="order-details-content">
        <div className="order-details-card">
          {/* Header */}
          <div className="order-details-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ←
            </button>

            <h1>Order Details</h1>
          </div>

          {/* Order Info */}
          <div className="order-main-info">
            {/* Order Code */}
            <div className="info-item">
              <span className="info-icon">
                <FiTag />
              </span>

              <div>
                <strong>Order Code</strong>

                <p>{order.orderCode}</p>
              </div>
            </div>

            {/* Status */}
            <div className="info-item">
              <span className="info-icon">
                <FiInfo />
              </span>

              <div>
                <strong>Status</strong>

                <p>{order.status}</p>
              </div>
            </div>

            {/* Price */}
            <div className="info-item">
              <span className="info-icon">
                <FiDollarSign />
              </span>

              <div>
                <strong>Price</strong>

                <p>${order.totalPrice}</p>
              </div>
            </div>

            {/* Date */}
            <div className="info-item">
              <span className="info-icon">
                <FiCalendar />
              </span>

              <div>
                <strong>Date</strong>

                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="info-item">
              <span className="info-icon">
                <FiMapPin />
              </span>

              <div>
                <strong>Delivery Address</strong>

                <p>
                  {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <h3 className="items-title">Items</h3>

          <div className="order-items">
            {order.orderItems?.map((item) => (
              <div className="order-item-card" key={item.id}>
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="order-item-image"
                />

                <div className="order-item-info">
                  <h3>{item.productName}</h3>

                  <p>Quantity: {item.quantity}</p>

                  <div className="item-options">
                    <span>Size: {item.size}</span>

                    <span>Color: {item.color}</span>
                  </div>

                  <strong className="item-price">${item.totalPrice}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="order-actions">
            <button
              className="cancel-order-btn"
              onClick={() => setShowCancelConfirm(true)}
              disabled={
                cancelling || order.status?.toLowerCase() === "cancelled"
              }
            >
              {cancelling
                ? "Cancelling..."
                : order.status?.toLowerCase() === "cancelled"
                  ? "Order Cancelled"
                  : "Cancel Order"}
            </button>

            <button
              className="order-status-btn"
              onClick={() => navigate(`/orders/${id}/status`)}
            >
              Order Status
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showCancelConfirm}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        confirmLabel={cancelling ? "Cancelling..." : "Yes, Cancel Order"}
        onConfirm={cancelOrder}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}

export default OrderDetailsPage;