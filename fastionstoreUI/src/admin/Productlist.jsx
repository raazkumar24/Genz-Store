import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { deleteProduct } from "../services/productService";
import { useToast } from "../context/ToastContext";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  PackageOpen,
  Package,
} from "lucide-react";
import { Card, Badge, Button, Input } from "../components/ui";

const ProductList = () => {
  const { products, loading, error, removeProduct } = useProducts();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // search bar to search products by name
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteProduct(id);
      removeProduct(id);
      addToast("Product deleted successfully", "success");
    } catch (deleteError) {
      console.error("Error deleting product:", deleteError);
      addToast(
        "Failed to delete product. Please check API connection.",
        "error",
      );
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto pb-24">
      {/* Header Section */}
      <Card className="mb-8 md:mb-10 flex flex-col gap-4 md:gap-6 md:flex-row md:items-end md:justify-between p-5 sm:p-6 md:p-8">
        <div>
          <Badge
            variant="primary"
            className="mb-4 inline-flex items-center gap-2 px-3 py-1"
          >
            <Package size={14} />
            Inventory
          </Badge>
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Products
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Manage your store's drops.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search drops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 pl-10"
            />
          </div>

          <Button
            to="/admin/products/new"
            variant="primary"
            className="flex items-center gap-2 shrink-0"
          >
            <Plus size={20} />
            Add Drop
          </Button>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-600 flex items-center gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-lg">
            !
          </span>
          Failed to load products. API Error.
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 md:px-6 md:py-4">Product Details</th>
                <th className="px-4 py-3 md:px-6 md:py-4">Price</th>
                <th className="px-4 py-3 md:px-6 md:py-4 hidden sm:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Loading State */}
              {loading && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-[var(--color-primary)] border-gray-200"></div>
                      <span className="font-medium tracking-wide">
                        Loading drops...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State */}
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                        <PackageOpen size={40} />
                      </div>
                      <div>
                        <p
                          className="text-xl font-bold text-gray-900"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          Empty Vault
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          No products match your search.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data Rows — image aur price variant se liya kyunki root pe nahi hote */}
              {!loading &&
                filteredProducts.map((product) => {
                  // Pehla variant from which we derive image and price
                  const firstVariant = product.variants?.[0];
                  const displayImage = firstVariant?.images?.[0] || null;
                  const displayPrice = firstVariant?.price ?? null;
                  const salePrice = firstVariant?.isSale
                    ? firstVariant?.salePrice
                    : null;
                  const totalStock = (product.variants || []).reduce(
                    (sum, v) => sum + (v.stock || 0),
                    0,
                  );

                  return (
                    <tr
                      key={product._id}
                      className="transition-colors hover:bg-gray-50 group"
                    >
                      <td className="px-4 py-3 md:px-6 md:py-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          {/* Image from first variant */}
                          <div className="h-14 w-14 md:h-16 md:w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-transform group-hover:shadow-md flex items-center justify-center">
                            {displayImage ? (
                              <img
                                src={displayImage}
                                alt={product.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400 text-center px-1 leading-tight">
                                No Image
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-base">
                              {product.name}
                            </p>
                            <Badge
                              variant="secondary"
                              className="mt-1 px-2 py-0.5 text-[10px]"
                            >
                              {product.category || "Apparel"}
                            </Badge>
                            {/* Variant count */}
                            <p className="mt-1 text-[10px] text-gray-400">
                              {product.variants?.length || 0} variant(s) ·
                              Stock: {totalStock}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 font-semibold text-gray-900">
                        {/* Price from first variant */}
                        {displayPrice !== null ? (
                          <>
                            <div className="text-lg">₹{displayPrice}</div>
                            {salePrice && (
                              <div className="text-xs text-red-500 font-bold">
                                Sale: ₹{salePrice}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            No variants
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 hidden sm:table-cell">
                        <Badge
                          variant={totalStock > 0 ? "success" : "error"}
                          className="px-2 py-1 flex items-center gap-1 w-fit"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${totalStock > 0 ? "bg-green-500" : "bg-red-500"}`}
                          ></span>
                          {totalStock > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            to={`/admin/products/edit/${product._id}`}
                            variant="outline"
                            size="sm"
                            title="Edit Product"
                            className="px-2 py-2"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
