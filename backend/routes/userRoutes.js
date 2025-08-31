// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer config for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`); }
});
const upload = multer({ storage });

// Routes
router.get('/profile', protect, getUserProfile);
// The PUT route now uses multer to accept a single file named 'profileImage'
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);

module.exports = router;