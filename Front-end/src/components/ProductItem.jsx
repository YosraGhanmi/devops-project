"use client";
import "../styles/ProductItem.css";

function ProductItem({ product, deleteProduct, editProduct }) {
  return (
    <div className="product-item">
      <img
        src={product.imageUrl || "/placeholder.svg"}
        alt={product.name}
        className="product-image"
      />
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-actions">
          <button className="edit-button" onClick={() => editProduct(product)}>
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => deleteProduct(product.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
