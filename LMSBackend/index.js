

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');
const { globalLimiter, authLimiter, txLimiter, analyticsLimiter } = require('./middleware/rateLimiter');
const idempotency = require('./middleware/idempotency');
const errorHandler = require('./middleware/errorHandler');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));


const redisUrl = process.env.REDIS_URL;
const urlMatch = redisUrl.match(/^redis:\/\/:(.*?)@(.*):(\d+)$/);
if (!urlMatch) throw new Error('REDIS_URL format is invalid');
const password = urlMatch[1];
const host = urlMatch[2];
const port = Number(urlMatch[3]);
const redisClient = redis.createClient({
  host,
  port,
  auth_pass: password,
});
redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', (err) => console.error('Redis error:', err));


redisClient.set('testkey', 'testvalue', (err, reply) => {
  if (err) {
    console.error('Redis test error:', err);
  } else {
    console.log('Redis test success:', reply);
  }
});

app.use(cors());
app.use(express.json());
app.use(globalLimiter);-
app.use(idempotency(redisClient));
app.use(errorHandler);


app.get('/get', (req, res) => {
  res.json({ status: 'MicroCourses API running' });
});


app.use('/auth', require('./routes/auth'));
app.use('/creator', require('./routes/creator'));
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/learner'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
