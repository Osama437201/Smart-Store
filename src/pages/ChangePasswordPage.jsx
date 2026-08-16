import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import "./ChangePasswordPage.css";

function ChangePasswordPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "https://tryha.runasp.net/api/Account/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmNewPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        alert("Password Changed Successfully");
        navigate("/my-account");
      } else {
        alert(data.message || "Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setSaving(false);
  };

  return (
    <div className="change-password-page">

      <ProfileSidebar />

      <div className="change-password-content">

        <div className="change-password-card">

          <h2>Change Password</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group full">
              <label>Password</label>

              <div className="password-input-wrap">
                <Lock size={18} className="input-icon-left" />

                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter your Password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="toggle-visibility-btn"
                  onClick={() => setShowCurrent(!showCurrent)}
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="row">

              <div className="form-group">
                <label>New Password</label>

                <div className="password-input-wrap">
                  <Lock size={18} className="input-icon-left" />

                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="toggle-visibility-btn"
                    onClick={() => setShowNew(!showNew)}
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <div className="password-input-wrap">
                  <Lock size={18} className="input-icon-left" />

                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={confirmNewPassword}
                    onChange={(e) =>
                      setConfirmNewPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="toggle-visibility-btn"
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

            </div>

            <div className="button-group">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/my-account")}
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

export default ChangePasswordPage;