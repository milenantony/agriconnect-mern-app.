// src/pages/AboutPage.jsx

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// A simple banner component for the top of the page
const PageHeader = ({ title, subtitle }) => (
  // THE FIX IS HERE: We add a style prop to give it extra padding-top
  <div className="bg-light text-center" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
    <div className="container">
      <h1 className="display-4">{title}</h1>
      <p className="lead">{subtitle}</p>
    </div>
  </div>
);

function AboutPage() {
  return (
    <>
      <Navbar />
      <PageHeader title="About AgriConnect" subtitle="Connecting Modern Farming with Modern Consumers" />

      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="mb-3">Our Mission</h2>
              <p className="text-muted">
                At AgriConnect, our mission is to revolutionize the agricultural supply chain by bridging the gap between local farmers and end consumers. We believe in empowering farmers with the technology to manage their produce online, reach a wider market, and get fair value for their hard work.
              </p>
              <p className="text-muted">
                For consumers, we aim to provide a transparent and accessible platform to purchase fresh, locally-sourced produce directly from the farm, ensuring quality, freshness, and a stronger connection to the food they eat.
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80" 
                alt="Happy Farmer" 
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-title">
            <h2>How It Works</h2>
            <p>A simple platform designed for farmers and consumers alike.</p>
          </div>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card text-center h-100">
                <div className="feature-icon"><i className="fas fa-user-plus"></i></div>
                <h3>Farmers Register & List</h3>
                <p>Farmers can easily create a profile, manage their account, and list their products with images, descriptions, and quantities.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card text-center h-100">
                <div className="feature-icon"><i className="fas fa-shopping-basket"></i></div>
                <h3>Consumers Browse & Discover</h3>
                <p>Anyone can visit our platform to browse a wide variety of fresh products, see who grew them, and where they come from.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card text-center h-100">
                <div className="feature-icon"><i className="fas fa-tasks"></i></div>
                <h3>Admins Oversee</h3>
                <p>Our administrators monitor the platform to ensure everything runs smoothly and to manage products with low inventory levels.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AboutPage;