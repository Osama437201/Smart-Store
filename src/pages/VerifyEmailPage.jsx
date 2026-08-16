import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Signuppage.css";
import "./VerifyEmailPage.css";

import logo from "../assets/logo.svg";
import illustration from "../assets/login-illustration.png";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // جاي من صفحة الـ SignUp عن طريق navigate("/verify-email", { state: { email } })
  const email = location.state?.email || "";
  const userId = location.state?.userId || "";

  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const focusInput = (index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleChange = (index, value) => {
    // نسمح برقم واحد بس
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;

    const newCode = Array(CODE_LENGTH).fill("");
    pasted
      .slice(0, CODE_LENGTH)
      .split("")
      .forEach((digit, i) => (newCode[i] = digit));
    setCode(newCode);

    const nextIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    focusInput(nextIndex);
  };

const handleVerify = async (e) => {
  e.preventDefault();

  const otp = code.join("");

  if (otp.length !== 6) {
    alert("Please enter the 6-digit code.");
    return;
  }

  console.log("UserId:", userId);
  console.log("OTP:", otp);

  try {
    const response = await fetch(
      "https://tryha.runasp.net/api/Account/confirm-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          otp,
        }),
      }
    );

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);

    if (response.ok && data.succeeded) {
      alert("Email verified successfully.");

      navigate("/login");
    } else {
      alert(
        data.message ||
        (data.errors ? data.errors.join("\n") : "Verification failed.")
      );
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
};

  const handleResend = async () => {
    if (secondsLeft > 0) return;

    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/Account/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
          }),
        },
      );

      const data = await response.json();

      console.log(data);

      if (data.succeeded) {
        alert("Verification code sent successfully.");
        setSecondsLeft(RESEND_SECONDS);
      } else {
        alert(data.message || "Failed to resend code.");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
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
            Try outfits virtually and make smarter fashion
            <br /> decisions without guesswork.
          </p>
        </div>
      </div>

      <div className="verify-form-side">
        <button
          type="button"
          className="verify-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          &#8592;
        </button>

        <div className="verify-content">
          <img src={logo} alt="logo" className="verify-logo" />

          <h1 className="verify-title">Verification Code</h1>

          <p className="verify-subtitle">
            Enter the 6-digit code sent to your email
            <br />
            or phone number.
          </p>

          <form className="verify-form" onSubmit={handleVerify}>
            <label className="verify-label">Enter Verification Code</label>

            <div className="verify-otp-wrap" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="verify-otp-input"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>

            <button type="submit" className="signup-btn verify-btn">
              Verify
            </button>

            <p className="verify-resend-text">
              Don't receive a code?{" "}
              {secondsLeft > 0 ? (
                <span className="verify-resend-timer">
                  Resend in {secondsLeft}s
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

export default VerifyEmailPage;
