import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Mail, MessageCircle, User, X } from "lucide-react";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import Toast from "../components/Toast/Toast";
import "./Helpsupportpage.css";

// محتوى الأسئلة الشائعة ثابت (مفيش API لسه للـ FAQ) —
// سهل تضيف/تعدل/تشيل أسئلة من هنا.
const FAQ_ITEMS = [
  {
    id: 1,
    category: "Orders",
    question: "How can I track my order?",
    answer:
      'Go to My Orders from your account sidebar, open the order you want to track, and click "Order Status" to see its current stage.',
  },
  {
    id: 2,
    category: "Orders",
    question: "Can I cancel or modify my order?",
    answer:
      "You can cancel an order from its details page as long as it hasn't been shipped yet. Once an order is shipped, it can no longer be cancelled or modified.",
  },
  {
    id: 3,
    category: "Shipping",
    question: "What are the shipping options available?",
    answer:
      "We offer Standard Delivery (3-5 days) and Express Delivery (1-3 days). You can choose your preferred option during checkout.",
  },
  {
    id: 4,
    category: "Shipping",
    question: "Do you ship internationally?",
    answer:
      "Currently we only ship within Egypt. International shipping isn't available yet, but we're working on expanding soon.",
  },
  {
    id: 5,
    category: "Payment",
    question: "What payment methods do you accept?",
    answer:
      "We currently support Cash on Delivery and Card payments. More payment options will be added soon.",
  },
  {
    id: 6,
    category: "Returns",
    question: "What is your return policy?",
    answer:
      "Items can be returned within 14 days of delivery as long as they're unused and in their original packaging.",
  },
  {
    id: 7,
    category: "Returns",
    question: "How do I initiate a return?",
    answer:
      "Go to My Returns from your account sidebar and follow the steps to start a return request for your order.",
  },
  {
    id: 8,
    category: "Account",
    question: "How do I reset my password?",
    answer:
      'Go to Change Password from your account sidebar. If you\'re logged out, use the "Forgot Password" link on the login page instead.',
  },
];

function HelpSupportPage() {
  const [openId, setOpenId] = useState(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [toast, setToast] = useState({ show: false, message: "" });
  const triggerToast = (message) => setToast({ show: true, message });

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!contactName || !contactEmail || !contactMessage) {
      alert("Please fill in all the fields.");
      return;
    }

    // مفيش API لإرسال رسالة الدعم لسه، فبنفتح تطبيق الإيميل
    // بالبيانات جاهزة بدل ما نبعتها لسيرفر.
    const subject = `Support request from ${contactName}`;
    const body = `Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`;

    window.location.href = `mailto:support@smartstore.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setShowEmailModal(false);

    triggerToast("Opening your email app...");
  };

  return (
    <div className="support-page">
      <ProfileSidebar />

      <div className="support-content">
        <div className="support-inner">
          <h1>Helps & Support</h1>

          <div className="support-card">
            <h2>Frequently Asked Question</h2>

            <div className="faq-list">
              {FAQ_ITEMS.map((item) => {
                const isOpen = openId === item.id;

                return (
                  <div
                    className={`faq-item ${isOpen ? "open" : ""}`}
                    key={item.id}
                  >
                    <button
                      type="button"
                      className="faq-question-row"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="faq-question-text">
                        <span className="faq-category">{item.category}</span>
                        <span className="faq-question">{item.question}</span>
                      </div>

                      <ChevronDown size={18} className="faq-chevron" />
                    </button>

                    {isOpen && (
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="support-cta">
              <div className="support-cta-text">
                <h3>Still need help?</h3>
                <p>
                  Our support team is here to assist you with any questions or
                  concerns.
                </p>
              </div>

              <div className="support-cta-buttons">
                <button
                  type="button"
                  className="support-cta-btn email-btn"
                  onClick={() => setShowEmailModal(true)}
                >
                  <Mail size={16} />
                  Email Us
                </button>

                <Link to="/contact-us" className="support-cta-btn contact-btn">
                  <MessageCircle size={16} />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <div className="email-modal-overlay" onClick={closeEmailModal}>
          <div className="email-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="email-modal-close"
              onClick={closeEmailModal}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h3>Have a question or need assistance?</h3>

            <p className="email-modal-subtitle">
              Fill out the form below, and our support team will respond to the
              email address you provide as soon as possible.
            </p>

            <form onSubmit={handleContactSubmit}>
              <div className="email-form-group">
                <label>Name</label>

                <div className="email-input-wrap">
                  <User size={16} className="email-input-icon" />

                  <input
                    type="text"
                    placeholder="Enter your Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
              </div>

              <div className="email-form-group">
                <label>Email</label>

                <div className="email-input-wrap">
                  <Mail size={16} className="email-input-icon" />

                  <input
                    type="email"
                    placeholder="Enter your Email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="email-form-group">
                <label>Message</label>

                <div className="email-input-wrap textarea-wrap">
                  <MessageCircle size={16} className="email-input-icon" />

                  <textarea
                    placeholder="Enter your Message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <button type="submit" className="email-submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}

export default HelpSupportPage;