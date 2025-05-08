"use client";

import { useState, useEffect } from "react";
import "./App.css";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import {
  fetchProducts,
  deleteProduct as deleteProductApi,
  createProduct,
  updateProduct,
} from "./api";

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new product
  const handleProductAdded = async (newProduct) => {
    await createProduct(newProduct);
    loadProducts();
  };

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProductApi(id);
      loadProducts();
    } catch (err) {
      setError(`Failed to delete product: ${err.message}`);
    }
  };

  // Update a product
  const handleProductUpdated = async (updatedProduct) => {
    await updateProduct(updatedProduct.id, updatedProduct);
    loadProducts();
  };

  // Set product to edit
  const editProduct = (product) => {
    setEditingProduct(product);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Management System</h1>
      </header>

      {error && <div className="error-alert">{error}</div>}

      <main className="app-main">
        <section className="form-section">
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <ProductForm
            addProduct={handleProductAdded}
            updateProduct={handleProductUpdated}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
          />
        </section>

        <section className="products-section">
          <h2>Products</h2>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">No products available</div>
          ) : (
            <ProductList
              products={products}
              deleteProduct={handleDeleteProduct}
              editProduct={editProduct}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
