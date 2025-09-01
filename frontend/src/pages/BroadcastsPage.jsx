import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

function BroadcastsPage() {
  const { user } = useContext(AuthContext);
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to manage which broadcast a farmer is replying to
  const [replyingTo, setReplyingTo] = useState(null); // Will hold the broadcast ID
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchBroadcasts = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/broadcasts', config);
        setBroadcasts(data);
      } catch (error) {
        toast.error("Could not fetch admin requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchBroadcasts();
  }, [user]);

  const handleReplySubmit = async (e, broadcastId) => {
    e.preventDefault();
    if (!replyText.trim()) return toast.warn("Reply message cannot be empty.");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const body = { replyMessage: replyText };
      await axios.post(`http://localhost:5000/api/broadcasts/${broadcastId}/reply`, body, config);
      toast.success("Your reply has been sent!");
      setReplyingTo(null); // Hide the form
      setReplyText('');
    } catch (error) {
      toast.error("Failed to send reply.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        <div className="section-title">
          <h2>Admin Requests</h2>
          <p>Active requests for produce from the platform administrator.</p>
        </div>

        {broadcasts.length === 0 ? (
          <p className="text-center">There are no active requests at the moment.</p>
        ) : (
          <div className="list-group">
            {broadcasts.map(broadcast => (
              <div key={broadcast._id} className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{broadcast.message}</h5>
                  <small>{new Date(broadcast.createdAt).toLocaleDateString()}</small>
                </div>
                <p className="mb-1">Sent by: <strong>{broadcast.admin?.name || 'Admin'}</strong></p>
                
                {replyingTo !== broadcast._id && (
                    <button className="btn btn-primary btn-sm mt-2" onClick={() => setReplyingTo(broadcast._id)}>
                        Reply to this Request
                    </button>
                )}

                {/* Inline Reply Form */}
                {replyingTo === broadcast._id && (
                  <form className="mt-3" onSubmit={(e) => handleReplySubmit(e, broadcast._id)}>
                    <div className="mb-2">
                      <textarea 
                        className="form-control" 
                        rows="2" 
                        placeholder="Type your reply or offer here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-success btn-sm">Submit Reply</button>
                    <button type="button" className="btn btn-secondary btn-sm ms-2" onClick={() => setReplyingTo(null)}>Cancel</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default BroadcastsPage;
