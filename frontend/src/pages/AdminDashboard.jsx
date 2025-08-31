import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner'; // 1. Import the Spinner

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.token) {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          
          const [farmersRes, productsRes] = await Promise.all([
            axios.get('http://localhost:5000/api/admin/farmers', config),
            axios.get('http://localhost:5000/api/admin/products', config)
          ]);

          setFarmers(farmersRes.data);
          setProducts(productsRes.data);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch admin data', error);
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  const lowStockProducts = products.filter(p => p.quantity < 10);

  if (loading) {
    // 2. Use the Spinner component here
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          <Spinner />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-light" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          <h1 className="mb-4">Admin Dashboard</h1>

          {/* Stat Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card text-white bg-primary shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title mb-0">Total Farmers</h5>
                      <h1 className="display-4">{farmers.length}</h1>
                    </div>
                    <i className="fas fa-users fa-3x"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-success shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title mb-0">Total Products</h5>
                      <h1 className="display-4">{products.length}</h1>
                    </div>
                    <i className="fas fa-boxes fa-3x"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-danger shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title mb-0">Low Stock Items</h5>
                      <h1 className="display-4">{lowStockProducts.length}</h1>
                    </div>
                    <i className="fas fa-exclamation-triangle fa-3x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Products Table */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title mb-3">All Farm Products</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Product Name</th><th>Farmer</th><th>Category</th><th>Stock</th><th>Last Updated</th></tr></thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} className={product.quantity < 10 ? 'table-danger' : ''}>
                        <td>{product.name}</td>
                        <td>{product.farmer?.name || 'N/A'}</td>
                        <td>{product.category}</td>
                        <td><strong>{product.quantity} {product.unit}</strong></td>
                        <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
           {/* All Farmers Table */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Registered Farmers</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Name</th><th>Email</th><th>Location</th><th>Contact</th></tr></thead>
                  <tbody>
                    {farmers.map(farmer => (
                      <tr key={farmer._id}>
                        <td>{farmer.name}</td>
                        <td>{farmer.email}</td>
                        <td>{farmer.place}</td>
                        <td>{farmer.contactNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
