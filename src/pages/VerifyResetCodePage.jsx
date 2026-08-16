import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyResetCodePage.css";

import logo from "../assets/logo.svg";
import illustration from "../assets/login-illustration.png";

function VerifyResetCodePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef([]);

  const userId = location.state?.userId;
  const email = location.state?.email;

  // =========================
  // COOLDOWN
  // =========================
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // =========================
  // CHANGE OTP
  // =========================
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");
    setResendMessage("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // =========================
  // BACKSPACE
  // =========================
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // =========================
  // PASTE OTP
  // =========================
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");

      setOtp(digits);
      setError("");

      inputRefs.current[5]?.focus();
    }
  };

  // =========================
  // VERIFY RESET OTP
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fullOtp = otp.join("");

    if (fullOtp.length < 6) {
      setError("Please enter the full 6-digit verification code");
      return;
    }

    if (!userId) {
      setError("User information is missing");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://tryha.runasp.net/api/Account/confirm-reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            otp: fullOtp,
          }),
        },
      );

      const data = await response.json();

      console.log("Confirm Reset Status:", response.status);
      console.log("Confirm Reset Response:", data);

      if (response.ok && data.succeeded && data.data?.token) {
        navigate("/reset-password", {
          state: {
            userId: userId,
            email: email,
            token: data.data.token,
          },
        });
      } else {
        setError(data.message || "Invalid verification code");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setError("");
    setResendMessage("");

    if (!userId) {
      setError("User information is missing");
      return;
    }

    try {
      setResending(true);

      const response = await fetch(
        "https://tryha.runasp.net/api/Account/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        },
      );

      const data = await response.json();

      console.log("Resend OTP Status:", response.status);
      console.log("Resend OTP Response:", data);

      if (response.ok && data.succeeded) {
        setResendMessage("A new verification code has been sent.");

        setCooldown(60);

        setOtp(["", "", "", "", "", ""]);

        inputRefs.current[0]?.focus();
      } else {
        setError(data.message || "Failed to resend verification code");
      }
    } catch (err) {
      console.error("Resend OTP Error:", err);

      setError("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-page-container">
      {/* =========================
          LEFT SIDE
      ========================= */}
      <div className="verify-visual-side">
        <div className="verify-visual-content">
          <img
            src={illustration}
            alt="Virtual Try-On Illustration"
            className="verify-illustration"
          />

          <div className="verify-dots-indicator">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>

          <div className="verify-visual-text">
            <h2>Smart Virtual Try-On</h2>

            <p>
              Try outfits virtually and make smarter fashion decisions without
              guesswork.
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}
      <div className="verify-form-side">
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

        <div className="verify-content">
          <img src={logo} alt="Logo" className="verify-logo" />

          <h1 className="verify-title">Verification Code</h1>

          <p className="verify-subtitle">
            Enter the 6-digit code sent to your email or phone number.
          </p>

          <form className="verify-form" onSubmit={handleSubmit}>
            <label className="verify-label">Enter Verification Code</label>

            <div className="otp-inputs-container" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`otp-input ${digit ? "filled" : ""}`}
                />
              ))}
            </div>

            {error && <p className="verify-error">{error}</p>}

            {resendMessage && <p className="verify-success">{resendMessage}</p>}

            <button
              type="submit"
              disabled={loading}
              className="verify-submit-btn"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <p className="verify-resend-text">
              Don't receive a code?{" "}
              {resending ? (
                <span className="verify-resend-timer">Sending...</span>
              ) : cooldown > 0 ? (
                <span className="verify-resend-timer">
                  Resend in {cooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  className="verify-resend-link"
                  onClick={handleResend}
                >
                  Resend
                </button>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyResetCodePage;
