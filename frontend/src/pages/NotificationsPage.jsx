import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user || !user.token) { setLoading(false); return; }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/notifications/mine', config);
      setNotifications(data);
    } catch (error) { 
      const message = error.response?.data?.message || "Could not fetch notifications.";
      toast.error(message);
    } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, config);
      setNotifications(notifications.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
    } catch (error) { 
      const message = error.response?.data?.message || "Could not mark as read.";
      toast.error(message);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, config);
      fetchNotifications();
      toast.success("All notifications marked as read.");
    } catch (error) { 
      const message = error.response?.data?.message || "Could not mark all as read.";
      toast.error(message);
    }
  };
  
  const handleClearAll = () => {
    const performClear = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete('http://localhost:5000/api/notifications/delete-all', config);
        setNotifications([]);
        toast.success("All notifications cleared.");
      } catch (error) { 
        const message = error.response?.data?.message || "Could not clear notifications.";
        toast.error(message);
      }
    };

    const ConfirmationToast = ({ closeToast }) => (
      <div>
        <p className="mb-2 fw-bold">Confirm Action</p>
        <p className="mb-3">Are you sure you want to permanently clear all notifications?</p>
        <div className="d-flex justify-content-end">
            <button 
                className="btn btn-sm btn-danger me-2" 
                onClick={() => {
                    performClear();
                    closeToast();
                }}
            >
                Yes, Clear All
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
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  if (loading) return <Spinner />;

  return (
    <>
      <Navbar />
      <div className="bg-light" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 className="mb-0">My Notifications</h2>
                <p className="text-muted mb-0">You have {unreadCount} unread messages.</p>
            </div>
            <div>
              {unreadCount > 0 && (
                <button className="btn btn-primary me-2" onClick={handleMarkAllAsRead}>Mark All as Read</button>
              )}
              {notifications.length > 0 && (
                <button className="btn btn-outline-danger" onClick={handleClearAll}>Clear All</button>
              )}
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              {notifications.length === 0 ? (
                <div className="text-center p-5">
                    <i className="fas fa-envelope-open-text fa-4x text-muted mb-3"></i>
                    <h4 className="text-muted">Your Inbox is Empty</h4>
                    <p className="text-muted">You have no notifications at the moment.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {notifications.map(notif => (
                    <div key={notif._id} className={`list-group-item d-flex align-items-center p-3 ${!notif.isRead ? 'bg-light' : ''}`}>
                      <div className="me-3">
                        {!notif.isRead && <span className="badge bg-primary rounded-circle p-1">&nbsp;</span>}
                      </div>
                      <div className="flex-grow-1">
                          <Link to="/farmer/dashboard" className="text-decoration-none text-dark">
                            <p className={`mb-1 ${!notif.isRead ? 'fw-bold' : ''}`}>{notif.message}</p>
                          </Link>
                          <small className="text-muted">
                            Regarding Product: {notif.product?.name || 'General Message'}
                          </small>
                      </div>
                      <div className="ms-3 text-nowrap">
                        {!notif.isRead && (
                          <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleMarkAsRead(notif._id)} title="Mark as Read">
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        <small className="text-muted">{new Date(notif.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotificationsPage;

