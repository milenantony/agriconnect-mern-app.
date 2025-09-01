import React from 'react';
// The import for BrowserRouter is REMOVED from this line
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import BroadcastsPage from './pages/BroadcastsPage'; // 1. IMPORT
import BroadcastRepliesPage from './pages/BroadcastRepliesPage'; // 1. IMPORT
import NotificationsPage from './pages/NotificationsPage'; // 1. IMPORT




// Import route protectors
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    // The <BrowserRouter> tags that were here are now REMOVED
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        
        {/* === Protected Farmer Routes === */}
        <Route path="/farmer/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/broadcasts" element={<ProtectedRoute><BroadcastsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} /> {/* 2. ADD THIS ROUTE */}


        
        {/* === Protected Admin Route === */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route 
          path="/admin/broadcasts/:broadcastId/replies" 
          element={<AdminRoute><BroadcastRepliesPage /></AdminRoute>} 
        />

      </Routes>
    </>
  );
}

export default App;

