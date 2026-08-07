import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, Badge, Button } from "../components/ui";

const Dashboard = () => {
  // Access global products state to show stats
  const { products, loading, error } = useProducts();

  // Compute basic statistics for the dashboard
  const stats = useMemo(() => {
    const totalProducts = products?.length || 0;

    // Mocking total value for display purposes
    const inventoryValue =
      products?.reduce(
        (acc, curr) => acc + (curr.variants?.[0]?.price || 0),
        0,
      ) || 0;

    return {
      totalProducts,
      totalOrders: 0, // Placeholder as there's no order context yet
      revenue: inventoryValue * 3.5, // Mock revenue based on inventory
    };
  }, [products]);

  return (
    //get layout from admin
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto pb-24 min-w-0">
      {/* Dashboard Header */}
      <Card className="mb-10 flex flex-col gap-4 md:gap-6 md:flex-row md:items-end md:justify-between p-5 sm:p-6 md:p-8">
        <div>
          <Badge
            variant="primary"
            className="mb-4 inline-flex items-center gap-2 px-3 py-1"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            Admin Control
          </Badge>
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Manage your inventory, track drops, and oversee revenue.
          </p>
        </div>
        <div className="mt-4 md:mt-0 shrink-0">
          <Button
            to="/admin/products/new"
            variant="primary"
            className="flex items-center gap-2"
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Add New Drop
          </Button>
        </div>
      </Card>

      {/* Error State Banner */}
      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-600 flex items-center gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-lg">
            !
          </span>
          System Malfunction: Data Load Error. Please check the API.
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {/* 1. Products Card */}
        <Card className="group p-5 md:p-6 hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <Package size={24} />
            </div>
            <Badge
              variant="secondary"
              className="px-2 py-1 flex items-center gap-1"
            >
              <TrendingUp size={12} />
              Active
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Products
            </p>
            <h3
              className="text-3xl font-bold text-gray-900 mt-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats.totalProducts
              )}
            </h3>
          </div>
        </Card>

        {/* 2. Orders Card */}
        <Card className="group p-5 md:p-6 hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <ShoppingBag size={24} />
            </div>
            <Badge variant="secondary" className="px-2 py-1">
              This Month
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Orders
            </p>
            <h3
              className="text-3xl font-bold text-gray-900 mt-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {stats.totalOrders}
            </h3>
          </div>
        </Card>

        {/* 3. Revenue Card (Mock) */}
        <Card className="group p-5 md:p-6 hover:-translate-y-1 transition-transform sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-500">
              <IndianRupee size={24} />
            </div>
            <Badge
              variant="success"
              className="px-2 py-1 flex items-center gap-1"
            >
              <TrendingUp size={12} />
              +12%
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Est. Revenue
            </p>
            <h3
              className="text-3xl font-bold text-gray-900 mt-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ₹
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats.revenue.toLocaleString("en-IN")
              )}
            </h3>
          </div>
        </Card>
      </div>

      {/* Quick Access Section */}
      <Card className="p-5 md:p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h3
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Recent Drops
          </h3>
          <Button to="/admin/products" variant="secondary" size="sm">
            View All
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="py-10 text-center text-sm font-medium text-gray-400 animate-pulse">
              Loading Inventory...
            </div>
          ) : products?.length > 0 ? (
            products.slice(0, 4).map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between gap-2 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-gray-50 p-4 group transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 group-hover:shadow-sm transition-all flex items-center justify-center">
                    {product.variants?.[0]?.images?.[0] ? (
                      <img
                        src={product.variants[0].images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400 text-center px-1 leading-tight">
                        No Image
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-base sm:text-lg md:text-xl truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold text-[var(--color-primary)]">
                        ₹{product.variants?.[0]?.price ?? "N/A"}
                      </span>
                      <Badge
                        variant="secondary"
                        className="px-2 py-0.5 text-[10px]"
                      >
                        {product.category || "Apparel"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  to={`/admin/products/edit/${product._id}`}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  Edit
                </Button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <span className="text-4xl inline-block mb-4 text-gray-300">
                📦
              </span>
              <p className="text-sm font-medium text-gray-500">
                No products found. Start dropping heat!
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
