import { useEffect, useState } from "react";
import { Filter, ChevronUp, ChevronDown, Minus } from "lucide-react";
import "./FiltersSidebar.css";

function FiltersSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  setMinPrice,
  setMaxPrice,
  setSelectedSizeIds,
  setSelectedRating,
  setPageNumber,
}) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [sizes, setSizes] = useState([]);

  const [selectedSizesLocal, setSelectedSizesLocal] = useState([]);
  const [selectedRatingLocal, setSelectedRatingLocal] = useState(null);

  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const [openSections, setOpenSections] = useState({
    price: true,
    category: true,
    size: true,
    reviews: true,
  });

  // ==========================================
  // Get Sizes (real API)
  // ==========================================

  useEffect(() => {
    const getSizes = async () => {
      try {
        const response = await fetch(
          "https://tryha.runasp.net/api/Sizes/get/all/sizes"
        );

        const data = await response.json();

        console.log("Sizes Response:", data);

        if (data.succeeded) {
          setSizes(data.data);
        }
      } catch (err) {
        console.log("Sizes Error:", err);
      }
    };

    getSizes();
  }, []);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSize = (sizeId) => {
    setSelectedSizesLocal((prev) =>
      prev.includes(sizeId)
        ? prev.filter((s) => s !== sizeId)
        : [...prev, sizeId]
    );
  };

  const applyFilters = () => {
    setMinPrice(min);
    setMaxPrice(max);
    setSelectedSizeIds(selectedSizesLocal);
    setSelectedRating(selectedRatingLocal);
    if (setPageNumber) setPageNumber(1);
  };

  const resetFilters = () => {
    setMin("");
    setMax("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
    setSelectedSizesLocal([]);
    setSelectedRatingLocal(null);
    setSelectedSizeIds([]);
    setSelectedRating(null);
    if (setPageNumber) setPageNumber(1);
  };

  if (!isPanelOpen) {
    return (
      <button
        type="button"
        className="sidebar-collapsed"
        onClick={() => setIsPanelOpen(true)}
        aria-label="Show filters"
      >
        <Filter size={20} />
      </button>
    );
  }

  return (
    <div className="sidebar-content">

      <div className="filters-header">
        <Filter size={18} />
        <h2>Filters</h2>

        <button
          type="button"
          className="filters-toggle-btn"
          onClick={() => setIsPanelOpen(false)}
          aria-label="Collapse filters"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* ========== Price Range ========== */}
      <div className="filter-section">
        <button
          className="section-header"
          onClick={() => toggleSection("price")}
        >
          <span>Price Range</span>
          {openSections.price ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {openSections.price && (
          <div className="price-row">
            <input
              className="price-input"
              type="number"
              placeholder="Min Price"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />

            <input
              className="price-input"
              type="number"
              placeholder="Max Price"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* ========== Category ========== */}
      <div className="filter-section">
        <button
          className="section-header"
          onClick={() => toggleSection("category")}
        >
          <span>Category</span>
          {openSections.category ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {openSections.category && (
          <div className="section-body">

            <label className="filter-option">
              <input
                type="radio"
                name="category"
                checked={!selectedCategory}
                onChange={() => setSelectedCategory("")}
              />
              ALL CATEGORIES
            </label>

            {categories.map((category) => (
              <label key={category.id} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => setSelectedCategory(category.id)}
                />
                {category.name}
              </label>
            ))}

          </div>
        )}
      </div>

      {/* ========== Size ========== */}
      <div className="filter-section">
        <button
          className="section-header"
          onClick={() => toggleSection("size")}
        >
          <span>Size</span>
          {openSections.size ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {openSections.size && (
          <div className="size-grid">
            {sizes.map((size) => (
              <label key={size.id} className="size-option">
                <input
                  type="checkbox"
                  checked={selectedSizesLocal.includes(size.id)}
                  onChange={() => toggleSize(size.id)}
                />
                {size.sizeName}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ========== Reviews ========== */}
      <div className="filter-section">
        <button
          className="section-header"
          onClick={() => toggleSection("reviews")}
        >
          <span>Reviews</span>
          {openSections.reviews ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {openSections.reviews && (
          <div className="section-body">
            {[4, 3, 2, 1].map((stars) => (
              <label key={stars} className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRatingLocal === stars}
                  onChange={() => setSelectedRatingLocal(stars)}
                />
                <span className="rating-stars">
                  {"★".repeat(stars)}
                  {"☆".repeat(5 - stars)}
                </span>
                <span className="rating-up">&nbsp;& Up</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button className="filter-btn" onClick={applyFilters}>
        Apply
      </button>

      <button className="reset-btn" onClick={resetFilters}>
        Reset Filters
      </button>

    </div>
  );
}

export default FiltersSidebar;