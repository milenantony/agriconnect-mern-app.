import React from 'react';

function Features() {
  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title">
          <h2>Why Choose AgriConnect</h2>
          <p>A complete solution connecting farmers, consumers, and administrators.</p>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="feature-card h-100">
              <div className="feature-icon">
                <i className="fas fa-store-alt"></i>
              </div>
              <h3>Empower Your Farm</h3>
              <p>Easily create your digital storefront. Register, manage your profile, and list your farm-fresh products online to reach a broader customer base.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-card h-100">
              <div className="feature-icon">
                <i className="fas fa-shopping-basket"></i>
              </div>
              <h3>Direct From The Source</h3>
              <p>Consumers can browse, search, and filter a wide variety of local produce. Know exactly who grew your food and connect directly with the farm.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-card h-100">
              <div className="feature-icon">
                <i className="fas fa-bullhorn"></i>
              </div>
              <h3>A Connected Marketplace</h3>
              <p>Our platform features an active admin who manages inventory, sends low-stock alerts, and broadcasts urgent needs to create a responsive community.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
