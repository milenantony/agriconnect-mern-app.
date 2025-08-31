// src/components/TestimonialCard.jsx

import React from 'react';

// We destructure the props to easily access image, name, title, and quote
function TestimonialCard({ image, name, title, quote }) {
  return (
    <div className="testimonial-card">
      <div className="d-flex align-items-center mb-3">
        <img src={image} alt={name} className="testimonial-img" />
        <div>
          <h5 className="mb-0">{name}</h5>
          <small className="text-muted">{title}</small>
        </div>
      </div>
      <p className="mb-0">"{quote}"</p>
    </div>
  );
}

export default TestimonialCard;