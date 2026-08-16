import { useEffect, useState } from "react";
import "./CategoriesNav.css";
import { Link, useSearchParams, useLocation } from "react-router-dom";

function CategoriesNav() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isOnProductsPage = location.pathname === "/products";
  const activeCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          "https://tryha.runasp.net/api/Categories"
        );

        const data = await response.json();

        console.log("Categories:", data);

        if (data.succeeded) {
          setCategories(data.data);
        }
      } catch (error) {
        console.log("Categories Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  if (loading) {
    return (
      <nav className="categories-nav">
        <span className="category">Loading...</span>
      </nav>
    );
  }

  return (
    <nav className="categories-nav">
      {/* All Products */}
      <Link
        to="/products"
        className={`category ${
          isOnProductsPage && !activeCategoryId ? "active" : ""
        }`}
      >
        <span className="category-text">All Products</span>
      </Link>

      {/* API Categories */}
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/products?categoryId=${category.id}`}
          className={`category ${
            isOnProductsPage && activeCategoryId === String(category.id)
              ? "active"
              : ""
          }`}
        >
          <span className="category-text">
            {category.name}
          </span>
        </Link>
      ))}
    </nav>
  );
}

export default CategoriesNav;