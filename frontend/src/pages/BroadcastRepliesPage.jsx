import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function BroadcastRepliesPage() {
  const { user } = useContext(AuthContext);
  const { id: broadcastId } = useParams(); 
  const [replies, setReplies] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReplies = async () => {
    if (!user || !user.token || !broadcastId) {
      setLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`http://localhost:5000/api/broadcasts/${broadcastId}/replies`, config);
      setReplies(data.replies);
      setBroadcastMessage(data.broadcastMessage);
    } catch (error) {
      const message = error.response?.data?.message || "Could not fetch replies for this broadcast.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [user, broadcastId]);

  const handleMarkAsViewed = async (replyId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/broadcasts/replies/${replyId}/viewed`, {}, config);
      setReplies(prevReplies =>
        prevReplies.map(reply =>
          reply._id === replyId ? { ...reply, isViewed: true } : reply
        )
      );
      toast.success("Reply marked as viewed.");
    } catch (error) {
      const message = error.response?.data?.message || "Could not update the reply status.";
      toast.error(message);
    }
  };

  // --- THIS IS THE NEW, IMPROVED DELETE FUNCTION ---
  const handleClearAllReplies = () => {
    // This function performs the actual API call
    const performClear = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/broadcasts/${broadcastId}/replies`, config);
        setReplies([]); // Clear the replies on the frontend
        toast.success("All replies for this broadcast have been cleared.");
      } catch (error) {
        const message = error.response?.data?.message || "Could not clear replies.";
        toast.error(message);
      }
    };

    // This is the custom component for our confirmation toast
    const ConfirmationToast = ({ closeToast }) => (
      <div>
        <p className="mb-2 fw-bold">Confirm Action</p>
        <p className="mb-3">Are you sure you want to permanently delete all replies for this broadcast?</p>
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

    // We now call toast.error() to show a red, theme-matched confirmation
    toast.error(<ConfirmationToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      theme: "colored"
    });
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Navbar />
      <div className="bg-light" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-0">Broadcast Replies</h2>
              <p className="lead text-muted">Showing replies for your request.</p>
            </div>
            <div>
                {replies.length > 0 && (
                    <button className="btn btn-outline-danger me-2" onClick={handleClearAllReplies}>
                        <i className="fas fa-trash-alt me-1"></i> Clear All Replies
                    </button>
                )}
                <Link to="/admin/dashboard" className="btn btn-secondary">
                    <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
                </Link>
            </div>
          </div>
          
          <div className="card shadow-sm mb-4 bg-white border-start border-5 border-success">
              <div className="card-body">
                  <h5 className="card-title text-muted">Original Request:</h5>
                  <p className="card-text fs-5">"{broadcastMessage}"</p>
              </div>
          </div>

          {replies.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center p-5">
                <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">No Replies Yet</h4>
                <p className="text-muted">There are no replies for this broadcast message at the moment.</p>
              </div>
            </div>
          ) : (
            replies.map(reply => (
              <div key={reply._id} className={`card shadow-sm mb-3 ${!reply.isViewed ? 'border-primary' : ''}`}>
                <div className="card-body p-3">
                    <div className="d-flex align-items-start">
                        <img 
                            src={reply.farmer?.profileImage ? `http://localhost:5000/${reply.farmer.profileImage.replace(/\\/g, '/')}` : `https://ui-avatars.com/api/?name=${reply.farmer?.name}&background=random`} 
                            alt={reply.farmer?.name}
                            className="rounded-circle me-3" 
                            style={{width: '60px', height: '60px', objectFit: 'cover'}}
                        />
                        <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5 className="mb-1">
                                      {reply.farmer?.name || 'Unknown Farmer'}
                                      {!reply.isViewed && <span className="badge bg-primary ms-2">New</span>}
                                    </h5>
                                    <p className="text-muted mb-2">
                                        <i className="fas fa-map-marker-alt me-1"></i> {reply.farmer?.place || 'N/A'}
                                    </p>
                                </div>
                                <small className="text-muted">{new Date(reply.createdAt).toLocaleString()}</small>
                            </div>
                            <p className="card-text bg-light p-3 rounded">{reply.replyMessage}</p>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className="text-muted">
                                    Contact: <strong>{reply.farmer?.contactNumber || 'N/A'}</strong>
                                </span>
                                {!reply.isViewed && (
                                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleMarkAsViewed(reply._id)}>
                                    <i className="fas fa-check me-1"></i> Mark as Viewed
                                  </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BroadcastRepliesPage;

