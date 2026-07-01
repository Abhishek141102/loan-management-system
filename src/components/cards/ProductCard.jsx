import React from "react";

function ProductCard({ image, name, price, status }) {
  return (
    <div className="product-admin-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{price}</p>
      <span className={`status ${status}`}>{status}</span>
    </div>
  );
}

export default ProductCard;