// src/components/Newsletter.jsx

import React from 'react';

function Newsletter() {
  return (
    <section className="newsletter">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Stay updated with the latest farming techniques, seasonal offers, and agricultural news.</p>
            <form className="mt-4">
              <div className="input-group mb-3">
                <input type="email" className="form-control form-control-lg" placeholder="Your Email Address" aria-label="Your Email Address" />
                <button className="btn btn-primary" type="submit">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;