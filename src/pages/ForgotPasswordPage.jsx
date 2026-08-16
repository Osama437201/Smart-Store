import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ForgotPasswordPage.css";

import logo from "../assets/logo.svg";
import illustration from "../assets/login-illustration.png";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const response = await fetch(
        "https://tryha.runasp.net/api/Account/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        },
      );

      const data = await response.json();

      console.log("Forgot Password Response:", data);

      if (data.succeeded) {
        navigate("/verify-reset-code", {
          state: {
            userId: data.data.userId,
            email: email.trim(),
          },
        });
      } else {
        setError(data.message || "Email not found");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page forgot-password-page">
      {/* Left Side */}
      <div className="login-visual">
        <img
          src={illustration}
          alt="Smart Virtual Try-On"
          className="login-illustration"
        />

        <div className="login-dots">
          <span className="login-dot active" />
          <span className="login-dot" />
          <span className="login-dot" />
          <span className="login-dot" />
        </div>

        <div className="login-visual-text">
          <h2 className="login-visual-title">Smart Virtual Try-On</h2>

          <p className="login-visual-desc">
            Try outfits virtually and make smarter fashion decisions without
            guesswork.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-form-side">
        <button
          type="button"
          className="forgot-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <img src={logo} alt="Smart Store logo" className="login-logo" />

        <h1 className="login-title">Forgot Password</h1>

        <p className="login-subtitle">
          Please enter the email address associated with
          <br />
          your account.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email</label>

            <div
              className={`login-input-wrap ${error ? "login-input-error" : ""}`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666666"
                strokeWidth="1.7"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />

                <path
                  d="M3 7l9 6 9-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>

            {error && (
              <p className="login-error-message">
                <span className="login-error-small-icon">!</span>

                {error}
              </p>
            )}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
