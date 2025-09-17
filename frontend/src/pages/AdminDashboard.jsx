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
    if (!user || !user.token) { setLoading(false); return; }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [farmersRes, productsRes, broadcastsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/farmers', config),
        axios.get('http://localhost:5000/api/admin/products', config),
        axios.get('http://localhost:5000/api/broadcasts/my-broadcasts', config)
      ]);
      setFarmers(farmersRes.data);
      setProducts(productsRes.data);
      setBroadcasts(broadcastsRes.data);
    } catch (error) {
      // THE FIX IS HERE: We now use the 'error' variable
      const message = error.response?.data?.message || "Failed to load dashboard data.";
      toast.error(message);
    } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return toast.warn("Broadcast message cannot be empty.");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/broadcasts', { message: broadcastMessage }, config);
      toast.success("Broadcast sent to all farmers!");
      setBroadcastMessage('');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send broadcast.";
      toast.error(message);
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
        const message = error.response?.data?.message || 'Failed to send reminder.';
        toast.error(message);
    }
  };
  
  const handleDeleteBroadcast = (broadcastId) => {
    const performDelete = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/broadcasts/${id}`, config);
            toast.success("Broadcast deleted successfully.");
            fetchData();
        } catch (error) {
            const message = error.response?.data?.message || "Failed to delete broadcast.";
            toast.error(message);
        }
    };

    const ConfirmationToast = ({ closeToast }) => (
      <div>
        <p className="mb-2 fw-bold">Confirm Deletion</p>
        <p className="mb-3">Are you sure you want to permanently delete this broadcast and all its replies?</p>
        <div className="d-flex justify-content-end">
            <button 
                className="btn btn-sm btn-danger me-2" 
                onClick={() => {
                    performDelete(broadcastId);
                    closeToast();
                }}
            >
                Yes, Delete
            </button>
            <button className="btn btn-sm btn-secondary" onClick={closeToast}>
                Cancel
            </button>
        </div>
      </div>
    );

    toast.error(<ConfirmationToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      theme: "colored"
    });
  };

  const lowStockProductsCount = products.filter(p => p.quantity < 10).length;
  if (loading) return <Spinner />;

  return (
    <>
      <Navbar />
      <div className="bg-light" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-0">Admin Dashboard</h1>
              <p className="lead text-muted">Welcome, {user.name}!</p>
            </div>
          </div>

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
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0"><i className="fas fa-paper-plane me-2 text-success"></i>Broadcast a Request</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleBroadcastSubmit}>
                    <div className="mb-3">
                      <textarea className="form-control" rows="4" placeholder="e.g., Urgent requirement: 50kg of organic tomatoes needed..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">Send to All Farmers</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0"><i className="fas fa-history me-2 text-primary"></i>My Past Broadcasts</h5>
                </div>
                <div className="card-body">
                  <div className="list-group" style={{maxHeight: '220px', overflowY: 'auto'}}>
                    {broadcasts.length === 0 ? (
                      <p className="text-muted">You have not sent any broadcasts yet.</p>
                    ) : (
                      broadcasts.map(b => (
                        <div key={b._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                          <Link to={`/admin/broadcasts/${b._id}/replies`} className="text-decoration-none text-dark flex-grow-1">
                            <p className="mb-1 text-truncate">{b.message}</p>
                            <small className="text-muted">{new Date(b.createdAt).toLocaleString()}</small>
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => handleDeleteBroadcast(b._id)}
                            title="Delete Broadcast"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0"><i className="fas fa-carrot me-2 text-warning"></i>All Farm Products</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Product Name</th><th>Farmer</th><th>Category</th><th>Stock</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4">No products have been added yet.</td></tr>
                    ) : (
                      products.map(product => (
                        <tr key={product._id} className={product.quantity < 10 ? 'table-danger' : ''}>
                          <td>{product.name}</td>
                          <td>{product.farmer?.name || 'N/A'}</td>
                          <td>{product.category}</td>
                          <td><strong>{product.quantity} {product.unit}</strong></td>
                          <td>
                            {product.quantity < 10 && (
                              <button className="btn btn-sm btn-outline-warning" onClick={() => handleNotifyFarmer(product)}>
                                Notify
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
            <div className="card-header bg-white py-3">
                <h5 className="mb-0"><i className="fas fa-users me-2 text-info"></i>Registered Farmers</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Name</th><th>Email</th><th>Location</th><th>Contact</th></tr></thead>
                  <tbody>
                    {farmers.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-4">No farmers have registered yet.</td></tr>
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

