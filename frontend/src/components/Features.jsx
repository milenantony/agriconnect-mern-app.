// src/components/Features.jsx

import React from 'react';

function Features() {
  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title">
          <h2>Why Choose AgriConnect</h2>
          <p>We provide innovative solutions for modern agricultural challenges</p>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tractor"></i>
              </div>
              <h3>Modern Equipment</h3>
              <p>Access to the latest farming technology and equipment rentals to maximize your yield and efficiency.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>Quality Seeds</h3>
              <p>Premium quality, non-GMO seeds with high germination rates for better crop production.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Direct Delivery</h3>
              <p>Farm-to-table delivery system that ensures fresh produce reaches consumers quickly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;