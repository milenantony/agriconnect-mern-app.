// src/pages/LoginPage.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify'; // Import toast

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      if (user.role.toLowerCase() === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      toast.success('Login successful!'); // REPLACED alert()
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message); // REPLACED alert()
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        <div className={styles.leftPanel}>
          <h1>Welcome Back!</h1>
          <p>The fields are waiting. Let's get you signed in.</p>
        </div>
        <div className={styles.rightPanel}>
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="email" className="form-control" placeholder="Email Address" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <input type="password" className="form-control" placeholder="Password" name="password" required value={formData.password} onChange={handleChange} />
            </div>
            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg">Sign In</button>
            </div>
          </form>
          <p className="text-center mt-3 small">
            Don't have an account? <Link to="/register">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
