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
    if (!user || !user.token) {
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/notifications/mine', config);
      setNotifications(data);
    } catch (error) {
      toast.error("Could not fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, config);
      // Update the state on the frontend for instant feedback
      setNotifications(notifications.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
    } catch (error) {
      toast.error("Could not mark as read.");
    }
  };
  
  // THIS FUNCTION IS NOW FIXED
  const handleMarkAllAsRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, config);
      // Refetch notifications to update the UI with the changes from the backend
      fetchNotifications();
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error("Could not mark all as read.");
    }
  };
  
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications permanently?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete('http://localhost:5000/api/notifications/delete-all', config);
        setNotifications([]); // Clear notifications on the frontend
        toast.success("All notifications cleared.");
      } catch (error) {
        toast.error("Could not clear notifications.");
      }
    }
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  if (loading) return <Spinner />;

  return (
    <>
      <Navbar />
      <div className="bg-light" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">My Notifications</h2>
            <div>
              {unreadCount > 0 && (
                <button className="btn btn-primary me-2" onClick={handleMarkAllAsRead}>Mark All as Read</button>
              )}
              {notifications.length > 0 && (
                <button className="btn btn-danger" onClick={handleClearAll}>Clear All</button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="card shadow-sm"><div className="card-body text-center"><p className="mb-0">You have no notifications.</p></div></div>
          ) : (
            <div className="list-group">
              {notifications.map(notif => (
                <div key={notif._id} className={`list-group-item list-group-item-action ${!notif.isRead ? 'list-group-item-info' : ''}`}>
                  <div className="d-flex w-100 justify-content-between">
                    <p className={`mb-1 ${!notif.isRead ? 'fw-bold' : ''}`}>{notif.message}</p>
                    <small>{new Date(notif.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">
                        <Link to="/farmer/dashboard" className="text-decoration-none">
                          Regarding Product: {notif.product?.name || 'General Message'}
                        </Link>
                      </small>
                      {!notif.isRead && (
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleMarkAsRead(notif._id)}>
                          Mark as Read
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotificationsPage;

