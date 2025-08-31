// src/components/Hero.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h1>Modern Solutions for Sustainable Farming</h1>
            <p>Join the agricultural revolution with our innovative e-farming platform that connects farmers directly with consumers.</p>
            <div className="mt-5">
              {/* These buttons now link to the correct pages */}
              <Link to="/products" className="btn btn-primary me-3">Explore Products</Link>
              <Link to="/about" className="btn btn-outline-light">Learn More</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;