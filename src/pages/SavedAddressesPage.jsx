import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import "./SavedAddressesPage.css";

function SavedAddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getAddresses();
  }, []);

  const getAddresses = async () => {
    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/DeliveryAddress/get/client/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.succeeded) {
        setAddresses(data.data);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `https://tryha.runasp.net/api/DeliveryAddress/client/delete/address/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(data.message || "Failed to delete address");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setDeletingId(null);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="saved-address-page">
      <ProfileSidebar />

      <div className="saved-address-content">
        <div className="saved-address-card">
          <div className="title-row">
            <h2>Saved Addresses</h2>

            <button
              className="add-btn"
              onClick={() => navigate("/add-address")}
            >
              + Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="empty-address">No Addresses Yet</p>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="address-box">
                <div>
                  <h3>{address.fullName}</h3>

                  <p>{address.phoneNumber}</p>

                  <p>
                    {address.city}, {address.street}
                  </p>

                  <p>
                    Building {address.building}
                    {address.apartment && ` - Apt ${address.apartment}`}
                  </p>

                  {address.landmark && <p>Landmark: {address.landmark}</p>}

                  {address.isDefault && (
                    <span className="default-badge">Default</span>
                  )}
                </div>

                <hr className="address-divider" />

                <div className="address-actions">
                  <button
                    onClick={() =>
                      navigate(`/edit-address/${address.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                  >
                    {deletingId === address.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SavedAddressesPage;