import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// A reusable banner component for the top of the page
const PageHeader = ({ title, subtitle }) => (
  <div className="bg-light text-center" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
    <div className="container">
      <h1 className="display-4">{title}</h1>
      <p className="lead text-muted">{subtitle}</p>
    </div>
  </div>
);

// This ServiceCard now uses the EXACT SAME classes as your homepage's "Features" section
const ServiceCard = ({ icon, title, description }) => (
  <div className="col-lg-4 col-md-6 mb-4">
    <div className="feature-card h-100">
      <div className="feature-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

function ServicesPage() {
  return (
    <>
      <Navbar />
      <PageHeader title="Our Services" subtitle="Empowering Agriculture with Technology" />

      <div className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        {/* Services for Farmers */}
        <div className="mb-5">
          <div className="section-title">
            <h2>For Farmers</h2>
            <p>Tools designed to help you manage your farm and connect with a wider market.</p>
          </div>
          <div className="row">
            <ServiceCard 
              icon="fa-user-plus"
              title="Easy Registration"
              description="Create a secure account in minutes. Our simple registration process allows you to set up your profile, upload your license, and get started quickly."
            />
            <ServiceCard 
              icon="fa-carrot"
              title="Product Management"
              description="Add, update, and delete your farm products through an intuitive dashboard. Upload images, write descriptions, and manage your inventory with ease."
            />
            <ServiceCard 
              icon="fa-user-cog"
              title="Profile Management"
              description="Keep your personal information up-to-date. Update your name, contact details, location, and even your profile picture to build trust with consumers."
            />
             <ServiceCard 
              icon="fa-bullhorn"
              title="Admin Requests"
              description="View and reply to urgent requests broadcast by the admin. This feature provides new opportunities to sell your produce directly based on market demand."
            />
             <ServiceCard 
              icon="fa-bell"
              title="Low-Stock Alerts"
              description="Receive private notifications directly from the admin when your product inventory is running low, helping you stay on top of your stock levels."
            />
             <ServiceCard 
              icon="fa-globe"
              title="Marketplace Access"
              description="By listing your products, you gain access to a broad audience of consumers, restaurants, and businesses looking for fresh, local produce."
            />
          </div>
        </div>

        {/* Services for Admins */}
        <hr className="my-5" />
        <div className="mt-5">
          <div className="section-title">
            <h2>For Administrators</h2>
            <p>A powerful dashboard to oversee and manage the entire platform.</p>
          </div>
          <div className="row justify-content-center">
            <ServiceCard 
              icon="fa-tachometer-alt"
              title="Platform Overview"
              description="Monitor key statistics at a glance, including the total number of registered farmers, total products listed, and items with low inventory."
            />
            <ServiceCard 
              icon="fa-tasks"
              title="Inventory Management"
              description="View all products from all farmers. Easily identify low-stock items and send proactive reminder notifications directly to the farmer."
            />
            <ServiceCard 
              icon="fa-paper-plane"
              title="Broadcast System"
              description="Communicate urgent needs to all farmers simultaneously by sending out broadcast messages and viewing all their replies in an organized feed."
            />
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}

export default ServicesPage;

