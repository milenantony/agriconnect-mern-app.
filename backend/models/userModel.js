// backend/models/userModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true, // This field is mandatory
        trim: true      // Removes whitespace from both ends
    },
    email: {
        type: String,
        required: true,
        unique: true,   // Every email must be unique in the database
        trim: true,
        lowercase: true // Store emails in lowercase
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['farmer', 'admin'], // The role can only be one of these two values
        default: 'farmer'         // If no role is specified, it defaults to 'farmer'
    },
    contactNumber: {
        type: String,
        trim: true
    },
    place: {
        type: String,
        trim: true
    },
    licenceDocument: {
        type: String // We will store the path to the uploaded file here
    },
    profileImage: { type: String, default: '' }
}, {
    // This option adds two fields to our schema: createdAt and updatedAt
    timestamps: true
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model so we can use it elsewhere in our application
module.exports = User;