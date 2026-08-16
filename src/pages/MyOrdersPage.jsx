import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import "./MyOrdersPage.css";

function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tryha.runasp.net/api/Order/client/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log(data);

      if (data.succeeded) {
        setOrders(data.data.items);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

return (
  <div className="orders-page">

    <ProfileSidebar />

    <div className="orders-content">

      <div className="orders-card">

        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">

            <div className="empty-orders-icon">
              <span>▤</span>
            </div>

            <h2>No Orders yet</h2>

            <p>
              Once you place an order, it will appear here.
            </p>

            <button
              className="start-shopping-btn"
              onClick={() => navigate("/products")}
            >
              Start Shopping
            </button>

          </div>
        ) : (
          orders.map((order) => (
            <div className="order-item" key={order.id}>

              <div className="order-info">

                <h3>
                  Order Code:{order.orderCode}
                </h3>

                <p>
                  status: {order.status}
                </p>

              </div>

              <button
                className="details-btn"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                Details
              </button>

            </div>
          ))
        )}

      </div>

    </div>

  </div>
);
}

export default MyOrdersPage;