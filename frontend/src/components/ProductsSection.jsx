// src/components/ProductsSection.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        // We take only the first 4 products to "feature" them
        setProducts(data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="section-padding bg-light">
      <div className="container">
        <div className="section-title">
          <h2>Featured Products</h2>
          <p>Fresh from our partner farms to your table</p>
        </div>
        <div className="row">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            products.map((product) => (
              <div className="col-lg-3 col-md-6 mb-4" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-4">
          {/* This button now correctly links to the All Products page */}
          <Link to="/products" className="btn btn-primary">View All Products</Link>
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;