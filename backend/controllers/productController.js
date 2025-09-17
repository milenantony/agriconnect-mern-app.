const Product = require('../models/productModel');

// @desc    Get all products (public, with search and filter, and RANDOM order)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    try {
        const { keyword, category } = req.query;
        const filter = {};

        if (keyword) {
            filter.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        // 1. Fetch the products from the database without any specific sorting
        let products = await Product.find(filter).populate('farmer', 'name place');
            
        // 2. NEW: Shuffle the array of products randomly in JavaScript
        products = products.sort(() => 0.5 - Math.random());

        res.json(products);
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- All other functions (getProductById, create, get mine, update, delete) are unchanged ---
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('farmer', 'name place profileImage');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error in getProductById:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, category, quantity, unit } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }
    const product = new Product({ name, description, category, quantity, unit, image: req.file.path, farmer: req.user._id });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, category, quantity, unit } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) { return res.status(404).json({ message: 'Product not found' }); }
        if (product.farmer.toString() !== req.user._id.toString()) { return res.status(401).json({ message: 'Not authorized' }); }
        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.quantity = quantity || product.quantity;
        product.unit = unit || product.unit;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) { return res.status(404).json({ message: 'Product not found' }); }
        if (product.farmer.toString() !== req.user._id.toString()) { return res.status(401).json({ message: 'Not authorized' }); }
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed successfully' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    getMyProducts,
    updateProduct,
    deleteProduct
};

