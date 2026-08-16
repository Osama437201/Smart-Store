import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { Check, ChevronUp, MapPin, Navigation, Pencil, Plus, Trash2 } from "lucide-react";
import Toast from "../components/Toast/Toast";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import "./CheckoutPage.css";

const STEPS = [
  { id: 1, label: "Delivery Address" },
  { id: 2, label: "Delivery Option" },
  { id: 3, label: "Payment Method" },
  { id: 4, label: "Review & Confirm" },
];

// مفيش API بيرجع "قائمة" طرق الدفع، فالخيارات دي ثابتة في الفرونت.
// "Cash on Delivery" بيكمل الأوردر عادي، أما "Card" فبيستخدم
// /api/Payment/check-out-session-service/{orderId} بعد إنشاء الأوردر
// عشان يوديه لصفحة الدفع (Stripe Checkout Session).
// "PayPal" لسه معلّق لحد ما يتضاف API خاص بيه.
const TEMP_PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery" },
  { id: "card", name: "Card" },
  { id: "paypal", name: "PayPal" },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();

  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1);

  const [addresses, setAddresses] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(
    TEMP_PAYMENT_METHODS[0].id
  );

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // address object being edited, or null for "add new"
  const [addressToDelete, setAddressToDelete] = useState(null);

  const [manualOpen, setManualOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locatingMe, setLocatingMe] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "" });
  const triggerToast = (message) => setToast({ show: true, message });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      await Promise.all([getAddresses(), getDeliveryOptions()]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Addresses
  // ==========================================

  const getAddresses = async () => {
    try {
      const res = await fetch(
        "https://tryha.runasp.net/api/DeliveryAddress/get/client/addresses",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (data.succeeded) {
        const list = data.data || [];
        setAddresses(list);

        const defaultAddress = list.find((a) => a.isDefault === true);

        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        } else if (list.length > 0) {
          setSelectedAddress(list[0].id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveAddress = async (formData) => {
    const isEditing = Boolean(editingAddress);

    try {
      const res = await fetch(
        isEditing
          ? `https://tryha.runasp.net/api/DeliveryAddress/client/update/address/${editingAddress.id}`
          : "https://tryha.runasp.net/api/DeliveryAddress/client/add/address",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.succeeded) {
        await getAddresses();
        setSelectedAddress(data.data.id);
        closeAddressForm();
        triggerToast(isEditing ? "Address updated" : "Address added");
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

  const deleteAddress = async (addressId) => {
    try {
      const res = await fetch(
        `https://tryha.runasp.net/api/DeliveryAddress/client/delete/address/${addressId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.succeeded) {
        setAddresses((prev) => prev.filter((a) => a.id !== addressId));

        if (selectedAddress === addressId) {
          setSelectedAddress("");
        }

        triggerToast("Address removed");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const res = await fetch(
        `https://tryha.runasp.net/api/DeliveryAddress/client/set-default/${addressId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.succeeded) {
        await getAddresses();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resetAddressForm = () => {
    setFullName("");
    setPhoneNumber("");
    setLandmark("");
    setCity("");
    setStreet("");
    setBuilding("");
    setApartment("");
    setIsDefault(false);
    setLatitude(0);
    setLongitude(0);
    setManualOpen(false);
  };

  const openAddForm = () => {
    resetAddressForm();
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const openEditForm = (address) => {
    setFullName(address.fullName || "");
    setPhoneNumber(address.phoneNumber || "");
    setLandmark(address.landmark || "");
    setCity(address.city || "");
    setStreet(address.street || "");
    setBuilding(address.building || "");
    setApartment(address.apartment || "");
    setIsDefault(address.isDefault || false);
    setLatitude(address.latitude || 0);
    setLongitude(address.longitude || 0);
    setManualOpen(true); // اللي بيعدل غالبًا محتاج يشوف الحقول جاهزة
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddressForm();
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported on this browser.");
      return;
    }

    setLocatingMe(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocatingMe(false);
      },
      (err) => {
        console.log(err);
        alert("Couldn't get your location.");
        setLocatingMe(false);
      }
    );
  };

  const submitAddressForm = async () => {
    if (!fullName || !phoneNumber) {
      alert("Please fill in your name and phone number.");
      return false;
    }

    const hasManualAddress = manualOpen && city && street;
    const hasLocation = latitude !== 0 || longitude !== 0;

    if (!hasManualAddress && !hasLocation) {
      alert("Add your address manually or use your current location.");
      return false;
    }

    setSavingAddress(true);

    const success = await saveAddress({
      fullName,
      phoneNumber,
      landmark,
      city,
      street,
      building,
      apartment,
      isDefault,
      latitude,
      longitude,
    });

    setSavingAddress(false);

    return success;
  };

  const getDeliveryOptions = async () => {
    try {
      const res = await fetch(
        "https://tryha.runasp.net/api/DelivryOptions/all/delevery-options"
      );

      const data = await res.json();

      if (data.succeeded) {
        const list = data.data || [];
        setDeliveryOptions(list);

        if (list.length > 0) {
          setSelectedDelivery(list[0].id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // Create Order
  // ==========================================

  const createOrder = async () => {
    setPlacingOrder(true);

    try {
      const response = await fetch("https://tryha.runasp.net/api/Order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deliveryAddressId: selectedAddress,
          deliveryOptionId: selectedDelivery,
        }),
      });

      const data = await response.json();

      if (!data.succeeded) {
        alert(data.message || "Failed to create order");
        return;
      }

      const orderId = data.data?.id ?? data.data?.orderId;

      // لو الدفع بالكارت، منمررش على /orders دايركت -
      // بنفتح جلسة الدفع (Stripe Checkout Session) الأول.
      if (selectedPayment === "card") {
        const sessionRes = await fetch(
          `https://tryha.runasp.net/api/Payment/check-out-session-service/${orderId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const sessionData = await sessionRes.json();

        if (sessionData.succeeded) {
          const checkoutUrl = sessionData.data?.sessionUrl;

          if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
          }

          alert("Couldn't get the payment page link.");
          return;
        } else {
          alert(sessionData.message || "Failed to start card payment");
          return;
        }
      }

      // Cash on Delivery (أو أي طريقة تانية متاحة حاليًا)
      await fetch("https://tryha.runasp.net/api/Cart/client/clear/cart", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(null);
      navigate("/orders");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ==========================================
  // Step navigation
  // ==========================================

  const canContinue =
    (step === 1 && Boolean(selectedAddress)) ||
    (step === 2 && Boolean(selectedDelivery)) ||
    (step === 3 && Boolean(selectedPayment)) ||
    step === 4;

  const goNext = () => {
    if (step < 4) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const selectedAddressObj = addresses.find((a) => a.id === selectedAddress);
  const selectedDeliveryObj = deliveryOptions.find(
    (d) => d.id === selectedDelivery
  );
  const selectedPaymentObj = TEMP_PAYMENT_METHODS.find(
    (m) => m.id === selectedPayment
  );

  const cartSubtotal =
    cart?.items?.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    ) ?? cart?.totalPrice ?? 0;
  const shippingFee = selectedDeliveryObj?.shopingFee ?? 0;
  const orderTotal = cartSubtotal + shippingFee;

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* ================= Step Indicator ================= */}
      <div className="checkout-steps-card">
        <div className="checkout-steps">
          {STEPS.map((s, index) => (
            <div className="checkout-step-wrapper" key={s.id}>
              <div className="checkout-step">
                <span
                  className={`checkout-step-circle ${
                    step === s.id
                      ? "current"
                      : step > s.id
                      ? "done"
                      : ""
                  }`}
                >
                  {step > s.id ? <Check size={14} /> : s.id}
                </span>
                <span
                  className={`checkout-step-label ${
                    step === s.id ? "current" : ""
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <span className="checkout-step-connector" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= Step Content ================= */}
      <div className="checkout-content-card">
        {/* ---------- Step 1: Delivery Address ---------- */}
        {step === 1 && (
          <div className="checkout-step-panel">
            <h2>Saved Address</h2>

            {addresses.length === 0 && !showAddressForm && (
              <p className="checkout-empty-note">No saved addresses yet.</p>
            )}

            <div className="address-list">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`address-card ${
                    selectedAddress === address.id ? "active" : ""
                  }`}
                >
                  <button
                    className="address-radio"
                    onClick={() => setSelectedAddress(address.id)}
                    aria-label="Select this address"
                  >
                    <span
                      className={`radio-dot ${
                        selectedAddress === address.id ? "checked" : ""
                      }`}
                    />
                  </button>

                  <div
                    className="address-details"
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <h3>{address.fullName}</h3>
                    <p>{address.phoneNumber}</p>
                    <p>
                      {address.building} {address.street}, {address.city}
                    </p>

                    {address.isDefault && (
                      <span className="default-badge">Default Address</span>
                    )}
                  </div>

                  <div className="address-actions">
                    <button
                      className="address-icon-btn"
                      onClick={() => openEditForm(address)}
                      aria-label="Edit address"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      className="address-icon-btn danger"
                      onClick={() => setAddressToDelete(address.id)}
                      aria-label="Delete address"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="add-address-link"
              onClick={() =>
                showAddressForm ? closeAddressForm() : openAddForm()
              }
            >
              {showAddressForm ? (
                <ChevronUp size={16} />
              ) : (
                <Plus size={16} />
              )}
              {showAddressForm ? "" : "OR "}Add New Address
            </button>

            {showAddressForm && (
              <div className="address-form">
                <h4>Contact Information</h4>

                <div className="address-form-grid">
                  <input
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <input
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <input
                    placeholder="Land Mark"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="span-2"
                  />
                </div>

                <button
                  type="button"
                  className="address-option-btn"
                  onClick={() => setManualOpen((v) => !v)}
                >
                  <MapPin size={16} /> Add Address Manually
                </button>

                {manualOpen && (
                  <div className="manual-address-panel">
                    <h4>Add Address Manually</h4>

                    <input
                      className="panel-input"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                      className="panel-input"
                      placeholder="Street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />

                    <div className="panel-input-row">
                      <input
                        className="panel-input"
                        placeholder="Building"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                      />
                      <input
                        className="panel-input"
                        placeholder="Apartment"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                      />
                    </div>

                    <label className="address-default-check">
                      <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                      />
                      Make this my default address
                    </label>

                    <button
                      type="button"
                      className="confirm-address-btn"
                      disabled={savingAddress}
                      onClick={submitAddressForm}
                    >
                      {savingAddress ? "Saving..." : "Confirm the address"}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="address-option-btn"
                  onClick={useMyLocation}
                  disabled={locatingMe}
                >
                  <Navigation size={16} />
                  {locatingMe ? "Getting your location..." : "Use My Location"}
                </button>

                {(latitude !== 0 || longitude !== 0) && (
                  <div className="manual-address-panel">
                    <p className="location-captured-note">
                      <Check size={13} /> Location captured
                    </p>

                    <label className="address-default-check">
                      <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                      />
                      Make this my default address
                    </label>

                    <button
                      type="button"
                      className="confirm-address-btn"
                      disabled={savingAddress}
                      onClick={submitAddressForm}
                    >
                      {savingAddress ? "Saving..." : "Confirm the address"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------- Step 2: Delivery Option ---------- */}
        {step === 2 && (
          <div className="checkout-step-panel">
            <h2>Delivery option</h2>

            <div className="delivery-list">
              {deliveryOptions.map((item) => (
                <div
                  key={item.id}
                  className={`delivery-card ${
                    selectedDelivery === item.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedDelivery(item.id)}
                >
                  <span
                    className={`radio-dot ${
                      selectedDelivery === item.id ? "checked" : ""
                    }`}
                  />

                  <div className="delivery-details">
                    <h3>{item.name}</h3>
                    <p>Shipping Fee: {item.shopingFee} EGP</p>
                    <p>
                      Estimated delivery: {item.minDays}-{item.maxDays} Days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Step 3: Payment Method ---------- */}
        {step === 3 && (
          <div className="checkout-step-panel">
            <h2>Payment Method</h2>

            <p className="checkout-empty-note">
              Select your preferred payment option.
            </p>

            <div className="delivery-list">
              {TEMP_PAYMENT_METHODS.map((method) => {
                const disabled = method.id === "paypal";

                return (
                  <div
                    key={method.id}
                    className={`delivery-card ${
                      selectedPayment === method.id ? "active" : ""
                    } ${disabled ? "disabled" : ""}`}
                    onClick={() => !disabled && setSelectedPayment(method.id)}
                  >
                    <span
                      className={`radio-dot ${
                        selectedPayment === method.id ? "checked" : ""
                      }`}
                    />
                    <div className="delivery-details">
                      <h3>{method.name}</h3>
                    </div>
                    {disabled && (
                      <span className="coming-soon-badge">Coming soon</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- Step 4: Review & Confirm ---------- */}
        {step === 4 && (
          <div className="checkout-step-panel">
            <h2>Order Summary</h2>

            {cart?.items?.length ? (
              <div className="review-items-list">
                {cart.items.map((item) => (
                  <div className="review-item" key={item.id}>
                    <img
                      src={item.productImageUrl}
                      alt={item.poductName}
                      className="review-item-img"
                    />

                    <div className="review-item-details">
                      <h3>{item.poductName}</h3>
                      <p>
                        Size: <strong>{item.size}</strong> &nbsp;·&nbsp;
                        Color: <strong>{item.color}</strong> &nbsp;·&nbsp;
                        Qty: {item.quantity}
                      </p>
                      <p className="review-item-price">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="checkout-empty-note">Your cart is empty.</p>
            )}

            <div className="review-totals">
              <div className="review-totals-row">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="review-totals-row">
                <span>Shipping Fee</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
              <div className="review-totals-row review-totals-final">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="review-delivery-info">
              <h4>Delivery Information</h4>

              <div className="review-delivery-row">
                <span>Address</span>
                <span>
                  {selectedAddressObj
                    ? `${selectedAddressObj.building} ${selectedAddressObj.street}, ${selectedAddressObj.city}`
                    : "—"}
                </span>
              </div>

              <div className="review-delivery-row">
                <span>Delivery Option</span>
                <span>
                  {selectedDeliveryObj
                    ? `${selectedDeliveryObj.name} (${selectedDeliveryObj.minDays}-${selectedDeliveryObj.maxDays} Days)`
                    : "—"}
                </span>
              </div>

              <div className="review-delivery-row">
                <span>Payment Method</span>
                <span>{selectedPaymentObj?.name || "—"}</span>
              </div>
            </div>

            <div className="review-confirm-note">
              <span className="review-confirm-icon">
                <Check size={20} />
              </span>
              <h4>Ready to Confirm Payment</h4>
              <p>
                Please review all details above and click "Confirm Payment"
                to complete your order.
              </p>
            </div>
          </div>
        )}

        {/* ================= Nav Buttons ================= */}
        <div className="checkout-nav-buttons">
          <button
            className="checkout-back-btn"
            onClick={
              step === 1 && showAddressForm
                ? closeAddressForm
                : step === 1
                ? () => navigate("/cart")
                : goBack
            }
          >
            Back
          </button>

          {step < 4 ? (
            <button
              className="checkout-continue-btn"
              disabled={!canContinue}
              onClick={goNext}
            >
              Continue
            </button>
          ) : (
            <button
              className="checkout-continue-btn"
              onClick={createOrder}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Confirm Payment"}
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        show={addressToDelete !== null}
        title="Delete Address"
        message="Are you sure you want to delete this address?"
        confirmLabel="Delete"
        onConfirm={() => {
          deleteAddress(addressToDelete);
          setAddressToDelete(null);
        }}
        onCancel={() => setAddressToDelete(null)}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}

export default CheckoutPage;