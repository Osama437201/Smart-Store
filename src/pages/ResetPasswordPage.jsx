import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Check } from "lucide-react";
import "./ResetPasswordPage.css";

import logo from "../assets/logo.svg";
import illustration from "../assets/login-illustration.png";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const userId = location.state?.userId;
  const email = location.state?.email;
  const token = location.state?.token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // =========================
    // VALIDATION
    // =========================

    if (!newPassword.trim()) {
      setError("Password is required");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Confirm password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!userId) {
      setError(
        "User information is missing. Please restart the process."
      );
      return;
    }

    if (!token) {
      setError(
        "Verification token is missing. Please restart the process."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://tryha.runasp.net/api/Account/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: userId,
            token: token,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Reset Password Status:",
        response.status
      );

      console.log(
        "Reset Password Response:",
        data
      );

      if (response.ok && data.succeeded) {

        /*
          Reset Password لا يرجع accessToken/refreshToken،
          فمينفعش نودي المستخدم للهوم مباشرة (مش logged in).

          لكن تأكيد الباسورد هنا (عن طريق كود اتبعت على الإيميل)
          ملوش أي علاقة بتأكيد الإيميل (confirm-email) - ده OTP
          مختلف واتستهلك بالفعل في VerifyResetCodePage.

          فبدل الـ alert بنعرض شاشة نجاح، وبعدين المستخدم بنفسه
          يضغط "Return to Login" عشان يروح يسجل دخول بالباسورد
          الجديد.
        */

        setSuccess(true);

      } else {

        setError(
          data.message ||
          "Failed to reset password"
        );
      }

    } catch (err) {

      console.error(
        "Reset Password Error:",
        err
      );

      setError(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="reset-password-page-container">

      {/* =========================
          LEFT SIDE
      ========================= */}

      <div className="reset-password-visual-side">

        <div className="reset-password-visual-content">

          <img
            src={illustration}
            alt="Virtual Try-On Illustration"
            className="reset-password-illustration"
          />

          <div className="reset-password-dots-indicator">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>

          <div className="reset-password-visual-text">

            <h2>
              Smart Virtual Try-On
            </h2>

            <p>
              Try outfits virtually and make
              smarter fashion decisions without
              guesswork.
            </p>

          </div>

        </div>

      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="reset-password-form-side">

        <button
          type="button"
          className="reset-password-back-btn"
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

        <div className="reset-password-content">

          {success ? (

            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "48px 36px",
                maxWidth: "360px",
                width: "100%",
                margin: "0 auto",
                textAlign: "center",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#f1e9fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Check size={30} color="#6b21a8" strokeWidth={3} />
              </div>

              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: "0 0 8px",
                }}
              >
                Success
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  color: "#6b6b6b",
                  margin: "0 0 28px",
                  lineHeight: 1.5,
                }}
              >
                You have successfully reset your password.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/login", { replace: true })
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#6b21a8",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Return to Login
              </button>

            </div>

          ) : (

            <>

          <img
            src={logo}
            alt="Logo"
            className="reset-password-logo"
          />

          <h1 className="reset-password-title">
            Create new password
          </h1>

          <p className="reset-password-subtitle">
            Enter a new password to secure your account.
          </p>

          <form
            className="reset-password-form"
            onSubmit={handleSubmit}
          >

            {/* =========================
                NEW PASSWORD
            ========================= */}

            <div className="reset-password-field">

              <label>
                New Password
              </label>

              <div className="input-with-icon">

                <span className="input-icon lock-icon">

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                    />

                    <path
                      d="M7 11V7a5 5 0 0 1 10 0v4"
                    />
                  </svg>

                </span>

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(
                      e.target.value
                    );

                    setError("");
                  }}
                />

                <button
                  type="button"
                  className="input-icon eye-icon"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                >

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >

                    {showNewPassword ? (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />

                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </>
                    )}

                  </svg>

                </button>

              </div>

            </div>

            {/* =========================
                CONFIRM PASSWORD
            ========================= */}

            <div className="reset-password-field">

              <label>
                Confirm Password
              </label>

              <div className="input-with-icon">

                <span className="input-icon lock-icon">

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >

                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                    />

                    <path
                      d="M7 11V7a5 5 0 0 1 10 0v4"
                    />

                  </svg>

                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value
                    );

                    setError("");
                  }}
                />

                <button
                  type="button"
                  className="input-icon eye-icon"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >

                    {showConfirmPassword ? (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />

                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </>
                    )}

                  </svg>

                </button>

              </div>

            </div>

            {error && (
              <p className="reset-password-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="reset-password-submit-btn"
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>

          </form>

            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default ResetPasswordPage;