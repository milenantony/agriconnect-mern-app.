const User = require('../models/userModel');
const Product = require('../models/productModel');
const Notification = require('../models/notificationModel');

const getAllFarmers = async (req, res) => {
  console.log('--- [ADMIN API] Request received for getAllFarmers ---');
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    console.log('--- [ADMIN API] Successfully fetched farmers from DB. ---');
    res.json(farmers);
  } catch (error) {
    console.error('--- [ADMIN API CRASH] in getAllFarmers ---', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAllProductsAdmin = async (req, res) => {
  console.log('--- [ADMIN API] Request received for getAllProductsAdmin ---');
  try {
    const products = await Product.find({}).populate('farmer', 'name');
    console.log('--- [ADMIN API] Successfully fetched products from DB. ---');
    res.json(products);
  } catch (error) {
    console.error('--- [ADMIN API CRASH] in getAllProductsAdmin ---', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const sendNotification = async (req, res) => {
  console.log('--- [ADMIN API] Request received for sendNotification ---');
  try {
    const { recipientId, productId, message } = req.body;
    if (!recipientId || !message) {
      return res.status(400).json({ message: 'Recipient and message are required.' });
    }
    const notification = new Notification({
      recipient: recipientId,
      product: productId,
      sender: req.user._id,
      message,
    });
    await notification.save();
    console.log('--- [ADMIN API] Successfully sent notification. ---');
    res.status(201).json({ message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('--- [ADMIN API CRASH] in sendNotification ---', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllFarmers,
  getAllProductsAdmin,
  sendNotification,
};

