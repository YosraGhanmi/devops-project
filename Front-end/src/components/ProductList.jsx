import ProductItem from "./ProductItem";
import "../styles/ProductList.css";

function ProductList({ products, deleteProduct, editProduct }) {
  if (products.length === 0) {
    return (
      <p className="no-products">No products available. Add some products!</p>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          deleteProduct={deleteProduct}
          editProduct={editProduct}
        />
      ))}
    </div>
  );
}

export default ProductList;
