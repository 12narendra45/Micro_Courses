const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

router.use(authenticate);
router.use(requireRole('Admin'));


router.get('/all-courses', async (req, res, next) => {
  try {
    const courses = await Course.find({}).populate('creator', 'name email');
    res.json({ items: courses });
  } catch (err) {
    next(err);
  }
});


router.get('/course/:id/stats', async (req, res, next) => {
  try {
    const courseId = req.params.id;

      const enrollments = await Enrollment.find({ course: courseId }).populate('learner', 'name email');
      const enrolledCount = enrollments.length;
      const certificateCount = enrollments.filter(e => e.certificateIssued).length;
      const learners = enrollments.map(e => ({
        _id: e.learner._id,
        name: e.learner.name,
        email: e.learner.email,
        certificateIssued: e.certificateIssued
      }));
      res.json({ enrolledCount, certificateCount, learners });
  } catch (err) {
    next(err);
  }
});



router.get('/review/courses', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const courses = await Course.find({ reviewed: false })
      .skip(offset)
      .limit(limit)
      .populate('creator', 'name email');

    const next_offset = courses.length === limit ? offset + limit : null;
    res.json({ items: courses, next_offset });
  } catch (err) {
    next(err);
  }
});


router.post('/review/courses/:id/approve', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next({ code: 'NOT_FOUND', message: 'Course not found' });
    }
    course.reviewed = true;
    course.published = true;
    await course.save();

    await User.findByIdAndUpdate(course.creator, { isApproved: true });

    res.json({ message: 'Course approved', course });
    
  } catch (err) {
    next(err);
  }
});

module.exports = router;
