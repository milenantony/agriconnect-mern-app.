// backend/controllers/adminController.js

const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Get all farmers
// @route   GET /api/admin/farmers
// @access  Private/Admin
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all products (from all farmers)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({}).populate('farmer', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllFarmers,
  getAllProductsAdmin,
};