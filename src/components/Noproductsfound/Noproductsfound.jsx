import { SearchX, X } from "lucide-react";
import "./NoProductsFound.css";

/**
 * NoProductsFound
 *
 * Props:
 * - activeFilters: Array<{ key: string, label: string, value: string }>
 *     e.g. [{ key: "category", label: "Category", value: "Women" },
 *           { key: "size", label: "Size", value: "L" },
 *           { key: "rating", label: "Rating", value: "5 Stars" }]
 * - onRemoveFilter: (key: string) => void   // called when the user clicks the x on a chip
 * - onResetAll: () => void                  // called on "Reset All Filters"
 * - onBrowseAll: () => void                 // called on "Browse All Products"
 */
function NoProductsFound({
  activeFilters = [],
  onRemoveFilter,
  onResetAll,
  onBrowseAll,
}) {
  return (
    <div className="no-products">
      <button type="button" className="no-products-filter-icon" aria-hidden="true" tabIndex={-1}>
        <SearchX size={18} />
      </button>

      <div className="no-products-icon-circle">
        <SearchX size={32} />
      </div>

      <h2 className="no-products-title">No Products found</h2>
      <p className="no-products-subtitle">
        We couldn't find any products matching your current filters.
        <br />
        Try adjusting your search criteria.
      </p>

      {activeFilters.length > 0 && (
        <div className="no-products-active-filters">
          <span className="no-products-active-label">Active Filters</span>

          <div className="no-products-chips">
            {activeFilters.map((filter) => (
              <span key={filter.key} className="no-products-chip">
                {filter.label} <strong>{filter.value}</strong>
                <button
                  type="button"
                  className="no-products-chip-remove"
                  onClick={() => onRemoveFilter?.(filter.key)}
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="no-products-actions">
        <button type="button" className="no-products-reset-btn" onClick={onResetAll}>
          Reset All Filters
        </button>
        <button type="button" className="no-products-browse-btn" onClick={onBrowseAll}>
          Browse All Products
        </button>
      </div>

      <p className="no-products-help">Need Help? Try using fewer filters or broader search terms</p>
    </div>
  );
}

export default NoProductsFound;