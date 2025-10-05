
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email){
        return next({ code: 'FIELD_REQUIRED', field: 'email', message: 'Email is required' });
    }

    if (!password) {
        return next({ code: 'FIELD_REQUIRED', field: 'password', message: 'Password is required' });
    }

    if (!name) {
        return next({ code: 'FIELD_REQUIRED', field: 'name', message: 'Name is required' });
    }

    if (!role) {
        return next({ code: 'FIELD_REQUIRED', field: 'role', message: 'Role is required' });
    }

    const existing = await User.findOne({email});

    if (existing) {
        return next({ code: 'EMAIL_EXISTS', field: 'email', message: 'Email already registered' });
    }

    const hashedP = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedP, role });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    next(err);
  }
});



router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
        return next({ code: 'FIELD_REQUIRED', field: 'email', message: 'Email is required' })
    };
    if (!password) {
        return next({ code: 'FIELD_REQUIRED', field: 'password', message: 'Password is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next({ code: 'INVALID_CREDENTIALS', field: 'email', message: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return next({ code: 'INVALID_CREDENTIALS', field: 'password', message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
