import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Signuppage.css";

import logo from "../assets/logo.svg";
import illustration from "../assets/login-illustration.png";

function SignUpPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Required fields
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    }

    // Password match
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    // Stop here if there are errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const formData = new FormData();

    formData.append("FullName", fullName);
    formData.append("Email", email);
    formData.append("PhoneNumber", phoneNumber);
    formData.append("Age", age);
    formData.append("Address", address);
    formData.append("Password", password);
    formData.append("ConfirmPassword", confirmPassword);

    if (image) {
      formData.append("ProfileImageUrl", image);
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://tryha.runasp.net/api/Account/register/client",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      console.log(data);

      if (data.succeeded) {
        localStorage.setItem("token", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.data));

        navigate("/verify-email", {
          state: {
            userId: data.data.id,
            email: data.data.email,
          },
        });
      } else {
        setErrors({
          form: data.message || "Registration failed",
        });
      }
    } catch (error) {
      console.log(error);

      setErrors({
        form: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-visual">
        <img
          src={illustration}
          alt="illustration"
          className="signup-illustration"
        />

        <div className="signup-dots">
          <span className="signup-dot active"></span>
          <span className="signup-dot"></span>
          <span className="signup-dot"></span>
          <span className="signup-dot"></span>
        </div>

        <div className="signup-visual-text">
          <h2 className="signup-visual-title">Smart Virtual Try-On</h2>

          <p className="signup-visual-desc">
            Try outfits virtually and make smarter fashion decisions without
            guesswork.
          </p>
        </div>
      </div>

      <div className="signup-form-side">
        <img src={logo} alt="logo" className="signup-logo" />

        <h1 className="signup-title">Create an account</h1>

        <p className="signup-subtitle">
          Join us and start your Smart store journey.
        </p>

        <form className="signup-form" onSubmit={handleRegister}>
          <div className="signup-grid">
            <div className="signup-field">
              <label>Full Name</label>

              <div className="signup-input-wrap">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="signup-field">
              <label>Email</label>

              <div
                className={`signup-input-wrap ${errors.email ? "signup-input-error" : ""}`}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
              </div>

              {errors.email && (
                <span className="signup-error-message">{errors.email}</span>
              )}
            </div>

            <div className="signup-field">
              <label>Phone Number</label>

              <div
                className={`signup-input-wrap ${errors.phoneNumber ? "signup-input-error" : ""}`}
              >
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                  }}
                />
              </div>

              {errors.phoneNumber && (
                <span className="signup-error-message">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label>Age</label>

              <div className="signup-input-wrap">
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            <div className="signup-field">
              <label>Address</label>

              <div
                className={`signup-input-wrap ${errors.address ? "signup-input-error" : ""}`}
              >
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrors((prev) => ({ ...prev, address: "" }));
                  }}
                />
              </div>

              {errors.address && (
                <span className="signup-error-message">{errors.address}</span>
              )}
            </div>

            <div className="signup-field">
              <label>Profile Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="signup-field">
              <label>Password</label>

              <div
                className={`signup-input-wrap ${errors.password ? "signup-input-error" : ""}`}
              >
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
              </div>

              {errors.password && (
                <span className="signup-error-message">{errors.password}</span>
              )}
            </div>

            <div className="signup-field">
              <label>Confirm Password</label>

              <div
                className={`signup-input-wrap ${
                  errors.confirmPassword ? "signup-input-error" : ""
                }`}
              >
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                />
              </div>

              {errors.confirmPassword && (
                <span className="signup-error-message">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

          <div className="signup-divider">
            <span>OR</span>
          </div>

          <button type="button" className="signup-google-btn">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15.8 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-11.3 8-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-3.5z"
              />
            </svg>

            <span>Sign in with Google</span>
          </button>

          <p className="signup-footer-text">
            Have an account?{" "}
            <Link to="/login" className="signup-footer-link">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
