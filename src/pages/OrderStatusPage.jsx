import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckDouble,
  FaBoxOpen,
  FaTruck,
  FaShippingFast,
  FaHome,
} from "react-icons/fa";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import "./OrderStatusPage.css";

function OrderStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderStatus();
  }, [id]);

  const getOrderStatus = async () => {
    try {
      const response = await fetch(
        `https://tryha.runasp.net/api/Order/status/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Order Status:", data);

      if (data.succeeded) {
        setStatus(data.data);
      }
    } catch (error) {
      console.log("Order status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    {
      key: "Confirmed",
      title: "Order",
      subtitle: "Confirmed",
      icon: <FaCheckDouble />,
    },
    {
      key: "Processed",
      title: "Order",
      subtitle: "Processed",
      icon: <FaBoxOpen />,
    },
    {
      key: "Shipped",
      title: "Order",
      subtitle: "Shipped",
      icon: <FaTruck />,
    },
    {
      key: "OutForDelivery",
      title: "Order",
      subtitle: "Out for delivery",
      icon: <FaShippingFast />,
    },
    {
      key: "Arrived",
      title: "Order",
      subtitle: "Arrived",
      icon: <FaHome />,
    },
  ];

  const getStepIndex = () => {
    if (!status) return -1;

    const normalizedStatus = status
      .toLowerCase()
      .replace(/\s/g, "");

    const index = statusSteps.findIndex(
      (step) =>
        step.key.toLowerCase().replace(/\s/g, "") === normalizedStatus
    );

    return index;
  };

  const currentStep = getStepIndex();

  if (loading) {
    return (
      <h2 className="order-status-loading">
        Loading...
      </h2>
    );
  }

  return (
    <div className="order-status-page">
      <ProfileSidebar />

      <div className="order-status-content">
        <div className="order-status-card">

          {/* Header */}
          <div className="order-status-header">
            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </button>

            <h1>Order Status</h1>
          </div>

          {/* Status Steps */}
          <div className="status-steps">

            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStep;

              return (
                <div
                  className={`status-step ${
                    isCompleted ? "completed" : "not-completed"
                  }`}
                  key={step.key}
                >

                  <div className="status-step-box">

                    <span className="status-icon">
                      {step.icon}
                    </span>

                    <div className="status-text">
                      <span>{step.title}</span>
                      <strong>{step.subtitle}</strong>
                    </div>

                  </div>

                  <div className="status-check">
                    {isCompleted ? "✦" : "✦"}
                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderStatusPage;