AgriConnect - A Full-Stack E-Farming Application
AgriConnect is a complete, full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It serves as a digital marketplace designed to bridge the gap between local farmers and consumers, with a comprehensive administrative backend to manage the platform.

This project was built from a design document and includes a full suite of features for user registration, authentication, product management, and an interactive communication system between platform administrators and farmers.

Live Demo & Screenshots
(Link to your live deployed application would go here)

(Add screenshots of your application here to showcase the design)

Features Implemented
The application supports three distinct user experiences: for public visitors, registered farmers, and platform administrators.

For Public Visitors:
Browse Products: A public marketplace page to view all available products.

Search & Filter: Users can search for products by keyword and filter them by category.

Product Detail View: Each product is clickable and leads to a dedicated page with more details about the item and the farmer who listed it.

Responsive Design: A modern, fully responsive design that works on desktops, tablets, and mobile devices.

Informational Pages: Static pages like "About Us" and "Services" to explain the platform's mission.

For Farmers (Registered Users):
Secure Authentication: A full registration and login system using JWT (JSON Web Tokens) for secure sessions.

Profile Management: Farmers can view and update their profile information, including their name, contact details, location, and a profile picture.

Farmer Dashboard: A private, feature-rich dashboard that includes:

Full CRUD for Products: Farmers can Create, Read, Update, and Delete their own product listings.

Image Uploads: Support for uploading product images.

Inventory Management: Clear overview of all their listed products and current stock.

Notification System:

Low-Stock Alerts: Farmers receive private notifications from the admin when their product stock is low, visible in the navbar.

Broadcast System: A dedicated page to view public requests from the admin, see which are "New", and reply to them.

Reply Management: Farmers can see the status of their sent replies ("Sent" or "Viewed by Admin") on the same page.

For Administrators:
Secure Admin Role: A separate, protected role for platform management.

Admin Dashboard: A private, comprehensive dashboard that provides a full overview of the platform:

Statistic Cards: At-a-glance view of total farmers, total products, and low-stock items.

Inventory Management: View a table of all products from all farmers, with low-stock items highlighted.

Farmer Management: View a list of all registered farmers and their details.

Communication Tools:

Send Low-Stock Alerts: Admins can send a private, one-to-one notification to a specific farmer about a specific product.

Broadcast System: Admins can send a public request message to all farmers simultaneously.

Reply Management: Admins can view all farmer replies for a specific broadcast, mark replies as "viewed," and clear old replies.

Technology Stack
This project was built using the MERN stack and other modern web technologies.

Frontend:

React.js: A JavaScript library for building user interfaces.

Vite: A fast, modern build tool for frontend development.

React Router: For client-side routing and navigation.

Axios: For making HTTP requests to the backend API.

Bootstrap: For styling and creating a responsive layout.

react-toastify: For professional, non-blocking user notifications.

Backend:

Node.js: A JavaScript runtime for the server.

Express.js: A web application framework for Node.js.

MongoDB: A NoSQL database for storing all application data.

Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.

JSON Web Tokens (JWT): For secure user authentication.

Bcrypt.js: For hashing and securing user passwords.

Multer: For handling file uploads (product images, profile pictures, etc.).

Getting Started & Local Setup
To run this project on your local machine, please follow these steps:

Prerequisites
Node.js (LTS version recommended)

MongoDB installed and running locally, or a connection string from MongoDB Atlas.

Installation & Setup
Clone the repository:

git clone [https://github.com/your-username/agriconnect-mern-app.git](https://github.com/your-username/agriconnect-mern-app.git)
cd agriconnect-mern-app

Setup the Backend:

# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file in the backend root
# Add your MongoDB connection string and JWT secret
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

# Start the backend server (runs on http://localhost:5000)
npm start

Setup the Frontend:

# Navigate to the frontend folder from the root
cd ../frontend

# Install dependencies
npm install

# Start the frontend development server (runs on http://localhost:5173)
npm run dev

Open your browser and navigate to http://localhost:5173 to see the application.
