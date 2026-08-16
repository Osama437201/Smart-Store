import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, X } from "lucide-react";
import "./EditProfilePage.css";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";

function EditProfilePage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [preview, setPreview] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const fileInputRef = useRef(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [rememberPermission, setRememberPermission] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await fetch(
        "https://tryha.runasp.net/api/ClientProfile/get/client/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        setFullName(data.data.fullName);
        setEmail(data.data.email);
        setPhoneNumber(data.data.phoneNumber);

        if (data.data.profileImageUrl) {
          setPreview(data.data.profileImageUrl);
        }
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChangePhotoClick = () => {
    const alreadyGranted =
      localStorage.getItem("photoAccessGranted") === "true";

    if (alreadyGranted) {
      fileInputRef.current?.click();
    } else {
      setShowPermissionModal(true);
    }
  };

  const handleAllowAccess = () => {
    if (rememberPermission) {
      localStorage.setItem("photoAccessGranted", "true");
    }

    setShowPermissionModal(false);
    fileInputRef.current?.click();
  };

  const handleNotNow = () => {
    setShowPermissionModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("FullName", fullName);
    formData.append("Email", email);
    formData.append("PhoneNumber", phoneNumber);

    if (profileImage) {
      formData.append("ProfileImage", profileImage);
    }

    try {
      setSaving(true);

      const response = await fetch(
        "https://tryha.runasp.net/api/ClientProfile/client/update/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      console.log(data);

      if (data.succeeded) {
        alert("Profile Updated Successfully");

        localStorage.setItem(
          "user",
          JSON.stringify(data.data)
        );

        navigate("/my-account");
      } else {
        alert(data.message);
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
    <div className="edit-profile-page">
    <ProfileSidebar />

    <div className="edit-profile-content">
      <div className="edit-profile-card">

        <div className="image-section">

          <div className="avatar-wrap">

            {preview ? (
              <img
                src={preview}
                alt=""
                className="profile-image"
              />
            ) : (
              <div className="profile-avatar">
                {fullName ? fullName.charAt(0).toUpperCase() : "?"}
              </div>
            )}

            <button
              type="button"
              className="camera-icon"
              onClick={handleChangePhotoClick}
            >
              <Camera size={16} />
            </button>

            <input
              id="imageUpload"
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
            />

          </div>

          <button
            type="button"
            className="change-photo"
            onClick={handleChangePhotoClick}
          >
            Change profile photo
          </button>

        </div>

        <form onSubmit={handleSubmit}>

  <div className="form-group full">
    <label>Full Name</label>

    <input
      type="text"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
    />
  </div>

  <div className="row">

    <div className="form-group">
      <label>Phone Number</label>

      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
    </div>

    <div className="form-group">
      <label>Email</label>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
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

      {showPermissionModal && (
        <div className="permission-modal-overlay" onClick={handleNotNow}>
          <div
            className="permission-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="permission-modal-close"
              onClick={handleNotNow}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h3>Allow access to change your profile photo</h3>

            <p>
              This app needs permission to access your camera or gallery to
              upload a new profile photo.
            </p>

            <label className="permission-checkbox-row">
              <input
                type="checkbox"
                checked={rememberPermission}
                onChange={(e) => setRememberPermission(e.target.checked)}
              />
              Allow the app to access your Camera and skip this step in the
              future.
            </label>

            <div className="permission-modal-actions">
              <button
                type="button"
                className="not-now-btn"
                onClick={handleNotNow}
              >
                Not now
              </button>

              <button
                type="button"
                className="allow-access-btn"
                onClick={handleAllowAccess}
              >
                Allow access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfilePage;