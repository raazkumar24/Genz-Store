import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import User from "./pages/User";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import ProductList from "./admin/Productlist";
import ProductEdit from "./admin/ProductEdit";
import CollectionsEdit from "./admin/CollectionsEdit";
import NotFound from "./pages/NotFound";
import Collection from "./pages/Collection";
import Dashboard from "./admin/Dashboard";
import AdminLayout from "./admin/AdminLayout";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import "./App.css";

import NewArrivals from "./pages/NewArrivals";
import Sale from "./pages/Sale";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
};

function AnimatedRouteWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] selection:bg-[var(--color-primary)] selection:text-white">
      <ScrollToTop />
      {!isAdminRoute && (
        <div className="sticky top-0 z-50 shrink-0">
          <Navbar />
        </div>
      )}
      <main className={`flex-grow ${isAdminRoute ? 'h-screen overflow-hidden' : 'min-h-[90vh]'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedRouteWrapper><Home /></AnimatedRouteWrapper>} />
            <Route path="/new-arrivals" element={<AnimatedRouteWrapper><NewArrivals /></AnimatedRouteWrapper>} />
            <Route path="/sale" element={<AnimatedRouteWrapper><Sale /></AnimatedRouteWrapper>} />
            <Route path="/about" element={<AnimatedRouteWrapper><About /></AnimatedRouteWrapper>} />
            <Route path="/contact" element={<AnimatedRouteWrapper><Contact /></AnimatedRouteWrapper>} />
            <Route path="/products/:productId" element={<AnimatedRouteWrapper><ProductDetails /></AnimatedRouteWrapper>} />
            <Route path="/collections/:collectionName" element={<AnimatedRouteWrapper><Collection /></AnimatedRouteWrapper>} />
            <Route path="/login" element={<AnimatedRouteWrapper><Login /></AnimatedRouteWrapper>} />
            <Route path="/register" element={<AnimatedRouteWrapper><Register /></AnimatedRouteWrapper>} />
            <Route path="/profile" element={<AnimatedRouteWrapper><User /></AnimatedRouteWrapper>} />
            <Route path="/cart" element={<AnimatedRouteWrapper><Cart /></AnimatedRouteWrapper>} />
            <Route path="/wishlist" element={<AnimatedRouteWrapper><Wishlist /></AnimatedRouteWrapper>} />

            {/* 🛡️ ADMIN ROUTES */}
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
              <Route path="collections" element={<CollectionsEdit />} />
              <Route path="*" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<AnimatedRouteWrapper><NotFound /></AnimatedRouteWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

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
