import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let intervalId;
    const fetchNotificationCount = async () => {
      if (user && user.role.toLowerCase() === 'farmer' && user.token) {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/notifications/mine', config);
          const count = data.filter(n => !n.isRead).length;
          setUnreadCount(count);
        } catch (error) {
          console.error('Failed to fetch notification count', error);
        }
      } else {
        setUnreadCount(0);
      }
    };
    fetchNotificationCount();
    intervalId = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info("You have been logged out.");
  }

  const adminLinks = (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" to="/admin/dashboard">Admin Dashboard</NavLink>
      </li>
      <li className="nav-item">
        <a onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>Logout</a>
      </li>
    </>
  );

  const farmerLinks = (
    <>
      <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
      <li className="nav-item"><NavLink className="nav-link" to="/products">All Products</NavLink></li>
      <li className="nav-item"><NavLink className="nav-link" to="/about">About Us</NavLink></li>
      <li className="nav-item"><NavLink className="nav-link" to="/broadcasts">Admin Requests</NavLink></li>
      <li className="nav-item"><NavLink className="nav-link" to="/farmer/dashboard">My Dashboard</NavLink></li>
      
      <li className="nav-item">
        {/* THIS IS THE CORRECTED LINE */}
        <NavLink className="nav-link position-relative" to="/notifications" title="Notifications">
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && (
            <span className="badge rounded-pill bg-danger" style={{ position: 'absolute', top: '5px', right: '0px', fontSize: '0.6em' }}>
              {unreadCount}
            </span>
          )}
        </NavLink>
      </li>

      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img 
            src={user?.profileImage ? `http://localhost:5000/${user.profileImage.replace(/\\/g, '/')}` : `https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
            alt={user?.name}
            className="rounded-circle" 
            style={{width: '32px', height: '32px', objectFit: 'cover', marginLeft: '8px'}}
          />
        </a>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li><NavLink className="dropdown-item" to="/profile">My Profile</NavLink></li>
          <li><hr className="dropdown-divider"/></li>
          <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
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
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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

