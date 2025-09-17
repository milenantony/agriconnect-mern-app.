import React, { useState, useEffect } from 'react';

function EditProductModal({ product, show, onHide, onSave }) {
  // State for the form fields
  const [formData, setFormData] = useState({ name: '', description: '', category: '', quantity: '', unit: '' });

  // This effect runs whenever a new 'product' is passed to the modal.
  // It pre-fills the form with that product's current data.
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

  // Updates the form state as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Called when the "Save Changes" button is clicked
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product._id, formData); // Passes the ID and new data back to the dashboard
  };

  // If the 'show' prop is false, the component renders nothing
  if (!show) {
    return null;
  }

  return (
    <>
      {/* This style tag injects the fade-in animation for the modal */}
      <style>{`
        .modal-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content modal-fade-in border-0 shadow-lg">
            <div className="modal-header bg-light border-0">
              <h5 className="modal-title">
                <i className="fas fa-edit me-2 text-success"></i>
                Edit Product Details
              </h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Left Column: Image and Static Info */}
                  <div className="col-md-4 text-center">
                    <img 
                      src={`http://localhost:5000/${product.image.replace(/\\/g, '/')}`} 
                      alt={product.name}
                      className="img-fluid rounded mb-3"
                    />
                    <h5>{product.name}</h5>
                    <p className="text-muted">Current Stock: {product.quantity} {product.unit}</p>
                  </div>

                  {/* Right Column: Editable Form Fields */}
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                        <option value="Vegetable">Vegetable</option>
                        <option value="Fruit">Fruit</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Grain">Grain</option>
                      </select>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label className="form-label">Quantity</label>
                        <input type="number" className="form-control" name="quantity" value={formData.quantity} onChange={handleChange} required />
                      </div>
                      <div className="col">
                        <label className="form-label">Unit</label>
                        <input type="text" className="form-control" name="unit" value={formData.unit} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer mt-3 border-0">
                  <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
                  <button type="submit" className="btn btn-success">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProductModal;
