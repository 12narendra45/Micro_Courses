

const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const crypto = require('crypto');




router.get('/courses', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const courses = await Course.find({ published: true })
      .skip(offset)
      .limit(limit)
      .populate('creator', 'name email');
    const next_offset = courses.length === limit ? offset + limit : null;
    res.json({ items: courses, next_offset });
  } catch (err) {
    next(err);
  }
});


router.get('/courses/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('creator', 'name email')
      .populate({ path: 'lessons', options: { sort: { order: 1 } } });
    if (!course || !course.published) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ course });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


router.use(authenticate);
router.use(requireRole('Learner'));
router.post('/courses/:id/enroll', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.published) {
        return next({ code: 'NOT_FOUND', message: 'Course not found' });
    }
    let enrollment = await Enrollment.findOne({ learner: req.user.id, course: course._id });
    if (!enrollment) {
      enrollment = await Enrollment.create({ learner: req.user.id, course: course._id });
    }
    res.json({ message: 'Enrolled', enrollment });
  } catch (err) {
    next(err);
  }
});


router.get('/learn/:lessonId', async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return next({ code: 'NOT_FOUND', message: 'Lesson not found' });
    res.json({ lesson });
  } catch (err) {
    next(err);
  }
});


router.get('/progress', async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ learner: req.user.id })
      .populate('course', 'title')
      .populate('completedLessons', 'title order');
    res.json({ progress: enrollments });
  } catch (err) {
    next(err);
  }
});


router.post('/courses/:id/certificate', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('lessons');
    if (!course) {
        return next({ code: 'NOT_FOUND', message: 'Course not found' });
    }
    const enrollment = await Enrollment.findOne({ learner: req.user.id, course: course._id });
    if (!enrollment) {
        return next({ code: 'NOT_ENROLLED', message: 'Not enrolled in course' });
    }
    const totalLessons = course.lessons.length;
    const completed = enrollment.completedLessons.length;
    if (totalLessons === 0 || completed < totalLessons) {
      return next({ code: 'PROGRESS_INCOMPLETE', message: 'Complete all lessons to get certificate' });
    }
    if (enrollment.certificateIssued) {
      const cert = await Certificate.findOne({ enrollment: enrollment._id });
      return res.json({ message: 'Certificate already issued', serialHash: cert.serialHash });
    }

    const serialHash = crypto.createHash('sha256').update(`${req.user.id}-${course._id}-${Date.now()}`).digest('hex');
    const cert = await Certificate.create({
      enrollment: enrollment._id,
      learner: req.user.id,
      course: course._id,
      serialHash
    });
    enrollment.certificateIssued = true;
    await enrollment.save();
    res.json({ message: 'Certificate issued', serialHash });
  } catch (err) {
    next(err);
  }
});



router.post('/learn/:lessonId/complete', async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
        return next({ code: 'NOT_FOUND', message: 'Lesson not found' });
    }
    let enrollment = await Enrollment.findOne({ learner: req.user.id, course: lesson.course });
    if (!enrollment) {
      enrollment = await Enrollment.create({ learner: req.user.id, course: lesson.course });
    }
   
    let updated = false;
    if (!enrollment.completedLessons.includes(lesson._id)) {
      enrollment.completedLessons.push(lesson._id);
      updated = true;
    }
    const course = await Course.findById(lesson.course).populate('lessons');
    const totalLessons = course.lessons.length;
    const completed = enrollment.completedLessons.length;
    enrollment.progress = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    if (updated) {
      await enrollment.save();
    } else {
      await enrollment.save(); 
    }
    res.json({ message: 'Lesson marked as complete', enrollment });
  } catch (err) {
    next(err);
  }
});


router.get('/courses/:id/progress', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('lessons');
    if (!course) {
        return next({ code: 'NOT_FOUND', message: 'Course not found' });
    }
    const enrollment = await Enrollment.findOne({ learner: req.user.id, course: course._id });
    const totalLessons = course.lessons.length;
    const completed = enrollment ? enrollment.completedLessons.length : 0;
    const progress = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    res.json({ progress });
  } catch (err) {
    next(err);
  }
});


router.get('/courses/:id/enroll-status', async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({ learner: req.user.id, course: req.params.id });
    res.json({ enrolled: !!enrollment });
  } catch (err) {
    next(err);
  }
});


router.post('/courses/:id/complete', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('lessons');
    if (!course) {
        return next({ code: 'NOT_FOUND', message: 'Course not found' });
    }
    const enrollment = await Enrollment.findOne({ learner: req.user.id, course: course._id });
    if (!enrollment) return next({ code: 'NOT_ENROLLED', message: 'Not enrolled in course' });
    const totalLessons = course.lessons.length;
    const completed = enrollment.completedLessons.length;
    if (totalLessons === 0 || completed < totalLessons) {
      return next({ code: 'PROGRESS_INCOMPLETE', message: 'Complete all lessons to mark course as complete' });
    }
    enrollment.progress = 100;
    await enrollment.save();
 
    res.json({ message: 'Course marked as complete', enrollment });
  } catch (err) {
    next(err);
  }
});

router.get('/courses/:id/certificate', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next({ code: 'NOT_FOUND', message: 'Course not found' });
    }
    const enrollment = await Enrollment.findOne({ learner: req.user.id, course: course._id });
    if (!enrollment || !enrollment.certificateIssued) {
        return next({ code: 'NOT_ISSUED', message: 'Certificate not issued yet' });
    }
    const cert = await Certificate.findOne({ enrollment: enrollment._id });
    if (!cert) {
        return next({ code: 'NOT_FOUND', message: 'Certificate not found' });
    }
    res.json({
      courseTitle: course.title,
      issuedAt: cert.createdAt,
      serialHash: cert.serialHash,
      _id: cert._id
    });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
