// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { createProduct, getMyProducts, updateProduct, getAllProducts ,deleteProduct} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// --- THIS BLOCK WAS MISSING IN MY LAST RESPONSE ---
const multer = require('multer');
const path = require('path');

// Multer config for product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });
// --------------------------------------------------

// Define the API routes
router.post('/', protect, upload.single('image'), createProduct);
router.get('/mine', protect, getMyProducts);
router.put('/:id', protect, updateProduct);
router.get('/', getAllProducts);
router.delete('/:id', protect, deleteProduct);


module.exports = router;