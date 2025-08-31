// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', contactNumber: '', place: '' });
  const [licenceFile, setLicenceFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setLicenceFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('contactNumber', formData.contactNumber);
    data.append('place', formData.place);
    data.append('licenceDocument', licenceFile);

    try {
      await axios.post('http://localhost:5000/api/auth/register', data);
      toast.success('Registration successful! Please log in.'); // REPLACED alert()
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message); // REPLACED alert()
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        <div className={styles.leftPanel}>
          <h1>Join AgriConnect</h1>
          <p>Connect with a community of modern farmers and bring your harvest to the world.</p>
        </div>
        <div className={styles.rightPanel}>
          <h2>Register as a Farmer</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3"><input type="text" className="form-control" placeholder="Full Name" name="name" required value={formData.name} onChange={handleChange} /></div>
            <div className="mb-3"><input type="email" className="form-control" placeholder="Email Address" name="email" required value={formData.email} onChange={handleChange} /></div>
            <div className="mb-3"><input type="password" className="form-control" placeholder="Password" name="password" required value={formData.password} onChange={handleChange} /></div>
            <div className="mb-3"><input type="tel" className="form-control" placeholder="Contact Number" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} /></div>
            <div className="mb-3"><input type="text" className="form-control" placeholder="Place / City" name="place" required value={formData.place} onChange={handleChange} /></div>
            <div className="mb-3"><label htmlFor="licenceDocument" className="form-label small text-muted">Licence Document</label><input type="file" className="form-control" id="licenceDocument" name="licenceDocument" required onChange={handleFileChange} /></div>
            <div className="d-grid mt-4"><button type="submit" className="btn btn-primary btn-lg">Create Account</button></div>
          </form>
          <p className="text-center mt-3 small">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
