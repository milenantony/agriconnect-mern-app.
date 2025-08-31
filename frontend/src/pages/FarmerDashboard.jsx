import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import EditProductModal from '../components/EditProductModal';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner'; // 1. Import the Spinner

function FarmerDashboard() {
  const { user } = useContext(AuthContext);
  const [productData, setProductData] = useState({ name: '', description: '', category: 'Vegetable', quantity: '', unit: 'kg' });
  const [productImage, setProductImage] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // 2. Add a new loading state specifically for the product list
  const [productsLoading, setProductsLoading] = useState(true);

  const fetchMyProducts = async () => {
    if (!user || !user.token) return;
    setProductsLoading(true); // 3. Set loading to true before fetching
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/products/mine', config);
      setMyProducts(data);
    } catch (error) { 
      console.error('Failed to fetch products', error);
      toast.error("Could not load your products.");
    }
    setProductsLoading(false); // 3. Set loading to false after fetching (in both cases)
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

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
        toast.success('Product deleted successfully!');
        fetchMyProducts();
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete product.';
        toast.error(message);
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="bg-light" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          <h1 className="mb-4">Farmer Dashboard</h1>
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h4 className="card-title mb-4">Add New Product</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3"><input type="text" className="form-control" placeholder="Product Name" name="name" value={productData.name} onChange={handleChange} required /></div>
                    <div className="mb-3"><textarea className="form-control" placeholder="Product Description" name="description" value={productData.description} onChange={handleChange} rows="3"></textarea></div>
                    <div className="mb-3"><select className="form-select" name="category" value={productData.category} onChange={handleChange} required><option>Vegetable</option><option>Fruit</option></select></div>
                    <div className="row mb-3"><div className="col"><input type="number" className="form-control" placeholder="Quantity" name="quantity" value={productData.quantity} onChange={handleChange} required /></div><div className="col"><input type="text" className="form-control" placeholder="Unit (kg, dozen)" name="unit" value={productData.unit} onChange={handleChange} required /></div></div>
                    <div className="mb-3"><input type="file" className="form-control" name="image" onChange={handleFileChange} required /></div>
                    <button type="submit" className="btn btn-primary w-100">Add Product</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title mb-4">My Products</h4>
                  {/* 4. Use the new loading state here */}
                  {productsLoading ? (
                    <Spinner />
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead><tr><th>#</th><th>Product</th><th>Stock</th><th>Actions</th></tr></thead>
                        <tbody>
                          {myProducts.length === 0 ? (
                            <tr><td colSpan="4" className="text-center">You have not added any products yet.</td></tr>
                          ) : (
                            myProducts.map((product, index) => (
                              <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img src={`http://localhost:5000/${product.image.replace(/\\/g, '/')}`} alt={product.name} width="50" height="50" className="rounded me-3" style={{objectFit: 'cover'}} />
                                    <div>
                                      <h6 className="mb-0">{product.name}</h6>
                                      <small className="text-muted">{product.description}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>{product.quantity} {product.unit}</td>
                                <td>
                                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditClick(product)}>Edit</button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product._id)}>Delete</button>
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

