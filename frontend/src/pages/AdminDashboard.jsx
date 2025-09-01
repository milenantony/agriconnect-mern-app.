import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const fetchData = async () => {
    if (!user || !user.token) {
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Fetch all data in parallel for faster loading
      const [farmersRes, productsRes, broadcastsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/farmers', config),
        axios.get('http://localhost:5000/api/admin/products', config),
        axios.get('http://localhost:5000/api/broadcasts/my-broadcasts', config)
      ]);
      setFarmers(farmersRes.data);
      setProducts(productsRes.data);
      setBroadcasts(broadcastsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return toast.warn("Broadcast message cannot be empty.");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/broadcasts', { message: broadcastMessage }, config);
      toast.success("Broadcast sent to all farmers!");
      setBroadcastMessage('');
      fetchData(); // Refetch all data to update the broadcasts list
    } catch (error) {
      toast.error("Failed to send broadcast.");
    }
  };
  
  const handleNotifyFarmer = async (product) => {
    const message = `Reminder: Your product "${product.name}" is low on stock (${product.quantity} ${product.unit}). Please update your inventory.`;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const body = { recipientId: product.farmer._id, productId: product._id, message };
      await axios.post('http://localhost:5000/api/admin/notify', body, config);
      toast.success(`Reminder sent to ${product.farmer.name}!`);
    } catch (error) {
      toast.error('Failed to send reminder.');
    }
  };

  const lowStockProductsCount = products.filter(p => p.quantity < 10).length;
  if (loading) return <Spinner />;

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
                    <div><h5 className="card-title mb-0">Total Farmers</h5><h1 className="display-4">{farmers.length}</h1></div>
                    <i className="fas fa-users fa-3x"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-success shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div><h5 className="card-title mb-0">Total Products</h5><h1 className="display-4">{products.length}</h1></div>
                    <i className="fas fa-boxes fa-3x"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-danger shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div><h5 className="card-title mb-0">Low Stock Items</h5><h1 className="display-4">{lowStockProductsCount}</h1></div>
                    <i className="fas fa-exclamation-triangle fa-3x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h4 className="card-title mb-3">Broadcast a Request</h4>
                  <form onSubmit={handleBroadcastSubmit}>
                    <div className="mb-3">
                      <textarea className="form-control" rows="3" placeholder="e.g., Urgent requirement: 50kg of organic tomatoes needed..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">Send to All Farmers</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h4 className="card-title mb-3">My Past Broadcasts</h4>
                  <div className="list-group" style={{maxHeight: '190px', overflowY: 'auto'}}>
                    {broadcasts.length === 0 ? (
                      <p>You have not sent any broadcasts yet.</p>
                    ) : (
                      broadcasts.map(b => (
                        <Link key={b._id} to={`/admin/broadcasts/${b._id}/replies`} className="list-group-item list-group-item-action">
                          <p className="mb-1 text-truncate">{b.message}</p>
                          <small>{new Date(b.createdAt).toLocaleString()}</small>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title mb-3">All Farm Products</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Product Name</th><th>Farmer</th><th>Category</th><th>Stock</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan="5" className="text-center">No products have been added yet.</td></tr>
                    ) : (
                      products.map(product => (
                        <tr key={product._id} className={product.quantity < 10 ? 'table-danger' : ''}>
                          <td>{product.name}</td>
                          <td>{product.farmer?.name || 'N/A'}</td>
                          <td>{product.category}</td>
                          <td><strong>{product.quantity} {product.unit}</strong></td>
                          <td>
                            {product.quantity < 10 && (
                              <button className="btn btn-sm btn-warning" onClick={() => handleNotifyFarmer(product)}>
                                Notify Farmer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Registered Farmers</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Name</th><th>Email</th><th>Location</th><th>Contact</th></tr></thead>
                  <tbody>
                    {farmers.length === 0 ? (
                      <tr><td colSpan="4" className="text-center">No farmers have registered yet.</td></tr>
                    ) : (
                      farmers.map(farmer => (
                        <tr key={farmer._id}>
                          <td>{farmer.name}</td>
                          <td>{farmer.email}</td>
                          <td>{farmer.place}</td>
                          <td>{farmer.contactNumber}</td>
                        </tr>
                      ))
                    )}
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

