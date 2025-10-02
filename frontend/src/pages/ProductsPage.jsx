import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

// A reusable banner component for the top of the page
const PageHeader = ({ title, subtitle }) => (
    <div className="bg-light text-center" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
      <div className="container">
        <h1 className="display-4">{title}</h1>
        <p className="lead text-muted">{subtitle}</p>
      </div>
    </div>
  );

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = ['Vegetable', 'Fruit',];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // This sends the search term and category to the backend API
        const { data } = await axios.get(`http://localhost:5000/api/products?keyword=${searchTerm}&category=${selectedCategory}`);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    // We add a small delay (debounce) to the search to prevent too many API calls while typing
    const searchTimeout = setTimeout(() => {
        fetchProducts();
    }, 300); // 300ms delay

    return () => clearTimeout(searchTimeout); // Cleanup the timeout
  }, [searchTerm, selectedCategory]); // This effect re-runs whenever the search term or category changes

  return (
    <>
      <Navbar />
      <PageHeader title="Our Marketplace" subtitle="Browse fresh, high-quality produce direct from our community of farmers." />
      
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>

        {/* Search and Filter Controls in their own card */}
        <div className="card shadow-sm mb-5">
            <div className="card-body">
                <div className="row g-3 align-items-center">
                    <div className="col-lg-8">
                        <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search for products by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4">
                        <select 
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                        <option value="">Filter by Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="row">
            {products.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="fas fa-search fa-4x text-muted mb-3"></i>
                <h3 className="text-muted">No Products Found</h3>
                <p className="text-muted">We couldn't find any products matching your criteria. Try a different search or filter.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <Link to={`/products/${product._id}`} className="card product-card h-100 shadow-sm text-decoration-none border-0">
                    <img src={`http://localhost:5000/${product.image.replace(/\\/g, '/')}`} className="card-img-top product-img" alt={product.name} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="product-title text-dark">{product.name}</h5>
                      <p className="card-text text-muted small text-truncate flex-grow-1">{product.description}</p>
                      <div className="mt-auto">
                        <p className="product-price mb-2 text-dark fw-bold">{product.quantity} {product.unit} available</p>
                        <div className="text-muted small">
                          <i className="fas fa-user me-2"></i>{product.farmer?.name}
                        </div>
                      </div>
                    </div>
                  </Link>
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

