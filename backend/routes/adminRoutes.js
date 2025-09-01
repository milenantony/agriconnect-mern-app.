    const express = require('express');
    const router = express.Router();
    const { getAllFarmers, getAllProductsAdmin, sendNotification } = require('../controllers/adminController'); // 1. Import
    const { protect } = require('../middleware/authMiddleware');
    const { admin } = require('../middleware/adminMiddleware');

    router.get('/farmers', protect, admin, getAllFarmers);
    router.get('/products', protect, admin, getAllProductsAdmin);
    router.post('/notify', protect, admin, sendNotification); // 2. Add this new route

    module.exports = router;
    
