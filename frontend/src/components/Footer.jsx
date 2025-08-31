// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h4 className="footer-title">AgriConnect</h4>
            <p>Transforming agriculture through technology and innovation. Connecting farmers directly with consumers for a sustainable future.</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-4">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {/* These are now functional Links */}
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/#services">Services</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/#contact">Contact</Link></li>
            </ul>
          </div>
          {/* ... the rest of the footer ... */}
           <div className="col-lg-2 col-md-4 mb-4"> <h4 className="footer-title">Services</h4> <ul className="footer-links"> <li><a href="#">Farm Equipment</a></li> <li><a href="#">Organic Seeds</a></li> <li><a href="#">Fertilizers</a></li> <li><a href="#">Consultation</a></li> <li><a href="#">Delivery</a></li> </ul> </div> <div className="col-lg-4 col-md-4 mb-4"> <h4 className="footer-title">Contact Us</h4> <ul className="footer-links"> <li><i className="fas fa-map-marker-alt me-2"></i> 123 Farm Road, Agricultural Zone</li> <li><i className="fas fa-phone me-2"></i> +1 (555) 123-4567</li> <li><i className="fas fa-envelope me-2"></i> info@agriconnect.com</li> </ul> </div>
        </div>
        <div className="text-center copyright">
          <p>&copy; {new Date().getFullYear()} AgriConnect. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;