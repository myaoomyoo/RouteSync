const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'late', 'absent', 'cancelled'], required: true },
});

module.exports = mongoose.model('Trip', TripSchema);