import {
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  MessageCircle,
} from "lucide-react";

import Footer from "../components/Footer/Footer";

import "./ContactUsPage.css";

function ContactUsPage() {
  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Your message has been submitted successfully!");

    e.target.reset();
  };

  return (
    <div className="contact-page">

      {/* ================= NAVBAR ================= */}
      <header className="contact-navbar">
        <div className="contact-navbar-inner">

          <div className="contact-logo">
            <span className="contact-logo-icon">✣</span>
            <span>Smart Store</span>
          </div>

          <div className="contact-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search on Tryha..."
            />

            <span className="search-right-icon">♧</span>
          </div>

          <div className="contact-navbar-icons">
            <span>♧</span>
            <span>♡</span>
            <span>🛒</span>
            <span>♙</span>
          </div>

        </div>
      </header>


      {/* ================= CONTACT CONTENT ================= */}
      <main className="contact-content">

        <div className="contact-heading">

          <h1>Contact Us</h1>

          <p>
            We're here to help you find your perfect fit. Reach out to our
            dedicated team
            <br />
            for assistance.
          </p>

        </div>


        <div className="contact-main">

          {/* ================= LEFT ================= */}
          <div className="contact-info">

            <div className="contact-info-card">

              <Mail className="contact-card-icon" />

              <div>
                <h3>Email Us</h3>
                <p>tryha@gmail.com</p>
              </div>

            </div>


            <div className="contact-info-card">

              <Phone className="contact-card-icon" />

              <div>
                <h3>Call Us</h3>
                <p>01234567890</p>
              </div>

            </div>


            <div className="contact-info-card">

              <MapPin className="contact-card-icon" />

              <div>
                <h3>Our location</h3>
                <p>12 Nile Road, Cairo</p>
              </div>

            </div>


            <div className="contact-info-card contact-hours-card">

              <Clock className="contact-card-icon" />

              <div>
                <h3>Support Hours</h3>

                <p>
                  Saturday - Thursday: 9 AM - 6 PM (Egypt Time)
                  <br />
                  Friday: Closed
                </p>
              </div>

            </div>

          </div>


          {/* ================= FORM ================= */}
          <div className="contact-form-card">

            <h2>Send Us a Message</h2>

            <p className="contact-form-description">
              Fill out the form below and we will get back to you as soon as
              possible.
            </p>


            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div className="contact-form-group">

                <label>Name</label>

                <div className="contact-input-wrapper">

                  <User size={17} />

                  <input
                    type="text"
                    placeholder="Enter your Name"
                    required
                  />

                </div>

              </div>


              {/* Email */}
              <div className="contact-form-group">

                <label>Email</label>

                <div className="contact-input-wrapper">

                  <Mail size={17} />

                  <input
                    type="email"
                    placeholder="Enter your Email"
                    required
                  />

                </div>

              </div>


              {/* Message */}
              <div className="contact-form-group">

                <label>Message</label>

                <div className="contact-input-wrapper contact-textarea-wrapper">

                  <MessageCircle size={17} />

                  <textarea
                    placeholder="Tell us how we can help..."
                    rows={5}
                    required
                  />

                </div>

              </div>


              <button
                type="submit"
                className="contact-submit-btn"
              >
                Submit Message
              </button>

            </form>

          </div>

        </div>

      </main>


      {/* ================= EXISTING FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default ContactUsPage;