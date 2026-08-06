import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchAllProducts } from "../services/productService";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProducts();
      setProducts(data);
      setError(null);
    } catch (productError) {
      console.error("Products load karne me error:", productError);
      setError(productError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Add new product locally after creation
  const addProduct = (newProduct) => {
    setProducts((currentProducts) => [...currentProducts, newProduct]);
  };

  // Update ke baad product list me same product ko replace kar dete hain.
  const replaceProduct = (updatedProduct) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  // Delete ke baad UI se product ko turant remove kar dete hain.
  const removeProduct = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product._id !== productId)
    );
  };

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refreshProducts: loadProducts,
      addProduct,
      replaceProduct,
      removeProduct,
      getProductById: (productId) => products.find((product) => product._id === productId),
    }),
    [products, loading, error]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }

  return context;
};
