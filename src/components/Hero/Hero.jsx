import "./Hero.css";

// 👇 هنا مكان صورة الباكجراوند - غيّر المسار ده لصورة الهيرو بتاعتك (Bags.png)
import heroImage from "../../assets/hero-bg.jpg";

function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero-dots hero-dots-top" />
      <div className="hero-dots hero-dots-bottom" />

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">
          Discover Your
          <br /> Perfect Fashion
          <br /> Style
        </h1>
        <p className="hero-description">
          Explore our exclusive collection of premium fashion products designed
          for elegance and comfort.
        </p>
        <button className="hero-btn">
          <span className="hero-btn-text">Shop Now</span>
        </button>
      </div>

      <button className="chat-btn" aria-label="Help">
        <svg
          width="26.67"
          height="26.67"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="13.33"
            cy="13.33"
            r="12.33"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <path
            d="M10.5 10.5c0-1.6 1.3-2.8 2.9-2.8 1.5 0 2.8 1.1 2.8 2.6 0 1.3-.7 1.9-1.5 2.5-.8.6-1.3 1-1.3 2"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13.33" cy="18.3" r="0.9" fill="#FFFFFF" />
        </svg>
      </button>

      <svg
        className="hero-curve"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 60V30C240 0 1200 0 1440 30V60H0Z" fill="#FFFFFF" />
      </svg>
    </section>
  );
}

export default Hero;