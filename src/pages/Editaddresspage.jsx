import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import "./EditAddressPage.css";

function EditAddressPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

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

  useEffect(() => {
    getAddress();
  }, [id]);

  // =========================
  // GET ADDRESS (to prefill the form)
  // =========================
  const getAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://tryha.runasp.net/api/DeliveryAddress/get/client/address/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Address Response:", data);

      if (data.succeeded) {
        const a = data.data;

        setForm({
          fullName: a.fullName || "",
          phoneNumber: a.phoneNumber || "",
          city: a.city || "",
          street: a.street || "",
          building: a.building || "",
          apartment: a.apartment || "",
          landmark: a.landmark || "",
          latitude: a.latitude || 0,
          longitude: a.longitude || 0,
          isDefault: a.isDefault || false,
        });
      } else {
        alert(data.message || "Failed to load address");
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const canConfirm = form.city.trim() !== "" && form.street.trim() !== "";

  // =========================
  // USE MY LOCATION
  // =========================
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocating(false);
      },
      (err) => {
        console.log(err);
        alert("Could not get your location");
        setLocating(false);
      }
    );
  };

  // =========================
  // UPDATE ADDRESS
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://tryha.runasp.net/api/DeliveryAddress/client/update/address/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        alert("Address Updated Successfully");
        navigate("/saved-addresses");
      } else {
        alert(data.message || "Failed to update address");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setSaving(false);
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="edit-address-page">

      <ProfileSidebar />

      <div className="edit-address-content">

        <div className="edit-address-card">

          <h2>Edit Address</h2>

          <form onSubmit={handleSubmit}>

            <p className="section-label">Contact Information</p>

            <div className="row">

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

            </div>

            <input
              className="full-input"
              name="landmark"
              placeholder="Landmark (e.g. Near Elazaby Pharmacy)"
              value={form.landmark}
              onChange={handleChange}
            />

            <div className="manual-address-box">

              <p className="section-label">Add Address Manually</p>

              <input
                className="full-input"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />

              <input
                className="full-input"
                name="street"
                placeholder="Street"
                value={form.street}
                onChange={handleChange}
              />

              <div className="row">

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

              </div>

              <label className="default-check">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                />
                Make this my default address
              </label>

              <button
                type="button"
                className="confirm-address-btn"
                disabled={!canConfirm}
              >
                Confirm the address
              </button>

            </div>

            <button
              type="button"
              className="use-location-btn"
              onClick={useMyLocation}
              disabled={locating}
            >
              <MapPin size={20} />
              {locating ? "Locating..." : "Use My Location"}
            </button>

            <div className="action-row">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/saved-addresses")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditAddressPage;