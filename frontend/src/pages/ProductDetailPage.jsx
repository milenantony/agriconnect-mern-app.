import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';

function ProductDetailPage() {
  const { id: productId } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
        <>
            <Navbar />
            <div className="container text-center" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
                <h2 className="display-4">Product Not Found</h2>
                <p className="lead">We couldn't find the product you were looking for.</p>
                <Link to="/products" className="btn btn-primary mt-3">Back to All Products</Link>
            </div>
            <Footer />
        </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-light">
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          {/* Breadcrumb Navigation */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="card shadow-sm border-0">
            <div className="card-body p-lg-5">
              <div className="row">
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <img 
                    src={`http://localhost:5000/${product.image.replace(/\\/g, '/')}`} 
                    alt={product.name} 
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-lg-6">
                  <h1 className="display-4">{product.name}</h1>
                  <p className="lead text-success fw-bold">{product.category}</p>
                  <p className="text-muted">{product.description}</p>
                  
                  <div className="bg-light p-3 rounded my-4">
                    <h3 className="mb-0">{product.quantity} {product.unit} <span className="fs-5 text-muted">available</span></h3>
                  </div>
                  
                  <div className="card mt-4 border-0 bg-white">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Sold By</h5>
                        <div className="d-flex align-items-center">
                            <img 
                                src={product.farmer.profileImage ? `http://localhost:5000/${product.farmer.profileImage.replace(/\\/g, '/')}` : `https://ui-avatars.com/api/?name=${product.farmer.name}&background=random`} 
                                alt={product.farmer.name}
                                className="rounded-circle me-3"
                                style={{width: '60px', height: '60px', objectFit: 'cover'}}
                            />
                            <div>
                                <h6 className="mb-0">{product.farmer.name}</h6>
                                <p className="card-text text-muted mb-0">
                                  <i className="fas fa-map-marker-alt me-1"></i> {product.farmer.place}
                                </p>
                            </div>
                        </div>
                      </div>
                  </div>
                   <Link to="/products" className="btn btn-outline-secondary mt-4">
                     <i className="fas fa-arrow-left me-2"></i>Back to Products
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetailPage;

