import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import User from "./pages/User";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import ProductList from "./admin/Productlist"; // Name matching case check kar lijiye page folder se
import ProductEdit from "./admin/ProductEdit";
import NotFound from "./pages/NotFound";
import Collection from "./pages/Collection";
import Dashboard from "./admin/Dashboard";
import AdminLayout from "./admin/AdminLayout";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import "./App.css";

import NewArrivals from "./pages/NewArrivals";
import Sale from "./pages/Sale";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import { useLocation } from "react-router-dom";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAdminRoute && (
        <div className="sticky top-0 z-50 shrink-0">
          <Navbar />
        </div>
      )}
      <main className={`flex-grow ${isAdminRoute ? 'h-screen overflow-hidden' : 'min-h-[90vh]'}`}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/collections/:collectionName" element={<Collection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<User />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* 🛡️ FIXED ADMIN ROUTES: Using AdminLayout for Sidebar & Topbar UI */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductEdit />} />
              <Route path="products/edit/:productId" element={<ProductEdit />} />
              <Route path="*" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </ToastProvider>
  );
}

export default App;
