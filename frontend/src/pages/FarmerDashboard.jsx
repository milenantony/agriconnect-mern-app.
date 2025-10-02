import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import EditProductModal from '../components/EditProductModal';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

function FarmerDashboard() {
  const { user } = useContext(AuthContext);
  const [productData, setProductData] = useState({ name: '', description: '', category: 'Vegetable', quantity: '', unit: 'kg' });
  const [productImage, setProductImage] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);

  const fetchMyProducts = async () => {
    if (!user || !user.token) {
      setProductsLoading(false);
      return;
    }
    try {
      setProductsLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/products/mine', config);
      setMyProducts(data);
    } catch (error) { 
      // THE FIX IS HERE: We now use the 'error' variable.
      const message = error.response?.data?.message || "Could not load your products.";
      toast.error(message);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyProducts();
  }, [user]);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productImage) return toast.warn('Please select a product image.');
    const data = new FormData();
    data.append('name', productData.name);
    data.append('description', productData.description);
    data.append('category', productData.category);
    data.append('quantity', productData.quantity);
    data.append('unit', productData.unit);
    data.append('image', productImage);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/products', data, config);
      toast.success('Product added successfully!');
      setProductData({ name: '', description: '', category: 'Vegetable', quantity: '', unit: 'kg' });
      e.target.reset();
      fetchMyProducts();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add product.';
      toast.error(message);
    }
  };

  const handleSaveChanges = async (productId, updatedData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/products/${productId}`, updatedData, config);
      toast.success('Product updated successfully!');
      handleModalClose();
      fetchMyProducts();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product.';
      toast.error(message);
    }
  };

  const handleDelete = (productId) => {
    const performDelete = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/products/${id}`, config);
            toast.success('Product deleted successfully!');
            fetchMyProducts();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete product.';
            toast.error(message);
        }
    };
    
    const ConfirmationToast = ({ closeToast }) => (
      <div>
        <p className="mb-2 fw-bold">Confirm Deletion</p>
        <p className="mb-3">Are you sure you want to permanently delete this product?</p>
        <div className="d-flex justify-content-end">
            <button 
                className="btn btn-sm btn-danger me-2" 
                onClick={() => {
                    performDelete(productId);
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

  if (!user) return <Spinner />;

  return (
    <>
      <Navbar />
      <div className="bg-light" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 className="mb-0">Farmer Dashboard</h1>
                <p className="lead text-muted">Welcome back, {user.name}!</p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0"><i className="fas fa-plus-circle me-2 text-success"></i>Add New Product</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3"><input type="text" className="form-control" placeholder="Product Name" name="name" value={productData.name} onChange={handleChange} required /></div>
                    <div className="mb-3"><textarea className="form-control" placeholder="Product Description" name="description" value={productData.description} onChange={handleChange} rows="3"></textarea></div>
                    <div className="mb-3">
                        <select className="form-select" name="category" value={productData.category} onChange={handleChange} required>
                            <option value="Vegetable">Vegetable</option>
                            <option value="Fruit">Fruit</option>
                        </select>
                    </div>
                    <div className="row mb-3"><div className="col"><input type="number" className="form-control" placeholder="Quantity" name="quantity" value={productData.quantity} onChange={handleChange} required /></div><div className="col"><input type="text" className="form-control" placeholder="Unit (kg, dozen)" name="unit" value={productData.unit} onChange={handleChange} required /></div></div>
                    <div className="mb-3"><input type="file" className="form-control" name="image" onChange={handleFileChange} required /></div>
                    <button type="submit" className="btn btn-success w-100">Add Product</button>
                  </form>
                </div>
              </div>
            </div>
            
            <div className="col-lg-7">
              <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0"><i className="fas fa-list me-2 text-primary"></i>My Products</h5>
                </div>
                <div className="card-body">
                  {productsLoading ? (
                    <Spinner />
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <tbody>
                          {myProducts.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-4">You have not added any products yet.</td></tr>
                          ) : (
                            myProducts.map((product) => (
                              <tr key={product._id}>
                                <td>
                                  <img src={`http://localhost:5000/${product.image.replace(/\\/g, '/')}`} alt={product.name} width="60" height="60" className="rounded" style={{objectFit: 'cover'}} />
                                </td>
                                <td>
                                  <h6 className="mb-0">{product.name}</h6>
                                  <small className="text-muted">{product.description}</small>
                                </td>
                                <td>{product.quantity} {product.unit}</td>
                                <td>
                                  <button className="btn btn-sm btn-outline-success me-2 mb-2" onClick={() => handleEditClick(product)} title="Edit">
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product._id)} title="Delete">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <EditProductModal
        show={showEditModal}
        onHide={handleModalClose}
        product={selectedProduct}
        onSave={handleSaveChanges}
      />
    </>
  );
}

export default FarmerDashboard;

