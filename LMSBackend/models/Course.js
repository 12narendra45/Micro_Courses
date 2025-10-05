
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  published: { type: Boolean, default: false },
  reviewed: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
