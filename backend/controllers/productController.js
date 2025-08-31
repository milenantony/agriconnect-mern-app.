// backend/controllers/productController.js

const Product = require('../models/productModel');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Farmer)
const createProduct = async (req, res) => {
  // --- DEBUG MESSAGES ARE ADDED HERE ---
  console.log('--- [START] Inside createProduct Controller ---');
  try {
    console.log('Step 1: Data received from form.');
    console.log('  - Body:', req.body);
    console.log('  - File:', req.file);
    console.log('  - User:', req.user ? req.user._id : 'No User'); // Safely log user ID

    const { name, description, category, quantity, unit } = req.body;

    if (!req.file) {
      console.log('Step 2: FAILED - Product image is missing.');
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = new Product({
      name,
      description,
      category,
      quantity,
      unit,
      image: req.file.path,
      farmer: req.user._id,
    });

    console.log('Step 2: New product object created. Attempting to save to database...');

    // The code is likely getting stuck on the next line
    const createdProduct = await product.save();

    console.log('Step 3: Product saved to database successfully!');
    
    res.status(201).json(createdProduct);
    console.log('--- [END] Response sent to browser ---');

  } catch (error) {
    console.error('--- [CRASH] Error in createProduct controller ---', error);
    res.status(500).json({ message: 'Server Error while creating product' });
  }
};


// @desc    Get logged in user's products
// @route   GET /api/products/mine
// @access  Private (Farmer)
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.user._id });
        res.json(products);
    } catch (error) {
        console.error('Error in getMyProducts controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Farmer)
const updateProduct = async (req, res) => {
    try {
        const { name, description, category, quantity, unit } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.farmer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to edit this product' });
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.quantity = quantity || product.quantity;
        product.unit = unit || product.unit;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error in updateProduct controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('farmer', 'name place');
        res.json(products);
    } catch (error) {
        console.error('Error in getAllProducts controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Farmer)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // IMPORTANT: Security check to ensure the farmer owns this product
        if (product.farmer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this product' });
        }

        await Product.deleteOne({ _id: req.params.id });

        res.json({ message: 'Product removed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
module.exports = { createProduct, getMyProducts, updateProduct, getAllProducts, deleteProduct };