const express = require('express');
const router = express.Router();
// 1. Import all necessary controller functions
const {
    createProduct,
    getMyProducts,
    updateProduct,
    getAllProducts,
    deleteProduct,
    getProductById
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
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


// --- Define the API routes ---

// Public route to get all products (now supports search/filter)
router.get('/', getAllProducts);

// Farmer's private route to get their own products
router.get('/mine', protect, getMyProducts);

// Public route to get a single product by ID
// IMPORTANT: This dynamic route must come AFTER specific routes like '/mine'
// to avoid conflicts.
router.get('/:id', getProductById);

// Farmer's private route to create a product
router.post('/', protect, upload.single('image'), createProduct);

// Farmer's private route to update a product
router.put('/:id', protect, updateProduct);

// Farmer's private route to delete a product
router.delete('/:id', protect, deleteProduct);

module.exports = router;

