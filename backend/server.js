// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // We will configure this
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // 1. IMPORT
const broadcastRoutes = require('./routes/broadcastRoutes'); // 1. IMPORT



dotenv.config();
const app = express();

// --- NEW, EXPLICIT CORS CONFIGURATION ---
// This tells our server to accept requests from our frontend
// and to allow the necessary headers and methods.
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend's URL
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
};
app.use(cors(corsOptions));
// -----------------------------------------


// --- The rest of the middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error(err));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes); // 2. ADD THIS LINE
app.use('/api/broadcasts', broadcastRoutes); // 2. ADD THIS LINE


// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));