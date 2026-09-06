import React, { useState, useEffect, useCallback } from "react";
import { ProductContext } from "./ProductContext";
import { fetchAllProducts } from "../services/productService";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to load products from API:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getProductById = useCallback(
    (id) => {
      if (!id) return null;
      return products.find(
        (p) => String(p._id) === String(id) || String(p.id) === String(id)
      ) || null;
    },
    [products]
  );

  const addProduct = useCallback((newProduct) => {
    if (!newProduct) return;
    setProducts((prev) => [
      newProduct,
      ...prev.filter((p) => String(p._id) !== String(newProduct._id)),
    ]);
  }, []);

  const replaceProduct = useCallback((updatedProduct) => {
    if (!updatedProduct) return;
    setProducts((prev) =>
      prev.map((p) =>
        String(p._id) === String(updatedProduct._id) || String(p.id) === String(updatedProduct._id)
          ? updatedProduct
          : p
      )
    );
  }, []);

  const removeProduct = useCallback((id) => {
    if (!id) return;
    setProducts((prev) =>
      prev.filter((p) => String(p._id) !== String(id) && String(p.id) !== String(id))
    );
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        loading,
        error,
        getProductById,
        addProduct,
        replaceProduct,
        removeProduct,
        refetch: loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};