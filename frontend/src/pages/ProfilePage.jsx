import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', contactNumber: '', place: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        contactNumber: user.contactNumber || '',
        place: user.place || '',
      });
      setPreviewImage(user.profileImage ? `http://localhost:5000/${user.profileImage.replace(/\\/g, '/')}` : `https://ui-avatars.com/api/?name=${user.name}&background=random`);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('contactNumber', formData.contactNumber);
    data.append('place', formData.place);
    if (imageFile) {
      data.append('profileImage', imageFile);
    }
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };
      const { data: updatedData } = await axios.put('http://localhost:5000/api/users/profile', data, config);
      toast.success('Profile updated successfully!');
      const updatedUserInfo = { ...user, ...updatedData };
      setUser(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    } catch (error) {
      // THE FIX IS HERE: We now use the 'error' variable
      const message = error.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-light" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4">Manage Your Profile</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="text-center mb-4"><img src={previewImage} alt="Profile Preview" className="rounded-circle" style={{width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #eee'}}/></div>
                    <div className="row"><div className="col-md-6 mb-3"><label className="form-label">Name</label><input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} /></div><div className="col-md-6 mb-3"><label className="form-label">Email Address</label><input type="email" name="email" className="form-control" value={user?.email || ''} disabled /></div></div>
                    <div className="row"><div className="col-md-6 mb-3"><label className="form-label">Contact Number</label><input type="text" name="contactNumber" className="form-control" value={formData.contactNumber} onChange={handleChange} /></div><div className="col-md-6 mb-3"><label className="form-label">Place / City</label><input type="text" name="place" className="form-control" value={formData.place} onChange={handleChange} /></div></div>
                    <div className="mb-3"><label className="form-label">Update Profile Picture</label><input type="file" name="profileImage" className="form-control" onChange={handleFileChange} /></div>
                    <button type="submit" className="btn btn-primary w-100 mt-3">Save Changes</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfilePage;

