import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner'; // 1. Import the Spinner

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        <div className="section-title">
          <h2>All Products</h2>
          <p>Fresh from our partner farms to your table</p>
        </div>
        {loading ? (
          // 2. Use the Spinner component here
          <Spinner />
        ) : (
          <div className="row">
            {products.length === 0 ? (
              <p className="text-center">No products available at the moment.</p>
            ) : (
              products.map((product) => (
                <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div className="card product-card h-100 shadow-sm">
                    <img src={`http://localhost:5000/${product.image.replace(/\\/g, '/')}`} className="card-img-top product-img" alt={product.name} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="product-title">{product.name}</h5>
                      <p className="card-text text-muted small">{product.description}</p>
                      <div className="mt-auto">
                        <p className="product-price mb-2">{product.quantity} {product.unit} available</p>
                        <div className="text-muted small">
                          <i className="fas fa-user me-2"></i>
                          {product.farmer?.name}
                        </div>
                        <div className="text-muted small">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {product.farmer?.place}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ProductsPage;
