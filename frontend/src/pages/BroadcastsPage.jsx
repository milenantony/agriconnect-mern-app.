import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const PageHeader = ({ title, subtitle, children }) => (
  <div className="bg-light text-center" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
    <div className="container">
      <h1 className="display-4">{title}</h1>
      <p className="lead text-muted">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  </div>
);

function BroadcastsPage() {
  const { user } = useContext(AuthContext);
  const [broadcasts, setBroadcasts] = useState([]);
  const [myReplies, setMyReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const fetchData = async () => {
    if (!user || !user.token) { setLoading(false); return; }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [broadcastsRes, repliesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/broadcasts', config),
        axios.get('http://localhost:5000/api/broadcasts/my-replies', config)
      ]);
      setBroadcasts(broadcastsRes.data);
      setMyReplies(repliesRes.data);
    } catch (error) {
      // THE FIX IS HERE: We now use the 'error' variable.
      const message = error.response?.data?.message || "Could not fetch data for this page.";
      toast.error(message);
    } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleReplySubmit = async (e, broadcastId) => {
    e.preventDefault();
    if (!replyText.trim()) return toast.warn("Reply message cannot be empty.");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const body = { replyMessage: replyText };
      await axios.post(`http://localhost:5000/api/broadcasts/${broadcastId}/reply`, body, config);
      toast.success("Your reply has been sent to the admin!");
      setReplyText('');
      setReplyingTo(null);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send reply.";
      toast.error(message);
    }
  };

  const markAllAsSeen = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:5000/api/broadcasts/mark-all-seen', {}, config);
      toast.success("All requests marked as seen.");
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to mark as read.";
      toast.error(message);
    }
  };
  
  const handleClearAllBroadcasts = () => {
    const performClear = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put('http://localhost:5000/api/broadcasts/clear-all-mine', {}, config);
        toast.success("All requests have been cleared from your view.");
        fetchData();
      } catch (error) {
        const message = error.response?.data?.message || "Failed to clear requests.";
        toast.error(message);
      }
    };

    const ConfirmationToast = ({ closeToast }) => (
      <div>
        <p className="mb-2 fw-bold">Confirm Action</p>
        <p className="mb-3">Are you sure you want to clear all requests from your view? This action cannot be undone.</p>
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

  const handleReplyClick = async (broadcast) => {
    setReplyingTo(broadcast._id);
    setReplyText('');
    const isAlreadySeen = Array.isArray(broadcast.seenBy) && broadcast.seenBy.includes(user._id);
    if (!isAlreadySeen) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`http://localhost:5000/api/broadcasts/${broadcast._id}/seen`, {}, config);
        setBroadcasts(prev => prev.map(b => b._id === broadcast._id ? { ...b, seenBy: [...b.seenBy, user._id] } : b));
      } catch (error) {
        // We don't need to show a toast for this background action, but we should log it.
        console.error("Could not mark broadcast as seen.", error);
      }
    }
  };

  const unreadCount = broadcasts.filter(b => Array.isArray(b.seenBy) && !b.seenBy.includes(user._id)).length;
  if (loading) return <Spinner />;

  return (
    <>
      <Navbar />
      <PageHeader 
        title="Admin Requests" 
        subtitle="View active requests and manage your replies"
      >
        <div>
          {unreadCount > 0 && <button className="btn btn-success me-2" onClick={markAllAsSeen}><i className="fas fa-check-double me-2"></i>Mark All as Read</button>}
          {broadcasts.length > 0 && <button className="btn btn-outline-danger" onClick={handleClearAllBroadcasts}><i className="fas fa-times-circle me-2"></i>Clear All Requests</button>}
        </div>
      </PageHeader>
      
      <div className="container" style={{ paddingBottom: '50px', marginTop: '-30px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {broadcasts.length === 0 ? (
              <div className="text-center p-5 bg-white rounded shadow-sm">
                <i className="fas fa-check-circle fa-4x text-muted mb-3"></i>
                <h3 className="text-muted">All Caught Up!</h3>
                <p className="text-muted">There are no active requests from the admin at the moment.</p>
              </div>
            ) : (
              broadcasts.map(broadcast => {
                const userReply = myReplies.find(reply => reply.broadcastMessage?._id === broadcast._id);
                const isNew = Array.isArray(broadcast.seenBy) && !broadcast.seenBy.includes(user._id);
                return (
                  <div key={broadcast._id} className={`card shadow-sm mb-3 ${isNew ? 'border-primary' : ''}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          {isNew && <span className="badge bg-primary me-2">New</span>}
                          <strong className="text-dark">Request from {broadcast.admin?.name || 'Admin'}</strong>
                        </div>
                        <small className="text-muted">{new Date(broadcast.createdAt).toLocaleDateString()}</small>
                      </div>
                      <p className="my-3 fs-5">"{broadcast.message}"</p>
                      
                      <div className="p-3 bg-light rounded">
                        {userReply ? (
                          <div>
                            <h6 className="text-muted small">YOUR REPLY:</h6>
                            <p className="fst-italic mb-1">"{userReply.replyMessage}"</p>
                            {userReply.isViewed ? (
                              <span className="badge bg-success"><i className="fas fa-eye me-1"></i> Viewed by Admin</span>
                            ) : (
                              <span className="badge bg-secondary"><i className="fas fa-paper-plane me-1"></i> Sent</span>
                            )}
                          </div>
                        ) : (
                          replyingTo === broadcast._id ? (
                            <form onSubmit={(e) => handleReplySubmit(e, broadcast._id)}>
                              <textarea className="form-control form-control-sm mb-2" rows="2" placeholder="Type your offer here..." value={replyText} onChange={(e) => setReplyText(e.target.value)} required></textarea>
                              <button type="submit" className="btn btn-sm btn-primary">Submit Reply</button>
                              <button type="button" className="btn btn-sm btn-link text-secondary" onClick={() => setReplyingTo(null)}>Cancel</button>
                            </form>
                          ) : (
                            <button className="btn btn-primary" onClick={() => handleReplyClick(broadcast)}>
                              <i className="fas fa-reply me-2"></i>Reply to this Request
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BroadcastsPage;

