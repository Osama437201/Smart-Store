import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import "./AddAddressPage.css";

function AddAddressPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    city: "",
    street: "",
    building: "",
    apartment: "",
    landmark: "",
    latitude: 0,
    longitude: 0,
    isDefault: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tryha.runasp.net/api/DeliveryAddress/client/add/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        alert("Address Added Successfully");
        navigate("/saved-addresses");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="add-address-page">

      <ProfileSidebar />

      <div className="add-address-content">

        <div className="add-address-card">

          <h2>Add New Address</h2>

          <form onSubmit={handleSubmit}>

            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
            />

            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />

            <input
              name="street"
              placeholder="Street"
              value={form.street}
              onChange={handleChange}
            />

            <input
              name="building"
              placeholder="Building"
              value={form.building}
              onChange={handleChange}
            />

            <input
              name="apartment"
              placeholder="Apartment"
              value={form.apartment}
              onChange={handleChange}
            />

            <input
              name="landmark"
              placeholder="Landmark"
              value={form.landmark}
              onChange={handleChange}
            />

            <label className="default-check">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />
              Make Default Address
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Address"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddAddressPage;