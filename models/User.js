const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Core fields for all users
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'driver', 'operator'], required: true },
  profileComplete: { type: Boolean, default: false },

  // Student-specific fields
  homeAddress: { type: String },

  // Driver-specific fields
  age: { type: Number },
  phone: { type: String },
  vehicleType: { type: String }, // e.g., Car, Van
  vehicleName: { type: String }, // e.g., Toyota Camry, Ford Transit
  aadhaarProofUrl: { type: String }, // URL to uploaded Aadhar file
  vehicleSize: { type: String }, // e.g., 4-seater, 12-seater
  licenseNumber: { type: String },
  vehicleRegistration: { type: String },

});

module.exports = mongoose.model('User', UserSchema);