"use client";

import { useState, useEffect, useRef } from "react";
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
    image: "",
  });

  const fileInputRef = useRef(null);

  // When editingProduct changes, update the form data
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
        image: editingProduct.image,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        image: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? Number.parseFloat(value) || "" : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({
        ...formData,
        image: event.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.price || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    // Use default image if none provided
    const productData = {
      ...formData,
      image: formData.image || "/placeholder.svg?height=150&width=150",
    };

    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
    } else {
      addProduct(productData);
    }

    // Reset form
    setFormData({
      name: "",
      price: "",
      description: "",
      image: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      image: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        <label htmlFor="image">Product Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
        />
        {formData.image && (
          <div className="image-preview">
            <img src={formData.image || "/placeholder.svg"} alt="Preview" />
          </div>
        )}
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
