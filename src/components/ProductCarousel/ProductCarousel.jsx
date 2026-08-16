import { useRef } from 'react'
import './ProductCarousel.css'

function StarRating({ rating }) {
  return (
    <div className="product-rating-row">
      <div className="product-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={star <= Math.round(rating) ? '#f5a623' : 'none'}
            stroke="#f5a623"
            strokeWidth="1.5"
          >
            <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
          </svg>
        ))}
      </div>
      <span className="product-rating-value">({rating})</span>
    </div>
  )
}

function ProductCarousel({ title, products, filledHeart = false }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' })
    }
  }

  return (
    <section className="top-selling">
      <h2 className="top-selling-title">{title}</h2>

      <div className="top-selling-carousel">
        <button className="carousel-arrow carousel-arrow-left" onClick={() => scroll(-1)} aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#1a1515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="top-selling-track" ref={scrollRef}>
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-image-wrap">
                <img src={p.image} alt={p.title} className="product-image" />
                <div className="product-hover-actions">
                  <button className="product-btn product-btn-details">View Details</button>
                  <button className="product-btn product-btn-cart">Add to Cart</button>
                </div>
              </div>

              <div className="product-title-row">
                <h3 className="product-title">{p.title}</h3>
                <button className="product-favorite" aria-label="Add to wishlist">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={filledHeart ? '#d9364f' : 'none'}
                    stroke={filledHeart ? '#d9364f' : '#1a1515'}
                    strokeWidth="1.7"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6Z" />
                  </svg>
                </button>
              </div>

              <div className="product-price-row">
                <span className="product-price">${p.price}</span>
                <span className="product-old-price">${p.oldPrice}</span>
              </div>

              <StarRating rating={p.rating} />

              <div className="product-colors">
                {p.colors.map((c, i) => (
                  <span key={i} className="product-color-swatch" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-arrow carousel-arrow-right" onClick={() => scroll(1)} aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#1a1515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default ProductCarousel