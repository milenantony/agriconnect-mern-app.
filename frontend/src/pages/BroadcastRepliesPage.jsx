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
  const { broadcastId } = useParams(); // Gets the ID from the URL (e.g., /admin/broadcasts/THE_ID_IS_HERE/replies)
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReplies = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/broadcasts/${broadcastId}/replies`, config);
        setReplies(data);
      } catch (error) {
        toast.error("Could not fetch replies.");
      } finally {
        setLoading(false);
      }
    };
    fetchReplies();
  }, [user, broadcastId]);

  if (loading) return <Spinner />;

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Replies for Broadcast</h2>
          <Link to="/admin/dashboard" className="btn btn-secondary">
            &larr; Back to Dashboard
          </Link>
        </div>
        
        {replies.length === 0 ? (
          <div className="card">
            <div className="card-body text-center">
              <p>There are no replies for this broadcast message yet.</p>
            </div>
          </div>
        ) : (
          <div className="list-group">
            {replies.map(reply => (
              <div key={reply._id} className="list-group-item">
                <div className="d-flex align-items-center">
                  <img 
                    src={reply.farmer?.profileImage ? `http://localhost:5000/${reply.farmer.profileImage.replace(/\\/g, '/')}` : `https://ui-avatars.com/api/?name=${reply.farmer?.name}&background=random`} 
                    alt={reply.farmer?.name}
                    className="rounded-circle me-3" 
                    style={{width: '60px', height: '60px', objectFit: 'cover'}}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1"><strong>{reply.replyMessage}</strong></p>
                    <small className="text-muted">
                      From: {reply.farmer?.name || 'Unknown Farmer'} ({reply.farmer?.place || 'N/A'})
                      <br />
                      Contact: {reply.farmer?.contactNumber || 'N/A'}
                    </small>
                  </div>
                  <small className="text-muted">{new Date(reply.createdAt).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default BroadcastRepliesPage;
