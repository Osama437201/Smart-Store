import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard/ProductCard";
import FiltersSidebar from "../components/FiltersSidebar/FiltersSidebar";
import BackToTop from "../components/BackToTop/BackToTop";
import Footer from "../components/Footer/Footer";
import CategoriesNav from "../components/CategoriesNav/CategoriesNav";
import "./ProductsPage.css";

function getPageNumbers(current, total) {
  const pages = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}

function ProductsPage() {
  const [searchParams] = useSearchParams();

  // بنجيب categoryId من الـ URL
  const categoryIdFromUrl = searchParams.get("categoryId");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(
    categoryIdFromUrl || ""
  );

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSizeIds, setSelectedSizeIds] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 10;

  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // ==========================================
  // لما الـ category تتغير من الـ URL
  // ==========================================

  useEffect(() => {
    setSelectedCategory(categoryIdFromUrl || "");
    setPageNumber(1);
  }, [categoryIdFromUrl]);

  // ==========================================
  // Get Products
  // ==========================================

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError("");

      try {
        let url = "https://tryha.runasp.net/api/Products?";

        const params = [];

        // Category
        if (selectedCategory) {
          params.push(`CategoryId=${selectedCategory}`);
        }

        // Min Price
        if (minPrice) {
          params.push(`MinPrice=${minPrice}`);
        }

        // Max Price
        if (maxPrice) {
          params.push(`MaxPrice=${maxPrice}`);
        }

        // Sizes
        if (selectedSizeIds.length > 0) {
          selectedSizeIds.forEach((id) => {
            params.push(`SizeIds=${encodeURIComponent(id)}`);
          });
        }

        // Rating
        if (selectedRating) {
          params.push(`Rating=${selectedRating}`);
        }

        // Pagination
        params.push(`PageNumber=${pageNumber}`);
        params.push(`PageSize=${pageSize}`);

        url += params.join("&");

        console.log("Products URL:", url);

        const token = localStorage.getItem("token");

        const response = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        console.log("Products Response:", data);

        if (data.succeeded) {
          setProducts(data.data.items);

          setTotalPages(data.data.totalPage);

          setHasNextPage(data.data.hasNextPage);

          setHasPreviousPage(data.data.hasPreviousPages);
        } else {
          setError(data.message || "Something went wrong.");
        }
      } catch (err) {
        console.log(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [
    selectedCategory,
    minPrice,
    maxPrice,
    selectedSizeIds,
    selectedRating,
    pageNumber,
  ]);

  // ==========================================
  // Get Categories
  // ==========================================

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          "https://tryha.runasp.net/api/Categories"
        );

        const data = await response.json();

        console.log("Categories Response:", data);

        if (data.succeeded) {
          setCategories(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getCategories();
  }, []);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <>
        <CategoriesNav />
        <div style={{ marginTop: "50px", textAlign: "center" }}>
          Loading...
        </div>
      </>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <>
        <CategoriesNav />
        <div style={{ marginTop: "50px", textAlign: "center" }}>
          {error}
        </div>
      </>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <>
    <CategoriesNav />

    <div className="products-page">

      {/* Sidebar */}

      <FiltersSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        setSelectedSizeIds={setSelectedSizeIds}
        setSelectedRating={setSelectedRating}
        setPageNumber={setPageNumber}
      />

      {/* Products */}

      <div className="products-content">

        <div className="products-header">
          <h2>All Products</h2>

          <p>{products.length} Products Found</p>
        </div>

        {products.length === 0 ? (
          <h2>No Products Found</h2>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination */}

            <div className="pagination">

              <button
                className="pagination-arrow"
                disabled={!hasPreviousPage}
                onClick={() =>
                  setPageNumber((prev) => prev - 1)
                }
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {getPageNumbers(pageNumber, totalPages).map((page, idx) =>
                page === "..." ? (
                  <span key={`dots-${idx}`} className="pagination-dots">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    className={`pagination-number ${
                      page === pageNumber ? "active" : ""
                    }`}
                    onClick={() => setPageNumber(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="pagination-arrow"
                disabled={!hasNextPage}
                onClick={() =>
                  setPageNumber((prev) => prev + 1)
                }
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>

            </div>
          </>
        )}

      </div>

    </div>

    {/* Back to top + Footer */}
    <BackToTop />
    <Footer />
    </>
  );
}

export default ProductsPage;