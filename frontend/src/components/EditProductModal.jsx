// src/components/EditProductModal.jsx

import React, { useState, useEffect } from 'react';

function EditProductModal({ product, show, onHide, onSave }) {
  const [formData, setFormData] = useState({ name: '', description: '', category: '', quantity: '', unit: '' });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category,
        quantity: product.quantity,
        unit: product.unit,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product._id, formData);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Product: {product.name}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3"><label className="form-label">Product Name</label><input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required /></div>
              <div className="mb-3"><label className="form-label">Description</label><textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3"></textarea></div>
              <div className="mb-3"><label className="form-label">Category</label><select className="form-select" name="category" value={formData.category} onChange={handleChange} required><option>Vegetable</option><option>Fruit</option></select></div>
              <div className="row mb-3"><div className="col"><label className="form-label">Quantity</label><input type="number" className="form-control" name="quantity" value={formData.quantity} onChange={handleChange} required /></div><div className="col"><label className="form-label">Unit</label><input type="text" className="form-control" name="unit" value={formData.unit} onChange={handleChange} required /></div></div>
              <div className="modal-footer pb-0 border-0">
                <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProductModal;