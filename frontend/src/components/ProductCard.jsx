import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const imageUrl = `http://localhost:5000/${product.image.replace(/\\/g, '/')}`;

  return (
    // The entire card is wrapped in a Link component.
    // The link is dynamic, using the product's unique ID.
    <Link to={`/products/${product._id}`} className="card product-card h-100 shadow-sm text-decoration-none">
      <img src={imageUrl} className="card-img-top product-img" alt={product.name} />
      <div className="card-body d-flex flex-column">
        <h5 className="product-title text-dark">{product.name}</h5>
        <p className="card-text text-muted small text-truncate">{product.description}</p>
        
        {/* The mt-auto class pushes this block to the bottom of the card */}
        <div className="mt-auto">
          <p className="product-price mb-2 text-dark">{product.quantity} {product.unit} available</p>
          
          {/* Farmer details are now included */}
          <div className="text-muted small">
            <i className="fas fa-user me-2"></i>
            {/* Optional chaining (?.) is a safety check in case farmer data is missing */}
            {product.farmer?.name}
          </div>
          <div className="text-muted small">
            <i className="fas fa-map-marker-alt me-2"></i>
            {product.farmer?.place}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

