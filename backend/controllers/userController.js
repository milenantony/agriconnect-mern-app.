// backend/controllers/userController.js
const User = require('../models/userModel');

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, contactNumber: user.contactNumber,
      place: user.place, profileImage: user.profileImage // Send image path
    });
  } else { res.status(404).json({ message: 'User not found' }); }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.contactNumber = req.body.contactNumber || user.contactNumber;
    user.place = req.body.place || user.place;

    // Check if a new file was uploaded
    if (req.file) {
      user.profileImage = req.file.path;
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
      role: updatedUser.role, contactNumber: updatedUser.contactNumber,
      place: updatedUser.place, profileImage: updatedUser.profileImage // Send updated image path
    });
  } else { res.status(404).json({ message: 'User not found' }); }
};

module.exports = { getUserProfile, updateUserProfile };