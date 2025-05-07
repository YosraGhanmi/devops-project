"use client";

import { useState, useEffect } from "react";
import "../styles/ProductForm.css";

function ProductForm({
  addProduct,
  updateProduct,
  editingProduct,
  setEditingProduct,
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
        imageUrl: editingProduct.imageUrl,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? Number.parseFloat(value) || "" : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    const productData = {
      ...formData,
      imageUrl: formData.imageUrl || "https://via.placeholder.com/150",
    };

    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
    } else {
      addProduct(productData);
    }

    setFormData({
      name: "",
      price: "",
      description: "",
      imageUrl: "",
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      imageUrl: "",
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price ($):</label>
        <input
          type="number"
          id="price"
          name="price"
          min="0.01"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL (optional):</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://via.placeholder.com/150"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
        {editingProduct && (
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
