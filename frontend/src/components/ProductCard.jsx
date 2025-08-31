// src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// It now receives a full 'product' object from our database
function ProductCard({ product }) {
  // We construct the image URL based on our backend server address
  const imageUrl = `http://localhost:5000/${product.image.replace(/\\/g, '/')}`;

  return (
    <div className="card product-card h-100 shadow-sm">
      <img src={imageUrl} className="card-img-top product-img" alt={product.name} />
      <div className="card-body d-flex flex-column">
        <h5 className="product-title">{product.name}</h5>
        <p className="card-text text-muted small">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="product-price">{product.quantity} {product.unit}</span>
          {/* This button now links to the main products page */}
          <Link to="/products" className="btn btn-sm btn-primary">View Product</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;