// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getAllFarmers, getAllProductsAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Get all farmers (only accessible by logged-in admins)
router.get('/farmers', protect, admin, getAllFarmers);

// Get all products (only accessible by logged-in admins)
router.get('/products', protect, admin, getAllProductsAdmin);

module.exports = router;