
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  progress: { type: Number, default: 0 }, 
  certificateIssued: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

enrollmentSchema.index({ learner: 1, course: 1 }, { unique: true }); 

module.exports = mongoose.model('Enrollment', enrollmentSchema);
