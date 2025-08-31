// src/pages/HomePage.jsx

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ProductsSection from '../components/ProductsSection';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer'; // 1. Import

function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <ProductsSection />
      <Testimonials />
      <Newsletter />
      <Footer /> {/* 2. Add the component here */}
    </div>
  );
}

export default HomePage;