import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyAccountPage.css";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";

function MyAccountPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tryha.runasp.net/api/ClientProfile/get/client/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(data);

      if (data.succeeded) {
        setProfile(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!profile) {
    return (
      <div className="profile-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="myaccount-page">

      {/* Sidebar */}

     <ProfileSidebar />

      {/* Main */}

      <section className="profile-content">

        <div className="profile-card">

          <div className="profile-header">

            {profile.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt={profile.fullName}
                className="profile-image"
              />
            ) : (
              <div className="profile-avatar">
                {profile.fullName.charAt(0)}
              </div>
            )}

            <h2>{profile.fullName}</h2>

            <p>{profile.email}</p>

          </div>

          <div className="profile-form">

            <div className="form-group full">

              <label>Full Name</label>

              <input
                type="text"
                value={profile.fullName}
                readOnly
              />

            </div>

            <div className="form-group">

              <label>Phone Number</label>

              <input
                type="text"
                value={profile.phoneNumber}
                readOnly
              />

            </div>

            <div className="form-group">

              <label>Email</label>

              <input
                type="text"
                value={profile.email}
                readOnly
              />

            </div>

          </div>

          <div className="edit-btn-wrap">

           <button
  className="edit-profile-btn"
  onClick={() => navigate("/edit-profile")}
>
  Edit Profile
</button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default MyAccountPage;