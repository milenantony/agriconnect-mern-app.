// backend/models/productModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    // --- ADD THIS FIELD ---
    description: { type: String, trim: true },
    // ---------------------
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true, default: 'kg' },
    farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;