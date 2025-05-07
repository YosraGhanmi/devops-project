"use client";
import "../styles/ProductItem.css";

function ProductItem({ product, deleteProduct, editProduct }) {
  console.log(product.id);
  return (
    <div className="product-item">
      {/*<div className="product-image-container">
        {product.image.startsWith("data:") ? (
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <img
            src={product.image || "/placeholder.svg?height=150&width=150"}
            alt={product.name}
            className="product-image"
          />
        )}
      </div>*/}
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
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
