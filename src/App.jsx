import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CategoriesNav from "./components/CategoriesNav/CategoriesNav";
import Hero from "./components/Hero/Hero";
import PopularCategories from "./components/PopularCategories/PopularCategories";
import ProductCarousel from "./components/ProductCarousel/ProductCarousel";
import BackToTop from "./components/BackToTop/BackToTop";
import Footer from "./components/Footer/Footer";
import ProfileSidebar from "./components/ProfileSidebar/ProfileSidebar";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProductsPage from "./pages/ProductsPage";
import MyAccountPage from "./pages/MyAccountPage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import SavedAddressesPage from "./pages/SavedAddressesPage";
import AddAddressPage from "./pages/AddAddressPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyResetCodePage from "./pages/VerifyResetCodePage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";

import product1 from "./assets/product1.svg";
import product2 from "./assets/product2.svg";
import product3 from "./assets/product3.svg";
import product4 from "./assets/product4.svg";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import EditAddressPage from "./pages/Editaddresspage.jsx";
import HelpSupportPage from "./pages/Helpsupportpage.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";

const products = [
  {
    id: 1,
    image: product1,
    title: "Classic Blue Suit",
    price: 49.99,
    oldPrice: 59.99,
    rating: 4.8,
    colors: ["#1a1515", "#5d3a82", "#f3eefb", "#d9364f"],
  },
  {
    id: 2,
    image: product2,
    title: "Classic Blue Suit",
    price: 49.99,
    oldPrice: 59.99,
    rating: 4.8,
    colors: ["#1a1515", "#5d3a82", "#f3eefb", "#d9364f"],
  },
  {
    id: 3,
    image: product3,
    title: "Classic Blue Suit",
    price: 49.99,
    oldPrice: 59.99,
    rating: 4.8,
    colors: ["#1a1515", "#5d3a82", "#f3eefb", "#d9364f"],
  },
  {
    id: 4,
    image: product4,
    title: "Classic Blue Suit",
    price: 49.99,
    oldPrice: 59.99,
    rating: 4.8,
    colors: ["#1a1515", "#5d3a82", "#f3eefb", "#d9364f"],
  },
];

function HomePage() {
  return (
    <>
      <CategoriesNav />
      <Hero />
      <PopularCategories />
      <ProductCarousel title="Top Selling" products={products} />
      <ProductCarousel title="Recently Added Brands" products={products} />
      <ProductCarousel title="Recently Viewed" products={products} />
      <ProductCarousel
        title="Wishlist Highlights"
        products={products}
        filledHeart
      />
      <BackToTop />
      <Footer />
    </>
  );
}

function App() {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/profile",
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-reset-code",
    "/verify-email",
    "/verify-reset-code",
    "/reset-password",
    "/confirm-email",
  ];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname); // 👈 الصفحات اللي مش عايز الناف يظهر فيها

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/orders/:id/status" element={<OrderStatusPage />} />
        <Route path="/saved-addresses" element={<SavedAddressesPage />} />
        <Route path="/add-address" element={<AddAddressPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/edit-address/:id" element={<EditAddressPage />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="/support" element={<HelpSupportPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
      </Routes>
    </div>
  );
}

export default App;
