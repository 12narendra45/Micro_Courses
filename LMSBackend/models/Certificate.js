
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  serialHash: { type: String, required: true }, 
  issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);
