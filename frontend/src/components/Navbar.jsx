// src/components/Navbar.jsx

import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const adminLinks = (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" to="/admin/dashboard">Admin Dashboard</NavLink>
      </li>
      <li className="nav-item">
        <a onClick={logout} className="nav-link" style={{ cursor: 'pointer' }}>Logout</a>
      </li>
    </>
  );

  const farmerLinks = (
    <>
      <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
      <li className="nav-item"><NavLink className="nav-link" to="/products">All Products</NavLink></li>
      <li className="nav-item"><NavLink className="nav-link" to="/about">About Us</NavLink></li>
      <li className="nav-item"><NavLink className="nav-link" to="/farmer/dashboard">My Dashboard</NavLink></li>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img 
            src={user?.profileImage ? `http://localhost:5000/${user.profileImage.replace(/\\/g, '/')}` : `https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
            alt={user?.name}
            className="rounded-circle" 
            style={{width: '32px', height: '32px', objectFit: 'cover', marginRight: '8px'}}
          />
          {user?.name}
        </a>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li><NavLink className="dropdown-item" to="/profile">My Profile</NavLink></li>
          <li><hr className="dropdown-divider"/></li>
          <li><a className="dropdown-item" href="#" onClick={logout}>Logout</a></li>
        </ul>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
      <li className="nav-item"><NavLink className="nav-link" to="/products">Products</NavLink></li>
      <li className="nav-item"><NavLink className="nav-link" to="/about">About Us</NavLink></li>
    </>
  );

  const renderLinks = () => {
    if (user) {
      return user.role.toLowerCase() === 'admin' ? adminLinks : farmerLinks;
    }
    return guestLinks;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-leaf me-2"></i>AgriConnect
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {renderLinks()}
            {!user && (
              <li className="nav-item ms-lg-3">
                <Link to="/login" className="btn btn-primary">Sign In</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;