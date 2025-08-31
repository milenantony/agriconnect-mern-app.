// src/components/Testimonials.jsx

import React from 'react';
import TestimonialCard from './TestimonialCard'; // Import our reusable card

// Dummy data for our testimonials
const testimonialsData = [
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    name: 'John Peterson',
    title: 'Organic Farmer',
    quote: 'E-Farming has transformed how I sell my produce. I now connect directly with consumers and get better prices for my crops.'
  },
  {
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    name: 'Sarah Johnson',
    title: 'Regular Customer',
    quote: 'The quality of produce I get from E-Farming is exceptional. It\'s fresh, organic, and delivered right to my doorstep.'
  },
  {
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    name: 'Michael Chen',
    title: 'Restaurant Owner',
    quote: 'As a restaurant owner, having a reliable source of fresh, locally-sourced ingredients is crucial. E-Farming has been a game-changer for my business.'
  }
];

function Testimonials() {
  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title">
          <h2>What Our Customers Say</h2>
          <p>Hear from farmers and consumers who have benefited from our platform</p>
        </div>
        <div className="row">
          {testimonialsData.map((testimonial, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <TestimonialCard
                image={testimonial.image}
                name={testimonial.name}
                title={testimonial.title}
                quote={testimonial.quote}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;