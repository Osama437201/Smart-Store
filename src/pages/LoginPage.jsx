import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./LoginPage.css";

import logo from "../assets/logo.svg";
import illustration from "../assets/login-illustration.png";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email.trim() || !validateEmail(email.trim())) {
      setEmailError(
        "Please enter a valid email address"
      );

      hasError = true;
    }

    if (!password) {
      setPasswordError(
        "Please enter your password"
      );

      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);

      const response = await fetch(
        "https://tryha.runasp.net/api/Account/Login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Login Status:",
        response.status
      );

      console.log(
        "Login Response:",
        data
      );

      // =========================
      // SUCCESS
      // =========================

      if (
        response.ok &&
        data.succeeded &&
        data.data
      ) {
        localStorage.setItem(
          "token",
          data.data.accessToken
        );

        localStorage.setItem(
          "refreshToken",
          data.data.refreshToken
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.data)
        );

        navigate("/", {
          replace: true,
        });

        return;
      }

      // =========================
      // EMAIL NOT CONFIRMED
      // =========================

      if (
        response.status === 403 &&
        data.data?.id
      ) {
        navigate("/confirm-email", {
          state: {
            userId: data.data.id,
            email: data.data.email,
          },
        });

        return;
      }

      // =========================
      // NORMAL ERROR
      // =========================

      setPasswordError(
        data.message ||
        "Invalid email or password"
      );

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      setPasswordError(
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (emailError) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (passwordError) {
      setPasswordError("");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT */}

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

          <h2 className="login-visual-title">
            Smart Virtual Try-On
          </h2>

          <p className="login-visual-desc">
            Try outfits virtually and make smarter
            fashion decisions without guesswork.
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="login-form-side">

        <img
          src={logo}
          alt="Smart Store logo"
          className="login-logo"
        />

        <h1 className="login-title">
          Welcome Back!
        </h1>

        <p className="login-subtitle">
          Sign in to continue your Smart store journey.
        </p>

        <form
          className="login-form"
          onSubmit={handleLogin}
          noValidate
        >

          {/* EMAIL */}

          <div className="login-field">

            <label>
              Email *
            </label>

            <div
              className={`login-input-wrap ${
                emailError
                  ? "login-input-error"
                  : ""
              }`}
            >

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666666"
                strokeWidth="1.7"
              >

                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />

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
                onChange={handleEmailChange}
              />

              {emailError && (
                <span className="login-error-icon">
                  !
                </span>
              )}

            </div>

            {emailError && (
              <div className="login-error-message">

                <span>
                  {emailError}
                </span>

                <span className="login-error-small-icon">
                  !
                </span>

              </div>
            )}

          </div>

          {/* PASSWORD */}

          <div className="login-field">

            <label>
              Password
            </label>

            <div
              className={`login-input-wrap ${
                passwordError
                  ? "login-input-error"
                  : ""
              }`}
            >

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666666"
                strokeWidth="1.7"
              >

                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="10"
                  rx="2"
                />

                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={handlePasswordChange}
              />

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666666"
                strokeWidth="1.7"
                className="login-eye-icon"
              >

                <path
                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />

              </svg>

            </div>

            <div className="password-bottom-row">

              {passwordError ? (
                <div className="login-error-message password-error">

                  <span>
                    {passwordError}
                  </span>

                  <span className="login-error-small-icon">
                    !
                  </span>

                </div>
              ) : (
                <div />
              )}

              <Link
                to="/forgot-password"
                className="login-forgot"
              >
                Forgot Password?
              </Link>

            </div>

          </div>

          {/* LOGIN */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Login"}
          </button>

          {/* DIVIDER */}

          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* GOOGLE */}

          <button
            type="button"
            className="login-google-btn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
            >
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
                d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35 27 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
              />

              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C41.9 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-3.5z"
              />
            </svg>

            Sign in with Google

          </button>

          {/* SIGN UP */}

          <p className="login-signup-text">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="login-signup-link"
            >
              Sign Up
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;