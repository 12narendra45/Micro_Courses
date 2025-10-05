
const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');


router.use(authenticate);
router.use(requireRole('Creator'));


router.post('/apply', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { role: 'Creator', isApproved: false }, { new: true });
    res.json({ message: 'Creator application submitted', user });
  } catch (err) {
    next(err);
  }
});


router.get('/dashboard', async (req, res, next) => {
  try {
    const courses = await Course.find({ creator: req.user.id });
    res.json({ items: courses });
  } catch (err) {
    next(err);
  }
});

router.post('/courses', async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) {
        return next({ code: 'FIELD_REQUIRED', field: 'title', message: 'Title is required' })
    };
    if (!description) {
        return next({ code: 'FIELD_REQUIRED', field: 'description', message: 'Description is required' });
    }
    const course = await Course.create({ title, description, creator: req.user.id });
    res.json({ message: 'Course created', course });
  } catch (err) {
    next(err);
  }
});


router.get('/courses', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const courses = await Course.find({ creator: req.user.id })
      .skip(offset)
      .limit(limit);
    const next_offset = courses.length === limit ? offset + limit : null;
    res.json({ items: courses, next_offset });
  } catch (err) {
    next(err);
  }
});

router.post('/courses/:id/lessons', async (req, res, next) => {
  try {
    const { title, content, transcript, order } = req.body;
    if (!title || !content || order === undefined) {
      return next({ code: 'FIELD_REQUIRED', message: 'Title, content, and order are required' });
    }
    const course = await Course.findOne({ _id: req.params.id, creator: req.user.id });
    if (!course) {
        return next({ code: 'NOT_FOUND', message: 'Course not found or not owned by you' });
    }
    const lesson = await Lesson.create({ course: course._id, title, content, transcript, order });
    course.lessons.push(lesson._id);
    await course.save();
    res.json({ message: 'Lesson added', lesson });
  } catch (err) {
    next(err);
  }
});


router.put('/courses/:id', async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      { title, description },
      { new: true }
    );
    if (!course) {
        return next({ code: 'NOT_FOUND', message: 'Course not found or not owned by you' });
    }
    res.json({ message: 'Course updated', course });
  } catch (err) {
    next(err);
  }
});


router.delete('/courses/:id', async (req, res, next) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, creator: req.user.id });
    if (!course) {
        return next({ code: 'NOT_FOUND', message: 'Course not found or not owned by you' });
    }
    
    await Lesson.deleteMany({ course: course._id });
    res.json({ message: 'Course and lessons deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
