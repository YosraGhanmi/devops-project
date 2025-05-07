import { useState } from "react";
import "./App.css";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

function App() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      description: "High-quality wireless headphones with noise cancellation",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Smartphone",
      price: 699.99,
      description:
        "Latest model with high-resolution camera and fast processor",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Laptop",
      price: 1299.99,
      description: "Powerful laptop for work and gaming",
      imageUrl: "https://via.placeholder.com/150",
    },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const updateProduct = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditingProduct(null);
  };

  const editProduct = (product) => {
    setEditingProduct(product);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Simple E-Commerce Store</h1>
      </header>
      <main className="app-main">
        <section className="form-section">
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <ProductForm
            addProduct={addProduct}
            updateProduct={updateProduct}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
          />
        </section>
        <section className="products-section">
          <h2>Products</h2>
          <ProductList
            products={products}
            deleteProduct={deleteProduct}
            editProduct={editProduct}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
