
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  transcript: { type: String },
  order: { type: Number, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

lessonSchema.index({ course: 1, order: 1 }, { unique: true }); 

module.exports = mongoose.model('Lesson', lessonSchema);
